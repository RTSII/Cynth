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
