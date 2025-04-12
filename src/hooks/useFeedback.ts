import { useAudioContext } from '../contexts/AudioContext';

type FeedbackType = 'start' | 'progress' | 'complete' | 'warning';

export const useFeedback = () => {
    const { playSound } = useAudioContext();

    const provideFeedback = (type: FeedbackType, audioMessage?: string) => {
        // Provide haptic feedback if available
        if (navigator.vibrate) {
            switch (type) {
                case 'start':
                    navigator.vibrate(200);
                    break;
                case 'progress':
                    navigator.vibrate(100);
                    break;
                case 'complete':
                    navigator.vibrate([200, 100, 200]);
                    break;
                case 'warning':
                    navigator.vibrate([100, 50, 100]);
                    break;
            }
        }

        // Provide audio feedback
        if (audioMessage) {
            playSound(audioMessage);
        }
    };

    const exerciseFeedback = {
        start: (message?: string) => provideFeedback('start', message),
        progress: (message?: string) => provideFeedback('progress', message),
        complete: (message?: string) => provideFeedback('complete', message),
        warning: (message?: string) => provideFeedback('warning', message),
    };

    return { exerciseFeedback, provideFeedback };
};