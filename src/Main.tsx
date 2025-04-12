import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Initialize safe area insets for iOS devices
const initSafeAreaInsets = () => {
  const root = document.documentElement;

  // Set initial values
  root.style.setProperty('--sat', '0px');
  root.style.setProperty('--sar', '0px');
  root.style.setProperty('--sab', '0px');
  root.style.setProperty('--sal', '0px');

  // Check if running as PWA
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.body.classList.add('standalone-mode');

    // Get safe area insets
    const style = getComputedStyle(document.documentElement);
    const insets = {
      top: style.getPropertyValue('--sat'),
      right: style.getPropertyValue('--sar'),
      bottom: style.getPropertyValue('--sab'),
      left: style.getPropertyValue('--sal'),
    };

    // Apply safe area insets
    Object.entries(insets).forEach(([key, value]) => {
      if (value) {
        root.style.setProperty(`--sa${key[0]}`, value);
      }
    });
  }
};

const Root: React.FC = () => {
  useEffect(() => {
    // Initialize safe area insets
    initSafeAreaInsets();

    // Handle display mode changes (e.g., installing PWA)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      document.body.classList.toggle('standalone-mode', e.matches);
      if (e.matches) {
        initSafeAreaInsets();
      }
    };

    mediaQuery.addEventListener('change', handleDisplayModeChange);
    return () => mediaQuery.removeEventListener('change', handleDisplayModeChange);
  }, []);

  return <App />;
};

// Render the app
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
