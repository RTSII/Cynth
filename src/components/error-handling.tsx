import { ExerciseError, NetworkError, AudioError, VideoError } from '../types';

export const handleExerciseError = (error: unknown) => {
    if (error instanceof ExerciseError) {
        switch (error.code) {
            case 'EXERCISE_NOT_FOUND':
            case 'INVALID_EXERCISE':
                console.error(`Exercise Error ${error.code}: ${error.message}`);
                return { message: 'This exercise is not available. Please try another one.' };
            case 'PROGRESS_SAVE_FAILED':
                console.error(`Exercise Error ${error.code}: ${error.message}`);
                return { message: 'Unable to save your progress. Please check your connection.' };
            default:
                console.error('Unknown exercise error:', error);
                return { message: 'Something went wrong. Please try again.' };
        }
    } else if (error instanceof NetworkError) {
        console.error('Network Error:', error);
        return { message: 'Network connection issue. Please check your internet connection.' };
    } else if (error instanceof AudioError) {
        console.error('Audio Error:', error);
        return { message: 'Unable to play audio. Please check your device settings.' };
    } else if (error instanceof VideoError) {
        console.error('Video Error:', error);
        return { message: 'Unable to play video. Please check your device settings.' };
    } else {
        console.error('Unknown error:', error);
        return { message: 'An unexpected error occurred. Please try again.' };
    }
};

export const createErrorBoundaryFallback = (message: string = 'Something went wrong') => {
    return (
        <div className="min-h-[200px] flex items-center justify-center p-6" role="alert">
            <div className="text-center">
                <div className="w-12 h-12 text-warning-500 mx-auto mb-4" aria-hidden="true">⚠️</div>
                <h2 className="text-xl font-semibold mb-2">{message}</h2>
                <p className="text-gray-600">Please try refreshing the page.</p>
            </div>
        </div>
    );
};