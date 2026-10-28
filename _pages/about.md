---
layout: v2-page
permalink: /about/
title: "Hi there, I'm Junhua Huang!"
doc_title: "About · Junhua (Harry) Huang"
description: "Long-form bio of Junhua (Harry) Huang: robot learning and robotics systems at UCLA VAIL; research and engineering experience, teaching, projects and skills."
excerpt: "About me"
author_profile: true
redirect_from: 
  - /about.html
---

![Junhua Huang](/images/profile3.jpg){: .align-right width="300px" height = "400px"}
My name is Junhua, or Harry. I'm a master's student in Electrical and Computer Engineering at UCLA (expected 2027) and a student researcher at the [Vision and Autonomy Intelligence Lab (VAIL)](https://vail.cs.ucla.edu/) with Prof. [Bolei Zhou](https://boleizhou.github.io/). I work on robot learning and robotics systems: cross-embodiment data pipelines, imitation and human-in-the-loop learning, and building and deploying systems on real hardware, including a power wheelchair, a quadruped with a robot arm, a humanoid, and Meta Aria glasses. Before UCLA, I received a B.S. in Computer Science and a B.S. in Business from the University of Rochester (May 2025).

**Highlights**
* First author of [ChairNav](https://vail.cs.ucla.edu/ChairNav/) (under submission): 84.9% autonomous driving time across 7.8 km of outdoor navigation on a Permobil M3 power wheelchair.
* Co-author of [Cue the Flow](https://hatchetproject.github.io/delivery_steer/) (CoRL 2026), [ToolSmith](https://threesr.github.io/toolsmith/) (Findings of EMNLP 2026), and [S3](https://arxiv.org/abs/2605.21852) (ICML 2026 Spotlight). See all papers on the [Publications](/publications/) page.
* Résumé: [PDF](/files/Junhua_Huang_Robotics_Resume.pdf) · Full CV: [CV page](/cv/)


# Research & Engineering Experience

### Student Researcher, Vision and Autonomy Intelligence Lab (VAIL), UCLA
*Los Angeles, CA | Jan 2026 – Present | Advisor: Prof. Bolei Zhou*
* **[ChairNav](https://vail.cs.ucla.edu/ChairNav/) (first author):** built a data-efficient cross-embodiment training-data pipeline adapting 170 h of source teleoperation data to a Permobil M3 power wheelchair using synthetic trajectories; used imitation learning on 3.19 h of human demonstrations and human-in-the-loop post-training, achieving 84.9% autonomous driving time across 7.8 km of outdoor navigation.
* Identified nonlinear wheelchair dynamics for physics simulation; used Isaac Sim and UrbanSim; built semi-automated RGB–LiDAR calibration, conditional auto-exposure, 3D-printed mounts, and automated robot-data reconstruction, visualization, and filtering pipelines.
* Accelerated ChairNav model inference from 0.6 to 20 Hz through model quantization and TensorRT optimization on Jetson AGX Orin; reverse-engineered the R-net CAN bus and implemented feedforward and residual compensation. Broader engineering included GPS/IMU/odometry localization and multi-IMU / high-precision GPS data collection.
* **[Cue the Flow](https://hatchetproject.github.io/delivery_steer/) (CoRL 2026):** deployed VLM grounding and a frozen π<sub>0.5</sub> VLA on an AgileX PiPER arm with Jetson image processing and remote inference in a synchronous control loop; integrated the arm, power, communications, and streaming on a DEEP Robotics M20 Pro, and built semi-automated demonstration collection and cleaning.
* Built shared perception between Meta Aria Gen 1 glasses and the M20 Pro for online mapping and target navigation; combined Aria Gen 2 streaming, gaze, head pose, image depth, and hand gestures to infer target direction, distance, and user intent.
* Also: Booster T1 humanoid data collection and Unitree Go2 navigation host software.

### Student Researcher, UCLA NLP Group
*Los Angeles, CA | Dec 2025 – Mar 2026 | Advisor: Prof. Kai-Wei Chang*
* Co-developed [ToolSmith](https://threesr.github.io/toolsmith/) (Findings of EMNLP 2026), which synthesizes and verifies Python tools for multimodal search agents: generated 264 verified tools from a 9,174-query pool, improving Qwen3-VL-8B MMSearch accuracy from 51.46% to 55.56%.

### Student Researcher, Seizure Lab, ECE Department, UCLA
*Los Angeles, CA | Aug 2025 – Oct 2025*
* Built a clinical seizure-semiology video dataset (10,000 records, 8 features) contributing to [S3: Seizure-Semiology-Suite](https://arxiv.org/abs/2605.21852) (ICML 2026 Spotlight).
* Deployed 3 vision-language models with vLLM asynchronous inference and request batching, increasing throughput from 0.3 to 5 requests/s (16.7×).

### Student Researcher, Prof. Chenliang Xu's Lab, University of Rochester
*Rochester, NY | May 2025 – Sep 2025*  
Researched VLM-guided audio remixing (acoustic highlighting), drawing on techniques from traditional film composition. I am the first author of [Semantic Visually-Guided Acoustic Highlighting with Large Vision-Language Models](https://arxiv.org/abs/2601.08871) (arXiv 2026). On the engineering side, I built an asynchronous, sharded caption-embedding pipeline with chunking and prefix caching, and prototyped gated-fusion and multi-head attention modules.

### Student Researcher, Prof. Jiebo Luo's Lab, University of Rochester
*Rochester, NY | Aug 2024 – Apr 2025*  
Reconstructed animal images from skeletons using Stable Diffusion (image-to-image). I applied partial diffusion to retain segmentation and used sparse-cloud encoders to inject spatial cues across large domain gaps, then improved facial realism with preference optimization (DPO with LoRA fine-tuning), building preference pairs and tuning prompts and schedules on the University of Rochester's Linux clusters. I also contributed to the survey [Video-LMM Post-Training](https://arxiv.org/abs/2510.05034) (arXiv 2025).

### Machine Learning Intern, Farsee2 Technology, Hybrid
*Jul 2024 – Sep 2024 | Mentor: Dr. Hailong Pan*
* Reduced floating artifacts by approximately 40% in city-scale Gaussian Splatting reconstruction by restricting point generation with incidence-angle weighting (the angle between camera rays and surface normals) and adding depth/normal supervision.
* Reworked depth generation from a linear process into configurable multi-machine scripts that parallelized depth generation and preprocessing, integrated into the product pipeline.

### Research Assistant, Prof. Chenliang Xu's Lab, University of Rochester
*Rochester, NY | Apr 2024 – Aug 2024*  
Mentored by PhD candidate Pinxin Liu, I deployed, tested, and extended models for co-speech gesture generation on Linux GPU servers, and built, cleaned, and labeled 200 audio–gesture sequences. I also explored a Mamba backbone and a new dataloader for temporal action localization. I also modified a ViT (Transformer++) structure. This work contributed to [GestureLSM](https://arxiv.org/abs/2501.18898) (ICCV 2025).

### Student Researcher, Goergen Institute for Data Science, University of Rochester
*Rochester, NY | Jan 2024 – Jun 2024*  
I studied fairness and bias in large language models in the context of political ideology. I developed methods to calculate and evaluate political positions for blind testing of LLMs, automated data collection with Python and APIs, and helped maintain a database of more than 140,000 political-ideology sentences. The resulting paper, [Using Generative AI to Calculate Party Positions: A Comparison of Human Experts and Large Language Models](https://doi.org/10.1561/113.00000126), is published in the *Journal of Political Institutions and Political Economy* (2025; [SSRN preprint](https://ssrn.com/abstract=4907043)).

### Research Assistant, University of Rochester (Schwartz Discover Grant, $5,000)
*Rochester, NY | May 2022 – Dec 2022*  
With Dr. Zhu, Dr. Jarvis, and other team members, I contributed to the digital reconstruction of the Jamestown Settlement and Elmina Castle using low-cost, image-based 3D virtual reality techniques. I converted high-resolution models into lightweight models for VR, built 3D models with Agisoft Metashape and Unity, screened, cleaned, and restored raw image data, repaired overlapping virtual camera angles in Adobe Photoshop, manually cleaned interfering point clouds, and corrected shadows, lighting, and surface materials.


# Teaching

* **Teaching Assistant & Workshop Leader**, University of Rochester: CSC 172 Data Structures and Algorithms (Aug 2023 – May 2024); CSC 171 Introduction to Computer Science (Dec 2022 – May 2023). Details on the [Teaching](/teaching/) page.


# Projects

### OpenJDK 17u-dev
*July 2024 – August 2024*  
For the OpenJDK 17u-dev project, I authored a step-by-step installation guide on GitHub for deploying the JDK in local Linux testing environments, and contributed to the testing and acceptance of pull request #2756 (8313674) on Ubuntu 22.

### IMDB Database Project
*August 2023 – December 2023*  
Leading a team of three, I ensured database compliance and improved the security of an IMDB database project, focusing on testing, compatibility assessment, and debugging to prevent injection attacks. I implemented a login system and user-type-specific CRUD functions using JavaScript, PHP, MySQL, HTML, CSS, and Git, and redesigned the website's UI.

### Body Signals Analysis Project
*September 2023 – December 2023*  
I preprocessed over 900,000 records with feature engineering and reduced dimensionality with Principal Component Analysis (PCA). I trained SVM and XGBoost models with 72–81% accuracy for predicting the impact of smoking and drinking on body signals, and visualized data trends with Seaborn and Matplotlib.

### Bob's Burgers App Project
*January 2023 – May 2023*  
I solo-developed an Android app, Bob's Burgers, using RecyclerView, API integration, and the MVVM architecture, with robust error handling for invalid API requests and a user-friendly interface with smooth animations.


# Skills

**Robot Learning:** imitation, preference, and reinforcement learning; flow matching; VLA/VLM; cross-embodiment transfer  
**Robotics Systems:** system identification, physics-based simulation, Isaac Sim, UrbanSim, ROS/ROS2, CAN bus, TensorRT, SLAM, RGB–LiDAR calibration, 3D reconstruction  
**Platforms:** Permobil M3, AgileX PiPER, DEEP Robotics M20 Pro, Booster T1, Unitree Go2; Meta Aria Gen 1 and Gen 2; NVIDIA Jetson Xavier NX and Jetson AGX Orin  
**Programming:** Python, PyTorch, Linux, Java, Kotlin, C, R, SQL, JavaScript, PHP, MySQL, HTML, CSS, Git  
**Software:** Android Studio, IntelliJ IDEA, SolidWorks, Agisoft Metashape, Unity, Google Suite, Microsoft Office


# Interests

Cycling, Fishing, Scuba Diving (PADI Advanced Open Water Diver), Fitness, Snowboarding
