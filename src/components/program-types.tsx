export interface Program {
  id: string;
  title: string;
  description: string;
  category: 'chair-yoga' | 'tai-chi';
  level: 'Novice' | 'Active' | 'Advanced';
  month: number; // 1-12
  thumbnail: any;
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
  videoUrl?: any;
  thumbnailUrl?: any;
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
  videoUrl?: any;
  thumbnailUrl?: any;
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
