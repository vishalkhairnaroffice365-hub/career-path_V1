export interface DomainTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  cloudStyle: 'cumulus' | 'stratus' | 'cirrus' | 'cumulonimbus';
  particleStyle: 'dots' | 'lines' | 'stars' | 'hexagons' | 'nodes';
  lightingStyle: 'warm' | 'cool' | 'electric' | 'neon' | 'soft';
  atmosphere: string; // CSS gradient string for sky background
  objectType: 'smartphone' | 'neural_node' | 'shield' | 'controller' | 'design_frame' | 'chart' | 'microscope' | 'server' | 'camera' | 'pen';
  fogColor: string;
  emissiveColor: string;
}

export interface Domain {
  id: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  careerCount: number;
  avgSalary: string;
  growthRate: string;
  theme: DomainTheme;
  subDomains: SubDomain[];
  position: [number, number, number]; // 3D position in sky
  scale: number;
}

export interface SubDomain {
  id: string;
  domainId: string;
  name: string;
  icon: string;
  description: string;
  careerIds: string[];
  position: [number, number, number];
  scale: number;
}

export const domains: Domain[] = [
  {
    id: 'app-development',
    name: 'App Development',
    icon: '📱',
    description: 'Build the apps that live in every pocket. Mobile-first thinking that shapes how billions interact with technology.',
    tagline: 'Build the apps that move the world',
    careerCount: 8,
    avgSalary: '$95,000',
    growthRate: '+22%',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#06b6d4',
      accentColor: '#8b5cf6',
      gradientFrom: '#1e3a8a',
      gradientTo: '#0e7490',
      cloudStyle: 'cumulus',
      particleStyle: 'dots',
      lightingStyle: 'cool',
      atmosphere: 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 50%, #164e63 100%)',
      objectType: 'smartphone',
      fogColor: '#1e40af',
      emissiveColor: '#60a5fa',
    },
    subDomains: [
      { id: 'android', domainId: 'app-development', name: 'Android', icon: '🤖', description: 'Native Android apps with Kotlin & Java', careerIds: ['android-developer', 'android-architect'], position: [-3, 1, -2], scale: 0.7 },
      { id: 'ios', domainId: 'app-development', name: 'iOS', icon: '🍎', description: 'Elegant iOS experiences with Swift', careerIds: ['ios-developer', 'ios-architect'], position: [3, 2, -2], scale: 0.7 },
      { id: 'flutter', domainId: 'app-development', name: 'Flutter', icon: '🎯', description: 'Cross-platform apps from a single codebase', careerIds: ['flutter-developer'], position: [0, -1, -3], scale: 0.65 },
      { id: 'react-native', domainId: 'app-development', name: 'React Native', icon: '⚛️', description: 'JavaScript-powered native apps', careerIds: ['react-native-developer'], position: [-4, -1, -1], scale: 0.65 },
    ],
    position: [-6, 3, -8],
    scale: 1.2,
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    icon: '🧠',
    description: 'Shape the intelligence of tomorrow. Work at the frontier of what machines can understand, create, and predict.',
    tagline: 'Teach machines to think',
    careerCount: 10,
    avgSalary: '$130,000',
    growthRate: '+38%',
    theme: {
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#06b6d4',
      gradientFrom: '#1e1b4b',
      gradientTo: '#312e81',
      cloudStyle: 'cumulonimbus',
      particleStyle: 'nodes',
      lightingStyle: 'electric',
      atmosphere: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0f172a 100%)',
      objectType: 'neural_node',
      fogColor: '#3730a3',
      emissiveColor: '#818cf8',
    },
    subDomains: [
      { id: 'ml-engineering', domainId: 'ai-ml', name: 'ML Engineering', icon: '⚙️', description: 'Production ML systems at scale', careerIds: ['ml-engineer', 'mlops-engineer'], position: [-2, 1, -2], scale: 0.7 },
      { id: 'data-science', domainId: 'ai-ml', name: 'Data Science', icon: '📊', description: 'Uncover insights from complex data', careerIds: ['data-scientist', 'data-analyst'], position: [3, 0, -2], scale: 0.7 },
      { id: 'nlp', domainId: 'ai-ml', name: 'NLP', icon: '💬', description: 'Language models and text intelligence', careerIds: ['nlp-engineer'], position: [0, 2, -3], scale: 0.6 },
      { id: 'computer-vision', domainId: 'ai-ml', name: 'Computer Vision', icon: '👁️', description: 'Teaching machines to see and understand', careerIds: ['cv-engineer'], position: [-4, -1, -1], scale: 0.6 },
    ],
    position: [5, 5, -10],
    scale: 1.4,
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security',
    icon: '🛡️',
    description: 'Defend the digital world. Every system, every network, every person — security is the invisible shield.',
    tagline: 'Defend the digital world',
    careerCount: 7,
    avgSalary: '$110,000',
    growthRate: '+31%',
    theme: {
      primaryColor: '#1d4ed8',
      secondaryColor: '#1e3a8a',
      accentColor: '#ef4444',
      gradientFrom: '#0f172a',
      gradientTo: '#1e3a8a',
      cloudStyle: 'stratus',
      particleStyle: 'hexagons',
      lightingStyle: 'cool',
      atmosphere: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #450a0a 100%)',
      objectType: 'shield',
      fogColor: '#1e3a8a',
      emissiveColor: '#93c5fd',
    },
    subDomains: [
      { id: 'ethical-hacking', domainId: 'cyber-security', name: 'Ethical Hacking', icon: '💀', description: 'Penetration testing and offensive security', careerIds: ['ethical-hacker', 'pen-tester'], position: [-3, 1, -2], scale: 0.7 },
      { id: 'security-ops', domainId: 'cyber-security', name: 'Security Ops', icon: '🔒', description: 'SOC analyst and incident response', careerIds: ['soc-analyst', 'incident-responder'], position: [3, 1, -2], scale: 0.7 },
      { id: 'cloud-security', domainId: 'cyber-security', name: 'Cloud Security', icon: '☁️', description: 'Securing cloud infrastructure and services', careerIds: ['cloud-security-engineer'], position: [0, -1, -3], scale: 0.65 },
    ],
    position: [-3, 6, -12],
    scale: 1.1,
  },
  {
    id: 'web-development',
    name: 'Web Development',
    icon: '🌐',
    description: 'Craft the digital experiences of today and tomorrow. Every pixel, every interaction, every moment online.',
    tagline: 'Build the web of tomorrow',
    careerCount: 9,
    avgSalary: '$88,000',
    growthRate: '+15%',
    theme: {
      primaryColor: '#f97316',
      secondaryColor: '#fb923c',
      accentColor: '#fbbf24',
      gradientFrom: '#431407',
      gradientTo: '#7c2d12',
      cloudStyle: 'cumulus',
      particleStyle: 'dots',
      lightingStyle: 'warm',
      atmosphere: 'linear-gradient(135deg, #431407 0%, #7c2d12 50%, #92400e 100%)',
      objectType: 'server',
      fogColor: '#9a3412',
      emissiveColor: '#fed7aa',
    },
    subDomains: [
      { id: 'frontend', domainId: 'web-development', name: 'Frontend', icon: '🎨', description: 'Visual experiences and user interfaces', careerIds: ['frontend-developer', 'react-developer'], position: [-3, 1, -2], scale: 0.7 },
      { id: 'backend', domainId: 'web-development', name: 'Backend', icon: '⚙️', description: 'Server-side logic and APIs', careerIds: ['backend-developer', 'api-developer'], position: [3, 1, -2], scale: 0.7 },
      { id: 'fullstack', domainId: 'web-development', name: 'Full Stack', icon: '🔗', description: 'End-to-end web development', careerIds: ['fullstack-developer'], position: [0, 2, -3], scale: 0.65 },
      { id: 'devops', domainId: 'web-development', name: 'DevOps', icon: '🚀', description: 'CI/CD, deployment and infrastructure', careerIds: ['devops-engineer'], position: [-4, -1, -1], scale: 0.6 },
    ],
    position: [7, 1, -9],
    scale: 1.3,
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    icon: '🎨',
    description: 'Design the emotions people feel when they use technology. Every tap, every scroll, every "wow" moment.',
    tagline: 'Design experiences people love',
    careerCount: 6,
    avgSalary: '$85,000',
    growthRate: '+18%',
    theme: {
      primaryColor: '#a855f7',
      secondaryColor: '#ec4899',
      accentColor: '#f97316',
      gradientFrom: '#2e1065',
      gradientTo: '#701a75',
      cloudStyle: 'cirrus',
      particleStyle: 'stars',
      lightingStyle: 'soft',
      atmosphere: 'linear-gradient(135deg, #2e1065 0%, #701a75 50%, #7c2d12 100%)',
      objectType: 'design_frame',
      fogColor: '#7e22ce',
      emissiveColor: '#e879f9',
    },
    subDomains: [
      { id: 'product-design', domainId: 'ui-ux', name: 'Product Design', icon: '📐', description: 'End-to-end digital product design', careerIds: ['product-designer'], position: [-3, 1, -2], scale: 0.7 },
      { id: 'interaction-design', domainId: 'ui-ux', name: 'Interaction Design', icon: '✨', description: 'Micro-interactions and motion design', careerIds: ['interaction-designer'], position: [3, 1, -2], scale: 0.7 },
      { id: 'ux-research', domainId: 'ui-ux', name: 'UX Research', icon: '🔬', description: 'User research and usability testing', careerIds: ['ux-researcher'], position: [0, -1, -3], scale: 0.65 },
    ],
    position: [-7, 0, -10],
    scale: 1.0,
  },
  {
    id: 'game-development',
    name: 'Game Development',
    icon: '🎮',
    description: 'Create worlds where people escape, dream, and play. The ultimate intersection of art, code, and imagination.',
    tagline: 'Create worlds people dream in',
    careerCount: 5,
    avgSalary: '$90,000',
    growthRate: '+12%',
    theme: {
      primaryColor: '#7c3aed',
      secondaryColor: '#4f46e5',
      accentColor: '#10b981',
      gradientFrom: '#1a0533',
      gradientTo: '#1e1b4b',
      cloudStyle: 'cumulonimbus',
      particleStyle: 'stars',
      lightingStyle: 'neon',
      atmosphere: 'linear-gradient(135deg, #1a0533 0%, #1e1b4b 50%, #022c22 100%)',
      objectType: 'controller',
      fogColor: '#5b21b6',
      emissiveColor: '#a78bfa',
    },
    subDomains: [
      { id: 'unity', domainId: 'game-development', name: 'Unity', icon: '🎲', description: '2D and 3D games with Unity Engine', careerIds: ['unity-developer'], position: [-3, 1, -2], scale: 0.7 },
      { id: 'unreal', domainId: 'game-development', name: 'Unreal Engine', icon: '🌍', description: 'AAA-quality games with Unreal', careerIds: ['unreal-developer'], position: [3, 1, -2], scale: 0.7 },
      { id: 'indie', domainId: 'game-development', name: 'Indie Dev', icon: '🕹️', description: 'Independent game creation', careerIds: ['indie-developer'], position: [0, -1, -3], scale: 0.65 },
    ],
    position: [2, -2, -11],
    scale: 0.95,
  },
  {
    id: 'data-engineering',
    name: 'Data Engineering',
    icon: '📊',
    description: 'Build the infrastructure that turns raw data into the insights that drive billion-dollar decisions.',
    tagline: 'Power decisions with data',
    careerCount: 6,
    avgSalary: '$115,000',
    growthRate: '+25%',
    theme: {
      primaryColor: '#059669',
      secondaryColor: '#0891b2',
      accentColor: '#10b981',
      gradientFrom: '#022c22',
      gradientTo: '#164e63',
      cloudStyle: 'stratus',
      particleStyle: 'lines',
      lightingStyle: 'cool',
      atmosphere: 'linear-gradient(135deg, #022c22 0%, #164e63 50%, #0c4a6e 100%)',
      objectType: 'chart',
      fogColor: '#065f46',
      emissiveColor: '#6ee7b7',
    },
    subDomains: [
      { id: 'data-pipeline', domainId: 'data-engineering', name: 'Data Pipeline', icon: '🔄', description: 'ETL and data pipeline engineering', careerIds: ['data-engineer'], position: [-3, 1, -2], scale: 0.7 },
      { id: 'analytics', domainId: 'data-engineering', name: 'Analytics', icon: '📈', description: 'Business intelligence and reporting', careerIds: ['data-analyst', 'bi-developer'], position: [3, 1, -2], scale: 0.7 },
      { id: 'cloud-data', domainId: 'data-engineering', name: 'Cloud Data', icon: '☁️', description: 'Cloud-native data platforms', careerIds: ['cloud-data-engineer'], position: [0, -1, -3], scale: 0.65 },
    ],
    position: [-5, -3, -9],
    scale: 1.05,
  },
  {
    id: 'cloud-devops',
    name: 'Cloud & DevOps',
    icon: '☁️',
    description: 'The invisible backbone of modern software. Keep systems alive, scalable, and resilient at any scale.',
    tagline: 'Keep the cloud moving',
    careerCount: 7,
    avgSalary: '$120,000',
    growthRate: '+28%',
    theme: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#38bdf8',
      accentColor: '#f0abfc',
      gradientFrom: '#0c4a6e',
      gradientTo: '#075985',
      cloudStyle: 'cirrus',
      particleStyle: 'lines',
      lightingStyle: 'cool',
      atmosphere: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #164e63 100%)',
      objectType: 'server',
      fogColor: '#0369a1',
      emissiveColor: '#7dd3fc',
    },
    subDomains: [
      { id: 'aws', domainId: 'cloud-devops', name: 'AWS', icon: '🟠', description: 'Amazon Web Services cloud architecture', careerIds: ['aws-engineer'], position: [-3, 1, -2], scale: 0.7 },
      { id: 'kubernetes', domainId: 'cloud-devops', name: 'Kubernetes', icon: '⎈', description: 'Container orchestration and management', careerIds: ['k8s-engineer'], position: [3, 1, -2], scale: 0.7 },
      { id: 'sre', domainId: 'cloud-devops', name: 'SRE', icon: '🔧', description: 'Site reliability and uptime engineering', careerIds: ['sre-engineer'], position: [0, -1, -3], scale: 0.65 },
    ],
    position: [4, -4, -10],
    scale: 1.1,
  },
];
