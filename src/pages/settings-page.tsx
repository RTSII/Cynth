import { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useProgress } from '../contexts/ProgressContext';
import { UserPreferences } from '../contexts/UserContext';
import { AlertCircle, Check, ChevronRight, User, Bell, Eye, Volume2, Sun, Moon } from 'lucide-react';

const Settings = () => {
  const { userProfile, updateUserProfile, updatePreferences, resetProfile } = useUser();
  const { resetProgress } = useProgress();
  
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [displayName, setDisplayName] = useState('');
  
  useEffect(() => {
    if (userProfile) {
      setPreferences(userProfile.preferences);
      setDisplayName(userProfile.name);
    }
  }, [userProfile]);
  
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
  
  const handlePreferenceChange = async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    if (!preferences) return;
    
    try {
      const newPreferences = { ...preferences, [key]: value };
      setPreferences(newPreferences);
      await updatePreferences({ [key]: value });
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };
  
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
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <User className="mr-2 text-primary-500" size={20} />
          User Profile
        </h2>
        
        <div className="space-y-4">
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
              <button
                onClick={handleNameChange}
                disabled={!displayName.trim() || displayName === userProfile.name}
                className={`ml-2 px-4 py-2 rounded-lg ${
                  !displayName.trim() || displayName === userProfile.name
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Appearance Settings */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Eye className="mr-2 text-primary-500" size={20} />
          Appearance
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text Size
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePreferenceChange('textSize', 'normal')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.textSize === 'normal'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => handlePreferenceChange('textSize', 'large')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.textSize === 'large'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Large
              </button>
              <button
                onClick={() => handlePreferenceChange('textSize', 'extra-large')}
                className={`px-4 py-2 rounded-lg ${
                  preferences.textSize === 'extra-large'
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Extra Large
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">High Contrast Mode</h3>
              <p className="text-sm text-gray-500">Increase color contrast for better visibility</p>
            </div>
            <button 
              className={`w-12 h-6 rounded-full ${preferences.highContrast ? 'bg-primary-500' : 'bg-gray-300'} relative transition-colors`}
              onClick={() => handlePreferenceChange('highContrast', !preferences.highContrast)}
            >
              <span 
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
                  preferences.highContrast ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
        </div>
      </div>
      
      {/* Preference Settings */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center">
          <Bell className="mr-2 text-primary-500" size={20} />
          Practice Preferences
        </h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Prefer Chair Yoga</h3>
              <p className="text-sm text-gray-500">Recommend chair yoga programs</p>
            </div>
            <button 
              className={`w-12 h-6 rounded-full ${preferences.prefersChairYoga ? 'bg-primary-500' : 'bg-gray-300'} relative transition-colors`}
              onClick={() => handlePreferenceChange('prefersChairYoga', !preferences.prefersChairYoga)}
            >
              <span 
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
                  preferences.prefersChairYoga ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Prefer Tai Chi</h3>
              <p className="text-sm text-gray-500">Recommend tai chi programs</p>
            </div>
            <button 
              className={`w-12 h-6 rounded-full ${preferences.prefersTaiChi ? 'bg-primary-500' : 'bg-gray-300'} relative transition-colors`}
              onClick={() => handlePreferenceChange('prefersTaiChi', !preferences.prefersTaiChi)}
            >
              <span 
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
                  preferences.prefersTaiChi ? 'translate-x-6' : 'translate-x-1'
                }`} 
              />
            </button>
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
                onChange={(e) => handlePreferenceChange('musicVolume', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <Volume2 size={20} className="text-gray-900 ml-3" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Reset Section */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <h2 className="text-lg font-medium mb-4 flex items-center text-red-600">
          <AlertCircle className="mr-2" size={20} />
          Reset Application
        </h2>
        
        <p className="text-gray-700 mb-4">
          This will reset all your settings, progress, and data to default values. This action cannot be undone.
        </p>
        
        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Reset All Data
          </button>
        ) : (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 font-medium mb-4">
              Are you sure you want to reset all data? This cannot be undone.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={handleResetAll}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Yes, Reset Everything
              </button>
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* App Info */}
      <div className="bg-white rounded-xl shadow-card p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">About CynthAI</h2>
        <p className="text-gray-700 mb-2">
          Version 1.0.0
        </p>
        <p className="text-gray-700">
          CynthAI is a personalized chair yoga and tai chi application designed specifically for Cynthia Steen.
        </p>
      </div>
    </div>
  );
};

export default Settings;