import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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
  userProfile: UserProfile | null;
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

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Check if user has completed onboarding
        const onboardedStatus = localStorage.getItem('@cynthai_onboarded');
        setIsOnboarded(onboardedStatus === 'true');

        // Load user profile
        const profile = localStorage.getItem('@cynthai_user_profile');

        if (profile) {
          setUserProfile(JSON.parse(profile));
        } else if (onboardedStatus === 'true') {
          // If onboarded but no profile, create default profile
          await saveUserProfile(defaultUserProfile);
          setUserProfile(defaultUserProfile);
        }

        // Apply accessibility settings if available
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

  // Apply accessibility settings to document
  const applyAccessibilitySettings = (preferences: UserPreferences) => {
    // Apply text size
    if (preferences.textSize === 'large') {
      document.body.classList.add('text-base-large');
      document.body.classList.remove('text-lg');
    } else if (preferences.textSize === 'extra-large') {
      document.body.classList.add('text-lg');
      document.body.classList.remove('text-base-large');
    } else {
      document.body.classList.remove('text-base-large', 'text-lg');
    }

    // Apply high contrast
    if (preferences.highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };

  // Save user profile to local storage
  const saveUserProfile = async (profile: UserProfile) => {
    try {
      localStorage.setItem('@cynthai_user_profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  };

  const value: UserContextType = {
    userProfile,
    isOnboarded,
    updateUserProfile,
    updatePreferences,
    completeOnboarding,
    resetProfile,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Update user profile
const updateUserProfile = async (profile: Partial<UserProfile>) => {
  try {
    if (!userProfile) return;

    const updatedProfile = {
      ...userProfile,
      ...profile,
    };

    await saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Update user preferences
const updatePreferences = async (preferences: Partial<UserPreferences>) => {
  try {
    if (!userProfile) return;

    const updatedProfile = {
      ...userProfile,
      preferences: {
        ...userProfile.preferences,
        ...preferences,
      },
    };

    await saveUserProfile(updatedProfile);
    setUserProfile(updatedProfile);

    // Apply accessibility settings
    applyAccessibilitySettings(updatedProfile.preferences);
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
};

// Complete onboarding
const completeOnboarding = async () => {
  try {
    localStorage.setItem('@cynthai_onboarded', 'true');
    setIsOnboarded(true);

    // If no profile exists, create default profile
    if (!userProfile) {
      await saveUserProfile(defaultUserProfile);
      setUserProfile(defaultUserProfile);

      // Apply accessibility settings
      applyAccessibilitySettings(defaultUserProfile.preferences);
    }
  } catch (error) {
    console.error('Error completing onboarding:', error);
    throw error;
  }
};

// Reset profile
const resetProfile = async () => {
  try {
    localStorage.removeItem('@cynthai_onboarded');
    localStorage.removeItem('@cynthai_user_profile');
    setIsOnboarded(false);
    setUserProfile(null);

    // Reset accessibility settings
    document.body.classList.remove('text-base-large', 'text-lg', 'high-contrast');
  } catch (error) {
    console.error('Error resetting profile:', error);
    throw error;
  }
};