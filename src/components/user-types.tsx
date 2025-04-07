export interface UserProfile {
  name: string;
  age: number;
  level: 'Novice' | 'Active' | 'Advanced';
  startDate: string; // ISO date string
  healthConditions: HealthCondition[];
  goals: UserGoal[];
  preferences: UserPreferences;
}

export interface HealthCondition {
  id: string;
  name: string;
  description: string;
  recommendations: string[];
  modifications: string[];
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
