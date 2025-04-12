import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Award, Heart, ChevronRight, Play, Activity } from 'lucide-react';
import { format } from 'date-fns';

// Contexts
import { useUser } from '@/contexts/UserContext';
import { useProgress, Progress } from '@/contexts/ProgressContext';
import { useAudio } from '@/contexts/AudioContext';

// Components
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CircularProgress from '@/components/ui/CircularProgress';

// Data and types
import { Program } from '@/types';
import { DataItem, fetchData } from '@/services/dataService';
import { getProgramData } from '@/data/programs';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const { progress, completedToday } = useProgress();
  const { currentSong, playPause, isPlaying } = useAudio();

  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);
  const [todaySession, setTodaySession] = useState<ProgramDay | null>(null);
  const [showAllAchievements, setShowAllAchievements] = useState(false);
  const [greeting, setGreeting] = useState<string>('');
  const [data, setData] = useState<DataItem[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate progress percentage
  const progressPercentage = progress
    ? Math.round((progress.currentDay / (currentProgram?.totalDays || 100)) * 100)
    : 0;

  // Load current program and today's session
  useEffect(() => {
    if (progress?.currentProgram) {
      const program = getProgramData(progress.currentProgram);
      setCurrentProgram(program);

      if (program) {
        const day = program.days.find(d => d.dayNumber === progress.currentDay);
        if (day) {
          setTodaySession(day);
        }
      }
    }
  }, [progress]);

  // Set greeting based on time of day
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();

    if (hour < 12) {
      setGreeting('Good Morning');
    } else if (hour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleStartSession = () => {
    try {
      if (todaySession) {
        navigate(`/exercise/${todaySession.programId}/${todaySession.id}/${todaySession.exercises[0].id}`);
      } else {
        navigate('/programs');
      }
    } catch (error) {
      console.error('Error starting session:', error);
      // Handle error appropriately
    }
  };

  // Sample achievements data (would come from context in a real implementation)
  const achievements = [
    { id: 1, title: "First Week Complete", earned: true },
    { id: 2, title: "10-Day Streak", earned: true },
    { id: 3, title: "Core Master", earned: false }
  ];

  // Sample upcoming exercises (would come from todaySession in real implementation)
  const upcomingExercises = useMemo(() =>
    todaySession?.exercises.slice(0, 3).map(exercise => ({
      id: exercise.id,
      name: exercise.title,
      duration: exercise.duration,
      type: currentProgram?.category === 'chair-yoga' ? 'yoga' : 'tai-chi'
    })) || [],
    [todaySession, currentProgram?.category]
  );

  return (
    <div className= "max-w-6xl mx-auto" >
  <h1 className="text-2xl font-bold mb-6" >
    { greeting }, { user?.username || 'Cynthia'}!
      </h1>

      {/* Display data or messages based on loading/error state */}
      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : data ? (
        <ul>
          {data.map(item => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : null}

      {/* Today's practice card */}
      <Card variant="highlight" className="border-primary-100">
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center mb-2">
                <Calendar size={20} className="text-primary-500 mr-2" />
                <h2 className="text-lg font-medium">Today's Practice</h2>
              </div>

              {todaySession ? (
                <>
                  <h3 className="text-xl font-bold mb-2">{todaySession.title}</h3>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="badge bg-blue-50 text-blue-700">
                      <Clock size={16} className="mr-1" /> {todaySession.duration} min
                    </span>
                    <span className="badge bg-purple-50 text-purple-700">
                      {currentProgram?.category === 'chair-yoga' ? 'Chair Yoga' : 'Tai Chi'}
                    </span>
                    {completedToday && (
                      <span className="badge bg-green-50 text-green-700">
                        Completed Today
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-2">No Program Selected</h3>
                  <p className="text-gray-600 mb-2">
                    Choose a program to start your practice journey
                  </p>
                </>
              )}
            </div>

            <div className="w-full md:w-auto">
              <Button
                variant="primary"
                size="lg"
                icon={Play}
                disabled={completedToday}
                onClick={handleStartSession}
              >
                {completedToday
                  ? "Completed Today"
                  : todaySession
                    ? "Start Practice"
                    : "Find Program"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Section */}
      <h2 className="text-xl font-bold mb-4 mt-8">Your Progress</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card padding="md" className="text-center">
          <CardContent>
            <CircularProgress
              value={progressPercentage}
              size={100}
              strokeWidth={10}
              className="mb-2"
              progressColor="var(--color-primary-500)"
              backgroundColor="#E0E0E0"
            />
            <p className="font-medium mt-2">Program Complete</p>
            <p className="text-gray-600 text-sm">
              {progress?.currentDay || 0} of {currentProgram?.totalDays || 0} days
            </p>
          </CardContent>
        </Card>

        <Card padding="md" className="text-center">
          <CardContent>
            <div className="flex justify-center mb-2">
              <Heart size={60} className="text-red-500" />
            </div>
            <p className="text-2xl font-bold">{progress?.streakDays || 0}</p>
            <p className="font-medium">Day Streak</p>
            <p className="text-gray-600 text-sm">Keep it going!</p>
          </CardContent>
        </Card>

        <Card padding="md" className="col-span-1 md:col-span-2">
          <CardContent>
            <h3 className="font-bold mb-3">Coming Up Next</h3>
            {upcomingExercises.length > 0 ? (
              <div>
                {upcomingExercises.map((exercise, index) => (
                  <div key={exercise.id} className="mb-2">
                    <div className="flex justify-between items-center py-2">
                      <div className="flex items-center">
                        <span className="font-medium">{exercise.name}</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs ${exercise.type === 'yoga' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                            }`}
                        >
                          {exercise.type}
                        </span>
                      </div>
                      <span className="text-gray-600 text-sm">{exercise.duration} min</span>
                    </div>
                    {index < upcomingExercises.length - 1 && (
                      <div className="border-b border-gray-200"> </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Select a program to see upcoming exercises
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Achievements</h2>
          <button
            className="text-primary-600 flex items-center"
            onClick={() => setShowAllAchievements(!showAllAchievements)}
          >
            {showAllAchievements ? 'Show Less' : 'View All'}
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {achievements
            .slice(0, showAllAchievements ? achievements.length : 2)
            .map(achievement => (
              <Card
                key={achievement.id}
                className={`text-center ${achievement.earned ? 'border-2 border-yellow-300' : 'opacity-70'
                  }`}
              >
                <CardContent>
                  <div className="p-2 mb-2 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-yellow-50">
                    {achievement.earned ? (
                      <Award size={32} className="text-yellow-500" />
                    ) : (
                      <span role="img" aria-label="locked" className="text-3xl">🔒</span>
                    )}
                  </div>
                  <h3 className="font-bold">{achievement.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {achievement.earned ? 'Completed' : 'Keep practicing!'}
                  </p>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Level Information */}
      <Card className="bg-blue-50 border-none mb-6">
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <p className="text-gray-600 text-sm">Current Level</p>
              <h3 className="font-bold">Novice</h3>
              <p className="mt-1 text-sm">
                You're making great progress! Keep up the good work.
              </p>
            </div>
            <div className="mt-3 md:mt-0">
              <Button variant="outline" onClick={() => navigate('/programs')}>
                View Path
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Now Playing Mini Player */}
      {currentSong && (
        <Card className="fixed bottom-16 left-4 right-4 max-w-lg mx-auto z-20 p-3 shadow-lg">
          <div className="flex items-center">
            <img
              src={currentSong.artwork}
              alt={currentSong.title}
              className="w-10 h-10 rounded"
            />

            <div className="flex-1 mx-3 truncate">
              <p className="font-medium text-sm">{currentSong.title}</p>
              <p className="text-xs text-gray-500">{currentSong.artist}</p>
            </div>

            <button
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={playPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <span className="block w-4 h-4 border-l-2 border-r-2 border-primary-600"> </span>
              ) : (
                <Play size={16} className="text-primary-600" />
              )}
            </button>
          </div>
        </Card>
      )}
      <Button
        variant="secondary"
        size="sm"
        onClick={async () => {
          await logout();
          navigate('/login');
        }}
        className="mt-4"
      >
        Logout
      </Button>
    </div>
  );
};

export default Dashboard;

interface Progress {
  currentProgram?: string;
  currentDay: number;
  streakDays: number;
}

interface ProgressContextType {
  progress: Progress | null;
  completedToday: boolean;
  updateProgress: (newProgress: Progress) => void;
  setCompletedToday: (completed: boolean) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [completedToday, setCompletedToday] = useState(false);

  const updateProgress = (newProgress: Progress) => {
    setProgress(newProgress);
  };

  return (
    <ProgressContext.Provider value= {{ progress, completedToday, updateProgress, setCompletedToday }
}>
  { children }
  </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}

interface Exercise {
  id: string;
  title: string;
  duration: number;
}

interface ProgramDay {
  id: string;
  programId: string;
  dayNumber: number;
  title: string;
  duration: number;
  exercises: Exercise[];
}