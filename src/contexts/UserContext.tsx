import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import authService from '@/services/authService'; // Import the auth service

export interface UserPreferences {
  reminderTime: string;
  reminderDays: string[];
  prefersChairYoga: boolean;
  prefersTaiChi: boolean;
  musicVolume: number;
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
}

export interface Goal {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

export interface UserProfile {
  name: string;
  age: number;
  level: string;
  startDate: string;
  healthConditions: string[];
  goals: Goal[];
  preferences: UserPreferences;
}

// Default user profile specifically for Cynthia
const defaultUserProfile: UserProfile = {
  name: 'Cynthia',
  age: 65,
  level: 'Novice',
  startDate: new Date().toISOString(),
  healthConditions: [],
  username: 'Cynthia',
  goals: [
    {
      id: '1',
      name: 'Improve Flexibility',
      description: 'Increase range of motion in joints.',
      completed: false,
    },
    {
      id: '2',
      name: 'Build Strength',
      description: 'Develop muscle strength for daily activities.',
      completed: false,
    },
    {
      id: '3',
      name: 'Enhance Balance',
      description: 'Improve stability and reduce fall risk.',
      completed: false,
    }
  ],
  preferences: {
    reminderTime: '09:00',
    reminderDays: ['Monday', 'Wednesday', 'Friday'],
    prefersChairYoga: true,
    prefersTaiChi: false,
    musicVolume: 0.7,
    textSize: 'normal',
    highContrast: false,
  }
};

type UserContextType = {
  userProfile: UserProfile | null; // This will now hold the logged-in user
  isOnboarded: boolean;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  resetProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface User {
  username: string;
}
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null); // Use a simple User interface
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const onboardedStatus = localStorage.getItem('@cynthai_onboarded');
        setIsOnboarded(onboardedStatus === 'true');

        const profile = localStorage.getItem('@cynthai_user_profile');
        // Initialize with default profile if none exists and onboarded
        let userProfile: UserProfile | null = profile ? JSON.parse(profile) : (onboardedStatus === 'true' ? defaultUserProfile : null);

        setUser(userProfile ? { username: userProfile.username } : null); // Set initial user
        // Also save default profile if not present and onboarded
        if (profile) {
          const userProfile = JSON.parse(profile) as UserProfile;
          applyAccessibilitySettings(userProfile.preferences);
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    };

    loadUserData();
  }, []);

  const applyAccessibilitySettings = (preferences: UserPreferences) => {
    if (preferences.textSize === 'large') {
      document.body.classList.add('text-base-large');
      document.body.classList.remove('text-lg');
    } else if (preferences.textSize === 'extra-large') {
      document.body.classList.add('text-lg');
      document.body.classList.remove('text-base-large');
    } else {
      document.body.classList.remove('text-base-large', 'text-lg');
    }

    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  const saveUserProfile = async (profile: UserProfile) => {
    try {
      localStorage.setItem('@cynthai_user_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    try {
      if (!user) return;

      const updatedProfile = {
        ...userProfile,
        ...profile,
      };

      await saveUserProfile(updatedProfile);
      setUser(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      if (!user) return;

      const updatedProfile = {
        ...userProfile,
        preferences: {
          ...userProfile.preferences,
          ...preferences,
        },
      };

      await saveUserProfile(updatedProfile);
      setUser(updatedProfile);
      applyAccessibilitySettings(updatedProfile.preferences);
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    try {
      localStorage.setItem('@cynthai_onboarded', 'true');
      setIsOnboarded(true);

      if (!userProfile) {
        //await saveUserProfile(defaultUserProfile);
        //setUser(defaultUserProfile);
        applyAccessibilitySettings(defaultUserProfile.preferences);
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const resetProfile = async () => {
    try {
      localStorage.removeItem('@cynthai_onboarded');
      localStorage.removeItem('@cynthai_user_profile');
      setIsOnboarded(false);
      setUser(null);
      document.body.classList.remove('text-base-large', 'text-lg', 'high-contrast');
    } catch (error) {
      console.error('Error resetting profile:', error);
      throw error;
    }
  };

  const login = async (username: string, password: string) => {
    try {
      const success = await authService.login(username, password);
      if (success) {
        // In a real app, get the user profile from the backend
        const userProfile: UserProfile = {
          ...defaultUserProfile,
          username,
        };
        await saveUserProfile(userProfile);
        setUser({ username });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem('@cynthai_user_profile'); // Clear profile on logout
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error if needed
    }
  };

  const value: UserContextType = {
    userProfile,
    isOnboarded,
    updateUserProfile,
    updatePreferences,
    completeOnboarding,
    resetProfile,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};