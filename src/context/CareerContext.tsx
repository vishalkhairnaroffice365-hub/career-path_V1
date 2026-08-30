import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { UserProfile, UserProgress } from '../data/user';
import { defaultUser } from '../data/user';
import type { Career } from '../data/careers';

// ─── Learning Progress Types ───────────────────────────────────────────────────

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
}

export interface CourseProgress {
  nodeId: string;
  lessonsCompleted: string[]; // lessonIds
  totalLessons: number;
  completed: boolean;
  startedAt?: string;
  completedAt?: string;
}

export interface AssessmentScore {
  nodeId: string;
  score: number;        // 0-100
  passed: boolean;
  attempts: number;
  lastAttemptAt: string;
}

export interface TaskSubmission {
  nodeId: string;
  githubUrl?: string;
  liveUrl?: string;
  submittedAt?: string;
  status: 'not-started' | 'in-progress' | 'submitted' | 'under-review' | 'passed' | 'failed';
  taskStartTime?: number; // Unix timestamp when task was started
  taskDeadline?: number;  // Unix timestamp of deadline
}

export interface LearningState {
  roadmapStarted: boolean;
  courseProgress: Record<string, CourseProgress>;   // nodeId → CourseProgress
  assessmentScores: Record<string, AssessmentScore>; // nodeId → AssessmentScore
  codingScores: Record<string, number>;              // nodeId → score 0-100
  taskSubmissions: Record<string, TaskSubmission>;   // nodeId → TaskSubmission
}

// ─── State Interface ───────────────────────────────────────────────────────────

interface CareerState {
  user: UserProfile;
  selectedCareer: Career | null;
  comparedCareers: Career[];
  isAuthenticated: boolean;
  isLoading: boolean;
  learning: LearningState;
}

// ─── Actions ───────────────────────────────────────────────────────────────────

type CareerAction =
  | { type: 'LOGIN'; payload: Partial<UserProfile> }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_CAREER'; payload: Career }
  | { type: 'DESELECT_CAREER' }
  | { type: 'ADD_COMPARE'; payload: Career }
  | { type: 'REMOVE_COMPARE'; payload: string }
  | { type: 'CLEAR_COMPARE' }
  | { type: 'UPDATE_PROGRESS'; payload: Partial<UserProgress> }
  | { type: 'COMPLETE_NODE'; payload: string }
  | { type: 'EARN_ACHIEVEMENT'; payload: string }
  | { type: 'COMPLETE_ONBOARDING'; payload: Partial<UserProfile> }
  // Learning actions
  | { type: 'START_ROADMAP' }
  | { type: 'UPDATE_COURSE_PROGRESS'; payload: CourseProgress }
  | { type: 'SAVE_ASSESSMENT_SCORE'; payload: AssessmentScore }
  | { type: 'SAVE_CODING_SCORE'; payload: { nodeId: string; score: number } }
  | { type: 'UPDATE_TASK_SUBMISSION'; payload: TaskSubmission };

// ─── Default Learning State ────────────────────────────────────────────────────

const defaultLearningState: LearningState = {
  roadmapStarted: false,
  courseProgress: {},
  assessmentScores: {},
  codingScores: {},
  taskSubmissions: {},
};

const initialState: CareerState = {
  user: defaultUser,
  selectedCareer: null,
  comparedCareers: [],
  isAuthenticated: false,
  isLoading: false,
  learning: defaultLearningState,
};

// ─── Session Storage ───────────────────────────────────────────────────────────

const STORAGE_KEY = 'career_path_session';

const getInitialState = (): CareerState => {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Ensure learning state exists on loaded sessions (migration safety)
      if (!parsed.learning) {
        parsed.learning = defaultLearningState;
      }
      return parsed;
    }
  } catch (error) {
    console.error('Failed to parse session storage:', error);
  }
  return initialState;
};

// ─── Reducer ───────────────────────────────────────────────────────────────────

function careerReducer(state: CareerState, action: CareerAction): CareerState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: { ...state.user, ...action.payload },
      };
    case 'LOGOUT':
      return { ...initialState };
    case 'SELECT_CAREER':
      return {
        ...state,
        selectedCareer: action.payload,
        user: { ...state.user, selectedCareerId: action.payload.id },
      };
    case 'DESELECT_CAREER':
      return {
        ...state,
        selectedCareer: null,
        user: { ...state.user, selectedCareerId: undefined },
      };
    case 'ADD_COMPARE':
      if (state.comparedCareers.length >= 3) return state;
      if (state.comparedCareers.find((c) => c.id === action.payload.id)) return state;
      return {
        ...state,
        comparedCareers: [...state.comparedCareers, action.payload],
      };
    case 'REMOVE_COMPARE':
      return {
        ...state,
        comparedCareers: state.comparedCareers.filter((c) => c.id !== action.payload),
      };
    case 'CLEAR_COMPARE':
      return { ...state, comparedCareers: [] };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        user: {
          ...state.user,
          progress: { ...state.user.progress, ...action.payload },
        },
      };
    case 'COMPLETE_NODE':
      if (state.user.progress.completedNodeIds.includes(action.payload)) return state;
      return {
        ...state,
        user: {
          ...state.user,
          progress: {
            ...state.user.progress,
            completedNodeIds: [...state.user.progress.completedNodeIds, action.payload],
            inProgressNodeIds: state.user.progress.inProgressNodeIds.filter(
              (id) => id !== action.payload
            ),
          },
        },
      };
    case 'EARN_ACHIEVEMENT':
      return {
        ...state,
        user: {
          ...state.user,
          achievements: state.user.achievements.map((a) =>
            a.id === action.payload ? { ...a, isEarned: true, earnedAt: new Date().toISOString() } : a
          ),
        },
      };
    case 'COMPLETE_ONBOARDING':
      return {
        ...state,
        isAuthenticated: true,
        user: {
          ...state.user,
          ...action.payload,
          onboardingCompleted: true,
        },
      };

    // ─── Learning Actions ────────────────────────────────────────
    case 'START_ROADMAP':
      return {
        ...state,
        learning: { ...state.learning, roadmapStarted: true },
      };

    case 'UPDATE_COURSE_PROGRESS':
      return {
        ...state,
        learning: {
          ...state.learning,
          courseProgress: {
            ...state.learning.courseProgress,
            [action.payload.nodeId]: action.payload,
          },
        },
      };

    case 'SAVE_ASSESSMENT_SCORE': {
      const existing = state.learning.assessmentScores[action.payload.nodeId];
      return {
        ...state,
        learning: {
          ...state.learning,
          assessmentScores: {
            ...state.learning.assessmentScores,
            [action.payload.nodeId]: {
              ...action.payload,
              attempts: (existing?.attempts ?? 0) + 1,
            },
          },
        },
      };
    }

    case 'SAVE_CODING_SCORE':
      return {
        ...state,
        learning: {
          ...state.learning,
          codingScores: {
            ...state.learning.codingScores,
            [action.payload.nodeId]: action.payload.score,
          },
        },
      };

    case 'UPDATE_TASK_SUBMISSION':
      return {
        ...state,
        learning: {
          ...state.learning,
          taskSubmissions: {
            ...state.learning.taskSubmissions,
            [action.payload.nodeId]: action.payload,
          },
        },
      };

    default:
      return state;
  }
}

// ─── Context Value ─────────────────────────────────────────────────────────────

interface CareerContextValue {
  state: CareerState;
  user: UserProfile;
  selectedCareer: Career | null;
  comparedCareers: Career[];
  isAuthenticated: boolean;
  learning: LearningState;

  // Auth
  login: (userData?: Partial<UserProfile>) => void;
  logout: () => void;

  // Career
  selectCareer: (career: Career) => void;
  deselectCareer: () => void;
  addToCompare: (career: Career) => void;
  removeFromCompare: (careerId: string) => void;
  clearCompare: () => void;

  // Roadmap nodes
  completeNode: (nodeId: string) => void;
  earnAchievement: (achievementId: string) => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => void;

  // Learning
  startRoadmap: () => void;
  updateCourseProgress: (progress: CourseProgress) => void;
  saveAssessmentScore: (score: AssessmentScore) => void;
  saveCodingScore: (nodeId: string, score: number) => void;
  updateTaskSubmission: (submission: TaskSubmission) => void;
}

// ─── Context ────────────────────────────────────────────────────────────────────

const CareerContext = createContext<CareerContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export function CareerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(careerReducer, getInitialState());

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value: CareerContextValue = {
    state,
    user: state.user,
    selectedCareer: state.selectedCareer,
    comparedCareers: state.comparedCareers,
    isAuthenticated: state.isAuthenticated,
    learning: state.learning,

    // Auth
    login: (userData) => dispatch({ type: 'LOGIN', payload: userData ?? {} }),
    logout: () => dispatch({ type: 'LOGOUT' }),

    // Career
    selectCareer: (career) => dispatch({ type: 'SELECT_CAREER', payload: career }),
    deselectCareer: () => dispatch({ type: 'DESELECT_CAREER' }),
    addToCompare: (career) => dispatch({ type: 'ADD_COMPARE', payload: career }),
    removeFromCompare: (careerId) => dispatch({ type: 'REMOVE_COMPARE', payload: careerId }),
    clearCompare: () => dispatch({ type: 'CLEAR_COMPARE' }),

    // Nodes / Achievements
    completeNode: (nodeId) => dispatch({ type: 'COMPLETE_NODE', payload: nodeId }),
    earnAchievement: (id) => dispatch({ type: 'EARN_ACHIEVEMENT', payload: id }),
    completeOnboarding: (data) => dispatch({ type: 'COMPLETE_ONBOARDING', payload: data }),

    // Learning
    startRoadmap: () => dispatch({ type: 'START_ROADMAP' }),
    updateCourseProgress: (progress) => dispatch({ type: 'UPDATE_COURSE_PROGRESS', payload: progress }),
    saveAssessmentScore: (score) => dispatch({ type: 'SAVE_ASSESSMENT_SCORE', payload: score }),
    saveCodingScore: (nodeId, score) => dispatch({ type: 'SAVE_CODING_SCORE', payload: { nodeId, score } }),
    updateTaskSubmission: (submission) => dispatch({ type: 'UPDATE_TASK_SUBMISSION', payload: submission }),
  };

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────────────────────────────────

export function useCareer(): CareerContextValue {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
}
