export interface RawDomainTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  cloudStyle: 'cumulus' | 'stratus' | 'cirrus' | 'cumulonimbus';
  particleStyle: 'dots' | 'lines' | 'stars' | 'hexagons' | 'nodes';
  lightingStyle: 'warm' | 'cool' | 'electric' | 'neon' | 'soft';
  atmosphere: string;
  objectType: string;
  fogColor: string;
  emissiveColor: string;
}

export interface RawSubDomain {
  id: string;
  domainId: string;
  name: string;
  icon: string;
  description: string;
  careerIds: string[];
  position: [number, number, number];
  scale: number;
}

export interface RawDomain {
  id: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  careerCount: number;
  avgSalary: string;
  growthRate: string;
  theme: RawDomainTheme;
  subDomains: RawSubDomain[];
  position: [number, number, number];
  scale: number;
}

// 20 Distinct 3D Domains with orbital spatial positioning (Radius ~15, spread evenly)
export const rawDomains: RawDomain[] = [
  // 1. Full Stack Development
  {
    id: 'fullstack-development',
    name: 'Full Stack Development',
    icon: '🔗',
    description: 'Master frontend, backend, databases, and DevOps to ship complete web applications independently.',
    tagline: 'Build everything, end to end',
    careerCount: 2,
    avgSalary: '$108,000',
    growthRate: '+19%',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#60a5fa',
      accentColor: '#93c5fd',
      gradientFrom: '#1e3a8a',
      gradientTo: '#1e40af',
      cloudStyle: 'cumulus',
      particleStyle: 'nodes',
      lightingStyle: 'electric',
      atmosphere: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
      objectType: 'fullstack_core',
      fogColor: '#1d4ed8',
      emissiveColor: '#3b82f6',
    },
    subDomains: [
      { id: 'fullstack-mern', domainId: 'fullstack-development', name: 'MERN & Node', icon: '⚡', description: 'React, Node.js, Express, MongoDB and REST APIs', careerIds: ['fullstack-developer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'fullstack-nextjs', domainId: 'fullstack-development', name: 'Next.js & Serverless', icon: '🚀', description: 'App Router, Server Actions, PostgreSQL & Prisma', careerIds: ['fullstack-developer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [14.0, 2.0, 0.0],
    scale: 1.1,
  },

  // 2. Frontend Development
  {
    id: 'frontend-development',
    name: 'Frontend Development',
    icon: '🎨',
    description: 'Craft beautiful, accessible, and performant user interfaces with modern React, TypeScript, and Tailwind.',
    tagline: 'Craft the faces of the web',
    careerCount: 1,
    avgSalary: '$95,000',
    growthRate: '+15%',
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24',
      accentColor: '#fde68a',
      gradientFrom: '#78350f',
      gradientTo: '#b45309',
      cloudStyle: 'stratus',
      particleStyle: 'dots',
      lightingStyle: 'warm',
      atmosphere: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
      objectType: 'ui_canvas',
      fogColor: '#b45309',
      emissiveColor: '#f59e0b',
    },
    subDomains: [
      { id: 'frontend-react', domainId: 'frontend-development', name: 'React Ecosystem', icon: '⚛️', description: 'React 19, Next.js, Redux, and Tailwind CSS', careerIds: ['frontend-developer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'frontend-webgl', domainId: 'frontend-development', name: 'Creative Web & Motion', icon: '✨', description: 'Three.js, Framer Motion, GSAP, and Canvas', careerIds: ['frontend-developer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [13.0, 4.0, 4.5],
    scale: 1.1,
  },

  // 3. Backend Development
  {
    id: 'backend-development',
    name: 'Backend Development',
    icon: '⚡',
    description: 'Design robust server architectures, high-throughput microservices, real-time pipelines, and APIs.',
    tagline: 'Power the engines of the internet',
    careerCount: 1,
    avgSalary: '$112,000',
    growthRate: '+21%',
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#34d399',
      accentColor: '#6ee7b7',
      gradientFrom: '#064e3b',
      gradientTo: '#047857',
      cloudStyle: 'cumulonimbus',
      particleStyle: 'lines',
      lightingStyle: 'electric',
      atmosphere: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
      objectType: 'server_rack',
      fogColor: '#059669',
      emissiveColor: '#10b981',
    },
    subDomains: [
      { id: 'backend-node', domainId: 'backend-development', name: 'Node.js & Go', icon: '🟩', description: 'High-throughput APIs, microservices, and gRPC', careerIds: ['backend-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'backend-distributed', domainId: 'backend-development', name: 'Distributed Systems', icon: '🌐', description: 'Kafka message streaming, Redis caching, and RabbitMQ', careerIds: ['backend-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [10.0, -1.0, 9.5],
    scale: 1.1,
  },

  // 4. Mobile & App Development
  {
    id: 'app-development',
    name: 'Mobile & App Development',
    icon: '📱',
    description: 'Build native and cross-platform mobile apps for Android, iOS, and millions of global smartphone users.',
    tagline: 'Build the apps that live in every pocket',
    careerCount: 4,
    avgSalary: '$102,000',
    growthRate: '+22%',
    theme: {
      primaryColor: '#06b6d4',
      secondaryColor: '#22d3ee',
      accentColor: '#67e8f9',
      gradientFrom: '#164e63',
      gradientTo: '#0891b2',
      cloudStyle: 'cumulus',
      particleStyle: 'dots',
      lightingStyle: 'cool',
      atmosphere: 'linear-gradient(135deg, #164e63 0%, #083344 100%)',
      objectType: 'smartphone',
      fogColor: '#0891b2',
      emissiveColor: '#06b6d4',
    },
    subDomains: [
      { id: 'android', domainId: 'app-development', name: 'Android Native', icon: '🤖', description: 'Kotlin, Jetpack Compose, Coroutines & Room', careerIds: ['android-developer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'ios', domainId: 'app-development', name: 'iOS Native', icon: '🍎', description: 'Swift, SwiftUI, SwiftData & Combine', careerIds: ['ios-developer'], position: [2, 1, -1], scale: 0.7 },
      { id: 'flutter', domainId: 'app-development', name: 'Flutter', icon: '🎯', description: 'Dart, Riverpod & cross-platform apps', careerIds: ['flutter-developer'], position: [-2, -1, -1], scale: 0.7 },
      { id: 'react-native', domainId: 'app-development', name: 'React Native', icon: '⚛️', description: 'TypeScript, Expo, Reanimated & mobile apps', careerIds: ['react-native-developer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [5.0, 3.5, 13.0],
    scale: 1.2,
  },

  // 5. Artificial Intelligence
  {
    id: 'artificial-intelligence',
    name: 'Artificial Intelligence',
    icon: '🧠',
    description: 'Work at the frontier of artificial cognitive architectures, multi-agent systems, and neural research.',
    tagline: 'Shape synthetic minds and autonomous intelligence',
    careerCount: 1,
    avgSalary: '$145,000',
    growthRate: '+40%',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#818cf8',
      accentColor: '#a5b4fc',
      gradientFrom: '#312e81',
      gradientTo: '#4338ca',
      cloudStyle: 'cumulonimbus',
      particleStyle: 'nodes',
      lightingStyle: 'electric',
      atmosphere: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
      objectType: 'neural_net',
      fogColor: '#4f46e5',
      emissiveColor: '#6366f1',
    },
    subDomains: [
      { id: 'ai-research', domainId: 'artificial-intelligence', name: 'AI Core & Agents', icon: '🤖', description: 'Multi-agent frameworks, reasoning engines & neural networks', careerIds: ['ai-researcher'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'computer-vision', domainId: 'artificial-intelligence', name: 'Computer Vision', icon: '👁️', description: 'YOLO, object tracking, OpenCV & vision models', careerIds: ['ai-researcher'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [0.0, 5.0, 14.5],
    scale: 1.1,
  },

  // 6. Machine Learning
  {
    id: 'machine-learning',
    name: 'Machine Learning & MLOps',
    icon: '⚙️',
    description: 'Design, train, optimize, and deploy industrial-grade machine learning models to high-scale production.',
    tagline: 'Train predictive models that power enterprise automation',
    careerCount: 1,
    avgSalary: '$140,000',
    growthRate: '+38%',
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#a78bfa',
      accentColor: '#c4b5fd',
      gradientFrom: '#4c1d95',
      gradientTo: '#6d28d9',
      cloudStyle: 'cumulonimbus',
      particleStyle: 'nodes',
      lightingStyle: 'neon',
      atmosphere: 'linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)',
      objectType: 'gpu_tensor',
      fogColor: '#7c3aed',
      emissiveColor: '#8b5cf6',
    },
    subDomains: [
      { id: 'ml-engineering', domainId: 'machine-learning', name: 'PyTorch & Modeling', icon: '📊', description: 'Deep learning, PyTorch tensors & custom training loops', careerIds: ['ml-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'mlops-deployment', domainId: 'machine-learning', name: 'MLOps & Serving', icon: '🚢', description: 'MLflow, Docker, Ray, Triton Server & Kubernetes', careerIds: ['ml-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-5.0, 2.0, 13.5],
    scale: 1.1,
  },

  // 7. Generative AI
  {
    id: 'generative-ai',
    name: 'Generative AI & LLMs',
    icon: '✨',
    description: 'Build modern Large Language Model applications, RAG pipelines, fine-tuning workflows, and agentic tools.',
    tagline: 'Harness the creative power of foundation models',
    careerCount: 1,
    avgSalary: '$148,000',
    growthRate: '+45%',
    theme: {
      primaryColor: '#ec4899',
      secondaryColor: '#f472b6',
      accentColor: '#fbcfe8',
      gradientFrom: '#831843',
      gradientTo: '#be185d',
      cloudStyle: 'cumulus',
      particleStyle: 'stars',
      lightingStyle: 'neon',
      atmosphere: 'linear-gradient(135deg, #831843 0%, #500724 100%)',
      objectType: 'magic_wand',
      fogColor: '#db2777',
      emissiveColor: '#ec4899',
    },
    subDomains: [
      { id: 'rag-systems', domainId: 'generative-ai', name: 'RAG & Vector DBs', icon: '📚', description: 'Pinecone, Milvus, LangChain, LlamaIndex & embeddings', careerIds: ['genai-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'llm-finetuning', domainId: 'generative-ai', name: 'LoRA & Fine-Tuning', description: 'Hugging Face, vLLM, quantizations & open-weights models', icon: '🎛️', careerIds: ['genai-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-10.0, 4.0, 9.5],
    scale: 1.1,
  },

  // 8. Data Science
  {
    id: 'data-science',
    name: 'Data Science',
    icon: '📊',
    description: 'Extract statistical insights, build predictive models, and guide executive decisions from complex datasets.',
    tagline: 'Turn massive raw data into actionable intelligence',
    careerCount: 1,
    avgSalary: '$125,000',
    growthRate: '+28%',
    theme: {
      primaryColor: '#14b8a6',
      secondaryColor: '#2dd4bf',
      accentColor: '#5eead4',
      gradientFrom: '#134e4a',
      gradientTo: '#0f766e',
      cloudStyle: 'stratus',
      particleStyle: 'dots',
      lightingStyle: 'soft',
      atmosphere: 'linear-gradient(135deg, #134e4a 0%, #042f2e 100%)',
      objectType: 'chart_pie',
      fogColor: '#0d9488',
      emissiveColor: '#14b8a6',
    },
    subDomains: [
      { id: 'data-science-core', domainId: 'data-science', name: 'Exploratory & SQL', icon: '📈', description: 'Pandas, NumPy, advanced SQL analytics & A/B testing', careerIds: ['data-scientist'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'predictive-ml', domainId: 'data-science', name: 'Predictive Modeling', icon: '🔮', description: 'Scikit-learn, XGBoost, regression & clustering', careerIds: ['data-scientist'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-13.5, 1.0, 4.5],
    scale: 1.1,
  },

  // 9. Data Engineering
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    icon: '🗄️',
    description: 'Architect distributed data warehouses, real-time event streaming pipelines, and ETL infrastructure.',
    tagline: 'Build high-volume data highways for modern tech',
    careerCount: 1,
    avgSalary: '$128,000',
    growthRate: '+30%',
    theme: {
      primaryColor: '#0284c7',
      secondaryColor: '#38bdf8',
      accentColor: '#7dd3fc',
      gradientFrom: '#0c4a6e',
      gradientTo: '#0369a1',
      cloudStyle: 'cumulonimbus',
      particleStyle: 'lines',
      lightingStyle: 'electric',
      atmosphere: 'linear-gradient(135deg, #0c4a6e 0%, #082f49 100%)',
      objectType: 'data_pipeline',
      fogColor: '#0284c7',
      emissiveColor: '#0284c7',
    },
    subDomains: [
      { id: 'etl-pipelines', domainId: 'data-engineering', name: 'Spark & Airflow', icon: '🌊', description: 'PySpark, Apache Airflow, Kafka & lakehouses', careerIds: ['data-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'data-warehouses', domainId: 'data-engineering', name: 'Snowflake & dbt', icon: '❄️', description: 'Snowflake, BigQuery, dbt & data modeling', careerIds: ['data-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-14.5, -2.5, 0.0],
    scale: 1.1,
  },

  // 10. Cybersecurity
  {
    id: 'cyber-security',
    name: 'Cybersecurity & Pentesting',
    icon: '💀',
    description: 'Defend systems from adversaries, perform authorized penetration tests, and secure cloud infrastructure.',
    tagline: 'Think like an attacker. Protect like a defender.',
    careerCount: 2,
    avgSalary: '$118,000',
    growthRate: '+31%',
    theme: {
      primaryColor: '#ef4444',
      secondaryColor: '#f87171',
      accentColor: '#fca5a5',
      gradientFrom: '#7f1d1d',
      gradientTo: '#b91c1c',
      cloudStyle: 'cumulonimbus',
      particleStyle: 'hexagons',
      lightingStyle: 'neon',
      atmosphere: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
      objectType: 'shield_lock',
      fogColor: '#dc2626',
      emissiveColor: '#ef4444',
    },
    subDomains: [
      { id: 'ethical-hacking', domainId: 'cyber-security', name: 'Ethical Hacking', icon: '⚔️', description: 'Kali Linux, Burp Suite, Metasploit & OSCP', careerIds: ['ethical-hacker'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'soc-defense', domainId: 'cyber-security', name: 'SOC & Blue Team', icon: '🛡️', description: 'SIEM, threat hunting, incident response & network defense', careerIds: ['security-analyst'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-13.0, 3.5, -5.0],
    scale: 1.2,
  },

  // 11. Cloud Computing
  {
    id: 'cloud-computing',
    name: 'Cloud Computing',
    icon: '☁️',
    description: 'Architect scalable, high-availability multi-cloud infrastructure across AWS, Azure, and Google Cloud.',
    tagline: 'Deploy global infrastructure that never goes down',
    careerCount: 1,
    avgSalary: '$126,000',
    growthRate: '+26%',
    theme: {
      primaryColor: '#38bdf8',
      secondaryColor: '#7dd3fc',
      accentColor: '#bae6fd',
      gradientFrom: '#075985',
      gradientTo: '#0284c7',
      cloudStyle: 'cumulus',
      particleStyle: 'dots',
      lightingStyle: 'soft',
      atmosphere: 'linear-gradient(135deg, #075985 0%, #082f49 100%)',
      objectType: 'cloud_servers',
      fogColor: '#0284c7',
      emissiveColor: '#38bdf8',
    },
    subDomains: [
      { id: 'cloud-aws', domainId: 'cloud-computing', name: 'AWS Cloud Architect', icon: '🟠', description: 'EC2, S3, RDS, Lambda, IAM & VPC architecture', careerIds: ['cloud-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'cloud-azure-gcp', domainId: 'cloud-computing', name: 'Multi-Cloud & Azure', icon: '🔷', description: 'Azure Cloud, GCP Compute, Terraform & cost ops', careerIds: ['cloud-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-10.0, -1.0, -10.0],
    scale: 1.1,
  },

  // 12. DevOps & SRE
  {
    id: 'devops',
    name: 'DevOps & Site Reliability',
    icon: '🚀',
    description: 'Automate build pipelines, orchestrate Kubernetes clusters, and guarantee 99.999% system uptime.',
    tagline: 'Bridge code and cloud with automated pipelines',
    careerCount: 1,
    avgSalary: '$122,000',
    growthRate: '+27%',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#fb923c',
      accentColor: '#fdba74',
      gradientFrom: '#7c2d12',
      gradientTo: '#c2410c',
      cloudStyle: 'stratus',
      particleStyle: 'lines',
      lightingStyle: 'warm',
      atmosphere: 'linear-gradient(135deg, #7c2d12 0%, #431407 100%)',
      objectType: 'rocket_launch',
      fogColor: '#ea580c',
      emissiveColor: '#f97316',
    },
    subDomains: [
      { id: 'cicd-automation', domainId: 'devops', name: 'CI/CD & GitHub Actions', icon: '🔄', description: 'Automated test runners, Docker builds & Helm charts', careerIds: ['devops-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'k8s-observability', domainId: 'devops', name: 'Kubernetes & SRE', icon: '☸️', description: 'K8s pods, Prometheus, Grafana & chaos testing', careerIds: ['devops-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-5.0, 4.5, -13.5],
    scale: 1.1,
  },

  // 13. Database & Big Data
  {
    id: 'database-bigdata',
    name: 'Database & Big Data',
    icon: '💾',
    description: 'Master SQL indexing, distributed NoSQL databases, Cassandra clusters, and transactional integrity.',
    tagline: 'Store and query petabytes of information in milliseconds',
    careerCount: 1,
    avgSalary: '$115,000',
    growthRate: '+18%',
    theme: {
      primaryColor: '#a855f7',
      secondaryColor: '#c084fc',
      accentColor: '#e9d5ff',
      gradientFrom: '#581c87',
      gradientTo: '#7e22ce',
      cloudStyle: 'cumulus',
      particleStyle: 'hexagons',
      lightingStyle: 'neon',
      atmosphere: 'linear-gradient(135deg, #581c87 0%, #3b0764 100%)',
      objectType: 'db_cylinder',
      fogColor: '#9333ea',
      emissiveColor: '#a855f7',
    },
    subDomains: [
      { id: 'sql-tuning', domainId: 'database-bigdata', name: 'PostgreSQL & SQL Tuning', icon: '🐘', description: 'B-Tree indexing, query planners & transactions', careerIds: ['database-administrator'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'nosql-distributed', domainId: 'database-bigdata', name: 'NoSQL & Redis', icon: '🍃', description: 'MongoDB sharding, Cassandra & Redis caching', careerIds: ['database-administrator'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [0.0, -3.0, -14.5],
    scale: 1.1,
  },

  // 14. UI/UX Design
  {
    id: 'ui-ux',
    name: 'UI/UX & Product Design',
    icon: '📐',
    description: 'Craft intuitive wireframes, scalable Figma design systems, and delightful digital user experiences.',
    tagline: 'Design products people fall in love with',
    careerCount: 1,
    avgSalary: '$100,000',
    growthRate: '+18%',
    theme: {
      primaryColor: '#f43f5e',
      secondaryColor: '#fb7185',
      accentColor: '#fecdd3',
      gradientFrom: '#881337',
      gradientTo: '#be123c',
      cloudStyle: 'cirrus',
      particleStyle: 'dots',
      lightingStyle: 'soft',
      atmosphere: 'linear-gradient(135deg, #881337 0%, #4c0519 100%)',
      objectType: 'palette_frame',
      fogColor: '#e11d48',
      emissiveColor: '#f43f5e',
    },
    subDomains: [
      { id: 'product-design', domainId: 'ui-ux', name: 'Product Design', icon: '🎨', description: 'Figma components, design tokens & auto-layout', careerIds: ['product-designer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'ux-research', domainId: 'ui-ux', name: 'UX Research', icon: '🔍', description: 'User testing, journey maps & usability heuristics', careerIds: ['product-designer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [5.0, 2.0, -13.5],
    scale: 1.1,
  },

  // 15. Game Development
  {
    id: 'game-development',
    name: 'Game Development',
    icon: '🎲',
    description: 'Create 2D and 3D games, physics engines, procedural shaders, and immersive interactive virtual worlds.',
    tagline: 'Build worlds millions will explore',
    careerCount: 1,
    avgSalary: '$92,000',
    growthRate: '+14%',
    theme: {
      primaryColor: '#84cc16',
      secondaryColor: '#a3e635',
      accentColor: '#d9f99d',
      gradientFrom: '#365314',
      gradientTo: '#4d7c0f',
      cloudStyle: 'cumulus',
      particleStyle: 'stars',
      lightingStyle: 'warm',
      atmosphere: 'linear-gradient(135deg, #365314 0%, #1a2e05 100%)',
      objectType: 'gamepad',
      fogColor: '#65a30d',
      emissiveColor: '#84cc16',
    },
    subDomains: [
      { id: 'unity', domainId: 'game-development', name: 'Unity 3D Engine', icon: '🎮', description: 'C#, physics, animations, Shader Graph & Netcode', careerIds: ['unity-developer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'unreal', domainId: 'game-development', name: 'Unreal Engine 5', icon: '🔥', description: 'C++, Blueprints, Nanite & Lumen rendering', careerIds: ['unity-developer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [10.0, -2.0, -10.0],
    scale: 1.1,
  },

  // 16. Blockchain & Web3
  {
    id: 'blockchain-web3',
    name: 'Blockchain & Web3',
    icon: '⛓️',
    description: 'Develop tamper-proof smart contracts, decentralized finance protocols, and Web3 decentralized applications.',
    tagline: 'Architect decentralized trust and peer-to-peer finance',
    careerCount: 1,
    avgSalary: '$135,000',
    growthRate: '+25%',
    theme: {
      primaryColor: '#eab308',
      secondaryColor: '#facc15',
      accentColor: '#fef08a',
      gradientFrom: '#713f12',
      gradientTo: '#a16207',
      cloudStyle: 'stratus',
      particleStyle: 'hexagons',
      lightingStyle: 'warm',
      atmosphere: 'linear-gradient(135deg, #713f12 0%, #422006 100%)',
      objectType: 'crypto_cube',
      fogColor: '#ca8a04',
      emissiveColor: '#eab308',
    },
    subDomains: [
      { id: 'smart-contracts', domainId: 'blockchain-web3', name: 'Solidity & EVM', icon: '📜', description: 'Solidity, Hardhat, Foundry, OpenZeppelin & Gas optimization', careerIds: ['blockchain-developer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'web3-dapps', domainId: 'blockchain-web3', name: 'Web3 DApps & Rust', icon: '🔗', description: 'Ethers.js, Wagmi, Solana Rust & IPFS', careerIds: ['blockchain-developer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [13.0, 4.0, -5.0],
    scale: 1.1,
  },

  // 17. IoT & Embedded Systems
  {
    id: 'iot-embedded',
    name: 'IoT & Embedded Systems',
    icon: '📡',
    description: 'Program microcontrollers, edge sensors, robotics, and firmware powering the connected physical world.',
    tagline: 'Write the code that controls physical hardware',
    careerCount: 1,
    avgSalary: '$104,000',
    growthRate: '+20%',
    theme: {
      primaryColor: '#0d9488',
      secondaryColor: '#14b8a6',
      accentColor: '#5eead4',
      gradientFrom: '#115e59',
      gradientTo: '#0f766e',
      cloudStyle: 'cumulus',
      particleStyle: 'dots',
      lightingStyle: 'electric',
      atmosphere: 'linear-gradient(135deg, #115e59 0%, #042f2e 100%)',
      objectType: 'microchip',
      fogColor: '#0d9488',
      emissiveColor: '#0d9488',
    },
    subDomains: [
      { id: 'embedded-firmware', domainId: 'iot-embedded', name: 'Embedded C/C++', icon: '⚡', description: 'ARM Cortex, STM32, FreeRTOS & memory management', careerIds: ['embedded-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'iot-connectivity', domainId: 'iot-embedded', name: 'IoT Protocols & ESP32', icon: '📶', description: 'MQTT, WebSockets, Bluetooth LE & edge computing', careerIds: ['embedded-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [14.0, -3.0, 0.0],
    scale: 1.1,
  },

  // 18. Computer Networks & Systems
  {
    id: 'computer-networks',
    name: 'Computer Networks & Systems',
    icon: '🌐',
    description: 'Design enterprise network topographies, routing protocols, firewalls, and low-level socket communication.',
    tagline: 'Engineer the global pathways of digital communication',
    careerCount: 1,
    avgSalary: '$98,000',
    growthRate: '+16%',
    theme: {
      primaryColor: '#2563eb',
      secondaryColor: '#3b82f6',
      accentColor: '#93c5fd',
      gradientFrom: '#1e3a8a',
      gradientTo: '#1d4ed8',
      cloudStyle: 'stratus',
      particleStyle: 'lines',
      lightingStyle: 'cool',
      atmosphere: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
      objectType: 'router_switch',
      fogColor: '#2563eb',
      emissiveColor: '#2563eb',
    },
    subDomains: [
      { id: 'routing-switching', domainId: 'computer-networks', name: 'Cisco Routing & Protocols', icon: '🔀', description: 'TCP/IP, BGP, OSPF, VLANs, Wireshark & CCNA', careerIds: ['network-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'network-automation', domainId: 'computer-networks', name: 'Network Automation', icon: '🤖', description: 'Python Netmiko, Ansible for networks & SDN', careerIds: ['network-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [12.0, 1.5, 7.0],
    scale: 1.1,
  },

  // 19. Software Testing & QA
  {
    id: 'software-testing-qa',
    name: 'Software Testing & SDET',
    icon: '🔍',
    description: 'Build automated test frameworks, end-to-end regression suites, and guarantee flawless software reliability.',
    tagline: 'Ensure bulletproof software quality at scale',
    careerCount: 1,
    avgSalary: '$96,000',
    growthRate: '+17%',
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#8b5cf6',
      accentColor: '#c4b5fd',
      gradientFrom: '#4c1d95',
      gradientTo: '#6d28d9',
      cloudStyle: 'cumulus',
      particleStyle: 'hexagons',
      lightingStyle: 'neon',
      atmosphere: 'linear-gradient(135deg, #4c1d95 0%, #2e1065 100%)',
      objectType: 'test_badge',
      fogColor: '#7c3aed',
      emissiveColor: '#7c3aed',
    },
    subDomains: [
      { id: 'test-automation', domainId: 'software-testing-qa', name: 'Playwright & Cypress', icon: '🧪', description: 'E2E automation, TypeScript, CI integration & mocks', careerIds: ['qa-automation-engineer'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'perf-load-testing', domainId: 'software-testing-qa', name: 'Performance & k6', icon: '⏱️', description: 'k6 load testing, JMeter, chaos testing & API validation', careerIds: ['qa-automation-engineer'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [7.0, -4.0, 12.0],
    scale: 1.1,
  },

  // 20. Business & Data Analytics
  {
    id: 'data-analytics',
    name: 'Business & Data Analytics',
    icon: '📈',
    description: 'Transform complex business datasets into executive dashboards, financial models, and strategic growth drivers.',
    tagline: 'Translate numbers into strategic commercial growth',
    careerCount: 1,
    avgSalary: '$94,000',
    growthRate: '+23%',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      accentColor: '#6ee7b7',
      gradientFrom: '#064e3b',
      gradientTo: '#047857',
      cloudStyle: 'cirrus',
      particleStyle: 'dots',
      lightingStyle: 'soft',
      atmosphere: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
      objectType: 'dashboard_kpi',
      fogColor: '#059669',
      emissiveColor: '#059669',
    },
    subDomains: [
      { id: 'bi-dashboards', domainId: 'data-analytics', name: 'PowerBI & Tableau', icon: '📊', description: 'DAX formulas, visual modeling & interactive KPI reports', careerIds: ['business-analyst'], position: [-2, 1, -1], scale: 0.7 },
      { id: 'product-funnels', domainId: 'data-analytics', name: 'Product & Cohort Analytics', icon: '🎯', description: 'Mixpanel, SQL cohorts, retention & conversion funnels', careerIds: ['business-analyst'], position: [2, -1, -1], scale: 0.7 },
    ],
    position: [-7.0, -3.5, 12.0],
    scale: 1.1,
  },
];
