<<<<<<< HEAD
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

// Components
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import TodayPractice from './pages/TodayPractice';
import Programs from './pages/Programs';
import ExercisePlayer from './pages/ExercisePlayer';
import Inspiration from './pages/Inspiration';
import Music from './pages/Music';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

const App: React.FC = () => {
    const { isOnboarded, completeOnboarding } = useUser();
    const location = useLocation();

    const handleSkipOnboarding = () => {
        if (import.meta.env.DEV) {
            completeOnboarding();
        }
    };

    const shouldShowNav = () => {
        return isOnboarded &&
            !location.pathname.startsWith('/exercise') &&
            !location.pathname.startsWith('/onboarding');
    };

    return (
        <Routes>
            {!isOnboarded ? (
                <>
                    {import.meta.env.DEV && (
                        <Route
                            path="/dev-skip-onboarding"
                            element={
                                <div className="p-8">
                                    <h1 className="text-2xl font-bold mb-4">Developer Shortcut</h1>
                                    <button
                                        onClick={handleSkipOnboarding}
                                        className="btn btn-primary"
                                    >
                                        Skip Onboarding
                                    </button>
                                </div>
                            }
                        />
                    )}
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="*" element={<Navigate to="/onboarding" replace />} />
                </>
            ) : (
                <Route element={<Layout showNav={shouldShowNav()} />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/today" element={<TodayPractice />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/inspiration" element={<Inspiration />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route
                        path="/exercise/:programId/:dayId/:exerciseId"
                        element={<ExercisePlayer />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            )}
        </Routes>
    );
};

export default App;
=======
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ExercisePlayer from './pages/ExercisePlayer';

import { UserProvider, useUser } from './contexts/UserContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AudioProvider } from './contexts/AudioContext';

// Import service worker registration for PWA
import { registerSW } from './utils/registerSW';

// Lazy load other pages for better performance
const TodayPractice = React.lazy(() => import('./pages/TodayPractice'));
const Programs = React.lazy(() => import('./pages/Programs'));
const ProgramDetail = React.lazy(() => import('./pages/ProgramDetail'));
const ProgramDayDetail = React.lazy(() => import('./pages/ProgramDayDetail'));
const DayComplete = React.lazy(() => import('./pages/DayComplete'));
const Inspiration = React.lazy(() => import('./pages/Inspiration'));
const Music = React.lazy(() => import('./pages/Music'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));

// Loading component for lazy-loaded routes
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full py-20">
    <div className="w-16 h-16 border-4 border-neutral-300 border-t-primary-500 rounded-full animate-spin" />
  </div>
);

// RouteGuard component to handle authentication and onboarding
const RouteGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useUser();
  
  if (isLoading) {
    return <LoadingFallback />;
  }
  
  // Check if user needs onboarding (this is simplified - you might want more complex logic)
  const needsOnboarding = !user.name || (!user.selectedPrograms.chairYoga && !user.selectedPrograms.taiChi);
  
  if (needsOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <>{children}</>;
};

const AppContent: React.FC = () => {  
  // Register service worker for PWA
  useEffect(() => {
    registerSW();
  }, []);
  
  return (
    <BrowserRouter>
      <Layout>
        <React.Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Onboarding Route (no guard) */}
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <RouteGuard>
                <Dashboard />
              </RouteGuard>
            } />
            
            <Route path="/today" element={
              <RouteGuard>
                <TodayPractice />
              </RouteGuard>
            } />
            
            <Route path="/programs" element={
              <RouteGuard>
                <Programs />
              </RouteGuard>
            } />
            
            <Route path="/programs/:programId" element={
              <RouteGuard>
                <ProgramDetail />
              </RouteGuard>
            } />
            
            <Route path="/programs/:programId/:dayId" element={
              <RouteGuard>
                <ProgramDayDetail />
              </RouteGuard>
            } />
            
            <Route path="/programs/:programId/:dayId/:exerciseIndex" element={
              <RouteGuard>
                <ExercisePlayer />
              </RouteGuard>
            } />
            
            <Route path="/programs/:programId/:dayId/complete" element={
              <RouteGuard>
                <DayComplete />
              </RouteGuard>
            } />
            
            <Route path="/inspiration" element={
              <RouteGuard>
                <Inspiration />
              </RouteGuard>
            } />
            
            <Route path="/music" element={
              <RouteGuard>
                <Music />
              </RouteGuard>
            } />
            
            <Route path="/settings" element={
              <RouteGuard>
                <Settings />
              </RouteGuard>
            } />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Layout>
    </BrowserRouter>
  );
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <ProgressProvider>
        <AudioProvider>
          <AppContent />
        </AudioProvider>
      </ProgressProvider>
    </UserProvider>
  );
};

export default App;
>>>>>>> 56360646f92426441bd53b9be28d308739174b72
