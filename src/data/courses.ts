// TODO: Connect to backend API — replace mock data with GET /api/v1/courses

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'exercise' | 'quiz';
  duration: string;
  completed: boolean;
  content?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: Lesson[];
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  nodeId: string; // links to RoadmapNode.id
  title: string;
  description: string;
  domain: string;
  difficulty: CourseDifficulty;
  estimatedTime: string;
  objectives: string[];
  modules: CourseModule[];
  hasAssessment: boolean;
  hasCodingChallenge: boolean;
  hasPracticalTask: boolean;
}

export const courses: Course[] = [
  // ─── Android Developer Path ───────────────────────────────────
  {
    id: 'course-kotlin-basics',
    nodeId: 'kotlin-basics',
    title: 'Kotlin Fundamentals',
    description: 'Master the Kotlin programming language — the primary language for Android development. Covers variables, functions, OOP, null safety, and coroutines basics.',
    domain: 'android',
    difficulty: 'beginner',
    estimatedTime: '4 weeks',
    objectives: ['Write Kotlin code confidently', 'Understand null safety', 'Use coroutines for async tasks', 'Apply OOP concepts'],
    hasAssessment: true,
    hasCodingChallenge: false,
    hasPracticalTask: false,
    modules: [
      {
        id: 'mod-kt-1',
        title: 'Getting Started with Kotlin',
        lessons: [
          { id: 'l-kt-1-1', title: 'Introduction to Kotlin', type: 'video', duration: '15 min', completed: true },
          { id: 'l-kt-1-2', title: 'Variables and Data Types', type: 'reading', duration: '20 min', completed: true },
          { id: 'l-kt-1-3', title: 'Functions and Lambdas', type: 'exercise', duration: '30 min', completed: true },
        ],
      },
      {
        id: 'mod-kt-2',
        title: 'Object-Oriented Programming',
        lessons: [
          { id: 'l-kt-2-1', title: 'Classes and Objects', type: 'video', duration: '20 min', completed: true },
          { id: 'l-kt-2-2', title: 'Inheritance and Interfaces', type: 'reading', duration: '25 min', completed: false },
          { id: 'l-kt-2-3', title: 'Data Classes and Sealed Classes', type: 'exercise', duration: '35 min', completed: false },
        ],
      },
      {
        id: 'mod-kt-3',
        title: 'Null Safety & Coroutines',
        lessons: [
          { id: 'l-kt-3-1', title: 'Null Safety in Kotlin', type: 'video', duration: '20 min', completed: false },
          { id: 'l-kt-3-2', title: 'Kotlin Coroutines Basics', type: 'reading', duration: '30 min', completed: false },
          { id: 'l-kt-3-3', title: 'Practice: Async with Coroutines', type: 'exercise', duration: '45 min', completed: false },
        ],
      },
    ],
  },
  {
    id: 'course-android-ui',
    nodeId: 'android-ui',
    title: 'Jetpack Compose UI',
    description: 'Build declarative, modern Android UIs with Jetpack Compose. Learn layouts, state management, and theming.',
    domain: 'android',
    difficulty: 'intermediate',
    estimatedTime: '5 weeks',
    objectives: ['Build Compose UIs', 'Manage UI state', 'Create custom themes', 'Handle navigation'],
    hasAssessment: true,
    hasCodingChallenge: true,
    hasPracticalTask: false,
    modules: [
      {
        id: 'mod-ui-1',
        title: 'Compose Basics',
        lessons: [
          { id: 'l-ui-1-1', title: 'What is Jetpack Compose?', type: 'video', duration: '20 min', completed: false },
          { id: 'l-ui-1-2', title: 'Composable Functions', type: 'reading', duration: '25 min', completed: false },
          { id: 'l-ui-1-3', title: 'Layouts in Compose', type: 'exercise', duration: '40 min', completed: false },
        ],
      },
      {
        id: 'mod-ui-2',
        title: 'State & Theming',
        lessons: [
          { id: 'l-ui-2-1', title: 'State in Compose', type: 'video', duration: '25 min', completed: false },
          { id: 'l-ui-2-2', title: 'Material Design Theming', type: 'reading', duration: '20 min', completed: false },
          { id: 'l-ui-2-3', title: 'Build a Login Screen', type: 'exercise', duration: '60 min', completed: false },
        ],
      },
    ],
  },
  {
    id: 'course-android-architecture',
    nodeId: 'android-architecture',
    title: 'MVVM Architecture',
    description: 'Learn ViewModel, LiveData, StateFlow, and the Repository pattern to build scalable Android applications.',
    domain: 'android',
    difficulty: 'intermediate',
    estimatedTime: '3 weeks',
    objectives: ['Implement MVVM', 'Use ViewModel and StateFlow', 'Apply Repository pattern'],
    hasAssessment: true,
    hasCodingChallenge: true,
    hasPracticalTask: false,
    modules: [
      {
        id: 'mod-arch-1',
        title: 'MVVM Pattern',
        lessons: [
          { id: 'l-arch-1-1', title: 'Why Architecture Matters', type: 'video', duration: '18 min', completed: false },
          { id: 'l-arch-1-2', title: 'ViewModel Deep Dive', type: 'reading', duration: '30 min', completed: false },
          { id: 'l-arch-1-3', title: 'StateFlow vs LiveData', type: 'exercise', duration: '35 min', completed: false },
        ],
      },
    ],
  },
  {
    id: 'course-capstone',
    nodeId: 'capstone-project',
    title: 'Capstone Project',
    description: 'Build and ship a production-quality Android application to the Play Store.',
    domain: 'android',
    difficulty: 'advanced',
    estimatedTime: '4 weeks',
    objectives: ['Architect a full app', 'Implement real APIs', 'Submit to Play Store'],
    hasAssessment: false,
    hasCodingChallenge: false,
    hasPracticalTask: true,
    modules: [
      {
        id: 'mod-cap-1',
        title: 'Project Planning',
        lessons: [
          { id: 'l-cap-1-1', title: 'Define Your App Idea', type: 'exercise', duration: '2 hrs', completed: false },
          { id: 'l-cap-1-2', title: 'Architecture Planning', type: 'reading', duration: '1 hr', completed: false },
        ],
      },
    ],
  },
  // ─── ML Engineer Path ─────────────────────────────────────────
  {
    id: 'course-python-ml',
    nodeId: 'python-ml',
    title: 'Python for Machine Learning',
    description: 'Python fundamentals, NumPy, Pandas, and data manipulation for ML workflows.',
    domain: 'ai-ml',
    difficulty: 'beginner',
    estimatedTime: '4 weeks',
    objectives: ['Master Python basics', 'Use NumPy efficiently', 'Manipulate data with Pandas'],
    hasAssessment: true,
    hasCodingChallenge: true,
    hasPracticalTask: false,
    modules: [
      {
        id: 'mod-py-1',
        title: 'Python Essentials',
        lessons: [
          { id: 'l-py-1-1', title: 'Python Setup & Syntax', type: 'video', duration: '20 min', completed: true },
          { id: 'l-py-1-2', title: 'Data Structures', type: 'reading', duration: '25 min', completed: true },
          { id: 'l-py-1-3', title: 'Functions & Modules', type: 'exercise', duration: '40 min', completed: false },
        ],
      },
    ],
  },
  // ─── Frontend Developer Path ───────────────────────────────────
  {
    id: 'course-react-core',
    nodeId: 'react-core',
    title: 'React Core',
    description: 'Master React components, hooks, state management, and React Router for building modern web applications.',
    domain: 'frontend',
    difficulty: 'intermediate',
    estimatedTime: '5 weeks',
    objectives: ['Build React components', 'Use hooks effectively', 'Manage state', 'Implement routing'],
    hasAssessment: true,
    hasCodingChallenge: true,
    hasPracticalTask: false,
    modules: [
      {
        id: 'mod-re-1',
        title: 'React Fundamentals',
        lessons: [
          { id: 'l-re-1-1', title: 'JSX and Components', type: 'video', duration: '20 min', completed: false },
          { id: 'l-re-1-2', title: 'Props and State', type: 'reading', duration: '25 min', completed: false },
          { id: 'l-re-1-3', title: 'useState and useEffect', type: 'exercise', duration: '45 min', completed: false },
        ],
      },
    ],
  },
];

export function getCourseByNodeId(nodeId: string): Course | undefined {
  return courses.find((c) => c.nodeId === nodeId);
}
