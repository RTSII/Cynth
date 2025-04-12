import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Star, ChevronRight } from 'lucide-react';
import { useVideoPlayer } from '../../hooks/useVideoPlayer';
import { LoadingSpinner } from '../language-loading';
import { createAccessibleButtonProps } from '../accessibility';
import { Exercise } from '../../types';

// VideoPlayer Component Props
interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
}

// Exercise Player Props
interface ExercisePlayerProps {
  exercise: Exercise;
  onExit: () => void;
  onComplete: (data: { exerciseId: string; rating: number }) => void;
}

interface Modification {
  id: string;
  title: string;
  forCondition: string;
  description: string;
  instructions: string[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, title, onComplete }) => {
  const {
    videoRef,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    playbackRate,
    isFullscreen,
    buffering,
    error,
    handlePlay,
    handlePause,
    handleTimeUpdate,
    handleVolumeChange,
    handleToggleMute,
    handlePlaybackRateChange,
    handleToggleFullscreen,
  } = useVideoPlayer(videoUrl);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div role="alert" className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-700">{error}</p>
        <button
          {...createAccessibleButtonProps({
            onClick: () => window.location.reload(),
            label: 'Reload video',
          })}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative group" role="region" aria-label={`Video player: ${title}`}>
      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <LoadingSpinner size="large" message="Loading video..." />
        </div>
      )}

      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full rounded-lg"
        poster={`${videoUrl}/poster.jpg`}
        preload="metadata"
        playsInline
        onEnded={onComplete}
      >
        <track
          kind="captions"
          src={`${videoUrl}/captions.vtt`}
          srcLang="en"
          label="English"
        />
        Your browser does not support the video tag.
      </video>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Progress bar */}
        <div className="mb-4">
          <input
            type="range"
            value={currentTime}
            min={0}
            max={duration}
            step={0.1}
            onChange={(e) => handleTimeUpdate(parseFloat(e.target.value))}
            className="w-full"
            aria-label="Video progress"
            aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
          />
          <div className="flex justify-between text-white text-sm mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button
            {...createAccessibleButtonProps({
              onClick: isPlaying ? handlePause : handlePlay,
              label: isPlaying ? 'Pause' : 'Play',
              description: isPlaying ? 'Pause video' : 'Play video',
            })}
            className="p-2 rounded-full hover:bg-white/20"
          >
            {isPlaying ? <Pause className="text-white" /> : <Play className="text-white" />}
          </button>

          <div className="flex items-center space-x-2">
            <button
              {...createAccessibleButtonProps({
                onClick: handleToggleMute,
                label: isMuted ? 'Unmute' : 'Mute',
              })}
              className="p-2 rounded-full hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="text-white" /> : <Volume2 className="text-white" />}
            </button>
            <input
              type="range"
              value={volume}
              min={0}
              max={1}
              step={0.1}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-24"
              aria-label="Volume"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              {...createAccessibleButtonProps({
                onClick: () => handlePlaybackRateChange(Math.max(playbackRate - 0.25, 0.5)),
                label: 'Decrease speed',
              })}
              className="p-2 rounded-full hover:bg-white/20"
            >
              <RotateCcw className="text-white" size={16} />
            </button>
            <span className="text-white">{playbackRate}x</span>
            <button
              {...createAccessibleButtonProps({
                onClick: () => handlePlaybackRateChange(Math.min(playbackRate + 0.25, 2)),
                label: 'Increase speed',
              })}
              className="p-2 rounded-full hover:bg-white/20"
            >
              <RotateCw className="text-white" size={16} />
            </button>
          </div>

          <button
            {...createAccessibleButtonProps({
              onClick: handleToggleFullscreen,
              label: isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen',
            })}
            className="p-2 rounded-full hover:bg-white/20 ml-auto"
          >
            <Maximize className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise, onExit, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(exercise ? exercise.duration * 60 : 0); // Convert to seconds
  const [rating, setRating] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showModification, setShowModification] = useState(false);
  const [activeTab, setActiveTab] = useState<'instructions' | 'benefits' | 'modifications'>('instructions');

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setIsCompleted(true);
  };

  const handleRating = (value: number) => {
    setRating(value);
  };

  const handleFinish = () => {
    onComplete({
      exerciseId: exercise.id,
      rating: rating > 0 ? rating : 5 // Default to 5 if not rated
    });

    onExit();
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
            title={exercise.title}
            onComplete={handleVideoEnded}
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
                      className={`${value <= rating
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
                className={`px-4 py-2 font-medium ${activeTab === 'instructions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'benefits'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('benefits')}
              >
                Benefits
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'modifications'
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
                        className={`text-blue-500 transition-transform ${showModification ? 'rotate-90' : ''
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