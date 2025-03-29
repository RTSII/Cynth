import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { format, isToday, differenceInDays, parseISO } from 'date-fns';
import { UserProgress, CompletedExercise, Achievement, ExerciseProgress } from '@/types';

// Default progress data
const defaultProgress: UserProgress = {
  streakDays: 0,
  longestStreak: 0,
  totalSessionsCompleted: 0,
  totalMinutesPracticed: 0,
  lastSessionDate: '',
  completedExercises: [],
  achievements: [],
  currentProgram: 'chair-yoga-novice-month-1',
  currentDay: 1,
};

type ProgressContextType = {
  progress: UserProgress | null;
  todayProgress: ExerciseProgress[];
  completedToday: boolean;
  updateStreak: () => Promise<void>;
  completeExercise: (exercise: CompletedExercise) => Promise<void>;
  updateExerciseProgress: (exerciseId: string, progress: Partial<ExerciseProgress>) => Promise<void>;
  addAchievement: (achievement: Achievement) => Promise<void>;
  updateCurrentProgram: (programId: string, day: number) => Promise<void>;
  resetProgress: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [todayProgress, setTodayProgress] = useState<ExerciseProgress[]>([]);
  const [completedToday, setCompletedToday] = useState(false);

  // Load progress data on mount
  useEffect(() => {
    const loadProgressData = async () => {
      try {
        const progressData = localStorage.getItem('@cynthai_user_progress');
        
        if (progressData) {
          const parsedProgress = JSON.parse(progressData) as UserProgress;
          setProgress(parsedProgress);
          
          // Check if completed today
          if (parsedProgress.lastSessionDate) {
            setCompletedToday(isToday(parseISO(parsedProgress.lastSessionDate)));
          }
        } else {
          // Create default progress
          await saveProgress(defaultProgress);
          setProgress(defaultProgress);
        }
      } catch (error) {
        console.error('Error loading progress data:', error);
      }
    };

    loadProgressData();
  }, []);

  // Load today's progress
  useEffect(() => {
    const loadTodayProgress = async () => {
      try {
        const todayProgressData = localStorage.getItem('@cynthai_today_progress');
        
        if (todayProgressData) {
          setTodayProgress(JSON.parse(todayProgressData));
        }
      } catch (error) {
        console.error('Error loading today progress:', error);
      }
    };

    loadTodayProgress();
  }, []);

  // Save progress to local storage
  const saveProgress = async (progressData: UserProgress) => {
    try {
      localStorage.setItem('@cynthai_user_progress', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  };

  // Save today's progress
  const saveTodayProgress = async (progressData: ExerciseProgress[]) => {
    try {
      localStorage.setItem('@cynthai_today_progress', JSON.stringify(progressData));
    } catch (error) {
      console.error('Error saving today progress:', error);
      throw error;
    }
  };

  // Update streak
  const updateStreak = async () => {
    if (!progress) return;

    try {
      const today = new Date().toISOString();
      let newStreakDays = progress.streakDays;
      
      if (progress.lastSessionDate) {
        const lastDate = parseISO(progress.lastSessionDate);
        const daysDiff = differenceInDays(new Date(), lastDate);
        
        if (daysDiff > 1) {
          // Streak broken
          newStreakDays = 1;
        } else if (daysDiff === 1) {
          // Streak continues
          newStreakDays += 1;
        }
      } else {
        // First session
        newStreakDays = 1;
      }
      
      const updatedProgress = {
        ...progress,
        streakDays: newStreakDays,
        longestStreak: Math.max(newStreakDays, progress.longestStreak),
        lastSessionDate: today,
      };
      
      await saveProgress(updatedProgress);
      setProgress(updatedProgress);
      setCompletedToday(true);
    } catch (error) {
      console.error('Error updating streak:', error);
      throw error;
    }
  };

  // Complete exercise
  const completeExercise = async (exercise: CompletedExercise) => {
    if (!progress) return;

    try {
      // Create updated lists
      const updatedCompletedExercises = [...progress.completedExercises, exercise];
      
      // Update progress
      const updatedProgress = {
        ...progress,
        totalSessionsCompleted: progress.totalSessionsCompleted + 1,
        totalMinutesPracticed: progress.totalMinutesPracticed + exercise.duration,
        completedExercises: updatedCompletedExercises,
        lastSessionDate: exercise.completedDate,
      };
      
      // Save updated progress
      await saveProgress(updatedProgress);
      setProgress(updatedProgress);
      
      // Update streak
      await updateStreak();
      
      // Update today progress
      const exerciseProgress: ExerciseProgress = {
        exerciseId: exercise.exerciseId,
        isCompleted: true,
        isModified: false,
        completedAt: exercise.completedDate,
        rating: exercise.rating,
        notes: exercise.notes,
      };
      
      const updatedTodayProgress = [...todayProgress];
      const existingIndex = updatedTodayProgress.findIndex(p => p.exerciseId === exercise.exerciseId);
      
      if (existingIndex >= 0) {
        updatedTodayProgress[existingIndex] = exerciseProgress;
      } else {
        updatedTodayProgress.push(exerciseProgress);
      }
      
      await saveTodayProgress(updatedTodayProgress);
      setTodayProgress(updatedTodayProgress);
    } catch (error) {
      console.error('Error completing exercise:', error);
      throw error;
    }
  };

  // Update exercise progress
  const updateExerciseProgress = async (exerciseId: string, progressUpdate: Partial<ExerciseProgress>) => {
    try {
      const updatedTodayProgress = [...todayProgress];
      const existingIndex = updatedTodayProgress.findIndex(p => p.exerciseId === exerciseId);
      
      if (existingIndex >= 0) {
        updatedTodayProgress[existingIndex] = {
          ...updatedTodayProgress[existingIndex],
          ...progressUpdate,
        };
      } else {
        updatedTodayProgress.push({
          exerciseId,
          isCompleted: false,
          isModified: false,
          ...progressUpdate,
        });
      }
      
      await saveTodayProgress(updatedTodayProgress);
      setTodayProgress(updatedTodayProgress);
    } catch (error) {
      console.error('Error updating exercise progress:', error);
      throw error;
    }
  };

  // Add achievement
  const addAchievement = async (achievement: Achievement) => {
    if (!progress) return;

    try {
      // Check if achievement already exists
      if (progress.achievements.some(a => a.id === achievement.id)) {
        return;
      }
      
      const updatedAchievements = [...progress.achievements, achievement];
      
      const updatedProgress = {
        ...progress,
        achievements: updatedAchievements,
      };
      
      await saveProgress(updatedProgress);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error adding achievement:', error);
      throw error;
    }
  };

  // Update current program
  const updateCurrentProgram = async (programId: string, day: number) => {
    if (!progress) return;

    try {
      const updatedProgress = {
        ...progress,
        currentProgram: programId,
        currentDay: day,
      };
      
      await saveProgress(updatedProgress);
      setProgress(updatedProgress);
    } catch (error) {
      console.error('Error updating current program:', error);
      throw error;
    }
  };

  // Reset progress
  const resetProgress = async () => {
    try {
      localStorage.removeItem('@cynthai_user_progress');
      localStorage.removeItem('@cynthai_today_progress');
      setProgress(defaultProgress);
      setTodayProgress([]);
      setCompletedToday(false);
    } catch (error) {
      console.error('Error resetting progress:', error);
      throw error;
    }
  };

  const value: ProgressContextType = {
    progress,
    todayProgress,
    completedToday,
    updateStreak,
    completeExercise,
    updateExerciseProgress,
    addAchievement,
    updateCurrentProgram,
    resetProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
