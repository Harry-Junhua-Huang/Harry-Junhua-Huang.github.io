---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<a href="/files/Junhua_Huang_Robotics_Resume.pdf" class="btn btn--success">Download Résumé (PDF, 1 page)</a>

<div style="text-align: center;">
    <strong>Junhua (Harry) Huang</strong><br>
    1-585-286-7948 | <a href="mailto:junhuahuang1218@gmail.com">junhuahuang1218@gmail.com</a> | Los Angeles, CA | <a href="https://www.linkedin.com/in/junhuahuang1218">LinkedIn</a>
</div>

EDUCATION
======
*   **University of California, Los Angeles** (Los Angeles, CA)
    *   M.S. in Electrical and Computer Engineering (Expected 2027)
    *   Research with Prof. Bolei Zhou (VAIL) and Prof. Kai-Wei Chang (UCLA NLP)
*   **University of Rochester** (Rochester, NY)
    *   B.S. in Computer Science and B.S. in Business, Cluster in Studio Art (May 2025)
    *   GPA: 3.82/4.00
    *   *Honors:* Highest Distinction, Cum Laude; Dean's List (8 semesters); Schwartz Discover Grant ($5,000), 2022

RESEARCH & ENGINEERING EXPERIENCE
======
*   **Student Researcher**, Vision and Autonomy Intelligence Lab (VAIL), UCLA, Prof. Bolei Zhou
    *   *Los Angeles, CA · Jan 2026 – Present*
    *   **[ChairNav](https://vail.cs.ucla.edu/ChairNav/) (first author):** built a data-efficient cross-embodiment training-data pipeline adapting 170 h of source teleoperation data to a Permobil M3 power wheelchair using synthetic trajectories; used imitation learning on 3.19 h of human demonstrations and human-in-the-loop post-training, achieving 84.9% autonomous driving time across 7.8 km of outdoor navigation.
    *   Identified nonlinear wheelchair dynamics for physics simulation; used Isaac Sim and UrbanSim; built semi-automated RGB–LiDAR calibration, conditional auto-exposure, 3D-printed mounts, and automated robot-data reconstruction, visualization, and filtering pipelines.
    *   Accelerated ChairNav model inference from 0.6 to 20 Hz through model quantization and TensorRT optimization on Jetson AGX Orin; reverse-engineered the R-net CAN bus and implemented feedforward and residual compensation. Broader engineering included GPS/IMU/odometry localization and multi-IMU / high-precision GPS data collection.
    *   **[Cue the Flow](https://hatchetproject.github.io/delivery_steer/) (CoRL 2026):** deployed VLM grounding and a frozen π<sub>0.5</sub> VLA on an AgileX PiPER arm with Jetson image processing and remote inference in a synchronous control loop; integrated the arm, power, communications, and streaming on a DEEP Robotics M20 Pro, and built semi-automated demonstration collection and cleaning.
    *   Built shared perception between Meta Aria Gen 1 glasses and the M20 Pro for online mapping and target navigation; combined Aria Gen 2 streaming, gaze, head pose, image depth, and hand gestures to infer target direction, distance, and user intent.
    *   Also: Booster T1 humanoid data collection; Unitree Go2 navigation host software.

*   **Student Researcher**, UCLA NLP Group, Prof. Kai-Wei Chang
    *   *Los Angeles, CA · Dec 2025 – Mar 2026*
    *   Co-developed [ToolSmith](https://threesr.github.io/toolsmith/) (Findings of EMNLP 2026): generated 264 verified tools from a 9,174-query pool through tool synthesis and verification, improving Qwen3-VL-8B MMSearch accuracy from 51.46% to 55.56%.

*   **Student Researcher**, Seizure Lab, ECE Department, UCLA
    *   *Los Angeles, CA · Aug 2025 – Oct 2025*
    *   Built a clinical seizure-semiology dataset (10,000 records, 8 features) contributing to [S3](https://arxiv.org/abs/2605.21852) (ICML 2026 Spotlight).
    *   Deployed 3 VLMs with vLLM asynchronous inference and request batching, increasing throughput from 0.3 to 5 requests/s (16.7×).

*   **Student Researcher**, Prof. Chenliang Xu's Lab, Computer Science Department, University of Rochester
    *   *Rochester, NY · May 2025 – Sep 2025*
    *   Researched VLM-guided audio remixing (acoustic highlighting); first author of [Semantic Visually-Guided Acoustic Highlighting with Large Vision-Language Models](https://arxiv.org/abs/2601.08871) (arXiv 2026).
    *   Built an asynchronous, sharded caption-embedding pipeline with chunking and prefix caching; prototyped gated-fusion and multi-head attention modules.

*   **Student Researcher**, Prof. Jiebo Luo's Lab, Computer Science Department, University of Rochester
    *   *Rochester, NY · Aug 2024 – Apr 2025*
    *   Reconstructed animal images from skeletons using Stable Diffusion (image-to-image); applied partial diffusion to retain segmentation and sparse-cloud encoders to inject spatial cues across large domain gaps.
    *   Improved facial realism with preference optimization (DPO with LoRA fine-tuning); built preference pairs and tuned prompts and schedules on UR Linux clusters. Contributed to the [Video-LMM Post-Training](https://arxiv.org/abs/2510.05034) survey.

*   **Machine Learning Intern**, Farsee2 Technology (Hybrid / Wuhan, China), mentored by Dr. Hailong Pan
    *   *Jul 2024 – Sep 2024*
    *   Reduced floating artifacts by approximately 40% in city-scale Gaussian Splatting with incidence-angle weighting and depth/normal supervision.
    *   Built configurable multi-machine scripts that parallelized depth generation and preprocessing for reconstruction prototypes.

*   **Research Assistant**, Prof. Chenliang Xu's Lab, Computer Science Department, University of Rochester
    *   *Rochester, NY · Apr 2024 – Aug 2024*
    *   Deployed, tested, and extended co-speech gesture generation models on Linux GPU servers; built, cleaned, and labeled 200 audio–gesture sequences; explored a Mamba backbone for temporal action localization; modified a ViT (Transformer++) structure. Contributed to [GestureLSM](https://arxiv.org/abs/2501.18898) (ICCV 2025).

*   **Student Researcher**, Goergen Institute for Data Science, University of Rochester
    *   *Rochester, NY · Jan 2024 – Aug 2024*
    *   Designed two ideology-bias metrics and a blind-test harness; automated data collection and reproducible scoring for evaluating political ideology in LLMs; helped maintain a database of more than 140,000 political-ideology sentences.
    *   Found that LLMs rate manifestos about 73.64% less extreme than the ground truth; published in the *Journal of Political Institutions and Political Economy* (2025; [SSRN](https://ssrn.com/abstract=4907043)).

*   **Research Assistant (Schwartz Discover Grant)**, University of Rochester
    *   *Rochester, NY · May 2022 – Dec 2022*
    *   Low-cost, image-based 3D/VR reconstruction of the Jamestown Settlement and Elmina Castle with Agisoft Metashape and Unity; image and point-cloud cleaning and restoration.

PUBLICATIONS
======
\* equal contribution

*   **Junhua Huang\***, Zhizheng Liu\*, Honglin He, Xiang Zhang, Bolei Zhou. **ChairNav: Cross-Embodiment Pre-training and Personalization for Long-Horizon Wheelchair Navigation**. Under submission, 2026. [arXiv](https://arxiv.org/abs/2610.24012) · [Project page](https://vail.cs.ucla.edu/ChairNav/)
*   Haoxuan Wang, Griffin Galimi, **Junhua Huang**, Selina Song, Wayne Wu, Yan Yan, Bolei Zhou. **Cue the Flow: Steering Flow-Matching Policies for Open-World Delivery Manipulation**. CoRL 2026. [arXiv](https://arxiv.org/abs/2609.38989) · [Project page](https://hatchetproject.github.io/delivery_steer/)
*   Rui Sun, **Junhua Huang**, Luca Zancato, Md Mofijul Islam, Kai-Wei Chang. **ToolSmith: An Automatic Tool-Generation Framework for Multimodal Search Agents**. Findings of EMNLP 2026. [Project page](https://threesr.github.io/toolsmith/)
*   Lina Zhang, Tonmoy Monsoor, et al. (incl. **Junhua Huang**), Rajarshi Mazumder, Vwani Roychowdhury. **Seizure-Semiology-Suite (S3): A Clinically Multimodal Dataset, Benchmark, and Models for Seizure Semiology Understanding**. ICML 2026 (Spotlight). [arXiv](https://arxiv.org/abs/2605.21852)
*   Pinxin Liu, Luchuan Song, **Junhua Huang**, Haiyang Liu, Junfan Zhu, Chenliang Xu. **GestureLSM: Latent Shortcut based Co-Speech Gesture Generation with Spatial-Temporal Modeling**. ICCV 2025. [arXiv](https://arxiv.org/abs/2501.18898)
*   **Junhua Huang**, Chao Huang, Chenliang Xu. **Semantic Visually-Guided Acoustic Highlighting with Large Vision-Language Models**. arXiv 2026. [arXiv](https://arxiv.org/abs/2601.08871)
*   Pinxin Liu, Haiyang Liu, Jiahao Luo, **Junhua Huang**, Chunhao Zou, Luchuan Song. **GestureFAR: Streaming Co-Speech Gesture Generation with Flow Autoregression**. arXiv 2026. [arXiv](https://arxiv.org/abs/2609.21576)
*   Yolo Y. Tang, Jing Bi, Pinxin Liu, et al. (incl. **Junhua Huang**), Jiebo Luo, Chenliang Xu. **Video-LMM Post-Training: A Deep Dive into Video Reasoning with Large Multimodal Models**. arXiv 2025. [arXiv](https://arxiv.org/abs/2510.05034)
*   Cantay Caliskan, **Junhua Huang**, Yiyang Huang, Ruoxuan Lin, Wanting Shan. **Using Generative AI to Calculate Party Positions: A Comparison of Human Experts and Large Language Models**. Journal of Political Institutions and Political Economy, 2025. [DOI](https://doi.org/10.1561/113.00000126) · [SSRN](https://ssrn.com/abstract=4907043)

PLATFORMS
======
*   **Robots:** Permobil M3, AgileX PiPER, DEEP Robotics M20 Pro, Booster T1, Unitree Go2
*   **Wearable platforms:** Meta Aria Gen 1 and Gen 2
*   **Edge computing:** NVIDIA Jetson Xavier NX, NVIDIA Jetson AGX Orin

SKILLS
======
*   **Robot learning:** imitation, preference, and reinforcement learning; flow matching; VLA/VLM; cross-embodiment transfer
*   **Robotics systems:** system identification, physics-based simulation, Isaac Sim, UrbanSim, ROS/ROS2, CAN bus, TensorRT, SLAM, RGB–LiDAR calibration, 3D reconstruction
*   **Programming:** Python, PyTorch, Linux, Java, Kotlin, C, R, SQL, JavaScript, PHP, MySQL, HTML, CSS, Git
*   **Software:** Android Studio, IntelliJ IDEA, SolidWorks, Agisoft Metashape, Unity, Google Suite, Microsoft Office

TEACHING
======
*   **Teaching Assistant & Workshop Leader**, University of Rochester
    *   CSC 172 Data Structures and Algorithms (Aug 2023 – May 2024)
    *   CSC 171 Introduction to Computer Science (Dec 2022 – May 2023)

PROJECTS
======
*   **Body Signals Analysis of Smoking and Drinking**
    *   *Sep 2023 – Dec 2023*
    *   Preprocessed over 900k records by selecting relevant attributes through feature engineering; applied PCA to 2 principal + 2 auxiliary components, capturing the dominant variance for compact modeling.
    *   Trained SVM and XGBoost for 5 categories of smoking/drinking prediction with 72/81% accuracy.

*   **OpenJDK 17u-dev**
    *   *Jul 2024 – Aug 2024*
    *   Wrote a step-by-step guide for deploying the JDK in local Linux testing environments; contributed to testing and acceptance of pull request #2756 (8313674) on Ubuntu 22.

*   **IMDB Database Project**
    *   *Aug 2023 – Dec 2023*
    *   Led a team of three on database compliance and security (injection-attack testing); built a login system and user-type-specific CRUD functions with JavaScript, PHP, MySQL, HTML, CSS, and Git.

*   **Bob's Burgers Android App**
    *   *Jan 2023 – May 2023*
    *   Solo-developed an Android app with RecyclerView, API integration, and MVVM, with robust error handling for invalid API requests.
