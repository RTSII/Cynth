import React, { useState, useEffect } from 'react';
import { User, Eye, Bell, Volume2, AlertCircle, Check } from 'lucide-react';

// Components
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Contexts
import { useUser } from '@/contexts/UserContext';
import { useProgress } from '@/contexts/ProgressContext';
import { UserPreferences } from '@/types';

const Settings: React.FC = () => {
  const { userProfile, updateUserProfile, updatePreferences, resetProfile } = useUser();
  const { resetProgress } = useProgress();
  
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  // Initialize state when user profile is loaded
  useEffect(() => {
    if (userProfile) {
      setPreferences(userProfile.preferences);
      setDisplayName(userProfile.name);
    }
  }, [userProfile]);
  
  // Handle name change
  const handleNameChange = async () => {
    if (!userProfile || !displayName.trim()) return;
    
    try {
      await updateUserProfile({ name: displayName.trim() });
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error('Error updating name:', error);
    }
  };
  
  // Handle preference toggle
  const handleToggleChange = async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    if (!preferences) return;
    
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      await updatePreferences({ [key]: value });
      
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };
  
  // Handle text size change
  const handleTextSizeChange = async (size: 'normal' | 'large' | 'extra-large') => {
    if (!preferences) return;
    
    try {
      const newPreferences = { ...preferences, textSize: size };
      setPreferences(newPreferences);
      await updatePreferences({ textSize: size });
      
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error('Error updating text size:', error);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!preferences) return;
    
    try {
      const volume = parseFloat(e.target.value);
      const newPreferences = { ...preferences, musicVolume: volume };
      setPreferences(newPreferences);
      await updatePreferences({ musicVolume: volume });
    } catch (error) {
      console.error('Error updating volume:', error);
    }
  };
  
  // Handle reset all data
  const handleResetAll = async () => {
    try {
      await resetProfile();
      await resetProgress();
      setShowConfirmReset(false);
      window.location.reload(); // Reload the app to reset state
    } catch (error) {
      console.error('Error resetting app:', error);
    }
  };
  
  if (!userProfile || !preferences) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 flex items-center">
          <Check className="mr-2" size={20} />
          <span>Settings updated successfully</span>
        </div>
      )}
      
      {/* Profile Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 text-primary-500" size={20} />
            User Profile
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="display-name" className="block text-sm font-medium text-gray-700 mb-1">
              Display Name
            </label>
            <div className="flex">
              <input
                type="text"
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Button
                onClick={handleNameChange}
                disabled={!displayName.trim() || displayName === userProfile.name}
                className="ml-2"
              >
                Save
              </Button>
            </div>
          </div>
          
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </p>
            <p>{userProfile.age}</p>
          </div>
          
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </p>
            <p>{userProfile.level}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Appearance Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 text-primary-500" size={20} />
            Appearance
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Size
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={preferences.textSize === 'normal' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleTextSizeChange('normal')}
              >
                Normal
              </Button>
              <Button
                variant={preferences.textSize === 'large' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleTextSizeChange('large')}
              >
                Large
              </Button>
              <Button
                variant={preferences.textSize === 'extra-large' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleTextSizeChange('extra-large')}
              >
                Extra Large
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">High Contrast Mode</h3>
              <p className="text-sm text-gray-500">Increase color contrast for better visibility</p>
            </div>
            <div 
              className={`toggle ${preferences.highContrast ? 'bg-primary-500' : 'bg-gray-300'}`}
              onClick={() => handleToggleChange('highContrast', !preferences.highContrast)}
            >
              <span 
                className={`toggle-knob ${
                  preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Preference Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 text-primary-500" size={20} />
            Practice Preferences
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Prefer Chair Yoga</h3>
              <p className="text-sm text-gray-500">Recommend chair yoga programs</p>
            </div>
            <div 
              className={`toggle ${preferences.prefersChairYoga ? 'bg-primary-500' : 'bg-gray-300'}`}
              onClick={() => handleToggleChange('prefersChairYoga', !preferences.prefersChairYoga)}
            >
              <span 
                className={`toggle-knob ${
                  preferences.prefersChairYoga ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Prefer Tai Chi</h3>
              <p className="text-sm text-gray-500">Recommend tai chi programs</p>
            </div>
            <div 
              className={`toggle ${preferences.prefersTaiChi ? 'bg-primary-500' : 'bg-gray-300'}`}
              onClick={() => handleToggleChange('prefersTaiChi', !preferences.prefersTaiChi)}
            >
              <span 
                className={`toggle-knob ${
                  preferences.prefersTaiChi ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Music Volume
            </label>
            <div className="flex items-center">
              <Volume2 size={20} className="text-gray-400 mr-3" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={preferences.musicVolume}
                onChange={handleVolumeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Volume2 size={20} className="text-gray-900 ml-3" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Reset Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertCircle className="mr-2" size={20} />
            Reset Application
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700 mb-4">
            This will reset all your settings, progress, and data to default values. This action cannot be undone.
          </p>
          
          {!showConfirmReset ? (
            <Button
              variant="danger"
              onClick={() => setShowConfirmReset(true)}
            >
              Reset All Data
            </Button>
          ) : (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 font-medium mb-4">
                Are you sure you want to reset all data? This cannot be undone.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="danger"
                  onClick={handleResetAll}
                >
                  Yes, Reset Everything
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setShowConfirmReset(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* App Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>About CynthAI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-2">
            Version 1.0.0
          </p>
          <p className="text-gray-700">
            CynthAI is a personalized chair yoga and tai chi application designed specifically for Cynthia Steen.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;