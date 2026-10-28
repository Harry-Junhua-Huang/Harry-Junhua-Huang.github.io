/*!
 * chair-sim.js - drive a model of a Permobil M3 (R-net) power wheelchair in the browser.
 *
 * The plant is a velocity-level unicycle identified from real calibration drives of the chair:
 * delivered joystick bytes in, forward speed v [m/s] and yaw rate omega [rad/s] out
 * (dead time, first-order lag, rate limits, gains). No wheels, mass, inertia or slope.
 * It is a model for illustration, not the controller used on the road.
 *
 * Vanilla JS, no dependencies, no network requests.
 * Usage: ChairSim.init(rootElement)  (the include calls it from an IntersectionObserver).
 */
(function (global) {
"use strict";

// ------------------------------------------------------------------ identified parameters
// Parameter set "v2 linear + v1 angular": angular channel from the first identification,
// linear channel from the later forward-step calibration. Values copied unchanged.
var PARAMS = Object.freeze({
  // angular channel
  K_ang: 1.06, L_ang: 0.113, tau_ang: 0.598,
  K_ang_left: 1.145, K_ang_right: 1.013, lr_asymmetry_enabled: false,
  low_speed_gain_factor: 0.87, low_speed_v_lo: 0.4, low_speed_v_hi: 0.57, low_speed_enabled: true,
  road_gain_scale: 1.0,
  u_breakaway: 0.19685, breakaway_enabled: true, v_static: 0.05, omega_static: 0.02,
  // linear channel
  K_lin_fwd: 1.769, K_lin_rev: 0.69, accel_max: 0.538, decel_max: 13.45, L_lin: 0.38, tau_lin: 0.29
});
var DT = 0.02;          // plant step: 50 Hz
var CMD_SCALE = 127;    // delivered byte n -> command n / 127
var STICK_RANGE = 100;  // the physical joystick reaches +-100 of +-127
var KEY_AMP = 0.6;      // keyboard deflection (Shift = full stick)

// ------------------------------------------------------------------ plant (physics unchanged)
class Delay {
  constructor(delay, init) {
    this.delay = Math.max(0.0, Number(delay));
    this.ts = [-Infinity];
    this.us = [init || 0.0];
    this.h = 0;
  }
  push(t, u) { this.ts.push(t); this.us.push(u); }
  valueAt(t) {
    const tq = t - this.delay;
    while (this.ts.length - this.h > 1 && this.ts[this.h + 1] <= tq) this.h++;
    if (this.h > 4096) {
      this.ts = this.ts.slice(this.h); this.us = this.us.slice(this.h); this.h = 0;
    }
    return this.us[this.h];
  }
}

class ChairPlant {
  constructor(params) { this.p = Object.assign({}, params); this.reset(); }
  reset(v0 = 0.0, omega0 = 0.0) {
    this.t = 0.0;
    this.v = Number(v0);
    this.v_ref = Number(v0);
    this.x_ang = -Number(omega0);
    this.omega = Number(omega0);
    this.dl = new Delay(this.p.L_ang);
    this.dl_lin = new Delay(this.p.L_lin);
  }
  speedFactor(v_abs) {
    const p = this.p;
    if (!p.low_speed_enabled) return 1.0;
    const f = p.low_speed_gain_factor, lo = p.low_speed_v_lo, hi = p.low_speed_v_hi;
    if (v_abs <= lo) return f;
    if (v_abs >= hi) return 1.0;
    return f + (1.0 - f) * (v_abs - lo) / (hi - lo);
  }
  kAng(u) {
    const p = this.p;
    if (p.lr_asymmetry_enabled) return u >= 0 ? p.K_ang_right : p.K_ang_left;
    return p.K_ang;
  }
  // cmd_lin, cmd_ang: delivered command n/127 (+ang = right, R-net). omega: + = left (REP-103).
  step(cmd_lin, cmd_ang, dt, d_yaw = 0.0, v_override = null) {
    const p = this.p;
    if (dt <= 0) return [this.v, this.omega];
    const t = this.t;
    this.dl.push(t, Number(cmd_ang));
    this.dl_lin.push(t, Number(cmd_lin));
    let u = this.dl.valueAt(t);
    const ul = this.dl_lin.valueAt(t);
    const v_for_gain = Math.abs(v_override === null ? this.v : v_override);
    // angular: breakaway gate at rest, speed-dependent gain, first-order lag
    if (p.breakaway_enabled) {
      const at_rest = v_for_gain < p.v_static && Math.abs(this.x_ang) < p.omega_static;
      if (at_rest && Math.abs(u) <= p.u_breakaway + 1e-6) u = 0.0;
    }
    const k_eff = this.kAng(u) * this.speedFactor(v_for_gain) * p.road_gain_scale;
    const a = p.tau_ang > 0 ? Math.exp(-dt / p.tau_ang) : 0.0;
    this.x_ang = a * this.x_ang + (1.0 - a) * k_eff * u;
    // linear: gain, accel/decel rate limit, first-order lag
    const k_lin = ul >= 0 ? p.K_lin_fwd : p.K_lin_rev;
    const v_tgt = k_lin * ul;
    let dv = v_tgt - this.v_ref;
    const growing = (Math.abs(v_tgt) > Math.abs(this.v_ref)) && (v_tgt * this.v_ref >= 0);
    const lim = (growing ? p.accel_max : p.decel_max) * dt;
    if (lim > 0) dv = Math.max(-lim, Math.min(lim, dv));
    this.v_ref += dv;
    const b = p.tau_lin > 0 ? Math.exp(-dt / p.tau_lin) : 0.0;
    this.v = b * this.v + (1.0 - b) * this.v_ref;
    this.t = t + dt;
    this.omega = -this.x_ang + Number(d_yaw);
    return [this.v, this.omega];
  }
}

function integrateUnicycle(x, y, yaw, v, omega, dt) {
  if (Math.abs(omega) < 1e-9) return [x + v * dt * Math.cos(yaw), y + v * dt * Math.sin(yaw), yaw];
  const yaw1 = yaw + omega * dt;
  const r = v / omega;
  return [x + r * (Math.sin(yaw1) - Math.sin(yaw)), y - r * (Math.cos(yaw1) - Math.cos(yaw)), yaw1];
}

// stick deflection in [-1, 1] -> int8 byte (round half away from zero) -> delivered n/127
function toByte(s, fullScale) {
  const n = Math.floor(Math.abs(s) * fullScale + 0.5) * (s < 0 ? -1 : 1);
  return Math.max(-128, Math.min(127, n));
}

// ------------------------------------------------------------------ live drive state (pure, testable)
function makeLive() {
  return {
    plant: new ChairPlant(PARAMS), pose: [0, 0, 0], trail: [[0, 0]], dist: 0,
    stick: [0, 0], keys: new Set(), keyAmp: KEY_AMP, script: null, nLin: 0, nAng: 0, lastCmdT: -1e9
  };
}
function liveReset(L) {
  L.plant = new ChairPlant(PARAMS);
  L.pose = [0, 0, 0]; L.trail = [[0, 0]]; L.dist = 0; L.script = null; L.lastCmdT = -1e9;
}
function currentStick(L) {
  if (L.keys.size) {
    const k = L.keys, a = L.keyAmp;
    return [((k.has("u") ? 1 : 0) - (k.has("d") ? 1 : 0)) * a, ((k.has("r") ? 1 : 0) - (k.has("l") ? 1 : 0)) * a];
  }
  return L.stick;
}
function liveStep(L, dt) {
  if (L.script) {
    const sc = L.script;
    L.nLin = sc.lin[sc.i]; L.nAng = sc.ang[sc.i];
    if (++sc.i >= sc.lin.length) L.script = null;
  } else {
    const s = currentStick(L);
    L.nLin = toByte(s[0], STICK_RANGE); L.nAng = toByte(s[1], STICK_RANGE);
  }
  const cl = L.nLin / CMD_SCALE, ca = L.nAng / CMD_SCALE;
  const pl = L.plant, v0 = pl.v, w0 = pl.omega;
  if (L.nLin || L.nAng) L.lastCmdT = pl.t;
  const vw = pl.step(cl, ca, dt, 0.0, null);
  const P = L.pose;
  const np = integrateUnicycle(P[0], P[1], P[2], 0.5 * (v0 + vw[0]), 0.5 * (w0 + vw[1]), dt);
  L.dist += Math.hypot(np[0] - P[0], np[1] - P[1]);
  L.pose = np;
  const tl = L.trail[L.trail.length - 1];
  if (Math.hypot(np[0] - tl[0], np[1] - tl[1]) > 0.03) {
    L.trail.push([np[0], np[1]]);
    if (L.trail.length > 3000) L.trail.shift();
  }
}

// ------------------------------------------------------------------ scripted maneuver (stick input only)
// [linear byte, angular byte (+ = right), seconds]; stays within the physical +-100 stick range.
var MANEUVER = [
  [0, 0, 0.6], [70, 0, 1.6], [70, -60, 2.4], [70, 60, 2.6], [70, -60, 1.4],
  [0, 0, 1.4], [0, 90, 2.4], [0, 0, 0.6], [60, 0, 1.6], [0, 0, 1.4]
];
function expandManeuver(seq) {
  const lin = [], ang = [];
  seq.forEach(function (s) {
    const n = Math.round(s[2] / DT);
    for (let i = 0; i < n; i++) { lin.push(s[0]); ang.push(s[1]); }
  });
  return { lin: lin, ang: ang, i: 0 };
}

// ------------------------------------------------------------------ one real calibration drive
// Straight forward steps (no steering). lin: delivered linear byte as run-length [byte, samples] at 50 Hz.
// v: measured forward speed (visual odometry) in mm/s, every `stride` samples from sample i0.
var REPLAY = {"dt":0.02,"lin":[[0,593],[127,350],[0,571],[127,350],[0,579],[100,178],[0,67]],"i0":450,"stride":5,"v":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,6,16,31,54,86,128,176,232,284,343,409,489,598,682,721,785,849,902,993,1083,1135,1161,1214,1294,1323,1343,1396,1453,1496,1524,1560,1598,1619,1641,1685,1739,1755,1710,1675,1668,1706,1729,1747,1757,1729,1698,1660,1674,1767,1862,1887,1856,1814,1782,1706,1692,1744,1768,1770,1737,1727,1716,1613,1510,1595,1754,1805,1723,1618,1470,1225,960,700,459,246,96,59,100,94,64,37,10,12,16,13,7,5,4,5,3,3,1,1,3,2,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,2,6,21,41,62,94,138,180,222,277,332,381,444,510,580,654,716,798,882,925,980,1055,1113,1169,1231,1303,1387,1457,1498,1548,1622,1651,1671,1672,1660,1701,1722,1723,1749,1765,1776,1778,1779,1774,1766,1774,1786,1814,1859,1876,1835,1772,1753,1764,1757,1742,1742,1719,1711,1749,1784,1782,1791,1816,1815,1805,1788,1760,1766,1758,1619,1422,1239,1025,748,475,265,105,38,94,92,62,38,13,12,18,14,6,2,4,4,2,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]};

// Feed the recorded command through the plant (command at t[i] held over [t[i], t[i+1]),
// output at t[i+1], as in the offline simulator) and sample it where speed was measured.
function replayModel(R) {
  const lin = [];
  R.lin.forEach(function (s) { for (let i = 0; i < s[1]; i++) lin.push(s[0]); });
  const pl = new ChairPlant(PARAMS);
  const vSim = new Float64Array(lin.length);
  for (let i = 0; i < lin.length - 1; i++) {
    const dt = (i + 1) * R.dt - i * R.dt;  // same time base as the offline simulate(): t[i] = i * dt
    vSim[i + 1] = pl.step(lin[i] / CMD_SCALE, 0, dt, 0.0, null)[0];
  }
  const n = R.v.length, t = [], meas = [], model = [], cmd = [];
  let se = 0;
  for (let k = 0; k < n; k++) {
    const i = R.i0 + k * R.stride;
    t.push(k * R.stride * R.dt); meas.push(R.v[k] / 1000); model.push(Math.abs(vSim[i])); cmd.push(lin[i]);
    se += (model[k] - meas[k]) * (model[k] - meas[k]);
  }
  return { t: t, meas: meas, model: model, cmd: cmd, rms: Math.sqrt(se / n), T: t[n - 1] };
}

// ------------------------------------------------------------------ DOM widget
function fitCanvas(c) {
  const dpr = Math.min(3, global.devicePixelRatio || 1);
  const w = c.clientWidth, h = c.clientHeight;
  if (c.width !== Math.round(w * dpr) || c.height !== Math.round(h * dpr)) {
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
  }
  const g = c.getContext("2d");
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  return [g, w, h];
}
function rrect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.lineTo(x + w - r, y); g.arcTo(x + w, y, x + w, y + r, r);
  g.lineTo(x + w, y + h - r); g.arcTo(x + w, y + h, x + w - r, y + h, r);
  g.lineTo(x + r, y + h); g.arcTo(x, y + h, x, y + h - r, r);
  g.lineTo(x, y + r); g.arcTo(x, y, x + r, y, r); g.closePath();
}
var KEYMAP = { ArrowUp: "u", KeyW: "u", ArrowDown: "d", KeyS: "d", ArrowLeft: "l", KeyA: "l", ArrowRight: "r", KeyD: "r" };
var MINUS = "\u2212";
function num(x, d) {
  const s = Math.abs(x) < 0.5 * Math.pow(10, -d) ? (0).toFixed(d) : Math.abs(x).toFixed(d);
  return (x < 0 && s !== (0).toFixed(d) ? MINUS : "") + s;
}

function init(root) {
  if (!root || root.__chairSim) return root && root.__chairSim;
  const $ = function (sel) { return root.querySelector(sel); };
  const view = $(".cs-view"), stage = $(".cs-stage"), joy = $(".cs-joy"), knob = $(".cs-knob");
  const outV = $('[data-cs="v"]'), outW = $('[data-cs="w"]'), status = $('[data-cs="status"]');
  const btnPlay = $('[data-cs="play"]'), btnReset = $('[data-cs="reset"]');
  const chart = $(".cs-chart"), outRms = $('[data-cs="rms"]');
  const reduced = global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // touch-only devices have no keyboard: the idle hint mentions the stick only
  const touchOnly = global.matchMedia && global.matchMedia("(hover: none)").matches;
  const idleHint = touchOnly ? "Drag the stick" : "Drag stick \u00b7 WASD";

  const L = makeLive();
  const cam = [0, 0];
  let T = {}, font = "system-ui, sans-serif", mono = "ui-monospace, monospace";
  let raf = 0, last = null, acc = 0, onScreen = false, played = false, dirty = true;
  let dragging = false, lastV = "", lastW = "", lastStatus = "";
  const rep = replayModel(REPLAY);
  let reveal = reduced ? 1 : 0, chartDirty = true, chartSeen = false;
  let kick = null;
  if (outRms) outRms.textContent = "RMS gap " + rep.rms.toFixed(2) + " m/s";

  function readTheme() {
    const cs = getComputedStyle(root);
    const v = function (n, f) { return (cs.getPropertyValue(n) || "").trim() || f; };
    T = { bg: v("--cs-bg", "#FAFAF7"), surface: v("--cs-surface", "#fff"), text: v("--cs-text", "#15171C"),
          muted: v("--cs-muted", "#5A616E"), line: v("--cs-line", "#E3E3DC"), accent: v("--cs-accent", "#2774AE") };
    font = cs.fontFamily || font;
    mono = v("--cs-mono", mono);
    dirty = true; chartDirty = true;
    if (typeof kick === "function") kick();
  }
  readTheme();
  if (global.matchMedia) {
    const mq = global.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", readTheme);
  }
  if (global.MutationObserver) {
    const mo = new MutationObserver(readTheme);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "class", "style"] });
    if (document.body) mo.observe(document.body, { attributes: true, attributeFilter: ["data-theme", "class"] });
  }

  // ---------------------------------------------------------------- input
  function takeOver() { if (L.script) { L.script = null; } }
  function reset() { liveReset(L); cam[0] = 0; cam[1] = 0; dirty = true; }
  function play() { reset(); L.script = expandManeuver(MANEUVER); played = true; ensureLoop(); }
  btnPlay.addEventListener("click", play);
  btnReset.addEventListener("click", function () { reset(); ensureLoop(); });

  function joyFromEvent(e) {
    const r = joy.getBoundingClientRect();
    const R = r.width / 2 - knob.offsetWidth / 2;
    let dx = (e.clientX - r.left - r.width / 2) / R, dy = -(e.clientY - r.top - r.height / 2) / R;
    const m = Math.hypot(dx, dy);
    if (m > 1) { dx /= m; dy /= m; }
    L.stick = [dy, dx];  // [linear (up = forward), angular (right = + R-net)]
  }
  joy.addEventListener("pointerdown", function (e) {
    e.preventDefault();
    dragging = true; takeOver();
    try { joy.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    joy.classList.add("is-active");
    // keyboard focus only for mouse users: on touch it would leave a focus ring on the canvas
    if (e.pointerType === "mouse") stage.focus({ preventScroll: true });
    joyFromEvent(e); ensureLoop();
  });
  joy.addEventListener("pointermove", function (e) { if (dragging) joyFromEvent(e); });
  function joyUp() { dragging = false; L.stick = [0, 0]; joy.classList.remove("is-active"); }
  joy.addEventListener("pointerup", joyUp);
  joy.addEventListener("pointercancel", joyUp);
  joy.addEventListener("lostpointercapture", joyUp);

  root.addEventListener("keydown", function (e) {
    const code = KEYMAP[e.code];
    if (e.key === "Shift") { L.keyAmp = 1; return; }
    if (!code || e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = (e.target && e.target.tagName) || "";
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    e.preventDefault(); takeOver(); L.keys.add(code); L.keyAmp = e.shiftKey ? 1 : KEY_AMP; ensureLoop();
  });
  root.addEventListener("keyup", function (e) {
    if (e.key === "Shift") { L.keyAmp = KEY_AMP; return; }
    if (KEYMAP[e.code]) L.keys.delete(KEYMAP[e.code]);
  });
  root.addEventListener("focusout", function (e) { if (!root.contains(e.relatedTarget)) L.keys.clear(); });
  global.addEventListener("blur", function () { L.keys.clear(); joyUp(); });

  // ---------------------------------------------------------------- drawing
  function drawView(frameDt) {
    const fw = fitCanvas(view), g = fw[0], w = fw[1], h = fw[2];
    if (!w || !h) return;
    const S = Math.max(48, Math.min(120, Math.min(w, h) / 3.4));  // px per metre (chair ~0.9 m long)
    const P = L.pose;
    const k = 1 - Math.exp(-frameDt / 0.35);
    cam[0] += (P[0] - cam[0]) * k; cam[1] += (P[1] - cam[1]) * k;
    // world (x forward, y left) -> screen, start heading = up
    const SX = function (x, y) { return w / 2 - (y - cam[1]) * S; };
    const SY = function (x, y) { return h / 2 - (x - cam[0]) * S; };
    g.fillStyle = T.bg; g.fillRect(0, 0, w, h);
    // 1 m grid (every 5th line stronger)
    const hx = h / S / 2 + 1, hy = w / S / 2 + 1;
    g.lineWidth = 1; g.strokeStyle = T.line;
    for (let pass = 0; pass < 2; pass++) {
      g.globalAlpha = pass ? 1 : 0.75;
      g.beginPath();
      for (let i = Math.floor(cam[0] - hx); i <= cam[0] + hx; i++) {
        if ((i % 5 === 0) !== !!pass) continue;
        const yy = Math.round(SY(i, 0)) + 0.5; g.moveTo(0, yy); g.lineTo(w, yy);
      }
      for (let j = Math.floor(cam[1] - hy); j <= cam[1] + hy; j++) {
        if ((j % 5 === 0) !== !!pass) continue;
        const xx = Math.round(SX(0, j)) + 0.5; g.moveTo(xx, 0); g.lineTo(xx, h);
      }
      g.stroke();
    }
    g.globalAlpha = 1;
    // start marker
    g.strokeStyle = T.muted; g.lineWidth = 1.5;
    g.beginPath(); g.arc(SX(0, 0), SY(0, 0), 5, 0, 2 * Math.PI); g.stroke();
    // trail, older segments fainter
    const tr = L.trail, n = tr.length;
    g.strokeStyle = T.accent; g.lineWidth = 3; g.lineCap = "butt"; g.lineJoin = "round";
    const chunks = 8, cs = Math.max(1, Math.ceil(n / chunks));
    for (let c = 0; c * cs < n; c++) {
      const a = c * cs, b = Math.min(n - 1, (c + 1) * cs);
      g.globalAlpha = 0.2 + 0.7 * (c + 1) / Math.ceil(n / cs);
      g.beginPath(); g.moveTo(SX(tr[a][0], tr[a][1]), SY(tr[a][0], tr[a][1]));
      for (let i = a + 1; i <= b; i++) g.lineTo(SX(tr[i][0], tr[i][1]), SY(tr[i][0], tr[i][1]));
      if (b === n - 1) g.lineTo(SX(P[0], P[1]), SY(P[0], P[1]));
      g.stroke();
    }
    g.globalAlpha = 1;
    // chair, drawn in the body frame (metres): x forward, y left; nominal 0.90 x 0.61 m, axle at mid-length
    const c_ = Math.cos(P[2]), s_ = Math.sin(P[2]);
    g.save();
    g.translate(SX(P[0], P[1]), SY(P[0], P[1]));
    g.transform(-s_ * S, -c_ * S, -c_ * S, s_ * S, 0, 0);
    const px = 1 / S;
    g.fillStyle = T.accent; g.globalAlpha = 0.14;           // soft footprint halo
    rrect(g, -0.52, -0.37, 1.04, 0.74, 0.16); g.fill();
    g.globalAlpha = 1;
    g.fillStyle = T.surface; g.strokeStyle = T.text; g.lineWidth = 1.5 * px;
    rrect(g, -0.45, -0.305, 0.90, 0.61, 0.09); g.fill(); g.stroke();
    g.fillStyle = T.text;
    g.globalAlpha = 0.9;                                    // drive wheels on the axle
    rrect(g, -0.15, 0.235, 0.30, 0.075, 0.03); g.fill();
    rrect(g, -0.15, -0.31, 0.30, 0.075, 0.03); g.fill();
    g.globalAlpha = 0.5;                                    // casters
    [[0.36, 0.22], [0.36, -0.22], [-0.36, 0.22], [-0.36, -0.22]].forEach(function (q) {
      g.beginPath(); g.arc(q[0], q[1], 0.035, 0, 2 * Math.PI); g.fill();
    });
    g.globalAlpha = 0.16;                                   // seat
    rrect(g, -0.30, -0.19, 0.46, 0.38, 0.06); g.fill();
    g.globalAlpha = 0.55;                                   // backrest
    rrect(g, -0.40, -0.21, 0.07, 0.42, 0.03); g.fill();
    g.globalAlpha = 1;
    g.strokeStyle = T.accent; g.lineWidth = 3 * px;         // heading chevron
    g.beginPath(); g.moveTo(0.50, 0.15); g.lineTo(0.62, 0); g.lineTo(0.50, -0.15); g.stroke();
    g.restore();
    // scale bar, bottom right
    const x1 = w - 14, x0 = x1 - S, yb = h - 18;
    g.strokeStyle = T.muted; g.fillStyle = T.muted; g.lineWidth = 2; g.lineCap = "butt";
    g.beginPath(); g.moveTo(x0, yb); g.lineTo(x1, yb);
    g.moveTo(x0, yb - 5); g.lineTo(x0, yb + 5); g.moveTo(x1, yb - 5); g.lineTo(x1, yb + 5); g.stroke();
    g.font = "500 11px " + mono; g.textBaseline = "bottom"; g.textAlign = "center";
    g.fillText("1 m", (x0 + x1) / 2, yb - 4);
  }

  function drawChart() {
    if (!chart) return;
    const fw = fitCanvas(chart), g = fw[0], w = fw[1], h = fw[2];
    if (!w || !h) return;
    g.clearRect(0, 0, w, h);
    const padL = 22, padR = 6, padT = 6, padB = 18, pw = w - padL - padR, ph = h - padT - padB;
    const ymax = 2.0;
    const X = function (t) { return padL + t / rep.T * pw; };
    const Y = function (v) { return padT + ph - Math.max(0, Math.min(ymax, v)) / ymax * ph; };
    g.font = "500 10.5px " + mono; g.fillStyle = T.muted; g.textAlign = "right"; g.textBaseline = "middle";
    g.strokeStyle = T.line; g.lineWidth = 1;
    for (let v = 0; v <= ymax + 1e-9; v += 1) {
      const yy = Math.round(Y(v)) + 0.5;
      g.beginPath(); g.moveTo(padL, yy); g.lineTo(padL + pw, yy); g.stroke();
      g.fillText(String(v), padL - 6, yy);
    }
    g.textAlign = "left"; g.textBaseline = "top";
    g.fillText("m/s", padL + 4, Math.round(Y(ymax)) + 4);
    g.textBaseline = "top";
    for (let t = 0; t <= rep.T + 1e-9; t += 10) {
      g.textAlign = t === 0 ? "left" : "center";
      g.fillText(t + " s", X(t), padT + ph + 4);
    }
    // stick pushed forward: shaded bands
    g.fillStyle = T.accent; g.globalAlpha = 0.09;
    let s0 = -1;
    for (let k = 0; k <= rep.cmd.length; k++) {
      const on = k < rep.cmd.length && rep.cmd[k] > 0;
      if (on && s0 < 0) s0 = k;
      if (!on && s0 >= 0) { g.fillRect(X(rep.t[s0]), padT, X(rep.t[k - 1]) - X(rep.t[s0]), ph); s0 = -1; }
    }
    g.globalAlpha = 1;
    const line = function (arr, color, lw, alpha) {
      g.strokeStyle = color; g.lineWidth = lw; g.globalAlpha = alpha; g.lineJoin = "round"; g.lineCap = "round";
      g.beginPath();
      for (let k = 0; k < arr.length; k++) { const xx = X(rep.t[k]), yy = Y(arr[k]); if (k) g.lineTo(xx, yy); else g.moveTo(xx, yy); }
      g.stroke(); g.globalAlpha = 1;
    };
    line(rep.meas, T.text, 1.6, 0.8);
    g.save();                                   // the model trace sweeps in over the measured one
    g.beginPath(); g.rect(padL, 0, pw * reveal + 1, h); g.clip();
    line(rep.model, T.accent, 2.4, 1);
    g.restore();
  }

  function updateReadouts() {
    const pl = L.plant;
    const sv = num(pl.v, 2), sw = num(pl.omega, 2);
    if (sv !== lastV) { outV.textContent = sv; lastV = sv; }
    if (sw !== lastW) { outW.textContent = sw; lastW = sw; }
    const active = dragging || L.keys.size > 0;
    const st = L.script ? "Scripted maneuver" : active ? "Driving" : idleHint;
    if (st !== lastStatus) { status.textContent = st; lastStatus = st; root.classList.toggle("is-scripted", !!L.script); }
    // knob shows the stick: user input, or the scripted bytes
    let s = currentStick(L);
    if (L.script) s = [L.nLin / STICK_RANGE, L.nAng / STICK_RANGE];
    const R = joy.clientWidth / 2 - knob.offsetWidth / 2;
    knob.style.transform = "translate(" + (s[1] * R).toFixed(1) + "px," + (-s[0] * R).toFixed(1) + "px)";
  }

  // at rest with no input and nothing left in the dead-time buffers: stop scheduling frames
  function settled() {
    const pl = L.plant, s = currentStick(L);
    return !L.script && !dragging && !L.keys.size && s[0] === 0 && s[1] === 0 &&
      pl.t - L.lastCmdT > 1.0 && Math.abs(pl.v) < 1e-4 && Math.abs(pl.v_ref) < 1e-4 &&
      Math.abs(pl.x_ang) < 1e-4 && Math.abs(cam[0] - L.pose[0]) < 1e-3 && Math.abs(cam[1] - L.pose[1]) < 1e-3;
  }

  // ---------------------------------------------------------------- loop: 50 Hz fixed-step physics, rAF rendering
  function frame(ts) {
    raf = 0;
    if (last === null) last = ts;
    const el = Math.min(0.25, Math.max(0, (ts - last) / 1000));
    last = ts;
    acc += el;
    while (acc >= DT) { liveStep(L, DT); acc -= DT; }
    const still = settled();
    if (dirty || !still) { drawView(el); dirty = false; }
    updateReadouts();
    if (chartSeen && reveal < 1) { reveal = Math.min(1, reveal + el / 2.4); chartDirty = true; }
    if (chartDirty) { drawChart(); chartDirty = false; }
    const idle = still && !dirty && !(chartSeen && reveal < 1);
    if (running() && !idle) raf = global.requestAnimationFrame(frame);
  }
  function running() { return onScreen && !document.hidden; }
  function ensureLoop() {
    if (!raf && running()) { last = null; raf = global.requestAnimationFrame(frame); }
  }
  kick = ensureLoop;
  function stopLoop() { if (raf) { global.cancelAnimationFrame(raf); raf = 0; } L.keys.clear(); }

  if ("IntersectionObserver" in global) {
    new IntersectionObserver(function (es) {
      const e = es[es.length - 1];
      onScreen = e.isIntersecting;
      if (onScreen) {
        if (!played && !reduced && e.intersectionRatio >= 0.3) play();
        ensureLoop();
      } else stopLoop();
    }, { threshold: [0, 0.3] }).observe(root);
  } else { onScreen = true; chartSeen = true; if (!reduced) play(); }
  if (chart && "IntersectionObserver" in global) {
    const cio = new IntersectionObserver(function (es) {
      if (es[es.length - 1].isIntersecting) { chartSeen = true; cio.disconnect(); ensureLoop(); }
    }, { threshold: 0.6 });
    cio.observe(chart);
  }
  document.addEventListener("visibilitychange", function () { if (document.hidden) stopLoop(); else ensureLoop(); });
  if ("ResizeObserver" in global) {
    new ResizeObserver(function () { dirty = true; chartDirty = true; if (!raf) { drawView(0); drawChart(); updateReadouts(); } }).observe(root);
  }
  drawView(0); drawChart(); updateReadouts();
  root.classList.add("is-ready");
  root.__chairSim = { reset: reset, play: play, state: L };
  return root.__chairSim;
}

var API = {
  init: init, PARAMS: PARAMS, DT: DT, CMD_SCALE: CMD_SCALE, STICK_RANGE: STICK_RANGE,
  ChairPlant: ChairPlant, Delay: Delay, integrateUnicycle: integrateUnicycle, toByte: toByte,
  makeLive: makeLive, liveStep: liveStep, MANEUVER: MANEUVER, expandManeuver: expandManeuver,
  REPLAY: REPLAY, replayModel: replayModel
};
if (typeof module === "object" && module.exports) module.exports = API;
if (typeof window !== "undefined") window.ChairSim = API;
})(typeof window !== "undefined" ? window : this);
