// Navigation Types
export type AppRoute = 
  | 'home' 
  | 'today' 
  | 'programs' 
  | 'exercise' 
  | 'inspiration' 
  | 'music' 
  | 'settings'
  | 'onboarding';

// Program Types
export interface Program {
  id: string;
  title: string;
  description: string;
  category: 'chair-yoga' | 'tai-chi';
  level: 'Novice' | 'Active' | 'Advanced';
  month: number; // 1-12
  thumbnail: string;
  focusAreas: string[];
  totalDays: number;
  totalDuration: number; // in minutes
  recommendedFor: string[];
  days: ProgramDay[];
}

export interface ProgramDay {
  id: string;
  programId: string;
  dayNumber: number;
  title: string;
  description: string;
  duration: number; // in minutes
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'warmup' | 'core' | 'cooldown';
  focusArea: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  videoUrl: string;
  thumbnailUrl: string;
  instructions: string[];
  benefits: string[];
  modifications: Modification[];
  precautions: string[];
  repetitions: number;
  holdTime?: number; // in seconds
}

export interface Modification {
  id: string;
  title: string;
  description: string;
  forCondition: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  instructions: string[];
}

export interface ExerciseProgress {
  exerciseId: string;
  isCompleted: boolean;
  isModified: boolean;
  modificationId?: string;
  completedAt?: string; // ISO date string
  rating?: number; // 1-5
  notes?: string;
}

// User Types
export interface UserProfile {
  name: string;
  age: number;
  level: 'Novice' | 'Active' | 'Advanced';
  startDate: string; // ISO date string
  healthConditions: string[];
  goals: UserGoal[];
  preferences: UserPreferences;
}

export interface UserGoal {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  targetDate?: string; // ISO date string
}

export interface UserPreferences {
  reminderTime: string; // format: "HH:MM"
  reminderDays: string[]; // days of week: "Monday", "Tuesday", etc.
  prefersChairYoga: boolean;
  prefersTaiChi: boolean;
  musicVolume: number; // 0-1
  textSize: 'normal' | 'large' | 'extra-large';
  highContrast: boolean;
}

// Progress Types
export interface UserProgress {
  streakDays: number;
  longestStreak: number;
  totalSessionsCompleted: number;
  totalMinutesPracticed: number;
  lastSessionDate: string; // ISO date string
  completedExercises: CompletedExercise[];
  achievements: Achievement[];
  currentProgram: string; // program ID
  currentDay: number;
}

export interface CompletedExercise {
  id: string;
  exerciseId: string;
  programId: string;
  dayId: string;
  completedDate: string; // ISO date string
  duration: number; // in minutes
  rating: number; // 1-5
  notes?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedDate: string; // ISO date string
  category: 'Consistency' | 'Milestone' | 'Skill' | 'Special';
}

// Audio Types
export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
  artwork: string;
  duration: number;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  songs: Song[];
}

// Inspiration Types
export interface InspirationItem {
  id: string;
  type: 'image' | 'video' | 'quote';
  title: string;
  tags?: string[];
  
  // For images
  source?: string;
  description?: string;
  
  // For videos
  thumbnail?: string;
  videoUrl?: string;
  
  // For quotes
  quote?: string;
  author?: string;
  backgroundColor?: string;
}
