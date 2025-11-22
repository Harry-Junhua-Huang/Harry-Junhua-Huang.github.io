---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<a href="/files/MLE_junhua_huang_ V2.3.docx.pdf" class="btn btn--success">Download CV</a>

Education
======
* Ph.D in Version Control Theory, GitHub University, 2018 (expected)
* M.S. in Jekyll, GitHub University, 2014
* B.S. in GitHub, GitHub University, 2012

Work experience
======
* **Student Researcher**, Seizure Lab, ECE Department, University of California, Los Angeles
  * Los Angeles, CA | Aug 2025 - Oct 2025
  * During my time at UCLA's Seizure Lab, I focused on scaling Vision-Language Model (VLM) inference. I successfully deployed three models and boosted throughput by 16.7× (from 0.3 to 5 rps) through the implementation of asynchronous request batching. Additionally, I optimized latency by introducing a caching layer, achieving a prefix-cache hit rate of approximately 73%. Beyond the technical infrastructure, I also built a comprehensive medical visual dataset containing 10,000 records with 8 features focused on epilepsy seizures from the UCLA medical school.

* **Student Researcher**, Professor Chenliang Xu's Lab, Computer Science Department, University of Rochester
  * Rochester, NY | May 2025 - Sep 2025
  * Working in Professor Chenliang Xu's lab, I conducted research on improving VLM-guided audio remixing, drawing inspiration from traditional movie composition techniques. This research led to achieving State-of-the-Art (SOTA) results with approximately 9% fewer parameters by utilizing a simplified architecture and prompt-variant sweeps. I am the first author of the resulting paper submitted to IEEE ICASSP 2026. On the engineering side, I built an asynchronous, sharded caption-embedding pipeline that boosted throughput by 16× and increased KV-cache hits from 6% to 57% via chunking and prefix-caching. I also prototyped a gated fusion and multi-head attention module.

* **Student Researcher**, Professor Jiebo Luo's Lab, Computer Science Department, University of Rochester
  * Rochester, NY | Aug 2024 - Apr 2025
  * In Professor Jiebo Luo's lab, my research focused on reconstructing animal images from skeletons using Stable Diffusion (I2I). I applied partial diffusion to retain segmentation and utilized sparse-cloud encoders to inject spatial cues, effectively bridging long domain gaps. Furthermore, I improved facial realism in generated images via Reinforcement Learning from Human Feedback (RLHF) using Direct Preference Optimization (DPO) with LoRA fine-tuning. This involved building preference pairs and fine-tuning prompts and schedules on the University of Rochester's Linux clusters.
  
Skills
======
* Skill 1
* Skill 2
  * Sub-skill 2.1
  * Sub-skill 2.2
  * Sub-skill 2.3
* Skill 3

Publications
======
  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Talks
======
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Service and leadership
======
* Currently signed in to 43 different slack teams
