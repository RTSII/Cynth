import { logEvent, AnalyticsEvent } from './analytics';

// Types for different feedback patterns
export type HapticPattern = 'success' | 'error' | 'warning' | 'progress' | 'complete';
export type AudioPattern = 'start' | 'stop' | 'complete' | 'milestone' | 'error';

interface FeedbackOptions {
    haptic?: boolean;
    audio?: boolean;
    volume?: number;
}

// Audio context and sounds cache
let audioContext: AudioContext | null = null;
const audioCache = new Map<AudioPattern, AudioBuffer>();

// Initialize audio context
async function initializeAudioContext() {
    if (!audioContext) {
        audioContext = new AudioContext();
        await loadAudioFiles();
    }
    return audioContext;
}

// Load audio files
async function loadAudioFiles() {
    try {
        const audioFiles: Record<AudioPattern, string> = {
            start: '/assets/audio/start.mp3',
            stop: '/assets/audio/stop.mp3',
            complete: '/assets/audio/complete.mp3',
            milestone: '/assets/audio/milestone.mp3',
            error: '/assets/audio/error.mp3'
        };

        const loadPromises = Object.entries(audioFiles).map(async ([pattern, path]) => {
            const response = await fetch(path);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await audioContext!.decodeAudioData(arrayBuffer);
            audioCache.set(pattern as AudioPattern, audioBuffer);
        });

        await Promise.all(loadPromises);
    } catch (error) {
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'audio_load_error',
            error: (error as Error).message
        });
    }
}

// Play audio feedback
async function playAudioFeedback(pattern: AudioPattern, volume: number = 1) {
    try {
        const context = await initializeAudioContext();
        const buffer = audioCache.get(pattern);

        if (!buffer) {
            console.warn(`Audio pattern ${pattern} not found`);
            return;
        }

        const source = context.createBufferSource();
        const gainNode = context.createGain();

        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.value = volume;

        source.start(0);

        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'audio_feedback_played',
            pattern
        });
    } catch (error) {
        console.error('Error playing audio feedback:', error);
    }
}

// Trigger haptic feedback
function triggerHaptic(pattern: HapticPattern) {
    if (!navigator.vibrate) {
        return false;
    }

    const patterns: Record<HapticPattern, number[]> = {
        success: [100],
        error: [100, 100, 100],
        warning: [200, 100, 200],
        progress: [50],
        complete: [300]
    };

    try {
        navigator.vibrate(patterns[pattern]);
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'haptic_feedback_triggered',
            pattern
        });
        return true;
    } catch (error) {
        console.error('Error triggering haptic feedback:', error);
        return false;
    }
}

// Main feedback function
export async function provideFeedback(
    type: HapticPattern | AudioPattern,
    options: FeedbackOptions = {}
) {
    const { haptic = true, audio = true, volume = 1 } = options;

    const promises: Promise<any>[] = [];

    if (haptic && type in HapticPattern) {
        promises.push(Promise.resolve(triggerHaptic(type as HapticPattern)));
    }

    if (audio && type in AudioPattern) {
        promises.push(playAudioFeedback(type as AudioPattern, volume));
    }

    await Promise.all(promises);
}

// Feedback presets for common interactions
export const feedbackPresets = {
    exerciseStart: () => provideFeedback('start', { haptic: true, audio: true }),
    exercisePause: () => provideFeedback('stop', { haptic: true, audio: true }),
    exerciseComplete: () => provideFeedback('complete', { haptic: true, audio: true }),
    milestone: () => provideFeedback('milestone', { haptic: true, audio: true }),
    error: () => provideFeedback('error', { haptic: true, audio: true }),
    success: () => provideFeedback('success', { haptic: true, audio: true }),
    warning: () => provideFeedback('warning', { haptic: true, audio: true }),
    progress: () => provideFeedback('progress', { haptic: true, audio: false })
};

// Initialize feedback system
export async function initializeFeedback(): Promise<boolean> {
    try {
        await initializeAudioContext();
        return true;
    } catch (error) {
        console.error('Error initializing feedback system:', error);
        return false;
    }
}