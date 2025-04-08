import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, Heart, Music, Settings } from 'lucide-react';
import { AppRoute } from '@/types';

const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get current route from path
  const getCurrentRoute = (): AppRoute => {
    const path = location.pathname;
    
    if (path === '/') return 'home';
    if (path === '/today') return 'today';
    if (path === '/programs') return 'programs';
    if (path === '/inspiration') return 'inspiration';
    if (path === '/music') return 'music';
    if (path === '/settings') return 'settings';
    
    return 'home';
  };
  
  const currentRoute = getCurrentRoute();
  
  // Navigation items
  const navItems = [
    { 
      id: 'home' as AppRoute, 
      label: 'Home', 
      icon: Home, 
      path: '/' 
    },
    { 
      id: 'today' as AppRoute, 
      label: 'Today', 
      icon: Calendar, 
      path: '/today' 
    },
    { 
      id: 'programs' as AppRoute, 
      label: 'Programs', 
      icon: BookOpen, 
      path: '/programs' 
    },
    { 
      id: 'inspiration' as AppRoute, 
      label: 'Inspiration', 
      icon: Heart, 
      path: '/inspiration' 
    },
    { 
      id: 'music' as AppRoute, 
      label: 'Music', 
      icon: Music, 
      path: '/music' 
    },
    { 
      id: 'settings' as AppRoute, 
      label: 'Settings', 
      icon: Settings, 
      path: '/settings' 
    },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around max-w-4xl mx-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            className={`flex flex-col items-center py-2 px-4 ${
              currentRoute === item.id
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            aria-label={item.label}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
