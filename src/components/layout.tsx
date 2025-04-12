import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, Image, Music, Settings, HelpCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  
  const [showHelp, setShowHelp] = useState<boolean>(false);
  
  // Apply text size from user preferences
  const textSizeClasses = {
    normal: '',
    large: 'text-lg',
    extraLarge: 'text-xl',
  };
  
  // Apply high contrast if in user preferences
  const highContrastClass = user.preferences.highContrast ? 'high-contrast' : '';
  
  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="w-6 h-6" /> },
    { path: '/today', label: 'Today', icon: <Calendar className="w-6 h-6" /> },
    { path: '/programs', label: 'Programs', icon: <BookOpen className="w-6 h-6" /> },
    { path: '/inspiration', label: 'Inspiration', icon: <Image className="w-6 h-6" /> },
    { path: '/music', label: 'Music', icon: <Music className="w-6 h-6" /> },
    { path: '/settings', label: 'Settings', icon: <Settings className="w-6 h-6" /> },
  ];
  
  // Handle navigation
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  // Toggle help overlay
  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };
  
  // Listen for Escape key to close help overlay
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showHelp]);

  return (
    <div className={`min-h-screen bg-neutral-50 flex flex-col ${textSizeClasses[user.preferences.textSize]} ${highContrastClass}`}>
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 py-4 px-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/assets/icons/logo.svg" 
              alt="CynthAI" 
              className="h-8 w-auto"
            />
            <h1 className="ml-2 text-xl font-semibold text-primary-900">CynthAI</h1>
          </div>
          
          <button
            onClick={toggleHelp}
            className="p-2 text-neutral-600 hover:text-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full"
            aria-label="Help"
          >
            <HelpCircle className="w-6 h-6" />
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-6 py-6 overflow-auto">
        {children}
      </main>
      
      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-neutral-200 pt-2 pb-safe">
        <div className="flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`
                  flex flex-col items-center p-2 min-w-[72px]
                  focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg
                  ${isActive ? 'text-primary-500' : 'text-neutral-600'}
                `}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon}
                <span className="mt-1 text-sm">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Help Overlay */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[80vh] overflow-auto">
            <h2 className="text-2xl font-semibold mb-4">Help & Information</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Getting Around</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Home className="w-5 h-5 mr-2 flex-shrink-0 text-primary-500" />
                  <span><strong>Home:</strong> See your progress and today's practice</span>
                </li>
                <li className="flex items-start">
                  <Calendar className="w-5 h-5 mr-2 flex-shrink-0 text-primary-500" />
                  <span><strong>Today:</strong> View and start today's recommended exercises</span>
                </li>
                <li className="flex items-start">
                  <BookOpen className="w-5 h-5 mr-2 flex-shrink-0 text-primary-500" />
                  <span><strong>Programs:</strong> Browse all yoga and tai chi programs</span>
                </li>
                <li className="flex items-start">
                  <Image className="w-5 h-5 mr-2 flex-shrink-0 text-primary-500" />
                  <span><strong>Inspiration:</strong> View motivational images and quotes</span>
                </li>
                <li className="flex items-start">
                  <Music className="w-5 h-5 mr-2 flex-shrink-0 text-primary-500" />
                  <span><strong>Music:</strong> Play calming music during your exercises</span>
                </li>
                <li className="flex items-start">
                  <Settings className="w-5 h-5 mr-2 flex-shrink-0 text-primary-500" />
                  <span><strong>Settings:</strong> Adjust app preferences</span>
                </li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Exercise Controls</h3>
              <ul className="space-y-2">
                <li><strong>Play/Pause:</strong> Tap the video or use the play button</li>
                <li><strong>Volume:</strong> Use the volume slider in the video controls</li>
                <li><strong>Fullscreen:</strong> Tap the fullscreen button for a larger view</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Need More Help?</h3>
              <p>Contact your caregiver or family member for assistance with the app.</p>
            </div>
            
            <button
              onClick={toggleHelp}
              className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
            >
              Close Help
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
