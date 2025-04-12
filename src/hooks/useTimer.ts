import { useState, useEffect, useCallback, useRef } from 'react';
import { useAnnouncer } from '../components/accessibility';
import { logEvent, AnalyticsEvent } from '../utils/analytics';

interface TimerOptions {
    duration: number;
    onComplete?: () => void;
    announceIntervals?: number[];
    autoStart?: boolean;
    countDown?: boolean;
}

interface TimerState {
    isRunning: boolean;
    time: number;
    progress: number;
}

export function useTimer({
    duration,
    onComplete,
    announceIntervals = [25, 50, 75, 100],
    autoStart = false,
    countDown = false
}: TimerOptions) {
    const [state, setState] = useState<TimerState>({
        isRunning: autoStart,
        time: countDown ? duration : 0,
        progress: 0
    });

    const timerRef = useRef<number>();
    const { announce } = useAnnouncer();
    const lastAnnouncedProgressRef = useRef<number>(-1);

    // Calculate and announce progress
    const updateProgress = useCallback((currentTime: number) => {
        const newProgress = countDown
            ? ((duration - currentTime) / duration) * 100
            : (currentTime / duration) * 100;

        // Find the next announcement threshold we've crossed
        const crossedThreshold = announceIntervals.find(threshold => {
            const hasNotAnnounced = lastAnnouncedProgressRef.current < threshold;
            const hasReachedThreshold = newProgress >= threshold;
            return hasNotAnnounced && hasReachedThreshold;
        });

        if (crossedThreshold) {
            announce(`${crossedThreshold}% complete`);
            lastAnnouncedProgressRef.current = crossedThreshold;

            // Log progress milestone
            logEvent(AnalyticsEvent.PAGE_VIEW, {
                action: 'exercise_progress',
                progress: crossedThreshold
            });
        }

        return newProgress;
    }, [duration, countDown, announceIntervals, announce]);

    // Start timer
    const start = useCallback(() => {
        if (!state.isRunning) {
            setState(prev => ({ ...prev, isRunning: true }));
            announce('Exercise started');
        }
    }, [state.isRunning, announce]);

    // Pause timer
    const pause = useCallback(() => {
        if (state.isRunning) {
            setState(prev => ({ ...prev, isRunning: false }));
            announce('Exercise paused');
        }
    }, [state.isRunning, announce]);

    // Reset timer
    const reset = useCallback(() => {
        setState({
            isRunning: false,
            time: countDown ? duration : 0,
            progress: 0
        });
        lastAnnouncedProgressRef.current = -1;
        announce('Timer reset');
    }, [duration, countDown, announce]);

    // Handle timer completion
    const handleComplete = useCallback(() => {
        setState(prev => ({ ...prev, isRunning: false }));
        announce('Exercise complete');
        onComplete?.();

        // Log completion
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'exercise_complete',
            duration
        });
    }, [duration, onComplete, announce]);

    // Timer logic
    useEffect(() => {
        if (state.isRunning) {
            timerRef.current = window.setInterval(() => {
                setState(prev => {
                    const newTime = countDown ? prev.time - 1 : prev.time + 1;
                    const newProgress = updateProgress(newTime);

                    // Check for completion
                    if ((countDown && newTime <= 0) || (!countDown && newTime >= duration)) {
                        clearInterval(timerRef.current);
                        handleComplete();
                        return {
                            isRunning: false,
                            time: countDown ? 0 : duration,
                            progress: 100
                        };
                    }

                    return {
                        ...prev,
                        time: newTime,
                        progress: newProgress
                    };
                });
            }, 1000);

            return () => {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
            };
        }
    }, [state.isRunning, duration, countDown, updateProgress, handleComplete]);

    // Format time for display
    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

    return {
        isRunning: state.isRunning,
        time: state.time,
        progress: state.progress,
        formattedTime: formatTime(state.time),
        start,
        pause,
        reset,
        toggle: state.isRunning ? pause : start
    };
}