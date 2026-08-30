import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from 'react';
import type { UserProfile, UserProgress } from '../data/user';
export type { UserProfile, UserProgress };
import { defaultUser } from '../data/user';
import type { Career } from '../data/careers';
import { authApi } from '../services/auth.api';
import { userApi } from '../services/user.api';
import { careerApi } from '../services/career.api';
import { roadmapApi } from '../services/roadmap.api';

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
  score: number; // 0-100
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
  taskDeadline?: number; // Unix timestamp of deadline
}

export interface LearningState {
  roadmapStarted: boolean;
  courseProgress: Record<string, CourseProgress>; // nodeId → CourseProgress
  assessmentScores: Record<string, AssessmentScore>; // nodeId → AssessmentScore
  codingScores: Record<string, number>; // nodeId → score 0-100
  taskSubmissions: Record<string, TaskSubmission>; // nodeId → TaskSubmission
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
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'LOGIN'; payload: UserProfile }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_CAREER'; payload: Career }
  | { type: 'DESELECT_CAREER' }
  | { type: 'SET_COMPARED'; payload: Career[] }
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
  | { type: 'UPDATE_TASK_SUBMISSION'; payload: TaskSubmission }
  | { type: 'SET_LEARNING_STATE'; payload: Partial<LearningState> };

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
  isAuthenticated: Boolean(localStorage.getItem('career_path_token')),
  isLoading: true,
  learning: defaultLearningState,
};

// ─── Storage Key ───────────────────────────────────────────────────────────────

const STORAGE_KEY = 'career_path_session';

const getInitialState = (): CareerState => {
  try {
    const hasToken = Boolean(localStorage.getItem('career_path_token'));
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        isAuthenticated: hasToken || parsed.isAuthenticated,
        learning: parsed.learning || defaultLearningState,
        isLoading: hasToken, // Will hydrate from backend
      };
    }
  } catch (error) {
    console.error('Failed to parse session storage:', error);
  }
  return initialState;
};

// ─── Reducer ───────────────────────────────────────────────────────────────────

function careerReducer(state: CareerState, action: CareerAction): CareerState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: { ...state.user, ...action.payload },
      };

    case 'LOGOUT':
      return {
        ...initialState,
        isAuthenticated: false,
        isLoading: false,
      };

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

    case 'SET_COMPARED':
      return {
        ...state,
        comparedCareers: action.payload,
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
            a.id === action.payload
              ? { ...a, isEarned: true, earnedAt: new Date().toISOString() }
              : a
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

    case 'SET_LEARNING_STATE':
      return {
        ...state,
        learning: {
          ...state.learning,
          ...action.payload,
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
  isLoading: boolean;
  learning: LearningState;

  // Auth
  login: (userData?: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;

  // Career
  selectCareer: (career: Career) => Promise<void>;
  deselectCareer: () => Promise<void>;
  addToCompare: (career: Career) => Promise<void>;
  removeFromCompare: (careerId: string) => Promise<void>;
  clearCompare: () => Promise<void>;

  // Roadmap nodes
  completeNode: (nodeId: string) => Promise<void>;
  earnAchievement: (achievementId: string) => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => Promise<void>;

  // Learning
  startRoadmap: () => Promise<void>;
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

  // Save session state locally
  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Session Hydration from MongoDB backend on mount
  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('career_path_token');
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    try {
      const user = await authApi.getMe();
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });

        // Hydrate learning state if present on backend user document
        const anyUser = user as any;
        if (anyUser.learning) {
          dispatch({ type: 'SET_LEARNING_STATE', payload: anyUser.learning });
        }

        // Hydrate active career if selected
        if (user.selectedCareerId) {
          try {
            const activeCareer = await careerApi.getCareerById(user.selectedCareerId);
            if (activeCareer) {
              dispatch({ type: 'SELECT_CAREER', payload: activeCareer });
            }
          } catch (e) {
            console.warn('Could not fetch active career details:', e);
          }
        }

        // Hydrate compared careers
        try {
          const compared = await careerApi.getComparedCareers();
          if (Array.isArray(compared)) {
            dispatch({ type: 'SET_COMPARED', payload: compared });
          }
        } catch (e) {
          console.warn('Could not fetch compared careers:', e);
        }
      }
    } catch (err) {
      console.warn('Session hydration failed or token expired:', err);
      localStorage.removeItem('career_path_token');
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [refreshProfile]);

  const value: CareerContextValue = {
    state,
    user: state.user,
    selectedCareer: state.selectedCareer,
    comparedCareers: state.comparedCareers,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    learning: state.learning,

    // Auth
    login: (userData) => {
      sessionStorage.removeItem(STORAGE_KEY);
      dispatch({ type: 'LOGIN', payload: (userData as UserProfile) ?? defaultUser });
      refreshProfile();
    },
    logout: async () => {
      try {
        await authApi.logout();
      } catch {}
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('career_path_token');
      dispatch({ type: 'LOGOUT' });
    },
    refreshProfile,

    // Career Selection & Comparison
    selectCareer: async (career) => {
      dispatch({ type: 'SELECT_CAREER', payload: career });
      try {
        const res = await careerApi.selectCareer(career.id);
        if (res.user) {
          dispatch({ type: 'UPDATE_PROGRESS', payload: res.user.progress });
        }
      } catch (err) {
        console.warn('Backend career selection sync failed:', err);
      }
    },

    deselectCareer: async () => {
      dispatch({ type: 'DESELECT_CAREER' });
      try {
        await careerApi.deselectCareer();
      } catch (err) {
        console.warn('Backend career deselection sync failed:', err);
      }
    },

    addToCompare: async (career) => {
      dispatch({ type: 'ADD_COMPARE', payload: career });
      try {
        const compared = await careerApi.addToCompare(career.id);
        if (Array.isArray(compared)) {
          dispatch({ type: 'SET_COMPARED', payload: compared });
        }
      } catch (err) {
        console.warn('Backend add to compare failed:', err);
      }
    },

    removeFromCompare: async (careerId) => {
      dispatch({ type: 'REMOVE_COMPARE', payload: careerId });
      try {
        const compared = await careerApi.removeFromCompare(careerId);
        if (Array.isArray(compared)) {
          dispatch({ type: 'SET_COMPARED', payload: compared });
        }
      } catch (err) {
        console.warn('Backend remove from compare failed:', err);
      }
    },

    clearCompare: async () => {
      dispatch({ type: 'CLEAR_COMPARE' });
      try {
        await careerApi.clearCompare();
      } catch (err) {
        console.warn('Backend clear compare failed:', err);
      }
    },

    // Roadmap & Nodes
    completeNode: async (nodeId) => {
      dispatch({ type: 'COMPLETE_NODE', payload: nodeId });
      try {
        const res = await roadmapApi.completeNode(nodeId);
        if (res.user) {
          dispatch({ type: 'UPDATE_PROGRESS', payload: res.user.progress });
        }
      } catch (err) {
        console.warn('Backend complete node sync failed:', err);
      }
    },

    earnAchievement: (id) => dispatch({ type: 'EARN_ACHIEVEMENT', payload: id }),

    completeOnboarding: async (data) => {
      dispatch({ type: 'COMPLETE_ONBOARDING', payload: data });
      try {
        const updated = await userApi.completeOnboarding(data);
        if (updated) {
          dispatch({ type: 'SET_USER', payload: updated });
        }
      } catch (err) {
        console.warn('Backend complete onboarding sync failed:', err);
      }
    },

    // Learning
    startRoadmap: async () => {
      dispatch({ type: 'START_ROADMAP' });
      try {
        const res = await roadmapApi.startRoadmap();
        if (res.user) {
          dispatch({ type: 'UPDATE_PROGRESS', payload: res.user.progress });
        }
      } catch (err) {
        console.warn('Backend start roadmap sync failed:', err);
      }
    },

    updateCourseProgress: (progress) =>
      dispatch({ type: 'UPDATE_COURSE_PROGRESS', payload: progress }),
    saveAssessmentScore: (score) =>
      dispatch({ type: 'SAVE_ASSESSMENT_SCORE', payload: score }),
    saveCodingScore: (nodeId, score) =>
      dispatch({ type: 'SAVE_CODING_SCORE', payload: { nodeId, score } }),
    updateTaskSubmission: (submission) =>
      dispatch({ type: 'UPDATE_TASK_SUBMISSION', payload: submission }),
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
