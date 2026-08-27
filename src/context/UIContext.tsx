import { createContext, useContext, useState, type ReactNode  } from 'react';

export type CameraState = 'SKY_VIEW' | 'DOMAIN_VIEW' | 'CAREER_VIEW';

interface UIState {
  // Camera / 3D Sky
  cameraState: CameraState;
  activeDomainId: string | null;
  activeSubDomainId: string | null;
  // Sidebar / modal
  isSidebarOpen: boolean;
  activeModal: string | null;
  // Theme
  isDark: boolean;
  // Toast notifications
  toasts: Toast[];
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface UIContextValue extends UIState {
  setCameraState: (state: CameraState) => void;
  setActiveDomain: (domainId: string | null) => void;
  setActiveSubDomain: (subDomainId: string | null) => void;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  toggleDark: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  enterDomain: (domainId: string) => void;
  enterSubDomain: (subDomainId: string) => void;
  exitToSky: () => void;
  exitToDomain: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cameraState, setCameraState] = useState<CameraState>('SKY_VIEW');
  const [activeDomainId, setActiveDomainId] = useState<string | null>(null);
  const [activeSubDomainId, setActiveSubDomainId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: Toast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, toast.duration ?? 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const enterDomain = (domainId: string) => {
    setActiveDomainId(domainId);
    setActiveSubDomainId(null);
    setCameraState('DOMAIN_VIEW');
  };

  const enterSubDomain = (subDomainId: string) => {
    setActiveSubDomainId(subDomainId);
    setCameraState('CAREER_VIEW');
  };

  const exitToSky = () => {
    setActiveDomainId(null);
    setActiveSubDomainId(null);
    setCameraState('SKY_VIEW');
  };

  const exitToDomain = () => {
    setActiveSubDomainId(null);
    setCameraState('DOMAIN_VIEW');
  };

  const value: UIContextValue = {
    cameraState,
    activeDomainId,
    activeSubDomainId,
    isSidebarOpen,
    activeModal,
    isDark,
    toasts,
    setCameraState,
    setActiveDomain: setActiveDomainId,
    setActiveSubDomain: setActiveSubDomainId,
    toggleSidebar: () => setIsSidebarOpen((prev) => !prev),
    openModal: (id) => setActiveModal(id),
    closeModal: () => setActiveModal(null),
    toggleDark: () => setIsDark((prev) => !prev),
    addToast,
    removeToast,
    enterDomain,
    enterSubDomain,
    exitToSky,
    exitToDomain,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI(): UIContextValue {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
