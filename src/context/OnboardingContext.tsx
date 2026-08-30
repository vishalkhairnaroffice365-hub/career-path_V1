import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { OnboardingData } from '../data/user';
import { userApi } from '../services/user.api';

export type OnboardingStep =
  | 'about-you'
  | 'interests'
  | 'skills'
  | 'strengths'
  | 'work-style'
  | 'career-goals'
  | 'future-vision';

const STEPS: OnboardingStep[] = [
  'about-you',
  'interests',
  'skills',
  'strengths',
  'work-style',
  'career-goals',
  'future-vision',
];

interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  data: Partial<OnboardingData>;
  isCompleted: boolean;
}

type OnboardingAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'UPDATE_DATA'; payload: Partial<OnboardingData> }
  | { type: 'SET_DATA'; payload: Partial<OnboardingData> }
  | { type: 'COMPLETE' }
  | { type: 'RESET' };

const initialState: OnboardingState = {
  currentStep: 0,
  totalSteps: STEPS.length,
  steps: STEPS,
  data: {},
  isCompleted: false,
};

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
      };
    case 'PREV_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };
    case 'GO_TO_STEP':
      return {
        ...state,
        currentStep: action.payload,
      };
    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'SET_DATA':
      return {
        ...state,
        data: action.payload,
      };
    case 'COMPLETE':
      return {
        ...state,
        isCompleted: true,
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface OnboardingContextValue {
  state: OnboardingState;
  currentStep: OnboardingStep;
  currentStepIndex: number;
  progress: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  updateData: (data: Partial<OnboardingData>) => void;
  complete: () => void;
  reset: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  const currentStep = state.steps[state.currentStep];
  const progress = Math.round((state.currentStep / (state.totalSteps - 1)) * 100);

  const handleUpdateData = (data: Partial<OnboardingData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
    // Sync to backend if token exists
    const token = localStorage.getItem('career_path_token');
    if (token) {
      userApi.saveOnboarding(data).catch(() => {});
    }
  };

  const handleComplete = () => {
    dispatch({ type: 'COMPLETE' });
    const token = localStorage.getItem('career_path_token');
    if (token) {
      userApi.completeOnboarding().catch(() => {});
    }
  };

  const value: OnboardingContextValue = {
    state,
    currentStep,
    currentStepIndex: state.currentStep,
    progress,
    isFirstStep: state.currentStep === 0,
    isLastStep: state.currentStep === state.totalSteps - 1,
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    goToStep: (index) => dispatch({ type: 'GO_TO_STEP', payload: index }),
    updateData: handleUpdateData,
    complete: handleComplete,
    reset: () => dispatch({ type: 'RESET' }),
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding(): OnboardingContextValue {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
