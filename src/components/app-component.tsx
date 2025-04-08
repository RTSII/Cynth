import React, { useState, useEffect } from 'react';
import { Home, Calendar, BookOpen, Heart, Music, Settings } from 'lucide-react';
import { useUser } from './contexts/UserContext';
import { useProgress } from './contexts/ProgressContext';

// Import components
import Dashboard from './components/Dashboard';
import ExercisePlayer from './components/ExercisePlayer';
import InspirationGallery from './components/InspirationGallery';
import MusicPlayer from './components/MusicPlayer';
import SettingsComponent from './components/Settings';
import OnboardingFlow from './components/OnboardingFlow';

// Navigation component
const Navigation = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'programs', label: 'Programs', icon: BookOpen },
    { id: 'inspiration', label: 'Inspiration', icon: Heart },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center py-2 px-4 ${
              activeView === item.id
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Main App component
const App = () => {
  const { userProfile, isOnboarded } = useUser();
  const { progress } = useProgress();
  
  const [activeView, setActiveView] = useState('home');
  const [currentExercise, setCurrentExercise] = useState(null);
  const [isExerciseMode, setIsExerciseMode] = useState(false);
  
  // Check if user has completed onboarding
  useEffect(() => {
    if (!isOnboarded) {
      // Skip directly to main app for development
      // In production, would show onboarding: setActiveView('onboarding');
    }
  }, [isOnboarded]);
  
  const startExercise = (exercise) => {
    setCurrentExercise(exercise);
    setIsExerciseMode(true);
  };
  
  const exitExerciseMode = () => {
    setIsExerciseMode(false);
  };
  
  // Render onboarding if not onboarded
  if (activeView === 'onboarding') {
    return <OnboardingFlow onComplete={() => setActiveView('home')} />;
  }
  
  // Render exercise player if in exercise mode
  if (isExerciseMode) {
    return (
      <ExercisePlayer
        exercise={currentExercise}
        onExit={exitExerciseMode}
      />
    );
  }
  
  // Determine which component to render based on active view
  const renderView = () => {
    switch (activeView) {
      case 'home':
        return <Dashboard onStartExercise={startExercise} />;
      case 'today':
        return <div className="p-4"><h1 className="text-2xl font-bold">Today's Practice</h1></div>;
      case 'programs':
        return <div className="p-4"><h1 className="text-2xl font-bold">Programs</h1></div>;
      case 'inspiration':
        return <InspirationGallery />;
      case 'music':
        return <MusicPlayer />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return <Dashboard onStartExercise={startExercise} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {renderView()}
      <Navigation activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};

// Root component with providers
const AppWithProviders = () => {
  return (
    <UserProvider>
      <ProgressProvider>
        <AudioProvider>
          <App />
        </AudioProvider>
      </ProgressProvider>
    </UserProvider>
  );
};

export default AppWithProviders;