import { useState, useRef, useEffect, useCallback } from 'react';
import { VideoError } from '../types';
import { announceToScreenReader } from '../components/accessibility';

interface VideoPlayerState {
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

interface VideoPlayerHookResult extends VideoPlayerState {
    videoRef: React.RefObject<HTMLVideoElement>;
    handlePlay: () => void;
    handlePause: () => void;
    handleTimeUpdate: (time: number) => void;
    handleVolumeChange: (volume: number) => void;
    handleToggleMute: () => void;
    handlePlaybackRateChange: (rate: number) => void;
    handleToggleFullscreen: () => void;
    handleKeyboardControls: (e: KeyboardEvent) => void;
}

export function useVideoPlayer(videoUrl: string): VideoPlayerHookResult {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [state, setState] = useState<VideoPlayerState>({
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        isMuted: false,
        playbackRate: 1,
        isFullscreen: false,
        buffering: false,
        error: null,
    });

    const updateState = (updates: Partial<VideoPlayerState>) => {
        setState(prev => ({ ...prev, ...updates }));
    };

    const handleError = useCallback((error: Error) => {
        console.error('Video playback error:', error);
        const videoError = new VideoError(
            error.message,
            'VIDEO_PLAY_FAILED'
        );
        updateState({ error: videoError.message });
        announceToScreenReader('Error playing video: ' + error.message, 'assertive');
    }, []);

    const handlePlay = useCallback(async () => {
        try {
            if (videoRef.current) {
                await videoRef.current.play();
                updateState({ isPlaying: true });
                announceToScreenReader('Video playing');
            }
        } catch (error) {
            handleError(error as Error);
        }
    }, [handleError]);

    const handlePause = useCallback(() => {
        if (videoRef.current) {
            videoRef.current.pause();
            updateState({ isPlaying: false });
            announceToScreenReader('Video paused');
        }
    }, []);

    const handleTimeUpdate = useCallback((time: number) => {
        updateState({ currentTime: time });
    }, []);

    const handleVolumeChange = useCallback((volume: number) => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
            updateState({ volume, isMuted: volume === 0 });
            announceToScreenReader(`Volume set to ${Math.round(volume * 100)}%`);
        }
    }, []);

    const handleToggleMute = useCallback(() => {
        if (videoRef.current) {
            const newMutedState = !state.isMuted;
            videoRef.current.muted = newMutedState;
            updateState({ isMuted: newMutedState });
            announceToScreenReader(newMutedState ? 'Video muted' : 'Video unmuted');
        }
    }, [state.isMuted]);

    const handlePlaybackRateChange = useCallback((rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            updateState({ playbackRate: rate });
            announceToScreenReader(`Playback speed set to ${rate}x`);
        }
    }, []);

    const handleToggleFullscreen = useCallback(async () => {
        if (!videoRef.current) return;

        try {
            if (!document.fullscreenElement) {
                await videoRef.current.requestFullscreen();
                updateState({ isFullscreen: true });
                announceToScreenReader('Entered fullscreen mode');
            } else {
                await document.exitFullscreen();
                updateState({ isFullscreen: false });
                announceToScreenReader('Exited fullscreen mode');
            }
        } catch (error) {
            handleError(error as Error);
        }
    }, [handleError]);

    const handleKeyboardControls = useCallback((e: KeyboardEvent) => {
        if (!videoRef.current) return;

        switch (e.key.toLowerCase()) {
            case ' ':
            case 'k':
                e.preventDefault();
                state.isPlaying ? handlePause() : handlePlay();
                break;
            case 'm':
                e.preventDefault();
                handleToggleMute();
                break;
            case 'f':
                e.preventDefault();
                handleToggleFullscreen();
                break;
            case 'arrowleft':
                e.preventDefault();
                videoRef.current.currentTime -= 5;
                announceToScreenReader('Rewound 5 seconds');
                break;
            case 'arrowright':
                e.preventDefault();
                videoRef.current.currentTime += 5;
                announceToScreenReader('Advanced 5 seconds');
                break;
            case 'arrowup':
                e.preventDefault();
                handleVolumeChange(Math.min(state.volume + 0.1, 1));
                break;
            case 'arrowdown':
                e.preventDefault();
                handleVolumeChange(Math.max(state.volume - 0.1, 0));
                break;
        }
    }, [state.isPlaying, state.volume, handlePlay, handlePause, handleToggleMute, handleToggleFullscreen, handleVolumeChange]);

    // Set up video event listeners
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onLoadedMetadata = () => {
            updateState({ duration: video.duration });
        };

        const onTimeUpdate = () => {
            updateState({ currentTime: video.currentTime });
        };

        const onWaiting = () => {
            updateState({ buffering: true });
            announceToScreenReader('Video buffering');
        };

        const onPlaying = () => {
            updateState({ buffering: false });
        };

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('waiting', onWaiting);
        video.addEventListener('playing', onPlaying);

        return () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('playing', onPlaying);
        };
    }, []);

    // Set up keyboard controls
    useEffect(() => {
        window.addEventListener('keydown', handleKeyboardControls);
        return () => {
            window.removeEventListener('keydown', handleKeyboardControls);
        };
    }, [handleKeyboardControls]);

    return {
        ...state,
        videoRef,
        handlePlay,
        handlePause,
        handleTimeUpdate,
        handleVolumeChange,
        handleToggleMute,
        handlePlaybackRateChange,
        handleToggleFullscreen,
        handleKeyboardControls,
    };
}