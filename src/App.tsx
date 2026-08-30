import { Suspense, lazy  } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { OnboardingProvider } from './context/OnboardingContext';
import { CareerProvider, useCareer } from './context/CareerContext';
import { UIProvider } from './context/UIContext';
import { Navbar } from './components/layout/Navbar';
import { ToastContainer } from './components/ui/Toast';

// Eager-loaded critical pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';

// Lazy-loaded pages
const OnboardingPage = lazy(() => import('./pages/onboarding/OnboardingPage'));
const ProfileReflectionPage = lazy(() => import('./pages/ProfileReflectionPage'));
const AnalysisPage = lazy(() => import('./pages/AnalysisPage'));
const CareerSkyPage = lazy(() => import('./pages/career-sky/CareerSkyPage'));
const CareerDetailsPage = lazy(() => import('./pages/CareerDetailsPage'));
const CareerComparisonPage = lazy(() => import('./pages/CareerComparisonPage'));
const CareerSelectionPage = lazy(() => import('./pages/CareerSelectionPage'));
const SkillGapPage = lazy(() => import('./pages/SkillGapPage'));
const RoadmapPage = lazy(() => import('./pages/RoadmapPage'));
const ResourcesPage = lazy(() => import('./pages/ResourcesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const CareerJourneyPage = lazy(() => import('./pages/CareerJourneyPage'));
const ProgressPage = lazy(() => import('./pages/ProgressPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const CareerReadinessPage = lazy(() => import('./pages/CareerReadinessPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

// New learning pages
const CoursePage = lazy(() => import('./pages/CoursePage'));
const AssessmentPage = lazy(() => import('./pages/AssessmentPage'));
const CodingChallengePage = lazy(() => import('./pages/CodingChallengePage'));
const TaskPage = lazy(() => import('./pages/TaskPage'));

function PageLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 animate-pulse" />
        <p className="text-muted-foreground text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useCareer();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/onboarding/:step" element={<OnboardingPage />} />
          <Route path="/profile-reflection" element={<ProfileReflectionPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />

          {/* Core app */}
          <Route path="/sky" element={<ProtectedRoute><CareerSkyPage /></ProtectedRoute>} />
          <Route path="/career/:careerId" element={<ProtectedRoute><CareerDetailsPage /></ProtectedRoute>} />
          <Route path="/compare" element={<ProtectedRoute><CareerComparisonPage /></ProtectedRoute>} />
          <Route path="/select" element={<ProtectedRoute><CareerSelectionPage /></ProtectedRoute>} />
          <Route path="/skill-gap" element={<ProtectedRoute><SkillGapPage /></ProtectedRoute>} />
          <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
          <Route path="/journey" element={<ProtectedRoute><CareerJourneyPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
          <Route path="/achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
          <Route path="/readiness" element={<ProtectedRoute><CareerReadinessPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* ── New Learning Routes ──────────────────────────── */}
          <Route path="/roadmap/course/:nodeId" element={<ProtectedRoute><CoursePage /></ProtectedRoute>} />
          <Route path="/roadmap/assessment/:nodeId" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />
          <Route path="/roadmap/challenge/:nodeId" element={<ProtectedRoute><CodingChallengePage /></ProtectedRoute>} />
          <Route path="/roadmap/task/:nodeId" element={<ProtectedRoute><TaskPage /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CareerProvider>
        <UIProvider>
          <OnboardingProvider>
            <AppRoutes />
          </OnboardingProvider>
        </UIProvider>
      </CareerProvider>
    </BrowserRouter>
  );
}

export default App;
