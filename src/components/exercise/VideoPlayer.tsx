import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Star, X, ChevronLeft, ChevronRight } from 'lucide-react';

// This component supports multiple video sources including YouTube
const VideoPlayer = ({ videoUrl, onEnded }) => {
  const [isYouTube, setIsYouTube] = useState(false);
  const [youtubeId, setYoutubeId] = useState('');
  
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
  
  if (isYouTube) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Exercise Video"
        onEnded={onEnded}
      ></iframe>
    );
  } else {
    // Standard HTML5 Video Player
    return (
      <video
        src={videoUrl}
        className="absolute top-0 left-0 w-full h-full"
        controls
        playsInline
        onEnded={onEnded}
      ></video>
    );
  }
};

// Exercise Player Component
const ExercisePlayer = ({ exercise, onExit, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(exercise ? exercise.duration * 60 : 0); // Convert to seconds
  const [rating, setRating] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [activeTab, setActiveTab] = useState('instructions');
  
  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
  };
  
  const handleRating = (value) => {
    setRating(value);
  };
  
  const handleFinish = () => {
    // Use the onComplete prop instead of directly accessing the context
    if (onComplete) {
      onComplete({
        exerciseId: exercise.id,
        rating: rating > 0 ? rating : 5 // Default to 5 if not rated
      });
    }
    
    if (onExit) onExit();
  };
  
  const toggleModification = () => {
    setShowModification(!showModification);
  };
  
  if (!exercise) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No exercise selected</p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Video section */}
      <div className="relative bg-black">
        <div className="relative pt-[56.25%]"> {/* 16:9 aspect ratio */}
          <VideoPlayer 
            videoUrl={exercise.videoUrl} 
            onEnded={handleVideoEnded} 
          />
        </div>
        
        {/* Completion overlay */}
        {isCompleted && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-center">Great Job!</h3>
              
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
              
              <button
                onClick={handleFinish}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Complete & Continue
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Exercise information section */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-1">{exercise.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {exercise.type}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              {exercise.focusArea}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
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
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'benefits' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeTab === 'modifications' 
                    ? 'text-blue-600 border-b-2 border-blue-600' 
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
                    className="p-4 border border-gray-200 rounded-lg mb-3 hover:border-blue-300 cursor-pointer"
                    onClick={toggleModification}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{modification.title}</h3>
                      <ChevronRight 
                        size={20} 
                        className={`text-blue-500 transition-transform ${
                          showModification ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                    <p className="text-sm text-gray-600">For: {modification.forCondition}</p>
                    
                    {showModification && (
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
    </div>
  );
};

export default ExercisePlayer;