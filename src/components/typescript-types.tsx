export enum ExerciseType {
    YOGA = 'yoga',
    TAICHI = 'taichi',
    STRETCHING = 'stretching'
}

export enum Difficulty {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced'
}

export interface VideoAsset {
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    quality: string;
}

export interface Exercise {
    id: string;
    type: ExerciseType;
    difficulty: Difficulty;
    videoAsset: VideoAsset;
    holdTime: number;
    repetitions: number;
}