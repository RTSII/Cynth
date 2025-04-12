import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Providers
import { UserProvider } from './contexts/UserContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AudioProvider } from './contexts/AudioContext';
import { LoadingProvider } from './contexts/LoadingContext';

// Components
import Layout from './components/Layout';
import ErrorBoundary from './components/error-boundaries';
import AppRoutes from './routes';

// Utils
import { registerServiceWorker } from './utils/register-sw';
import { handleKeyboardNavigation } from './components/accessibility';

const AppContent: React.FC = () => {
  // Register service worker and set up keyboard navigation
  useEffect(() => {
    registerServiceWorker();
    window.addEventListener('keydown', handleKeyboardNavigation);
    return () => {
      window.removeEventListener('keydown', handleKeyboardNavigation);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Layout>
        <AppRoutes />
      </Layout>
    </ErrorBoundary>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <UserProvider>
          <ProgressProvider>
            <LoadingProvider>
              <AudioProvider>
                <AppContent />
              </AudioProvider>
            </LoadingProvider>
          </ProgressProvider>
        </UserProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
