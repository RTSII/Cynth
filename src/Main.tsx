import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { UserProvider } from './contexts/UserContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AudioProvider } from './contexts/AudioContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ProgressProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </ProgressProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
