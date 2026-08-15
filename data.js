/* 内容数据层 — 项目与经历的事实单一来源。
 * 媒体 URL 均已逐项核实可用（2026-08-16）：
 *  - R2 公开桶 pub-f9f31997afdc468aa605212042ed5ac3.r2.dev
 *  - GitHub raw (Multi-Robot-Inspection-System)
 *  - 本地 assets/ 资源
 * 中英文案一一对应，不得虚构成果。 */
(function () {
  window.SiteData = {};

  /* ------------------------------------------------------------------ */
  /* 精选项目（按展示顺序）                                              */
  /* ------------------------------------------------------------------ */
  window.SiteData.projects = [
    {
      id: 'roboinspect',
      detId: 'DET-01',
      index: '01',
      year: '2026',
      stats: ['SIM E2E', 'TB3 FIELD', 'ROS 2'],
      links: [
        {
          type: 'github',
          url: 'https://github.com/ryanwonglala/Multi-Robot-Inspection-System',
        },
      ],
      hero: {
        type: 'image',
        src: 'assets/projects/roboinspect/hero.svg',
        poster: null,
      },
      en: {
        eyebrow: 'Graduation Project',
        title: 'RoboInspect',
        subtitle: 'Multi-robot indoor inspection, from simulation to field trials.',
        summary:
          'A ROS 2 inspection platform where a small fleet allocates routes, navigates autonomously, maps anomalies by vision, and files bilingual evidence reports. Simulated end to end, then field-tested on TurtleBot3.',
        role: 'Solo graduation project · system design & integration',
        stack: 'ROS 2 · Nav2 · Gazebo · RViz',
        sections: [
          {
            title: 'System at a glance',
            body: 'Two mobile robots coordinate route allocation and inspection rounds; anomalies are marked on a shared map, and a response arm handles verified incidents. The evidence layer exports bilingual reports.',
            media: [{ type: 'image', src: 'assets/projects/roboinspect/hero.svg', alt: 'RoboInspect system map with two mobile robots, anomaly markers, and a response arm' }],
          },
          {
            title: 'Physical TurtleBot3 trials',
            body: 'Field trials covered localization, navigation, inspection, AprilTag terminal alignment, and guarded return and docking.',
            media: [],
          },
          {
            title: 'SO-ARM response station',
            body: 'A standalone vision-guided arm detects, grasps, verifies, transports, and sorts abnormal-coloured objects.',
            media: [{ type: 'image', src: 'https://raw.githubusercontent.com/ryanwonglala/Multi-Robot-Inspection-System/47bf992932856b28d8fb0cda36299cba022ff762/so-arm101/calibration/workzone.jpg', alt: 'SO-ARM101 camera work zone used for vision-guided sorting' }],
          },
          {
            title: 'Honest integration boundary',
            body: 'Cross-platform handoff remains operator-supervised rather than an unattended production deployment.',
            media: [],
          },
        ],
      },
      zh: {
        eyebrow: '毕业设计',
        title: 'RoboInspect',
        subtitle: '多机器人室内巡检：从仿真到实机验证。',
        summary:
          '基于 ROS 2 的巡检平台：小规模机器人车队完成路线分配、自主导航、视觉异常标注，并输出中英双语巡检报告。全流程先在仿真中打通，再于 TurtleBot3 实机验证。',
        role: '独立毕业设计 · 系统设计与集成',
        stack: 'ROS 2 · Nav2 · Gazebo · RViz',
        sections: [
          {
            title: '系统总览',
            body: '两台移动机器人协同完成路线分配与巡检轮次；异常标注在共享地图上，经核实后由响应机械臂处理，证据层可导出双语报告。',
            media: [{ type: 'image', src: 'assets/projects/roboinspect/hero.svg', alt: 'RoboInspect 系统示意图：两台移动机器人、异常标注与响应机械臂' }],
          },
          {
            title: 'TurtleBot3 实机试验',
            body: '实机验证覆盖定位、导航、巡检、AprilTag 终端对位，以及 guarded 返航与对接。',
            media: [],
          },
          {
            title: 'SO-ARM 响应站',
            body: '独立视觉机械臂完成异常颜色物体的检测、抓取、校验、搬运与分拣。',
            media: [{ type: 'image', src: 'https://raw.githubusercontent.com/ryanwonglala/Multi-Robot-Inspection-System/47bf992932856b28d8fb0cda36299cba022ff762/so-arm101/calibration/workzone.jpg', alt: 'SO-ARM101 视觉分拣工作区' }],
          },
          {
            title: '如实的集成边界',
            body: '跨平台交接目前仍需操作员监督，尚非无人值守的生产部署。',
            media: [],
          },
        ],
      },
    },
    {
      id: 'security-robot',
      detId: 'DET-02',
      index: '02',
      year: '2025',
      stats: ['<20 CM', 'YOLOV8+CLIP', 'NAV2'],
      links: [],
      hero: {
        type: 'video',
        src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/human%20detector.mp4',
        poster: 'assets/posters/p4.jpg',
      },
      en: {
        eyebrow: 'ROS 2 Autonomy',
        title: 'Autonomous Security Robot',
        subtitle: 'From uncharted exploration to AI-driven threat detection.',
        summary:
          'An autonomous patrol robot for the SUTD Robotics Lab — frontier-based SLAM mapping, Nav2 patrols, and YOLOv8 + CLIP classification fused with Lidar, with detected intruders projected onto the map in real time.',
        role: 'System architecture & control',
        stack: 'ROS 2 · YOLOv8 · CLIP · Nav2 · Lidar',
        sections: [
          {
            title: 'AI vision & asynchronous reasoning',
            body: 'A non-blocking vision server combines YOLOv8 and CLIP, then fuses camera bearings with Lidar to project classified markers onto the map.',
            media: [
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/intruder%E6%A3%80%E6%B5%8B.png', alt: 'Intruder detection result' },
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/staff%E6%A3%80%E6%B5%8B.png', alt: 'Staff detection result' },
            ],
          },
          {
            title: 'Mission orchestration & navigation',
            body: 'A mission state machine dispatches Nav2 patrols, performs systematic surveillance rotations, and respects visually detected restricted zones.',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E5%AE%9E%E6%8B%8D%E5%9B%BE.jpg', alt: 'Autonomous Security Robot test environment' }],
          },
        ],
      },
      zh: {
        eyebrow: 'ROS 2 自主系统',
        title: '实验室安保机器人',
        subtitle: '从未知环境探索到 AI 威胁检测。',
        summary:
          '面向 SUTD 机器人实验室的自主巡逻机器人——基于边界的 SLAM 建图、Nav2 巡逻，YOLOv8 + CLIP 与激光雷达融合识别，检测到的闯入者实时投影到地图上。',
        role: '系统架构与控制',
        stack: 'ROS 2 · YOLOv8 · CLIP · Nav2 · 激光雷达',
        sections: [
          {
            title: 'AI 视觉与异步推理',
            body: '非阻塞视觉服务器融合 YOLOv8 与 CLIP 的识别结果，再把相机方位角与激光雷达融合，将分类标记投影到地图上。',
            media: [
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/intruder%E6%A3%80%E6%B5%8B.png', alt: '闯入者检测结果' },
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/staff%E6%A3%80%E6%B5%8B.png', alt: '工作人员检测结果' },
            ],
          },
          {
            title: '任务编排与导航',
            body: '任务状态机调度 Nav2 巡逻、执行系统性监视旋转，并遵守视觉识别出的禁区。',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project4/%E6%B5%8B%E8%AF%95%E7%8E%AF%E5%A2%83%E5%AE%9E%E6%8B%8D%E5%9B%BE.jpg', alt: '安保机器人测试环境' }],
          },
        ],
      },
    },
    {
      id: 'flexilock',
      detId: 'DET-03',
      index: '03',
      year: '2025',
      stats: ['10 KG', '−60 KPA', '5.88 N·M'],
      links: [
        {
          type: 'paper',
          url: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/Team%20Paper.pdf',
        },
      ],
      hero: {
        type: 'video',
        src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E5%AE%9E%E7%89%A9%E6%BC%94%E7%A4%BA.mp4',
        poster: 'assets/posters/p3.jpg',
      },
      en: {
        eyebrow: 'Soft Robotics',
        title: 'FlexiLock',
        subtitle: 'Soft at rest, rigid on demand.',
        summary:
          'A pangolin-inspired vacuum scale-jamming sleeve for MAS grade 3–4 upper-limb spasticity rehab: 10 kg load and a 5.88 N·m bending moment at −60 kPa. My part: mechanism and soft-robotics design.',
        role: 'Soft robotics & mechanism design',
        stack: 'Vacuum actuation · 3D printing · PLA scales',
        sections: [
          {
            title: 'Bio-inspired scale jamming',
            body: 'Inspired by pangolin armour geometry, overlapping scales interlock under vacuum, switching the sleeve from highly flexible to rigid within seconds.',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E5%90%AF%E5%8F%91.png', alt: 'Bio-inspired scale jamming mechanism' }],
          },
          {
            title: 'Design iteration & fabrication',
            body: 'Scale morphology was iterated to optimise overlap ratio and the friction interface. The final wearable packs 3D-printed PLA scales inside a custom-sealed nylon envelope for reliable vacuum distribution.',
            media: [
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E9%B3%9E%E7%89%87%E8%BF%AD%E4%BB%A3.png', alt: 'Scale morphology iterations' },
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E5%B7%A5%E8%89%BA%E6%B5%81%E7%A8%8B.png', alt: 'Fabrication process workflow' },
            ],
          },
          {
            title: 'Mechanical validation',
            body: 'At −60 kPa the device withstood a 10 kg dead-weight load without visible deformation, producing a 5.88 N·m bending moment.',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/10kg%E8%B4%9F%E8%BD%BD%E8%AF%95%E9%AA%8C.png', alt: '10 kg dead-weight load validation test' }],
          },
          {
            title: 'Mathematical modelling',
            body: 'A dimensional analysis extracted the core non-dimensional groups; a power-law regression predicts force output from overlap ratio, vacuum pressure, and deflection.',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/model.png', alt: 'Mathematical modelling and regression analysis' }],
          },
        ],
      },
      zh: {
        eyebrow: '软体机器人',
        title: 'FlexiLock',
        subtitle: '静息柔软，按需变刚。',
        summary:
          '穿山甲启发的真空鳞片卡变刚度袖套，面向 MAS 3–4 级上肢痉挛康复：−60 kPa 下承受 10 kg 负载、输出 5.88 N·m 弯矩。本人负责机构与软体机器人设计。',
        role: '软体机器人与机构设计',
        stack: '真空驱动 · 3D 打印 · PLA 鳞片',
        sections: [
          {
            title: '仿生鳞片卡锁',
            body: '受穿山甲鳞片几何启发，抽真空时交叠鳞片相互卡锁，袖套在数秒内从高柔顺切换为刚性。',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E5%90%AF%E5%8F%91.png', alt: '仿生鳞片卡锁机构' }],
          },
          {
            title: '设计迭代与制造',
            body: '鳞片形态经多轮迭代以优化重叠率与摩擦界面；最终可穿戴结构将 3D 打印 PLA 鳞片封装于定制密封尼龙袋内，保证真空分布可靠。',
            media: [
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E9%B3%9E%E7%89%87%E8%BF%AD%E4%BB%A3.png', alt: '鳞片形态迭代' },
              { type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/%E5%B7%A5%E8%89%BA%E6%B5%81%E7%A8%8B.png', alt: '制造工艺流程' },
            ],
          },
          {
            title: '力学验证',
            body: '在 −60 kPa 下，装置承受 10 kg 砝码负载无明显形变，输出弯矩 5.88 N·m。',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/10kg%E8%B4%9F%E8%BD%BD%E8%AF%95%E9%AA%8C.png', alt: '10 kg 负载验证试验' }],
          },
          {
            title: '数学建模',
            body: '通过量纲分析提取核心无量纲组，建立幂律回归模型，由重叠率、真空压力与挠度预测输出力。',
            media: [{ type: 'image', src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/project3/model.png', alt: '数学建模与回归分析' }],
          },
        ],
      },
    },
    {
      id: 'arm-challenge',
      detId: 'DET-04',
      index: '04',
      year: '2025',
      stats: ['4TH PLACE', '6-DOF', '1 WEEK'],
      links: [],
      hero: {
        type: 'video',
        src: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/pic1.MP4',
        poster: 'assets/posters/p1.jpg',
      },
      en: {
        eyebrow: 'Competition',
        title: 'Robotic Arm Challenge',
        subtitle: 'Six days, one arm, a maze on the other end.',
        summary:
          'A one-week team competition: a 6-DOF arm grasps objects at arbitrary positions, loads a mobile vehicle, and triggers its autonomous run through a colour-coded maze. 4th place in the final live run. I owned arm control — motion planning, calibration, and reliable execution on real hardware.',
        role: 'Robotic arm control',
        stack: '6-DOF arm · motion planning · calibration',
        sections: [
          {
            title: 'Competition outcome',
            body: 'The system was evaluated in a final live competition. Our team achieved 4th place, with all grasping tasks completed reliably during the final runs.',
            media: [
              { type: 'image', src: 'assets/projects/project1/pic2.JPG', alt: 'Robotic Arm Challenge rig' },
            ],
          },
          {
            title: 'From ideal model to real hardware',
            body: 'The workflow reflects how ideal kinematic models were adapted to real conditions — servo offsets, polarity differences, and power-related variation.',
            media: [
              { type: 'image', src: 'assets/projects/project1/pic3.png', alt: 'Arm control workflow on real hardware' },
            ],
          },
        ],
      },
      zh: {
        eyebrow: '竞赛',
        title: '机械臂挑战赛',
        subtitle: '六天，一条臂，迷宫在另一端。',
        summary:
          '为期一周的团队竞赛：6 自由度机械臂在任意位置抓取物体、装载小车，并触发小车自主通过颜色编码迷宫。决赛现场第 4 名。本人负责机械臂控制——运动规划、标定与真实硬件上的可靠执行。',
        role: '机械臂控制',
        stack: '6 自由度机械臂 · 运动规划 · 标定',
        sections: [
          {
            title: '比赛结果',
            body: '系统在决赛现场评测。我们团队取得第 4 名，决赛轮次中全部抓取任务可靠完成。',
            media: [
              { type: 'image', src: 'assets/projects/project1/pic2.JPG', alt: '机械臂挑战赛装置' },
            ],
          },
          {
            title: '从理想模型到真实硬件',
            body: '工作流展示了理想运动学模型如何适配真实条件——舵机偏置、极性差异与供电波动。',
            media: [
              { type: 'image', src: 'assets/projects/project1/pic3.png', alt: '真实硬件上的机械臂控制流程' },
            ],
          },
        ],
      },
    },
  ];

  /* ------------------------------------------------------------------ */
  /* 档案项目（非核心，收纳在折叠区）                                    */
  /* ------------------------------------------------------------------ */
  window.SiteData.archive = {
    id: 'hango',
    index: 'A-01',
    poster: 'assets/posters/p2.jpg',
    video: 'https://pub-f9f31997afdc468aa605212042ed5ac3.r2.dev/Project/Hango%20V1.1.mp4',
    en: {
      eyebrow: 'Archived · Interdisciplinary design',
      title: 'Hango',
      description:
        'A semester-long design project by a five-person interdisciplinary team, developed through four staged reviews from research to an exhibited prototype. My contribution focused on visual communication, presentation structure, and the final exhibition video.',
      facts: ['5-person team', '4 reviews', 'Exhibited'],
      cta: 'Watch exhibition video',
    },
    zh: {
      eyebrow: '已归档 · 跨学科设计',
      title: 'Hango',
      description:
        '五人跨学科团队为期一学期的设计项目，历经四阶段评审，从研究推进到展览原型。本人主要负责视觉传达、汇报结构与最终展览视频。',
      facts: ['5 人团队', '4 次评审', '公开展出'],
      cta: '观看展览视频',
    },
  };

  /* ------------------------------------------------------------------ */
  /* 经历时间线（按时间正序存储，展示时倒序）                            */
  /* ------------------------------------------------------------------ */
  window.SiteData.experience = [
    {
      id: 'tust-undergrad',
      period: '2019–2023',
      stage: 'Undergraduate',
      org: 'TUST',
      orgFull: 'Taiyuan University of Science and Technology',
      media: 'assets/experience/1.jpeg',
      en: {
        role: 'B.Eng. in Mechatronic Engineering',
        summary:
          'Undergraduate training in mechatronic engineering — mechanical systems, electronics, control fundamentals, and applied coursework.',
        highlights: [
          'Studied mechanical design, electronics, control fundamentals, and engineering mathematics.',
          'Built early foundations in mathematical modelling and structured engineering problem solving.',
          'Received university scholarship recognition and joined academic competitions.',
        ],
        tags: ['Mechatronics', 'Control', 'Engineering maths'],
      },
      zh: {
        role: '机械电子工程 学士',
        summary:
          '机械电子工程本科训练——机械系统、电子学、控制基础与应用课程。',
        highlights: [
          '学习机械设计、电子学、控制基础与工程数学。',
          '建立数学建模与结构化工程问题求解的早期基础。',
          '获校级奖学金认定，参与学科竞赛。',
        ],
        tags: ['机电一体化', '控制', '工程数学'],
      },
    },
    {
      id: 'foxconn-work',
      period: '2023–2024',
      stage: 'Work',
      org: 'Foxconn',
      orgFull: 'Foxconn',
      media: 'assets/experience/2.jpeg',
      en: {
        role: 'Assistant Project Manager · Automation Engineering Support',
        summary:
          'Supported project management and manufacturing coordination for automated production line ramp-up in consumer electronics.',
        highlights: [
          'Coordinated cross-functional project tasks, meeting follow-ups, and action tracking during production preparation.',
          'Supported RFP preparation, DFM review, and project documentation for new product introduction.',
          'Tracked mass-production anomalies and followed up corrective actions with manufacturing teams.',
          'Contributed to ramp-up readiness through schedule alignment, documentation control, and issue tracking.',
        ],
        tags: ['Project management', 'Automation', 'NPI', 'DFM'],
      },
      zh: {
        role: '助理项目经理 · 自动化工程支持',
        summary:
          '在消费电子产品制造中，支持自动化产线爬坡的项目管理与制造协调工作。',
        highlights: [
          '生产准备期间协调跨职能项目任务、会议跟进与行动项追踪。',
          '支持 RFP 准备、DFM 评审与新产品导入的项目文档。',
          '追踪量产阶段异常，与制造团队跟进纠正措施。',
          '通过排期对齐、文档管控与问题追踪支撑爬坡就绪。',
        ],
        tags: ['项目管理', '自动化', 'NPI', 'DFM'],
      },
    },
    {
      id: 'luxshare-work',
      period: '2024–2025',
      stage: 'Work',
      org: 'Luxshare-ICT',
      orgFull: 'Luxshare-ICT',
      media: 'assets/experience/3.jpg',
      en: {
        role: 'Assistant Product Design Engineer',
        summary:
          'Supported mechanical component design documentation, engineering change tracking, and NPI build documentation for consumer electronics products.',
        highlights: [
          'Managed engineering drawing and BOM documentation for NPI builds, supporting version accuracy and release readiness.',
          'Prepared ECR/ECO comparison reports to track design changes, revision impact, and approval requirements.',
          'Used Siemens NX and AutoCAD to review 3D/2D drawings, mark up changes, and support manufacturing communication.',
          'Supported component design verification, installation documentation, and cross-functional coordination.',
        ],
        tags: ['Product design', 'NPI', 'ECO/ECR', 'Siemens NX', 'AutoCAD'],
      },
      zh: {
        role: '助理产品设计工程师',
        summary:
          '支持消费电子产品结构件设计文档、工程变更追踪与 NPI 试产文档。',
        highlights: [
          '管理 NPI 试产的工程图纸与 BOM 文档，保障版本准确与发布就绪。',
          '编制 ECR/ECO 对比报告，追踪设计变更、版本影响与审批要求。',
          '使用 Siemens NX 与 AutoCAD 审阅 3D/2D 图纸、标注变更，支持制造沟通。',
          '支持零件设计验证、装配文档与跨职能协调。',
        ],
        tags: ['产品设计', 'NPI', 'ECO/ECR', 'Siemens NX', 'AutoCAD'],
      },
    },
    {
      id: 'sutd-grad',
      period: '2025–2026',
      stage: 'Graduate',
      org: 'SUTD',
      orgFull: 'Singapore University of Technology and Design',
      media: 'assets/experience/4.jpg',
      en: {
        role: 'MSc in Robotics & Automation',
        summary:
          'MSc coursework and projects covering mobile robotics, control, robot intelligence, soft robotics, and a multi-robot graduation project.',
        highlights: [
          'Built and tested course projects involving TurtleBot3, ROS navigation, visual recognition, SLAM testing, and arm control.',
          'Delivered a real-robot Autonomous Security Robot demo — Ubuntu laptop + TurtleBot3, ROS navigation, YOLO/CLIP vision, exploratory SLAM.',
          'Completed a Robotic Arm Challenge: 6-DOF control, calibration, grasping, and integration with a mobile robot.',
          'Delivered RoboInspect — multi-robot indoor inspection spanning ROS 2 simulation, field-tested TurtleBot3 workflows, anomaly reporting, and an SO-ARM sorting station.',
        ],
        tags: ['ROS 2', 'Multi-robot', 'TurtleBot3', 'Nav2', 'Computer vision', 'SO-ARM101'],
      },
      zh: {
        role: '机器人与自动化 硕士',
        summary:
          '硕士课程与项目覆盖移动机器人、控制、机器人智能、软体机器人，以及多机器人毕业设计。',
        highlights: [
          '完成 TurtleBot3、ROS 导航、视觉识别、SLAM 测试与机械臂控制的课程实机项目。',
          '交付实机安保机器人演示——Ubuntu 笔记本 + TurtleBot3、ROS 导航、YOLO/CLIP 视觉、探索式 SLAM。',
          '完成机械臂挑战赛：6 自由度控制、标定、抓取及与移动机器人的任务集成。',
          '交付 RoboInspect——多机器人室内巡检，涵盖 ROS 2 仿真、TurtleBot3 实机流程、异常报告与 SO-ARM 分拣站。',
        ],
        tags: ['ROS 2', '多机器人', 'TurtleBot3', 'Nav2', '计算机视觉', 'SO-ARM101'],
      },
    },
  ];
})();
