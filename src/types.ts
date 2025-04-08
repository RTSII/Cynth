/**
 * Core types for the CynthAI application
 */

// Program difficulty levels
export type DifficultyLevel = 'Novice' | 'Active' | 'Advanced';

// Program types
export type ProgramType = 'ChairYoga' | 'TaiChi';

// User interface preferences
export interface UIPreferences {
  textSize: 'normal' | 'large' | 'extraLarge';
  highContrast: boolean;
  reducedMotion: boolean;
  audioFeedback: boolean;
}

// User health profile
export interface HealthProfile {
  ageRange: '65-70' | '71-75' | '76-80' | '81-85' | '86+';
  mobilityLevel: 'High' | 'Moderate' | 'Limited' | 'Seated';
  healthConditions: string[];
  focusAreas: string[];
}

// User profile
export interface UserProfile {
  id: string;
  name: string;
  createdAt: string;
  preferences: UIPreferences;
  healthProfile: HealthProfile;
  selectedPrograms: {
    chairYoga: string | null;
    taiChi: string | null;
  };
}

// Exercise definition
export interface Exercise {
  id: string;
  title: string;
  description: string;
  durationSeconds: number;
  videoUrl: string;
  thumbnailUrl: string;
  difficultyLevel: DifficultyLevel;
  targetAreas: string[];
  modifications: {
    easier: string | null;
    harder: string | null;
  };
  instructions: string[];
  precautions: string[];
  benefitDescription: string;
}

// Day in a program
export interface ProgramDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  exercises: Exercise[];
  totalDurationMinutes: number;
  focusArea: string;
}

// Program definition
export interface Program {
  id: string;
  title: string;
  description: string;
  type: ProgramType;
  difficultyLevel: DifficultyLevel;
  durationDays: number;
  thumbnailUrl: string;
  days: ProgramDay[];
  prerequisites: string[];
  goals: string[];
}

// User progress for an exercise
export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
  completedAt: string | null;
  durationSeconds: number;
  rating: number | null;
  notes: string | null;
}

// User progress for a day
export interface DayProgress {
  dayId: string;
  programId: string;
  completed: boolean;
  completedAt: string | null;
  exercises: ExerciseProgress[];
}

// User progress tracking
export interface UserProgress {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalPracticeMinutes: number;
  totalSessionsCompleted: number;
  dayProgress: Record<string, DayProgress>;
  achievements: Achievement[];
}

// Achievement definition
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: string | null;
  type: 'streak' | 'milestone' | 'completion' | 'special';
  requirement: {
    type: 'sessions' | 'streak' | 'minutes' | 'program';
    value: number;
    programId?: string;
  };
}

// Inspiration item
export interface InspirationItem {
  id: string;
  title: string;
  type: 'image' | 'quote' | 'video' | 'article';
  content: string;
  thumbnailUrl?: string;
  tags: string[];
  isFavorite: boolean;
}

// Music playlist
export interface MusicPlaylist {
  id: string;
  title: string;
  description: string;
  coverImageUrl: string;
  tracks: MusicTrack[];
}

// Music track
export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  durationSeconds: number;
  audioUrl: string;
}

// App notification
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'achievement' | 'tip' | 'system';
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

// User settings
export interface Settings {
  userId: string;
  practiceReminders: {
    enabled: boolean;
    time: string; // Format: "HH:MM"
    days: number[]; // 0-6, where 0 is Sunday
  };
  notifications: {
    achievements: boolean;
    tips: boolean;
    reminders: boolean;
  };
  offlineAccess: {
    downloadedPrograms: string[];
    autoDownloadNext: boolean;
  };
  privacySettings: {
    shareProgress: boolean;
    collectAnalytics: boolean;
  };
}

// API response format
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      perPage: number;
      total: number;
      totalPages: number;
    }
  };
}

// Video player state
export interface VideoPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  isFullscreen: boolean;
  buffering: boolean;
  error: string | null;
}

// Router location state
export interface LocationState {
  from?: string;
  programId?: string;
  dayId?: string;
  exerciseId?: string;
}
