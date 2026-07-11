(function () {
  const translations = {
    en: {
      meta: {
        title: 'Ryan Wong | Robotics & Automation Portfolio',
        description: "Ryan Wong's robotics and automation portfolio, covering ROS, TurtleBot3, robot navigation, AI vision, and manufacturing engineering experience.",
      },
      nav: {
        home: 'Home',
        about: 'About',
        projects: 'Projects',
        experience: 'Experience',
        contact: 'Contact',
        music: 'Music Zone',
        theme: 'Theme',
      },
      home: {
        eyebrow: 'Robotics & Automation Engineer · MSc, SUTD',
        heroTitle: 'Ryan Wong',
        heroSubtitle: 'I build robots that navigate, see, and act — ROS navigation, AI vision, and the manufacturing discipline to ship them into the real world.',
        cta: 'View Selected Work',
        ctaGithub: 'GitHub',
      },
      about: {
        title: 'Engineering in Motion',
        intro: 'Robotics & Automation engineer with an MSc from SUTD. Before robotics I worked in consumer-electronics manufacturing — NPI, DFM, and engineering documentation at Foxconn and Luxshare-ICT. Current focus: mobile robotics, ROS-based system integration, navigation, visual recognition, and practical automation workflows.',
        capabilitiesLabel: 'Capabilities',
        fileLabel: 'Station Master · Personnel File',
        name: 'Ryan Wong',
        class: 'Robotics & Automation Engineer',
        affil: 'MSc, SUTD · Class of 2026',
        blueprintAria: 'Self-drawing blueprint of a 6-DOF robotic arm',
        cards: [
          {
            title: 'Robotics & Automation',
            text: 'Hands-on experience with TurtleBot3, ROS navigation workflows, SLAM testing, sensor integration, and real-robot course demos.',
          },
          {
            title: 'Mechanical & Manufacturing Engineering',
            text: 'Background in NPI, engineering drawings, BOM documentation, ECO/ECR tracking, DFM support, and cross-functional manufacturing coordination.',
          },
          {
            title: 'Code, AI Vision & Documentation',
            text: 'Exploring Python, ROS, Git/GitHub, YOLO/CLIP-based visual recognition, and portfolio-style technical documentation to communicate engineering work clearly.',
          },
        ],
      },
      projects: {
        featured: 'Featured Projects',
        course: 'Course Projects',
        robotics: 'Robotics Projects',
        viewDetails: 'View Details',
        viewProject: 'View Project',
        technologies: 'Technologies',
        role: 'Role',
        outcome: 'Outcome',
        demo: 'Demo',
        documentation: 'Documentation',
        github: 'GitHub',
        portfolio: 'Portfolio',
        viewCase: 'View case file',
        showcaseAria: 'Project showcase',
        sphereAria: 'Project preview sphere',
        mediaPreview: 'Media preview',
        videoAria: [
          'Project 1 hero media video',
          'Project 2 hero media video',
          'Project 3 hero media video',
          'Project 4 hero media video',
        ],
        backToShowroom: 'Back to showroom',
        paperLink: 'View Full Research Paper',
        detailVideoLabel: 'Detail media video',
        detailPreview: 'Detail preview',
        items: [
          {
            eyebrow: 'Project 01 · Competition',
            title: 'Robotic Arm Challenge',
            subtitle: '4th place in the final live competition — a one-week team build where a 6-DOF arm grasps objects at arbitrary positions, loads a mobile vehicle, and triggers its run through a color-coded maze. My part: arm control (motion planning, calibration, real-hardware execution).',
          },
          {
            eyebrow: 'Project 02 · Design',
            title: 'Hango',
            subtitle: 'A semester-long design project by a five-person interdisciplinary team, developed through four staged reviews from research to an exhibited prototype. My part: visual communication, presentation structure, and the final exhibition video.',
          },
          {
            eyebrow: 'Project 03 · Soft Robotics',
            title: 'FlexiLock',
            subtitle: '10 kg load at −60 kPa with a 5.88 N·m bending moment — a pangolin-inspired vacuum scale-jamming sleeve for MAS grade 3–4 spasticity rehab, soft at rest and rigid on demand. My part: mechanism and soft-robotics design.',
          },
          {
            eyebrow: 'Project 04 · ROS2 Autonomy',
            title: 'Autonomous Security Robot',
            subtitle: 'An autonomous patrol robot for the SUTD Robotics Lab — frontier-based SLAM mapping without prior maps, Nav2 patrol, and YOLOv8 + CLIP zero-shot person classification fused with Lidar (<20 cm map projection error). My part: system architecture and control.',
          },
        ],
        details: [
          {
            kicker: 'Project 01',
            title: 'Robotic Arm Challenge',
            subtitle: '6-DOF arm control and task integration with a mobile robot.',
            descriptionHtml: 'This project is a one-week team-based competition combining mechanism design and control theory on a real robotic platform.<br><br>The task required a 6-DOF robotic arm to grasp objects at arbitrary positions, place them onto a mobile vehicle, and trigger the vehicle to autonomously navigate a color-coded maze.<br><br>I was primarily responsible for the robotic arm control, focusing on motion planning, calibration, and reliable execution under real-world hardware constraints.',
            meta: ['Role: Robotic Arm Control', 'Outcome: Final live competition'],
            splits: [
              {
                title: 'Competition Outcome',
                body: 'The system was evaluated in a final live competition. Our team achieved 4th place, with all grasping tasks completed reliably during the final runs.',
              },
              {
                title: 'System Workflow',
                body: 'The workflow reflects how ideal kinematic models were adapted to real hardware conditions, including servo offsets, polarity differences, and power-related variation.',
              },
            ],
          },
          {
            kicker: 'Project 02',
            title: 'Hango',
            subtitle: 'A semester-long interdisciplinary innovation design project.',
            description: 'Hango is a semester-long collaborative design project developed by a five-person interdisciplinary team. Through four staged presentations, we refined the concept from early research into a final prototype and exhibition narrative, balancing clarity, feasibility, and visitor experience. My contributions focused on visual communication, presentation structure, and the final exhibition prototype display video.',
            meta: ['Role: Visual Communication', 'Format: Innovation Design Project'],
            splits: [
              {
                title: 'Design Synthesis',
                body: 'The final exhibition poster condensed insights from four design phases into a single, cohesive narrative structure.',
              },
              {
                title: 'Team Collaboration',
                body: 'An interdisciplinary team of five brought together diverse backgrounds throughout the full design process.',
              },
            ],
          },
          {
            kicker: 'Project 03',
            title: 'FlexiLock: Variable Stiffness Support',
            subtitle: 'Soft compliant rest, rigid on demand.',
            description: 'A bio-inspired variable-stiffness wearable concept for stroke rehabilitation, connecting soft robotics, mechanism design, and assistive healthcare applications. The prototype uses a vacuum-actuated scale jamming mechanism to transition from a flexible state to a rigid support structure.',
            meta: ['Role: Soft Robotics & Mechanism Design', 'Tech: 3D Printing, Vacuum Actuation'],
            splits: [
              {
                title: 'Bio-Inspired Scale Jamming',
                body: 'Inspired by pangolin armour geometry, we developed a variable stiffness mechanism utilizing geometric interlocking. Vacuum actuation creates friction between overlapping scales, allowing rapid transition from soft to rigid states.',
              },
              {
                title: 'Design Iteration & Fabrication',
                body: 'The scale morphology underwent iterations to optimize overlap ratio and friction interface. The final wearable assembly integrates 3D-printed PLA scales within a custom-sealed nylon envelope.',
              },
              {
                title: 'Mechanical Validation',
                body: 'Quantitative testing demonstrated load-bearing capacity. Under -60 kPa operating pressure, FlexiLock withstood a 10 kg dead-weight load without visible deformation, yielding a 5.88 Nm bending moment.',
              },
              {
                title: 'Mathematical Modeling & Analysis',
                body: 'A dimensional analysis was performed to extract core non-dimensional groups, followed by a power-law regression model for predicting force output.',
              },
            ],
          },
          {
            kicker: 'Project 04',
            title: 'Autonomous Security Robot',
            subtitle: 'ROS navigation, AI vision, and exploratory SLAM testing for indoor inspection.',
            description: 'A real-robot course demo using Ubuntu laptop + TurtleBot3, ROS navigation, YOLO/CLIP-based visual recognition, and exploratory SLAM testing for indoor security inspection scenarios.',
            meta: ['Role: System Architecture & Control', 'Tech: ROS2, YOLOv8, CLIP, Nav2, Lidar'],
            splits: [
              {
                title: 'AI Vision & Asynchronous Reasoning',
                body: 'The vision server integrates YOLOv8 for detection and CLIP for semantic classification. By combining camera bearings with Lidar point clouds, the system projects classified markers onto the global map.',
              },
              {
                title: 'Mission Orchestration & Navigation',
                body: 'A mission state machine manages patrol behavior, dispatches the robot to target rooms using Nav2, performs 360-degree surveillance rotations, and monitors visual STOP signs for restricted zones.',
              },
            ],
          },
        ],
      },
      experience: {
        title: 'Experience',
        subtitle: 'Departure board — every stop since 2018',
        timelineAria: 'Experience timeline',
        mediaAlt: 'Experience media',
        mediaCollageAlt: 'Experience media collage',
        boardTitle: 'Departures',
        colTime: 'Time',
        colDest: 'Destination',
        colStatus: 'Status',
        statusBoarding: 'Boarding',
        statusDeparted: 'Departed',
        nextPeriod: '2026—',
        nextDest: 'Next Destination',
        nextHint: 'Open to Robotics & Automation roles',
        nextAria: 'Next destination — contact me',
        items: [
          {
            id: 'tust-undergrad',
            periodLabel: '2018–2021',
            stageTag: 'Undergraduate',
            orgName: 'Tianjin University of Science & Technology',
            roleOrMajor: 'B.Eng. in Mechatronic Engineering',
            summary: 'Completed undergraduate training in mechatronic engineering, building a foundation in mechanical systems, electronics, control fundamentals, and applied engineering coursework.',
            highlights: [
              'Studied mechanical design, electronics, control fundamentals, and engineering mathematics.',
              'Developed early exposure to mathematical modeling and structured engineering problem solving.',
              'Received university scholarship recognition and participated in academic competitions.',
            ],
            tags: ['Mechatronics', 'Control Fundamentals', 'Engineering Mathematics', 'Mechanical Systems'],
          },
          {
            id: 'foxconn-work',
            periodLabel: '2023–2024',
            stageTag: 'Work',
            orgName: 'Foxconn',
            roleOrMajor: 'Assistant Project Manager / Automation Engineering Support',
            summary: 'Supported project management and manufacturing coordination activities for automated production line ramp-up in consumer electronics manufacturing.',
            highlights: [
              'Coordinated cross-functional project tasks, meeting follow-ups, and action tracking during production preparation.',
              'Supported RFP preparation, DFM review, and project documentation for new product introduction activities.',
              'Tracked MP-stage anomalies and followed up corrective actions with manufacturing teams.',
              'Contributed to production ramp-up readiness through schedule alignment, documentation control, and issue tracking.',
            ],
            tags: ['Project Management', 'Automation', 'NPI', 'DFM', 'Manufacturing Coordination'],
          },
          {
            id: 'luxshare-work',
            periodLabel: '2024–2025',
            stageTag: 'Work',
            orgName: 'Luxshare-ICT',
            roleOrMajor: 'Assistant Product Design Engineer',
            summary: 'Supported internal mechanical component design documentation, engineering change tracking, and NPI build documentation for consumer electronics products.',
            highlights: [
              'Managed engineering drawing and BOM documentation for NPI builds, supporting version accuracy and release readiness.',
              'Prepared ECR/ECO comparison reports to track design changes, revision impact, and approval requirements.',
              'Used Siemens NX and AutoCAD to review 3D/2D drawings, mark up changes, and support manufacturing communication.',
              'Supported component design verification, installation documentation, and cross-functional engineering coordination.',
            ],
            tags: ['Product Design', 'NPI', 'Engineering Documentation', 'ECO/ECR', 'Siemens NX', 'AutoCAD'],
          },
          {
            id: 'sutd-grad',
            periodLabel: '2025–2026',
            stageTag: 'Graduate',
            orgName: 'Singapore University of Technology and Design (SUTD)',
            roleOrMajor: 'MSc in Robotics & Automation',
            summary: 'Completed an MSc in Robotics & Automation with hands-on coursework and projects covering mobile robotics, control, robot intelligence, soft robotics, and design project development.',
            highlights: [
              'Built and tested course projects involving TurtleBot3, ROS navigation, visual recognition, SLAM testing, and robotic arm control.',
              'Completed a real-robot Autonomous Security Robot demo using Ubuntu laptop + TurtleBot3, ROS navigation, YOLO/CLIP-based visual recognition, and exploratory SLAM testing.',
              'Completed a Robotic Arm Challenge involving 6-DOF arm control, calibration, object grasping, and task integration with a mobile robot.',
              'Delivered a capstone Design Project focused on robotics/automation system integration, prototyping, testing, and final demonstration.',
            ],
            tags: ['ROS', 'TurtleBot3', 'Robot Navigation', 'YOLO', 'CLIP', 'SLAM Testing', 'Robotic Arm', 'System Integration'],
          },
        ],
      },
      contact: {
        title: 'Contact',
        subtitle: "Let's connect",
        phone: 'Phone',
        phoneNote: 'Available on WhatsApp / WeChat',
        email: 'Email',
        sendEmail: 'Send an email',
        location: 'Location',
        locationValue: 'Singapore / Hougang',
        viewLinkedIn: 'View LinkedIn profile',
        copySingaporePhone: 'Copy Singapore phone number',
        copyChinaPhone: 'Copy China phone number',
        copy163: 'Copy 163 email address',
        viewGitHub: 'View GitHub profile',
      },
      musicModal: {
        title: 'Please Note',
        subtitle: 'Music Zone',
        body: 'You are about to enter the leisure zone',
        bodySecond: 'Continue to the music player?',
      },
      musicPlayer: {
        meta: {
          title: 'Music Zone - Acid Glitch Hub',
          description: 'Ryan Station music player and AI mood terminal.',
        },
        playlistToggle: 'Toggle Playlist',
        playlist: 'Playlist',
        playQueue: 'Play Queue',
        home: 'Home',
        headingLabel: 'Ryan Station',
        title: 'Music Zone',
        unloaded: 'No music loaded',
        terminal: 'AI TERMINAL',
        settings: 'Configure Gemini API Key',
        inputPlaceholder: '> enter mood to hack the system',
        collapseTerminal: 'Collapse terminal log',
        systemReady: '> SYSTEM: Ready for commands.',
        noSignal: 'NO SIGNAL',
        playing: 'PLAYING...',
        signalTracking: 'SIGNAL TRACKING',
        mascotAlt: 'Ryan Station Mascot',
        expandTerminal: 'Expand terminal log',
        playModes: {
          sequential: 'Sequential play',
          random: 'Shuffle play',
          single: 'Single repeat',
          fallback: 'Play mode',
        },
        controls: {
          previous: 'Previous track',
          playPause: 'Play / Pause',
          next: 'Next track',
          volume: 'Volume',
        },
        geminiPrompt: 'Enter Gemini API Key (leave blank to clear):',
        geminiSaved: '> SYSTEM: Gemini API key saved.',
        geminiCleared: '> SYSTEM: Gemini API key cleared.',
        playingTrack: '> SYSTEM: Playing "{title}"',
        notFound: '> SYSTEM: Could not find "{target}".',
        unknownCommand: '> SYSTEM: Unknown command "{command}".',
      },
      viewHint: {
        title: 'Best viewed on landscape or desktop',
        subtitle: 'Viewing suggestion',
        body: 'This site is optimized for larger screens.',
        bodySecond: 'Portrait mobile is supported with a simplified layout.',
      },
      common: {
        switchLanguage: 'Switch language',
        copy: 'Copy',
        copied: 'Copied',
        close: 'Close',
        closePreview: 'Close preview',
        yes: 'Yes',
        no: 'No',
        gotIt: 'Got it',
        loading: 'Loading',
      },
    },
    zh: {
      meta: {
        title: 'Ryan Wong | 机器人与自动化作品集',
        description: 'Ryan Wong 的机器人与自动化作品集，涵盖 ROS、TurtleBot3、机器人导航、AI 视觉和制造工程经历。',
      },
      nav: {
        home: '首页',
        about: '关于我',
        projects: '项目',
        experience: '经历',
        contact: '联系',
        music: '音乐区',
        theme: '主题',
      },
      home: {
        eyebrow: '机器人与自动化工程师 · SUTD 硕士',
        heroTitle: 'Ryan Wong',
        heroSubtitle: '我做能自主导航、能看懂环境、能真正落地的机器人——ROS 导航、AI 视觉，以及把它们送进真实世界的制造工程功底。',
        cta: '查看精选作品',
        ctaGithub: 'GitHub',
      },
      about: {
        title: '让工程动起来',
        intro: '机器人与自动化工程师，SUTD 硕士。进入机器人领域前在消费电子制造业工作——在富士康与立讯精密负责 NPI、DFM 与工程文档。当前方向：移动机器人、基于 ROS 的系统集成、导航、视觉识别与可落地的自动化流程。',
        capabilitiesLabel: '能力',
        fileLabel: '站长档案 · Personnel File',
        name: 'Ryan Wong',
        class: '机器人与自动化工程师',
        affil: '新加坡科技设计大学（SUTD）硕士 · 2026 届',
        blueprintAria: '一张自动绘制的六自由度机械臂蓝图',
        cards: [
          {
            title: '机器人与自动化',
            text: '具备 TurtleBot3、ROS 导航流程、SLAM 测试、传感器集成和真实机器人课程 Demo 的实践经验。',
          },
          {
            title: '机械与制造工程',
            text: '具备 NPI、工程图纸、BOM 文档、ECO/ECR 变更追踪、DFM 支持和跨职能制造协调经验。',
          },
          {
            title: '代码、AI 视觉与技术文档',
            text: '持续探索 Python、ROS、Git/GitHub、基于 YOLO/CLIP 的视觉识别，以及用于清晰呈现工程成果的作品集式技术文档。',
          },
        ],
      },
      projects: {
        featured: '精选项目',
        course: '课程项目',
        robotics: '机器人项目',
        viewDetails: '查看详情',
        viewProject: '查看项目',
        technologies: '技术栈',
        role: '职责',
        outcome: '成果',
        demo: '演示',
        documentation: '文档',
        github: 'GitHub',
        portfolio: '作品集',
        viewCase: '查看案例档案',
        showcaseAria: '项目展示',
        sphereAria: '项目预览球体',
        mediaPreview: '媒体预览',
        videoAria: [
          '项目 1 主视觉视频',
          '项目 2 主视觉视频',
          '项目 3 主视觉视频',
          '项目 4 主视觉视频',
        ],
        backToShowroom: '返回项目展厅',
        paperLink: '查看完整研究论文',
        detailVideoLabel: '项目详情视频',
        detailPreview: '项目详情预览',
        items: [
          {
            eyebrow: '项目 01 · 竞赛',
            title: 'Robotic Arm Challenge',
            subtitle: '决赛第 4 名——一周团队竞赛：6 自由度机械臂完成任意位姿抓取、装载小车并触发其穿越颜色迷宫。我负责机械臂控制：运动规划、标定与实机执行。',
          },
          {
            eyebrow: '项目 02 · 设计',
            title: 'Hango',
            subtitle: '五人跨学科团队的学期设计项目，经四轮评审从调研推进到展出原型。我负责视觉传达、汇报结构与最终展览视频。',
          },
          {
            eyebrow: '项目 03 · 软体机器人',
            title: 'FlexiLock',
            subtitle: '−60 kPa 下承载 10 kg、弯矩 5.88 N·m——穿山甲鳞片启发的真空锁止护具，静息柔顺、按需刚性，面向 MAS 3–4 级上肢痉挛康复。我负责机构与软体设计。',
          },
          {
            eyebrow: '项目 04 · ROS2 自主系统',
            title: 'Autonomous Security Robot',
            subtitle: 'SUTD 机器人实验室的自主巡逻机器人——frontier SLAM 无图建图、Nav2 巡逻、YOLOv8 + CLIP 零样本人员识别并与 Lidar 融合（全局投影误差 <20 cm）。我负责系统架构与控制。',
          },
        ],
        details: [
          {
            kicker: '项目 01',
            title: 'Robotic Arm Challenge',
            subtitle: '6 自由度机械臂控制，以及与移动机器人平台的任务集成。',
            descriptionHtml: '这是一个为期一周的团队竞赛项目，在真实机器人平台上结合机构设计与控制方法。<br><br>任务要求 6 自由度机械臂在任意位置抓取物体，将其放置到移动小车上，并触发小车自主通过颜色标记迷宫。<br><br>我主要负责机械臂控制部分，重点包括运动规划、标定，以及在真实硬件约束下实现稳定执行。',
            meta: ['职责：机械臂控制', '成果：最终现场竞赛'],
            splits: [
              {
                title: '竞赛结果',
                body: '系统在最终现场竞赛中完成评估。团队获得第 4 名，最终运行中抓取任务表现稳定。',
              },
              {
                title: '系统流程',
                body: '项目流程体现了如何将理想运动学模型适配到真实硬件条件，包括舵机偏置、极性差异和供电波动等问题。',
              },
            ],
          },
          {
            kicker: '项目 02',
            title: 'Hango',
            subtitle: '一个学期制跨学科创新设计项目。',
            description: 'Hango 是一个由五人跨学科团队完成的学期制协作设计项目。通过四个阶段性展示，我们将概念从早期调研逐步推进到最终原型和展览叙事，在清晰度、可行性和观众体验之间取得平衡。我的贡献主要集中在视觉表达、汇报结构和最终展览原型展示视频。',
            meta: ['职责：视觉表达', '形式：创新设计项目'],
            splits: [
              {
                title: '设计整合',
                body: '最终展览海报将四个设计阶段的洞察整合为一套清晰、连贯的叙事结构。',
              },
              {
                title: '团队协作',
                body: '五人跨学科团队在完整设计流程中结合不同背景，共同推进项目概念与展示。',
              },
            ],
          },
          {
            kicker: '项目 03',
            title: 'FlexiLock: Variable Stiffness Support',
            subtitle: '静止时柔顺，需要时刚性支撑。',
            description: '一个面向中风康复的仿生变刚度可穿戴概念项目，连接软体机器人、机构设计与辅助医疗应用场景。原型采用真空驱动的鳞片阻塞机制，在柔性状态和刚性支撑状态之间切换。',
            meta: ['职责：软体机器人与机构设计', '技术：3D 打印、真空驱动'],
            splits: [
              {
                title: '仿生鳞片阻塞机制',
                body: '受穿山甲鳞甲几何结构启发，我们开发了利用几何互锁的变刚度机制。真空驱动使重叠鳞片之间形成摩擦，从而实现柔性到刚性的快速切换。',
              },
              {
                title: '设计迭代与制造',
                body: '鳞片形态经过多轮迭代，用于优化重叠比例和摩擦界面。最终可穿戴组件将 3D 打印 PLA 鳞片集成到定制密封尼龙包覆结构中。',
              },
              {
                title: '力学验证',
                body: '定量测试验证了装置的承载能力。在 -60 kPa 工作压力下，FlexiLock 可承受 10 kg 静载而无明显变形，并产生 5.88 Nm 弯矩。',
              },
              {
                title: '数学建模与分析',
                body: '项目进一步进行了量纲分析以提取核心无量纲参数，并建立幂律回归模型，用于预测结构输出力。',
              },
            ],
          },
          {
            kicker: '项目 04',
            title: 'Autonomous Security Robot',
            subtitle: '面向室内巡检的 ROS 导航、AI 视觉与探索性 SLAM 测试。',
            description: '一个基于 Ubuntu 笔记本与 TurtleBot3 的真实机器人课程 Demo，结合 ROS 导航、基于 YOLO/CLIP 的视觉识别，以及面向室内安防巡检场景的探索性 SLAM 测试。',
            meta: ['职责：系统架构与控制', '技术：ROS2、YOLOv8、CLIP、Nav2、Lidar'],
            splits: [
              {
                title: 'AI 视觉与异步推理',
                body: '视觉服务器结合 YOLOv8 进行目标检测，并使用 CLIP 完成语义分类。系统将相机方向信息与 Lidar 点云融合，把分类标记投影到全局地图中。',
              },
              {
                title: '任务调度与导航',
                body: '任务状态机管理巡检流程，使用 Nav2 将机器人派发到目标房间，执行 360 度巡视旋转，并通过视觉 STOP 标识识别受限区域。',
              },
            ],
          },
        ],
      },
      experience: {
        title: '经历',
        subtitle: '出发信息板 · 2018 年以来的每一站',
        timelineAria: '经历时间线',
        mediaAlt: '经历图片',
        mediaCollageAlt: '经历图片组合',
        boardTitle: '出发 Departures',
        colTime: '时刻',
        colDest: '目的地',
        colStatus: '状态',
        statusBoarding: '检票中',
        statusDeparted: '已出发',
        nextPeriod: '2026—',
        nextDest: '下一站',
        nextHint: '机器人与自动化方向 · 开放接洽',
        nextAria: '下一站——联系我',
        items: [
          {
            id: 'tust-undergrad',
            periodLabel: '2018–2021',
            stageTag: '本科阶段',
            orgName: '天津科技大学',
            roleOrMajor: '机械电子工程 工学学士',
            summary: '完成机械电子工程本科阶段学习，建立了机械系统、电子技术、控制基础和应用工程课程方面的基础。',
            highlights: [
              '学习机械设计、电子技术、控制基础和工程数学等课程。',
              '初步接触数学建模和结构化工程问题分析方法。',
              '曾获得校级奖学金，并参与学科竞赛。',
            ],
            tags: ['机电工程', '控制基础', '工程数学', '机械系统'],
          },
          {
            id: 'foxconn-work',
            periodLabel: '2023–2024',
            stageTag: '工作经历',
            orgName: '富士康',
            roleOrMajor: '助理项目管理 / 自动化工程支持',
            summary: '在消费电子制造场景中，支持自动化产线导入与爬坡阶段的项目管理和制造协调工作。',
            highlights: [
              '在生产准备阶段协调跨职能项目任务、会议跟进和行动项追踪。',
              '支持 RFP 准备、DFM 评审和新产品导入相关项目文档。',
              '跟踪 MP 阶段异常，并与制造团队跟进改善措施。',
              '通过进度对齐、文档管控和问题追踪，支持产线爬坡与量产准备。',
            ],
            tags: ['项目管理', '自动化', 'NPI', 'DFM', '制造协调'],
          },
          {
            id: 'luxshare-work',
            periodLabel: '2024–2025',
            stageTag: '工作经历',
            orgName: '立讯精密',
            roleOrMajor: '助理产品设计工程师',
            summary: '支持消费电子产品内部机械部件的设计文档、工程变更追踪和 NPI 试产文档工作。',
            highlights: [
              '管理 NPI 试产阶段的工程图纸和 BOM 文档，支持版本准确性和发布准备。',
              '准备 ECR/ECO 变更对比报告，用于追踪设计变更、影响范围和审批需求。',
              '使用 Siemens NX 和 AutoCAD 查看 3D/2D 图纸、标注修改点，并支持制造端沟通。',
              '支持部件设计验证、安装文档整理和跨职能工程协调。',
            ],
            tags: ['产品设计', 'NPI', '工程文档', 'ECO/ECR', 'Siemens NX', 'AutoCAD'],
          },
          {
            id: 'sutd-grad',
            periodLabel: '2025–2026',
            stageTag: '研究生阶段',
            orgName: '新加坡科技设计大学（SUTD）',
            roleOrMajor: '机器人与自动化 理学硕士',
            summary: '已完成机器人与自动化硕士项目，课程与项目覆盖移动机器人、控制、机器人智能、软体机器人和设计项目开发。',
            highlights: [
              '构建并测试涉及 TurtleBot3、ROS 导航、视觉识别、SLAM 测试和机械臂控制的课程项目。',
              '完成真实机器人 Autonomous Security Robot Demo，使用 Ubuntu 笔记本 + TurtleBot3，结合 ROS 导航、YOLO/CLIP 视觉识别和探索性 SLAM 测试。',
              '完成 Robotic Arm Challenge，涉及 6 自由度机械臂控制、标定、物体抓取和与移动机器人的任务集成。',
              '完成 Capstone Design Project，重点关注机器人/自动化系统集成、原型搭建、测试和最终演示。',
            ],
            tags: ['ROS', 'TurtleBot3', '机器人导航', 'YOLO', 'CLIP', 'SLAM 测试', '机械臂', '系统集成'],
          },
        ],
      },
      contact: {
        title: '联系',
        subtitle: '欢迎交流',
        phone: '电话',
        phoneNote: '可通过 WhatsApp / WeChat 联系',
        email: '邮箱',
        sendEmail: '发送邮件',
        location: '地点',
        locationValue: '新加坡 / 后港',
        viewLinkedIn: '查看 LinkedIn 主页',
        copySingaporePhone: '复制新加坡手机号',
        copyChinaPhone: '复制中国手机号',
        copy163: '复制 163 邮箱',
        viewGitHub: '查看 GitHub 主页',
      },
      musicModal: {
        title: '请注意',
        subtitle: '音乐区',
        body: '即将进入休闲区域',
        bodySecond: '是否继续前往音乐播放器？',
      },
      musicPlayer: {
        meta: {
          title: '音乐区 - Acid Glitch Hub',
          description: 'Ryan Station 音乐播放器与 AI 心情终端。',
        },
        playlistToggle: '切换播放列表',
        playlist: '播放列表',
        playQueue: '播放队列',
        home: '首页',
        headingLabel: 'Ryan Station',
        title: '音乐区',
        unloaded: '未加载音乐',
        terminal: 'AI 终端',
        settings: '配置 Gemini API Key',
        inputPlaceholder: '> 输入心情来唤醒系统',
        collapseTerminal: '折叠终端日志',
        systemReady: '> 系统：等待指令。',
        noSignal: '无信号',
        playing: '播放中...',
        signalTracking: '信号追踪',
        mascotAlt: 'Ryan Station 吉祥物',
        expandTerminal: '展开终端日志',
        playModes: {
          sequential: '顺序播放',
          random: '随机播放',
          single: '单曲循环',
          fallback: '播放模式',
        },
        controls: {
          previous: '上一首',
          playPause: '播放 / 暂停',
          next: '下一首',
          volume: '音量',
        },
        geminiPrompt: '输入 Gemini API Key（留空则清除）：',
        geminiSaved: '> 系统：Gemini API Key 已保存。',
        geminiCleared: '> 系统：Gemini API Key 已清除。',
        playingTrack: '> 系统：正在播放《{title}》',
        notFound: '> 系统：未找到《{target}》。',
        unknownCommand: '> 系统：未知指令「{command}」。',
      },
      viewHint: {
        title: '建议横屏或桌面查看',
        subtitle: '查看建议',
        body: '此页面在大屏上有更完整的展示效果。',
        bodySecond: '手机竖屏已提供简化布局。',
      },
      common: {
        switchLanguage: '切换语言',
        copy: '复制',
        copied: '已复制',
        close: '关闭',
        closePreview: '关闭预览',
        yes: '是',
        no: '否',
        gotIt: '知道了',
        loading: '加载中',
      },
    },
  };

  const listeners = new Set();
  let currentLanguage = 'en';

  const getByPath = (source, path) => (
    path.split('.').reduce((value, key) => {
      if (value == null) return undefined;
      return value[key];
    }, source)
  );

  const getStoredLanguage = () => {
    try {
      const stored = localStorage.getItem('preferredLanguage');
      if (stored === 'en' || stored === 'zh') return stored;
    } catch (error) {
      return null;
    }
    return null;
  };

  const getInitialLanguage = () => {
    const stored = getStoredLanguage();
    if (stored) return stored;
    return 'en';
  };

  const translate = (path, lang = currentLanguage) => {
    const value = getByPath(translations[lang], path);
    if (value !== undefined) return value;
    return getByPath(translations.en, path) || '';
  };

  const applyDocumentMeta = (lang) => {
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';
    const metaPrefix = document.body && document.body.dataset.page === 'music' ? 'musicPlayer.meta' : 'meta';
    document.title = translate(`${metaPrefix}.title`, lang);
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute('content', translate(`${metaPrefix}.description`, lang));
    }
  };

  const applyStaticTranslations = (lang = currentLanguage) => {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n'), lang);
      if (value !== undefined) {
        element.textContent = value;
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-aria-label'), lang);
      if (value !== undefined) {
        element.setAttribute('aria-label', value);
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-title'), lang);
      if (value !== undefined) {
        element.setAttribute('title', value);
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-placeholder'), lang);
      if (value !== undefined) {
        element.setAttribute('placeholder', value);
      }
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((element) => {
      const value = translate(element.getAttribute('data-i18n-alt'), lang);
      if (value !== undefined) {
        element.setAttribute('alt', value);
      }
    });

    document.querySelectorAll('.language-option').forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    document.body.classList.toggle('lang-zh', lang === 'zh');
    applyDocumentMeta(lang);
  };

  const setLanguage = (lang, { persist = true } = {}) => {
    if (lang !== 'en' && lang !== 'zh') return;
    currentLanguage = lang;
    if (persist) {
      try {
        localStorage.setItem('preferredLanguage', lang);
      } catch (error) {
        // localStorage may be unavailable in private browsing contexts.
      }
    }
    applyStaticTranslations(lang);
    listeners.forEach((listener) => listener(lang));
  };

  window.PortfolioI18n = {
    translations,
    getLanguage: () => currentLanguage,
    setLanguage,
    t: translate,
    get(path, lang = currentLanguage) {
      const value = getByPath(translations[lang], path);
      if (value !== undefined) return value;
      return getByPath(translations.en, path);
    },
    onChange(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    applyStaticTranslations,
  };

  document.addEventListener('DOMContentLoaded', () => {
    currentLanguage = getInitialLanguage();
    document.querySelectorAll('.language-option').forEach((button) => {
      button.addEventListener('click', () => {
        setLanguage(button.dataset.lang || 'en');
      });
    });
    applyStaticTranslations(currentLanguage);
  });
})();
