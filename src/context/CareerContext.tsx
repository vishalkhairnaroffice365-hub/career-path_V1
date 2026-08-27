import { createContext, useContext, useReducer, type ReactNode  } from 'react';
import type { UserProfile, UserProgress } from '../data/user';
import { defaultUser } from '../data/user';
import type { Career } from '../data/careers';

interface CareerState {
  user: UserProfile;
  selectedCareer: Career | null;
  comparedCareers: Career[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

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
  | { type: 'COMPLETE_ONBOARDING'; payload: Partial<UserProfile> };

const initialState: CareerState = {
  user: defaultUser,
  selectedCareer: null,
  comparedCareers: [],
  isAuthenticated: false,
  isLoading: false,
};

function careerReducer(state: CareerState, action: CareerAction): CareerState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: { ...state.user, ...action.payload },
      };
    case 'LOGOUT':
      return {
        ...initialState,
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
      return {
        ...state,
        comparedCareers: [],
      };
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
            inProgressNodeIds: state.user.progress.inProgressNodeIds.filter((id) => id !== action.payload),
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
    default:
      return state;
  }
}

interface CareerContextValue {
  state: CareerState;
  user: UserProfile;
  selectedCareer: Career | null;
  comparedCareers: Career[];
  isAuthenticated: boolean;
  login: (userData?: Partial<UserProfile>) => void;
  logout: () => void;
  selectCareer: (career: Career) => void;
  deselectCareer: () => void;
  addToCompare: (career: Career) => void;
  removeFromCompare: (careerId: string) => void;
  clearCompare: () => void;
  completeNode: (nodeId: string) => void;
  earnAchievement: (achievementId: string) => void;
  completeOnboarding: (profileData: Partial<UserProfile>) => void;
}

const CareerContext = createContext<CareerContextValue | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(careerReducer, initialState);

  const value: CareerContextValue = {
    state,
    user: state.user,
    selectedCareer: state.selectedCareer,
    comparedCareers: state.comparedCareers,
    isAuthenticated: state.isAuthenticated,
    login: (userData) => dispatch({ type: 'LOGIN', payload: userData ?? {} }),
    logout: () => dispatch({ type: 'LOGOUT' }),
    selectCareer: (career) => dispatch({ type: 'SELECT_CAREER', payload: career }),
    deselectCareer: () => dispatch({ type: 'DESELECT_CAREER' }),
    addToCompare: (career) => dispatch({ type: 'ADD_COMPARE', payload: career }),
    removeFromCompare: (careerId) => dispatch({ type: 'REMOVE_COMPARE', payload: careerId }),
    clearCompare: () => dispatch({ type: 'CLEAR_COMPARE' }),
    completeNode: (nodeId) => dispatch({ type: 'COMPLETE_NODE', payload: nodeId }),
    earnAchievement: (id) => dispatch({ type: 'EARN_ACHIEVEMENT', payload: id }),
    completeOnboarding: (data) => dispatch({ type: 'COMPLETE_ONBOARDING', payload: data }),
  };

  return (
    <CareerContext.Provider value={value}>
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer(): CareerContextValue {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
}
