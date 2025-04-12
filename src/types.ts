/**
 * Core types for the CynthAI application
 */

// Enums
export enum DifficultyLevel {
  Novice = 'Novice',
  Active = 'Active',
  Advanced = 'Advanced'
}

export enum ProgramType {
  ChairYoga = 'chair-yoga',
  TaiChi = 'tai-chi'
}

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

// Feedback cues for exercises
export interface FeedbackCues {
  start?: string;
  during?: string[];
  end?: string;
}

// Modification for exercises
export interface Modification {
  id: string;
  title: string;
  description: string;
  forCondition: string;
  instructions: string[];
}

// Exercise definition
export interface Exercise {
  id: string;
  title: string;
  type: string;
  focusArea: string;
  difficulty: string;
  duration: number; // in minutes
  description: string;
  videoUrl?: string;
  instructions: string[];
  precautions: string[];
  benefits: string[];
  modifications?: Modification[];
  feedbackCues?: FeedbackCues;
}

// Day in a program
export interface ProgramDay {
  id: string;
  title: string;
  exercises: Exercise[];
}

// Feedback type
export type FeedbackType = 'start' | 'progress' | 'complete' | 'warning';

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
  isCompleted: boolean;
  isModified: boolean;
  completedAt?: string;
  rating?: number;
  notes?: string;
}

export interface CompletedExercise {
  id: string;
  exerciseId: string;
  programId: string;
  dayId: string;
  completedDate: string;
  duration: number;
  rating: number;
  notes?: string;
}

// User progress tracking
export interface UserProgress {
  streakDays: number;
  longestStreak: number;
  totalSessionsCompleted: number;
  totalMinutesPracticed: number;
  lastSessionDate: string;
  completedExercises: CompletedExercise[];
  achievements: Achievement[];
  currentProgram: string;
  currentDay: number;
}

// Achievement definition
export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  type: 'streak' | 'completion' | 'milestone';
  iconUrl: string;
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

// Error types
export class BaseError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ExerciseError extends BaseError {
  constructor(message: string, code: 'EXERCISE_NOT_FOUND' | 'INVALID_EXERCISE' | 'PROGRESS_SAVE_FAILED') {
    super(message, code);
  }
}

export class NetworkError extends BaseError {
  constructor(message: string) {
    super(message, 'NETWORK_ERROR');
  }
}

export class AudioError extends BaseError {
  constructor(message: string, code: 'AUDIO_LOAD_FAILED' | 'AUDIO_PLAY_FAILED' | 'AUDIO_UNSUPPORTED') {
    super(message, code);
  }
}

export class VideoError extends BaseError {
  constructor(message: string, code: 'VIDEO_LOAD_FAILED' | 'VIDEO_PLAY_FAILED' | 'VIDEO_UNSUPPORTED') {
    super(message, code);
  }
}
