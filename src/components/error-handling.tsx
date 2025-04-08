export class ExerciseError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'ExerciseError';
    }
}

export const handleExerciseError = (error: unknown) => {
    if (error instanceof ExerciseError) {
        // Handle known exercise errors
        console.error(`Exercise Error ${error.code}: ${error.message}`);
    } else {
        // Handle unknown errors
        console.error('Unknown error:', error);
    }
};