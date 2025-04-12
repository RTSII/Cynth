import { UserProfile, Exercise } from '../types';

// Analytics Events
export enum AnalyticsEvent {
    PAGE_VIEW = 'page_view',
    EXERCISE_START = 'exercise_start',
    EXERCISE_COMPLETE = 'exercise_complete',
    EXERCISE_PAUSE = 'exercise_pause',
    PROGRAM_START = 'program_start',
    ERROR = 'error',
    ACHIEVEMENT_UNLOCK = 'achievement_unlock',
    SETTING_CHANGE = 'setting_change',
}

interface AnalyticsPayload {
    eventName: AnalyticsEvent;
    timestamp: number;
    userId?: string;
    data?: Record<string, any>;
}

// Queue for offline analytics
let analyticsQueue: AnalyticsPayload[] = [];
const QUEUE_KEY = '@cynthai_analytics_queue';

// Load queued events from storage
const loadQueue = () => {
    try {
        const stored = localStorage.getItem(QUEUE_KEY);
        if (stored) {
            analyticsQueue = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading analytics queue:', error);
    }
};

// Save queue to storage
const saveQueue = () => {
    try {
        localStorage.setItem(QUEUE_KEY, JSON.stringify(analyticsQueue));
    } catch (error) {
        console.error('Error saving analytics queue:', error);
    }
};

// Initialize queue on load
loadQueue();

export const logEvent = async (
    eventName: AnalyticsEvent,
    data?: Record<string, any>,
    userId?: string
) => {
    const payload: AnalyticsPayload = {
        eventName,
        timestamp: Date.now(),
        userId,
        data,
    };

    try {
        if (navigator.onLine) {
            // Process any queued events first
            if (analyticsQueue.length > 0) {
                await processQueue();
            }

            // Send current event
            await sendAnalytics(payload);
        } else {
            // Queue event for later if offline
            analyticsQueue.push(payload);
            saveQueue();
        }
    } catch (error) {
        // Queue event if sending fails
        analyticsQueue.push(payload);
        saveQueue();
        console.error('Error sending analytics:', error);
    }
};

const sendAnalytics = async (payload: AnalyticsPayload) => {
    try {
        // In development, just log to console
        if (import.meta.env.DEV) {
            console.log('Analytics:', payload);
            return;
        }

        // In production, send to analytics service
        // Replace with your actual analytics endpoint
        const response = await fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Analytics request failed');
        }
    } catch (error) {
        throw error;
    }
};

const processQueue = async () => {
    if (analyticsQueue.length === 0) return;

    const events = [...analyticsQueue];
    analyticsQueue = [];
    saveQueue();

    try {
        // Send events in batches of 10
        const batchSize = 10;
        for (let i = 0; i < events.length; i += batchSize) {
            const batch = events.slice(i, i + batchSize);
            await Promise.all(batch.map(sendAnalytics));
        }
    } catch (error) {
        // If processing fails, add events back to queue
        analyticsQueue.push(...events);
        saveQueue();
        throw error;
    }
};

// Listen for online status to process queue
if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
        processQueue().catch(console.error);
    });
}

// Helper functions for common events
export const logExerciseStart = (exercise: Exercise, userId?: string) => {
    logEvent(AnalyticsEvent.EXERCISE_START, {
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        difficulty: exercise.difficultyLevel,
    }, userId);
};

export const logExerciseComplete = (
    exercise: Exercise,
    duration: number,
    rating: number,
    userId?: string
) => {
    logEvent(AnalyticsEvent.EXERCISE_COMPLETE, {
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        duration,
        rating,
    }, userId);
};

export const logError = (
    error: Error,
    context: Record<string, any> = {},
    userId?: string
) => {
    logEvent(AnalyticsEvent.ERROR, {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
        ...context,
    }, userId);
};

// Report error to error monitoring service
export const reportError = async (
    error: Error,
    context: Record<string, any> = {},
    userId?: string
) => {
    // Log error for analytics
    logError(error, context, userId);

    // In development, just log to console
    if (import.meta.env.DEV) {
        console.error('Error:', error, context);
        return;
    }

    try {
        // Replace with your error reporting service endpoint
        await fetch('/api/error-reporting', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
                context,
                userId,
                timestamp: Date.now(),
            }),
        });
    } catch (reportingError) {
        console.error('Error reporting failed:', reportingError);
    }
};