import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Play, Pause, X, Star, ChevronLeft, ChevronRight } from 'lucide-react';

// Components
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

// Contexts
import { useProgress } from '@/contexts/ProgressContext';

// Data and types
import { Exercise, ProgramDay } from '@/types';
import { getExerciseData, getProgramDay } from '@/data/programs';

// VideoPlayer component
const VideoPlayer: React.FC<{ 
  videoUrl: string; 
  onEnded: () => void;
  isPlaying: boolean;
  onPlayPause: () => void;
}> = ({ videoUrl, onEnded, isPlaying, onPlayPause }) => {
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeId, setYoutubeId] = useState('');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Check if URL is YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = videoUrl.match(youtubeRegex);
    
    if (match && match[1]) {
      setIsYouTube(true);
      setYoutubeId(match[1]);
    } else {
      setIsYouTube(false);
    }
  }, [videoUrl]);

  // Control video playback
  useEffect(() => {
    if (!isYouTube && videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(error => {
          console.error('Error playing video:', error);
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, isYouTube]);
  
  if (isYouTube) {
    // YouTube embed with playback control
    return (
      <div className="relative">
        <iframe
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
          className="absolute top-0 left-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Exercise Video"
        ></iframe>
        
        {/* Custom play/pause overlay for YouTube */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10"
          style={{ display: isPlaying ? 'none' : 'flex' }}
          onClick={onPlayPause}
        >
          <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer">
            {isPlaying ? (
              <Pause size={32} className="text-primary-600" />
            ) : (
              <Play size={32} className="text-primary-600 ml-1" />
            )}
          </div>
        </div>
      </div>
    );
  } else {
    // Standard HTML5 Video Player
    return (
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-full"
          onEnded={onEnded}
          playsInline
        ></video>
        
        {/* Play/pause overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-10"
          style={{ display: isPlaying ? 'none' : 'flex' }}
          onClick={onPlayPause}
        >
          <div className="w-16 h-16 bg-white bg-opacity-80 rounded-full flex items-center justify-center cursor-pointer">
            {isPlaying ? (
              <Pause size={32} className="text-primary-600" />
            ) : (
              <Play size={32} className="text-primary-600 ml-1" />
            )}
          </div>
        </div>
      </div>
    );
  }
};

// Main ExercisePlayer component
const ExercisePlayer: React.FC = () => {
  const { programId, dayId, exerciseId } = useParams();
  const navigate = useNavigate();
  const { completeExercise } = useProgress();
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [programDay, setProgramDay] = useState<ProgramDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [rating, setRating] = useState(0);
  const [activeTab, setActiveTab] = useState<'instructions' | 'benefits' | 'modifications'>('instructions');
  const [currentModification, setCurrentModification] = useState<string | null>(null);
  
  // Load exercise data
  useEffect(() => {
    const loadExerciseData = async () => {
      if (!programId || !dayId || !exerciseId) {
        navigate('/today');
        return;
      }
      
      try {
        setLoading(true);
        
        // Get exercise data
        const exerciseData = getExerciseData(exerciseId);
        if (!exerciseData) {
          throw new Error('Exercise not found');
        }
        setExercise(exerciseData);
        
        // Get program day data for navigation between exercises
        const day = getProgramDay(programId, dayId);
        if (day) {
          setProgramDay(day);
        }
      } catch (error) {
        console.error('Error loading exercise data:', error);
        navigate('/today');
      } finally {
        setLoading(false);
      }
    };
    
    loadExerciseData();
  }, [programId, dayId, exerciseId, navigate]);
  
  // Handle video playback control
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Handle video ended
  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
  };
  
  // Handle rating selection
  const handleRating = (value: number) => {
    setRating(value);
  };
  
  // Handle exercise completion
  const handleComplete = async () => {
    if (!exercise || !programId || !dayId) return;
    
    try {
      // Create completion data
      const completionData = {
        id: `${Date.now()}`,
        exerciseId: exercise.id,
        programId,
        dayId,
        completedDate: new Date().toISOString(),
        duration: exercise.duration,
        rating: rating > 0 ? rating : 5, // Default to 5 if not rated
      };
      
      // Save completion
      await completeExercise(completionData);
      
      // Navigate to the next exercise or back to today
      navigateAfterCompletion();
    } catch (error) {
      console.error('Error completing exercise:', error);
    }
  };
  
  // Navigate to next exercise or back to today
  const navigateAfterCompletion = () => {
    if (!programDay) {
      navigate('/today');
      return;
    }
    
    // Find current exercise index
    const currentIndex = programDay.exercises.findIndex(e => e.id === exerciseId);
    
    // If there's a next exercise, navigate to it
    if (currentIndex < programDay.exercises.length - 1) {
      const nextExercise = programDay.exercises[currentIndex + 1];
      navigate(`/exercise/${programId}/${dayId}/${nextExercise.id}`);
    } else {
      // Otherwise return to today view
      navigate('/today');
    }
  };
  
  // Exit exercise player
  const handleExit = () => {
    navigate('/today');
  };
  
  // Toggle modification details
  const toggleModification = (modId: string) => {
    if (currentModification === modId) {
      setCurrentModification(null);
    } else {
      setCurrentModification(modId);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-center">
          <p className="mb-4">Exercise not found</p>
          <Button variant="outline" onClick={handleExit}>Return to Today</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Video section */}
      <div className="relative bg-black">
        {/* Exit button */}
        <button 
          className="absolute top-4 left-4 z-20 bg-black bg-opacity-50 text-white p-2 rounded-full"
          onClick={handleExit}
        >
          <X size={24} />
        </button>
        
        <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
          {exercise.videoUrl && (
            <VideoPlayer 
              videoUrl={exercise.videoUrl} 
              onEnded={handleVideoEnded}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
            />
          )}
        </div>
        
        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6 z-30">
            <Card padding="lg" className="w-full max-w-md text-center">
              <h3 className="text-xl font-bold mb-4">Great Job!</h3>
              
              <p className="text-center mb-6">How was this exercise?</p>
              
              <div className="flex justify-center mb-6">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    onClick={() => handleRating(value)}
                    className="mx-1"
                  >
                    <Star
                      size={32}
                      className={`${
                        value <= rating 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleComplete}
              >
                Complete & Continue
              </Button>
            </Card>
          </div>
        )}
      </div>
      
      {/* Exercise information section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-1">{exercise.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-blue-100 text-blue-800">
              {exercise.type}
            </span>
            <span className="badge bg-purple-100 text-purple-800">
              {exercise.focusArea}
            </span>
            <span className="badge bg-green-100 text-green-800">
              {exercise.difficulty}
            </span>
          </div>
          
          <p className="text-gray-700 mb-4">{exercise.description}</p>
          
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-4">
            <div className="flex">
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'instructions' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'benefits' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'modifications' 
                    ? 'text-primary-600 border-b-2 border-primary-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('modifications')}
              >
                Modifications
              </button>
            </div>
          </div>
          
          {/* Tab content */}
          <div>
            {activeTab === 'instructions' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">How to do this exercise:</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  {exercise.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ol>
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <h3 className="font-semibold text-yellow-800 mb-1">Precautions:</h3>
                  <ul className="list-disc pl-5 text-sm text-yellow-800">
                    {exercise.precautions.map((precaution, index) => (
                      <li key={index}>{precaution}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'benefits' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Benefits:</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {exercise.benefits.map((benefit, index) => (
                    <li key={index} className="text-gray-700">{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {activeTab === 'modifications' && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Available Modifications:</h2>
                {exercise.modifications.map(modification => (
                  <div 
                    key={modification.id}
                    className="p-4 border border-gray-200 rounded-lg mb-3 hover:border-primary-300 cursor-pointer"
                    onClick={() => toggleModification(modification.id)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{modification.title}</h3>
                      <ChevronRight 
                        size={20} 
                        className={`text-primary-500 transition-transform ${
                          currentModification === modification.id ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                    <p className="text-sm text-gray-600">For: {modification.forCondition}</p>
                    
                    {currentModification === modification.id && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="mb-2 text-gray-700">{modification.description}</p>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                          {modification.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Playback controls */}
      <div className="bg-white border-t border-gray-200 p-4 flex justify-center">
        <Button
          variant="primary"
          size="lg"
          icon={isPlaying ? Pause : Play}
          onClick={handlePlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </div>
    </div>
  );
};

export default ExercisePlayer;