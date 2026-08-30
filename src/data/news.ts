// TODO: Connect to backend API — replace mock data with GET /api/v1/news?domain=:domain

export interface NewsItem {
  id: string;
  domain: string; // matches domain keywords
  title: string;
  description: string;
  source: string;
  publishedAt: string; // ISO date
  url: string;
  imageEmoji: string;
  tags: string[];
  isBreaking?: boolean;
}

// Domain → keyword/tag mapping for filtering
export const domainKeywordMap: Record<string, string[]> = {
  'android': ['android', 'kotlin', 'jetpack', 'google play', 'mobile', 'android studio'],
  'ios-development': ['ios', 'swift', 'swiftui', 'xcode', 'apple', 'app store'],
  'flutter': ['flutter', 'dart', 'cross-platform', 'mobile', 'flutter dev'],
  'react-native': ['react native', 'expo', 'mobile', 'javascript', 'react'],
  'ai-ml': ['ai', 'machine learning', 'llm', 'python', 'deep learning', 'openai', 'tensorflow', 'pytorch'],
  'data-science': ['data science', 'analytics', 'python', 'pandas', 'sql', 'visualization'],
  'web-development': ['web', 'javascript', 'react', 'nodejs', 'nextjs', 'typescript'],
  'frontend': ['react', 'nextjs', 'typescript', 'css', 'vite', 'tailwind', 'web'],
  'backend': ['nodejs', 'python', 'api', 'microservices', 'docker', 'kubernetes'],
  'devops': ['devops', 'docker', 'kubernetes', 'ci/cd', 'cloud', 'aws', 'azure'],
  'cyber-security': ['security', 'hacking', 'vulnerability', 'encryption', 'cybersecurity'],
  'cloud': ['aws', 'azure', 'gcp', 'serverless', 'cloud', 'infrastructure'],
  'game-development': ['unity', 'unreal', 'game dev', 'gaming', 'c++', 'gamedev'],
  'blockchain': ['blockchain', 'web3', 'solidity', 'nft', 'defi', 'ethereum'],
  'default': ['technology', 'programming', 'software', 'developer', 'career', 'coding'],
};

// Career ID → domain key mapping
export const careerDomainMap: Record<string, string> = {
  'android-developer': 'android',
  'ios-developer': 'ios-development',
  'flutter-developer': 'flutter',
  'react-native-developer': 'react-native',
  'ml-engineer': 'ai-ml',
  'data-scientist': 'data-science',
  'frontend-developer': 'frontend',
  'backend-developer': 'backend',
  'fullstack-developer': 'web-development',
  'devops-engineer': 'devops',
  'security-engineer': 'cyber-security',
  'cloud-architect': 'cloud',
  'game-developer': 'game-development',
  'blockchain-developer': 'blockchain',
};

export const mockNews: NewsItem[] = [
  // ─── Android ──────────────────────────────────────────────────
  {
    id: 'news-and-1',
    domain: 'android',
    title: 'Android Studio Ladybug Feature Drop Released',
    description: 'Google has released Android Studio Ladybug Feature Drop with major Gemini AI integrations, new UI components, and significantly improved build speeds up to 40% faster.',
    source: 'Android Developers Blog',
    publishedAt: '2026-08-28T09:00:00Z',
    url: 'https://android-developers.googleblog.com',
    imageEmoji: '🤖',
    tags: ['android studio', 'kotlin', 'android'],
    isBreaking: true,
  },
  {
    id: 'news-and-2',
    domain: 'android',
    title: 'Jetpack Compose 1.8 Brings Adaptive Layouts',
    description: 'The latest Jetpack Compose update introduces first-class adaptive layout support for foldables, tablets, and large screens, making multi-device development easier.',
    source: 'Google Developers',
    publishedAt: '2026-08-25T12:00:00Z',
    url: 'https://developer.android.com',
    imageEmoji: '🎨',
    tags: ['jetpack', 'compose', 'android', 'ui'],
  },
  {
    id: 'news-and-3',
    domain: 'android',
    title: 'Kotlin 2.1 Performance Improvements Benchmarked',
    description: 'Kotlin 2.1 shows up to 30% improvement in compilation speed and introduces new K2 compiler features. Benchmarks across real-world projects show consistent gains.',
    source: 'Kotlin Blog',
    publishedAt: '2026-08-22T08:00:00Z',
    url: 'https://kotlinlang.org/blog',
    imageEmoji: '⚡',
    tags: ['kotlin', 'performance', 'compiler'],
  },
  {
    id: 'news-and-4',
    domain: 'android',
    title: 'Android Developer Jobs Up 23% in Q3 2026',
    description: 'Industry reports show Android developer job postings increased 23% year-over-year in Q3 2026, with Kotlin and Compose expertise commanding premium salaries.',
    source: 'LinkedIn Career Insights',
    publishedAt: '2026-08-20T10:00:00Z',
    url: 'https://linkedin.com/jobs',
    imageEmoji: '📈',
    tags: ['android', 'jobs', 'career', 'mobile'],
  },
  // ─── AI / ML ──────────────────────────────────────────────────
  {
    id: 'news-ai-1',
    domain: 'ai-ml',
    title: 'GPT-5 Architecture Details Revealed',
    description: 'OpenAI shares insights into GPT-5\'s mixture-of-experts architecture, showing how specialized modules handle different types of reasoning tasks.',
    source: 'OpenAI Research',
    publishedAt: '2026-08-29T10:00:00Z',
    url: 'https://openai.com/research',
    imageEmoji: '🧠',
    tags: ['ai', 'llm', 'openai', 'machine learning'],
    isBreaking: true,
  },
  {
    id: 'news-ai-2',
    domain: 'ai-ml',
    title: 'PyTorch 2.5 Brings Native Apple Silicon Support',
    description: 'PyTorch 2.5 introduces native Metal Performance Shaders support for Apple Silicon, enabling 3x faster training on Mac devices.',
    source: 'PyTorch Blog',
    publishedAt: '2026-08-26T09:00:00Z',
    url: 'https://pytorch.org/blog',
    imageEmoji: '🔥',
    tags: ['pytorch', 'machine learning', 'deep learning'],
  },
  {
    id: 'news-ai-3',
    domain: 'ai-ml',
    title: 'ML Engineer Salaries Hit Record Highs',
    description: 'Machine learning engineers are commanding record salaries, with senior roles averaging $250K+ in tech hubs. Demand continues to outpace supply.',
    source: 'Levels.fyi',
    publishedAt: '2026-08-23T08:00:00Z',
    url: 'https://levels.fyi',
    imageEmoji: '💰',
    tags: ['ai', 'machine learning', 'career', 'salary'],
  },
  // ─── Frontend ─────────────────────────────────────────────────
  {
    id: 'news-fe-1',
    domain: 'frontend',
    title: 'React 20 RC Released with Server Components by Default',
    description: 'React 20 Release Candidate ships with Server Components enabled by default, new concurrent features, and the removal of legacy class component lifecycle methods.',
    source: 'React Blog',
    publishedAt: '2026-08-28T14:00:00Z',
    url: 'https://react.dev/blog',
    imageEmoji: '⚛️',
    tags: ['react', 'web', 'javascript', 'frontend'],
    isBreaking: true,
  },
  {
    id: 'news-fe-2',
    domain: 'frontend',
    title: 'Next.js 16 Introduces Partial Prerendering GA',
    description: 'Next.js 16 ships Partial Prerendering (PPR) as a stable feature, combining static and dynamic content at a route level for optimal performance.',
    source: 'Vercel Blog',
    publishedAt: '2026-08-25T11:00:00Z',
    url: 'https://vercel.com/blog',
    imageEmoji: '▲',
    tags: ['nextjs', 'react', 'web', 'frontend', 'typescript'],
  },
  {
    id: 'news-fe-3',
    domain: 'frontend',
    title: 'TypeScript 5.8 Improves Type Inference',
    description: 'TypeScript 5.8 introduces smarter type narrowing, conditional type inference improvements, and faster language server performance.',
    source: 'TypeScript Blog',
    publishedAt: '2026-08-21T09:00:00Z',
    url: 'https://devblogs.microsoft.com/typescript',
    imageEmoji: '📘',
    tags: ['typescript', 'web', 'javascript', 'frontend'],
  },
  // ─── DevOps ───────────────────────────────────────────────────
  {
    id: 'news-devops-1',
    domain: 'devops',
    title: 'Kubernetes 1.33 Releases with Native AI Workload Scheduling',
    description: 'Kubernetes 1.33 introduces native scheduling hints for AI/ML workloads, GPU fractioning support, and improved autoscaling for LLM inference pods.',
    source: 'CNCF Blog',
    publishedAt: '2026-08-27T10:00:00Z',
    url: 'https://kubernetes.io/blog',
    imageEmoji: '☸️',
    tags: ['kubernetes', 'devops', 'cloud', 'docker'],
    isBreaking: false,
  },
  // ─── Cyber Security ───────────────────────────────────────────
  {
    id: 'news-sec-1',
    domain: 'cyber-security',
    title: 'Zero-Day Vulnerability Found in Popular npm Packages',
    description: 'Security researchers discovered a critical zero-day in three widely-used npm packages with over 500M weekly downloads. Patches are available — update immediately.',
    source: 'Security Week',
    publishedAt: '2026-08-29T08:00:00Z',
    url: 'https://securityweek.com',
    imageEmoji: '🔐',
    tags: ['security', 'vulnerability', 'cybersecurity'],
    isBreaking: true,
  },
  // ─── General Tech ─────────────────────────────────────────────
  {
    id: 'news-gen-1',
    domain: 'default',
    title: 'GitHub Copilot Adds Multi-File Context Window',
    description: 'GitHub Copilot\'s new multi-file context feature allows the AI to understand your entire codebase structure when making suggestions, dramatically improving accuracy.',
    source: 'GitHub Blog',
    publishedAt: '2026-08-28T16:00:00Z',
    url: 'https://github.blog',
    imageEmoji: '🐙',
    tags: ['ai', 'github', 'developer tools', 'coding'],
  },
  {
    id: 'news-gen-2',
    domain: 'default',
    title: 'Stack Overflow Developer Survey 2026 Results',
    description: 'The annual Stack Overflow survey reveals TypeScript overtaking JavaScript as most-used language, Rust staying most admired, and AI tools used by 85% of developers.',
    source: 'Stack Overflow',
    publishedAt: '2026-08-20T12:00:00Z',
    url: 'https://survey.stackoverflow.co',
    imageEmoji: '📊',
    tags: ['technology', 'developer', 'career', 'programming'],
  },
];

export function getNewsByDomain(domain: string): NewsItem[] {
  if (!domain || domain === 'default') {
    return mockNews.filter(n => n.domain === 'default').concat(mockNews.slice(0, 2));
  }
  const domainKey = careerDomainMap[domain] || domain;
  const domainNews = mockNews.filter(n => n.domain === domainKey);
  if (domainNews.length === 0) {
    return mockNews.filter(n => n.domain === 'default');
  }
  return domainNews;
}

export function getNewsByCareer(careerId: string | undefined): NewsItem[] {
  if (!careerId) return getNewsByDomain('default');
  return getNewsByDomain(careerId);
}
