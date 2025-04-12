import { useState } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('Cynthia');
  const [age, setAge] = useState(65);
  const [level, setLevel] = useState<'Novice' | 'Active' | 'Advanced'>('Novice');
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [prefersChairYoga, setPrefersChairYoga] = useState(true);
  const [prefersTaiChi, setPrefersTaiChi] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  
  const { updateUserProfile, updatePreferences } = useUser();
  
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };
  
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const toggleHealthCondition = (condition: string) => {
    if (healthConditions.includes(condition)) {
      setHealthConditions(healthConditions.filter(c => c !== condition));
    } else {
      setHealthConditions([...healthConditions, condition]);
    }
  };
  
  const handleComplete = async () => {
    try {
      // Update user profile
      await updateUserProfile({
        name,
        age,
        level,
        healthConditions,
        startDate: new Date().toISOString(),
      });
      
      // Update preferences
      await updatePreferences({
        prefersChairYoga,
        prefersTaiChi,
        textSize,
        highContrast,
      });
      
      // Complete onboarding
      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Progress Indicator */}
        <div className="w-full bg-gray-200 h-1">
          <div 
            className="bg-primary-500 h-1 transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
        
        <div className="p-6">
          {/* Step 1: Welcome */}
          {step === 1 && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Welcome to CynthAI</h1>
              <p className="text-gray-600">
                Let's set up your personal chair yoga and tai chi experience. We'll help you
                create a practice that's perfect for you.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    min={50}
                    max={99}
                    value={age}
                    onChange={(e) => setAge(parseInt(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 2: Experience Level */}
          {step === 2 && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Experience Level</h1>
              <p className="text-gray-600">
                Select your current exercise experience level to help us tailor your program.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setLevel('Novice')}
                  className={`flex items-center w-full p-4 rounded-lg border-2 ${
                    level === 'Novice'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
                    level === 'Novice' ? 'bg-primary-500' : 'border-2 border-gray-300'
                  }`}>
                    {level === 'Novice' && <Check size={16} className="text-white" />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Novice</h3>
                    <p className="text-sm text-gray-500">New to yoga and tai chi, or returning after a long break</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setLevel('Active')}
                  className={`flex items-center w-full p-4 rounded-lg border-2 ${
                    level === 'Active'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
                    level === 'Active' ? 'bg-primary-500' : 'border-2 border-gray-300'
                  }`}>
                    {level === 'Active' && <Check size={16} className="text-white" />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Active</h3>
                    <p className="text-sm text-gray-500">Some experience with gentle exercise, comfortable with basic movements</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setLevel('Advanced')}
                  className={`flex items-center w-full p-4 rounded-lg border-2 ${
                    level === 'Advanced'
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
                    level === 'Advanced' ? 'bg-primary-500' : 'border-2 border-gray-300'
                  }`}>
                    {level === 'Advanced' && <Check size={16} className="text-white" />}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">Advanced</h3>
                    <p className="text-sm text-gray-500">Regular practitioner with good mobility and balance</p>
                  </div>
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Health Considerations */}
          {step === 3 && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Health Considerations</h1>
              <p className="text-gray-600">
                Select any conditions that apply to you. This helps us recommend appropriate modifications.
              </p>
              
              <div className="space-y-3">
                {['Arthritis', 'Back Pain', 'Balance Issues', 'Shoulder Tension', 'High Blood Pressure', 'Osteoporosis'].map((condition) => (
                  <button
                    key={condition}
                    onClick={() => toggleHealthCondition(condition)}
                    className={`flex items-center w-full p-4 rounded-lg border-2 ${
                      healthConditions.includes(condition)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
                      healthConditions.includes(condition) ? 'bg-primary-500' : 'border-2 border-gray-300'
                    }`}>
                      {healthConditions.includes(condition) && <Check size={16} className="text-white" />}
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium">{condition}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Step 4: Preferences */}
          {step === 4 && (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900">Your Preferences</h1>
              <p className="text-gray-600">
                Customize your experience with these final settings.
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Exercise Preference</h3>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Chair Yoga</span>
                      <button 
                        className={`w-12 h-6 rounded-full ${prefersChairYoga ? 'bg-primary-500' : 'bg-gray-300'} relative transition-colors`}
                        onClick={() => setPrefersChairYoga(!prefersChairYoga)}
                      >
                        <span 
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
                            prefersChairYoga ? 'translate-x-6' : 'translate-x-1'
                          }`} 
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>Tai Chi</span>
                      <button 
                        className={`w-12 h-6 rounded-full ${prefersTaiChi ? 'bg-primary-500' : 'bg-gray-300'} relative transition-colors`}
                        onClick={() => setPrefersTaiChi(!prefersTaiChi)}
                      >
                        <span 
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
                            prefersTaiChi ? 'translate-x-6' : 'translate-x-1'
                          }`} 
                        />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Text Size</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setTextSize('normal')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        textSize === 'normal'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      onClick={() => setTextSize('large')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        textSize === 'large'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Large
                    </button>
                    <button
                      onClick={() => setTextSize('extra-large')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        textSize === 'extra-large'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Extra Large
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium">High Contrast Mode</h3>
                    <p className="text-sm text-gray-500">Increases visibility for text and UI elements</p>
                  </div>
                  <button 
                    className={`w-12 h-6 rounded-full ${highContrast ? 'bg-primary-500' : 'bg-gray-300'} relative transition-colors`}
                    onClick={() => setHighContrast(!highContrast)}
                  >
                    <span 
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform transform ${
                        highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`} 
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={handlePreviousStep}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={16} className="mr-1" /> Back
              </button>
            ) : (
              <div></div> // Empty div to maintain flex spacing
            )}
            
            {step < 4 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Continue <ArrowRight size={16} className="ml-1" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="flex items-center px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Get Started <ArrowRight size={16} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;