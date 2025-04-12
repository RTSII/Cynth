import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { UserProvider } from './contexts/UserContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AudioProvider } from './contexts/AudioContext';
import { LoadingProvider } from './contexts/LoadingContext';

// Components
import Layout from './components/Layout';
import ErrorBoundary from './components/error-boundaries';
import LoginPage from './pages/Login';
import { Dashboard } from './pages'; // Import Dashboard and other pages as needed

// Utils
import { registerServiceWorker } from './utils/register-sw';
import { handleKeyboardNavigation } from './components/accessibility';

const AppRoutes: React.FC = () => {
  const { user } = useUser();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      {user ? (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other protected routes here */}
          <Route path="/" element={<Navigate to="/dashboard" />} /> {/* Redirect to dashboard if logged in */}
        </>
      ) : (
        <Route path="*" element={<Navigate to="/login" />} /> // Redirect to login if not logged in
      )}
    </Routes>
  );
};

const App: React.FC = () => {
    useEffect(() => {
    registerServiceWorker();
    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      window.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, []);
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <ProgressProvider>
            <LoadingProvider>
              <AudioProvider>
                <ErrorBoundary><Layout><AppRoutes /></Layout></ErrorBoundary>
              </AudioProvider>
            </LoadingProvider>
          </ProgressProvider>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
