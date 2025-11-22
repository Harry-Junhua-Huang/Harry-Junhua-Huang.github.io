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

<div style="text-align: center;">
    <strong>Junhua Huang</strong><br>
    1-585-286-7948 | <a href="mailto:junhuahuang1218@gmail.com">junhuahuang1218@gmail.com</a> | Los Angeles, CA | <a href="https://www.linkedin.com/in/junhuahuang1218">LinkedIn</a>
</div>

EDUCATION
======
*   **University of California, Los Angeles** (Los Angeles, CA)
    *   Master of Electrical Computer Engineering (Anticipated July 2027)
*   **University of Rochester** (Rochester, NY)
    *   B.S. in Computer Science, B.S. in Business, Cluster in Studio Art (May 2025)
    *   *Honors:* Highest distinction, cum laude, Dean's list (8/8 semesters), Schwartz Discover Research Grant 2022

ENGINEERING EXPERIENCE
======
*   **Student Researcher**, Seizure Lab, ECE Department, University of California, Los Angeles
    *   *Aug 2025 - Oct 2025*
    *   Scaled VLM inference: deployed 3 models, boosted throughput 16.7× (0.3→5 rps) via asynchronous request batching, optimized latency by introducing a caching layer using prefix-cache hit ~73%.
    *   Built a medical visual dataset of 10k records on 8 features on epilepsy seizure. (CVPR 2026 under review)

*   **Student Researcher**, Professor Chenliang Xu’s Lab, Computer Science Department, University of Rochester
    *   *May 2025 - Sep 2025*
    *   Conducted research on VLM-guided audio remixing’s improvement; transferred experience from traditional movie composers. Achieved SOTA with ~9% fewer parameters using a simplified architecture and prompt-variant sweeps; First author, submitted at IEEE ICASSP 2026.
    *   Built an async, sharded caption-embedding pipeline; boosted throughput 16× and raised KV-cache hits 6%→57% via chunking + prefix-cache; prototyped gated fusion & multi-head attention Module.

*   **Student Researcher**, Professor Jiebo Luo’s Lab, Computer Science Department, University of Rochester
    *   *Aug 2024 - Apr 2025*
    *   Reconstructed animal images from skeletons using Stable Diffusion (I2I); applied partial diffusion to retain segmentation and sparse-cloud encoders to inject spatial cues—bridging long domain gaps.
    *   Improved facial realism via RLHF (DPO) with LoRA fine-tuning; built preference pairs and tuned prompts/schedules on UR Linux clusters.

*   **Machine Learning Internship**, Farsee2 (Wuhan, China)
    *   *July 2024 - Sep 2024*
    *   Cut floating artifacts ~40% in Gaussian Splatting by adding angle-of-incidence and depth/normal supervision losses for better geometric consistency.
    *   Built customizable generation scripts with multi-machine parallelism; integrated into the product pipeline to improve throughput and reliability for prototype demo.

*   **Student Researcher**, Goergen Institute for Data Science, University of Rochester
    *   *Jan 2024 - Jun 2024*
    *   Designed two ideology-bias metrics and a blind-test harness; automated data collection and reproducible scoring for LLM political-ideology evaluation.
    *   Found LLMs rate manifestos ~73.64% less extreme than ground truth; paper accepted in Journal of Political Institutions & Political Economy (SSRN: [https://ssrn.com/abstract=4907043](https://ssrn.com/abstract=4907043)).

PROJECTS
======
*   **Body Signals Analysis of Smoking and Drinking**
    *   *Sep 2023 - Dec 2023*
    *   Preprocessed over 900k records by selecting relevant attributes through feature engineering; applied PCA to 2 principal + 2 auxiliary components, capturing the dominant variance for compact modeling.
    *   Trained SVM and XGBoost for 5 categories of smoking/drinking prediction with 72/81% accuracy.

RESEARCH PAPER AND PREPRINTS
======
*   Caliskan, Cantay and Huang, Junhua and Huang, Yiyang and Lin, Ruoxuan and Shan, Wanting, **Using Generative AI to Calculate Party Positions: A Comparison of Human Experts and Large Language Models** (July 26, 2024). Available at SSRN: [https://ssrn.com/abstract=4907043](https://ssrn.com/abstract=4907043)
*   Pinxin Liu, Luchuan Song*, Junhua Huang, Chenliang Xu, **GestureLSM: Latent Shortcut based Co-Speech Gesture Generation with Spatial-Temporal Modeling**. ICCV 2025, [https://arxiv.org/abs/2501.18898](https://arxiv.org/abs/2501.18898)
*   Junhua Huang*, Chao Huang, Chenliang Xu, **Semantic Visually-Guided Acoustic Highlighting with Large Vision-Language Models**. Submitted to ICASSP 2026 (Sep 17, 2025).
