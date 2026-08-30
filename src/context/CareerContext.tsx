import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { UserProfile, UserProgress } from '../data/user';
import { defaultUser } from '../data/user';
import type { Career } from '../data/careers';
import { authApi } from '../services/auth.api';
import { careerApi } from '../services/career.api';
import { roadmapApi } from '../services/roadmap.api';
import { userApi } from '../services/user.api';

interface CareerState {
  user: UserProfile;
  selectedCareer: Career | null;
  comparedCareers: Career[];
  isAuthenticated: boolean;
  isLoading: boolean;
}

type CareerAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'LOGIN'; payload: Partial<UserProfile> }
  | { type: 'LOGOUT' }
  | { type: 'SELECT_CAREER'; payload: Career }
  | { type: 'DESELECT_CAREER' }
  | { type: 'SET_COMPARED_CAREERS'; payload: Career[] }
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
  isLoading: true,
};

function careerReducer(state: CareerState, action: CareerAction): CareerState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: { ...state.user, ...action.payload },
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
    case 'SET_COMPARED_CAREERS':
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
  isLoading: boolean;
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
  refreshProfile: () => Promise<void>;
}

const CareerContext = createContext<CareerContextValue | null>(null);

export function CareerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(careerReducer, initialState);

  // Session hydration on mount
  useEffect(() => {
    async function hydrateSession() {
      const token = localStorage.getItem('career_path_token');
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const user = await authApi.getMe();
        dispatch({ type: 'SET_USER', payload: user });

        // If user has a selected career, hydrate it
        if (user.selectedCareerId) {
          try {
            const career = await careerApi.getCareerById(user.selectedCareerId);
            dispatch({ type: 'SELECT_CAREER', payload: career });
          } catch {
            // Non-blocking fallback
          }
        }

        // Hydrate compared careers if any
        try {
          const compared = await careerApi.getComparedCareers();
          dispatch({ type: 'SET_COMPARED_CAREERS', payload: compared });
        } catch {
          // Non-blocking fallback
        }
      } catch {
        localStorage.removeItem('career_path_token');
        dispatch({ type: 'LOGOUT' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    hydrateSession();
  }, []);

  const refreshProfile = async () => {
    try {
      const user = await userApi.getProfile();
      dispatch({ type: 'SET_USER', payload: user });
    } catch {
      // Non-blocking
    }
  };

  const handleSelectCareer = (career: Career) => {
    dispatch({ type: 'SELECT_CAREER', payload: career });
    careerApi.selectCareer(career.id).catch(() => {});
  };

  const handleDeselectCareer = () => {
    dispatch({ type: 'DESELECT_CAREER' });
    careerApi.deselectCareer().catch(() => {});
  };

  const handleAddToCompare = (career: Career) => {
    dispatch({ type: 'ADD_COMPARE', payload: career });
    careerApi.addToCompare(career.id).catch(() => {});
  };

  const handleRemoveFromCompare = (careerId: string) => {
    dispatch({ type: 'REMOVE_COMPARE', payload: careerId });
    careerApi.removeFromCompare(careerId).catch(() => {});
  };

  const handleClearCompare = () => {
    dispatch({ type: 'CLEAR_COMPARE' });
    careerApi.clearCompare().catch(() => {});
  };

  const handleCompleteNode = (nodeId: string) => {
    dispatch({ type: 'COMPLETE_NODE', payload: nodeId });
    roadmapApi
      .completeNode(nodeId)
      .then((res) => {
        if (res.user) {
          dispatch({ type: 'SET_USER', payload: res.user });
        }
      })
      .catch(() => {});
  };

  const handleCompleteOnboarding = (profileData: Partial<UserProfile>) => {
    dispatch({ type: 'COMPLETE_ONBOARDING', payload: profileData });
    userApi.completeOnboarding().catch(() => {});
  };

  const handleLogout = () => {
    localStorage.removeItem('career_path_token');
    dispatch({ type: 'LOGOUT' });
  };

  const value: CareerContextValue = {
    state,
    user: state.user,
    selectedCareer: state.selectedCareer,
    comparedCareers: state.comparedCareers,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login: (userData) => dispatch({ type: 'LOGIN', payload: userData ?? {} }),
    logout: handleLogout,
    selectCareer: handleSelectCareer,
    deselectCareer: handleDeselectCareer,
    addToCompare: handleAddToCompare,
    removeFromCompare: handleRemoveFromCompare,
    clearCompare: handleClearCompare,
    completeNode: handleCompleteNode,
    earnAchievement: (id) => dispatch({ type: 'EARN_ACHIEVEMENT', payload: id }),
    completeOnboarding: handleCompleteOnboarding,
    refreshProfile,
  };

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>;
}

export function useCareer(): CareerContextValue {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
}
