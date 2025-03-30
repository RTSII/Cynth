import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

// User context
interface UserContextType {
  isOnboarded: boolean;
  completeOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [isOnboarded, setIsOnboarded] = useState(false);

  const completeOnboarding = () => {
    setIsOnboarded(true);
  };

  return (
    <UserContext.Provider value={{ isOnboarded, completeOnboarding }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Pages
import Dashboard from './pages/Dashboard';
import TodayPractice from './pages/TodayPractice';
import Programs from './pages/Programs';
import ExercisePlayer from './pages/ExercisePlayer';
import Inspiration from './pages/Inspiration';
import Music from './pages/Music';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

// Components
import Layout from './components/Layout';

const App: React.FC = () => {
  const { isOnboarded, completeOnboarding } = useUser();
  const location = useLocation();

  // Skip onboarding for development
  const handleSkipOnboarding = () => {
    // Only enable this in development mode
    if (import.meta.env.DEV) {
      completeOnboarding();
    }
  };

  // Determine if route should show navigation
  const shouldShowNav = () => {
    // Don't show nav on onboarding or exercise screens
    return isOnboarded &&
      !location.pathname.startsWith('/exercise') &&
      !location.pathname.startsWith('/onboarding');
  };

  return (
    <Routes>
      {!isOnboarded ? (
        <>
          {/* Development shortcut - remove in production */}
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

          {/* Onboarding route */}
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Redirect all other routes to onboarding */}
          <Route path="*" element={<Navigate to="/onboarding" replace />} />
        </>
      ) : (
        <>
          {/* Main app routes with navigation layout */}
          <Route element={<Layout showNav={shouldShowNav()} />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/today" element={<TodayPractice />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/music" element={<Music />} />
            <Route path="/settings" element={<Settings />} />

            {/* Exercise player route without navigation */}
            <Route
              path="/exercise/:programId/:dayId/:exerciseId"
              element={<ExercisePlayer />}
            />

            {/* Redirect any other routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </>
      )}
    </Routes>
  );
};

export default App;
