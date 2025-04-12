import { UIPreferences } from '../types';
import { useEffect, useCallback } from 'react';
import React, { useState, createContext, useContext } from 'react';
import { logEvent, AnalyticsEvent } from '../utils/analytics';

// Types for announcements
type AnnouncementPolite = 'polite' | 'assertive';

interface Announcement {
    message: string;
    politeness?: AnnouncementPolite;
    key?: string;
}

// Context for managing announcements
interface AnnouncerContextType {
    announce: (message: string, politeness?: AnnouncementPolite) => void;
    announcePageChange: (title: string) => void;
    clearAnnouncements: () => void;
}

const AnnouncerContext = createContext<AnnouncerContextType | null>(null);

// Provider component
export const AnnouncerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    // Helper to add announcements
    const announce = useCallback((message: string, politeness: AnnouncementPolite = 'polite') => {
        setAnnouncements(prev => [...prev, {
            message,
            politeness,
            key: `${Date.now()}-${Math.random()}`
        }]);

        // Log announcement for analytics
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'screen_reader_announcement',
            politeness
        });
    }, []);

    // Special helper for page changes
    const announcePageChange = useCallback((title: string) => {
        announce(`Navigated to ${title}`, 'assertive');
    }, [announce]);

    // Clear all announcements
    const clearAnnouncements = useCallback(() => {
        setAnnouncements([]);
    }, []);

    // Clean up announcements after they've been read
    useEffect(() => {
        if (announcements.length > 0) {
            const timer = setTimeout(() => {
                setAnnouncements(prev => prev.slice(1));
            }, 3000); // Typical screen reader announcement duration

            return () => clearTimeout(timer);
        }
    }, [announcements]);

    const contextValue = {
        announce,
        announcePageChange,
        clearAnnouncements
    };

    return (
        <AnnouncerContext.Provider value={contextValue}>
            {children}
            {/* Polite announcements */}
            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {announcements
                    .filter(a => a.politeness === 'polite')
                    .map(a => (
                        <div key={a.key}>{a.message}</div>
                    ))}
            </div>
            {/* Assertive announcements */}
            <div
                role="alert"
                aria-live="assertive"
                aria-atomic="true"
                className="sr-only"
            >
                {announcements
                    .filter(a => a.politeness === 'assertive')
                    .map(a => (
                        <div key={a.key}>{a.message}</div>
                    ))}
            </div>
        </AnnouncerContext.Provider>
    );
};

// Hook for using the announcer
export function useAnnouncer() {
    const context = useContext(AnnouncerContext);
    if (!context) {
        throw new Error('useAnnouncer must be used within an AnnouncerProvider');
    }
    return context;
}

// Higher order component for announcing page changes
export function withPageAnnouncement<P extends object>(
    WrappedComponent: React.ComponentType<P>,
    getPageTitle: (props: P) => string
) {
    return function WithPageAnnouncement(props: P) {
        const { announcePageChange } = useAnnouncer();

        useEffect(() => {
            const title = getPageTitle(props);
            announcePageChange(title);
        }, [props]);

        return <WrappedComponent {...props} />;
    };
}

// Status component for dynamic content updates
interface StatusMessageProps {
    message: string;
    politeness?: AnnouncementPolite;
    className?: string;
    children?: React.ReactNode;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
    message,
    politeness = 'polite',
    className,
    children
}) => {
    return (
        <div
            role={politeness === 'assertive' ? 'alert' : 'status'}
            aria-live={politeness}
            aria-atomic="true"
            className={className}
        >
            <span className="sr-only">{message}</span>
            {children}
        </div>
    );
};

// Progress announcer component
interface ProgressAnnouncerProps {
    value: number;
    max: number;
    label: string;
    announceEvery?: number; // Announce every X percent
}

export const ProgressAnnouncer: React.FC<ProgressAnnouncerProps> = ({
    value,
    max,
    label,
    announceEvery = 25
}) => {
    const { announce } = useAnnouncer();
    const previousValueRef = React.useRef(value);

    useEffect(() => {
        const previousPercentage = Math.floor((previousValueRef.current / max) * 100);
        const currentPercentage = Math.floor((value / max) * 100);

        // Announce if we've crossed an announcement threshold
        const previousThreshold = Math.floor(previousPercentage / announceEvery);
        const currentThreshold = Math.floor(currentPercentage / announceEvery);

        if (currentThreshold !== previousThreshold) {
            announce(`${label}: ${currentPercentage}% complete`);
        }

        previousValueRef.current = value;
    }, [value, max, label, announceEvery, announce]);

    return (
        <div
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={label}
            className="sr-only"
        />
    );
};

interface AccessibilityConfig {
    textSize: number;
    highContrast: boolean;
    reducedMotion: boolean;
    audioFeedback: boolean;
}

const defaultConfig: AccessibilityConfig = {
    textSize: 1,
    highContrast: false,
    reducedMotion: false,
    audioFeedback: true,
};

export function useAccessibility(preferences: UIPreferences) {
    const applyAccessibilitySettings = useCallback((config: AccessibilityConfig) => {
        // Update CSS variables for text size
        document.documentElement.style.setProperty(
            '--font-scale',
            String(config.textSize)
        );

        // Toggle high contrast mode
        document.documentElement.classList.toggle('high-contrast', config.highContrast);

        // Toggle reduced motion
        document.documentElement.classList.toggle('reduced-motion', config.reducedMotion);

        // Set ARIA attributes for screen readers
        document.documentElement.setAttribute('aria-reducedmotion', String(config.reducedMotion));
    }, []);

    // Convert preferences to config
    const getConfigFromPreferences = (prefs: UIPreferences): AccessibilityConfig => ({
        textSize: prefs.textSize === 'normal' ? 1 : prefs.textSize === 'large' ? 1.2 : 1.4,
        highContrast: prefs.highContrast,
        reducedMotion: prefs.reducedMotion,
        audioFeedback: prefs.audioFeedback,
    });

    // Apply settings whenever preferences change
    useEffect(() => {
        const config = getConfigFromPreferences(preferences);
        applyAccessibilitySettings(config);

        // Check system preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const prefersHighContrast = window.matchMedia('(prefers-contrast: more)');

        if (prefersReducedMotion.matches && !preferences.reducedMotion) {
            config.reducedMotion = true;
            applyAccessibilitySettings(config);
        }

        if (prefersHighContrast.matches && !preferences.highContrast) {
            config.highContrast = true;
            applyAccessibilitySettings(config);
        }

        const handleReducedMotionChange = (e: MediaQueryListEvent) => {
            config.reducedMotion = e.matches;
            applyAccessibilitySettings(config);
        };

        const handleHighContrastChange = (e: MediaQueryListEvent) => {
            config.highContrast = e.matches;
            applyAccessibilitySettings(config);
        };

        prefersReducedMotion.addEventListener('change', handleReducedMotionChange);
        prefersHighContrast.addEventListener('change', handleHighContrastChange);

        return () => {
            prefersReducedMotion.removeEventListener('change', handleReducedMotionChange);
            prefersHighContrast.removeEventListener('change', handleHighContrastChange);
        };
    }, [preferences, applyAccessibilitySettings]);
}

// Announce messages to screen readers
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.classList.add('sr-only'); // visually hidden
    document.body.appendChild(announcement);

    // Use setTimeout to ensure the DOM update and announcement
    setTimeout(() => {
        announcement.textContent = message;
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }, 50);
}

// Handle keyboard navigation
export function handleKeyboardNavigation(e: KeyboardEvent) {
    // Skip to main content
    if (e.key === 'Enter' && e.altKey) {
        e.preventDefault();
        const main = document.querySelector('main');
        if (main) {
            main.focus();
            main.scrollIntoView();
        }
    }

    // Toggle high contrast mode
    if (e.key === 'F9' && e.altKey) {
        e.preventDefault();
        const html = document.documentElement;
        html.classList.toggle('high-contrast');
    }

    // Increase/decrease text size
    if (e.altKey && (e.key === '+' || e.key === '-')) {
        e.preventDefault();
        const html = document.documentElement;
        const currentScale = parseFloat(getComputedStyle(html).getPropertyValue('--font-scale') || '1');
        const newScale = e.key === '+' ? Math.min(currentScale + 0.1, 1.4) : Math.max(currentScale - 0.1, 1);
        html.style.setProperty('--font-scale', String(newScale));
    }
}

// Create accessible button props
interface AccessibleButtonProps {
    onClick: () => void;
    label: string;
    description?: string;
}

export function createAccessibleButtonProps({ onClick, label, description }: AccessibleButtonProps) {
    return {
        role: 'button',
        tabIndex: 0,
        'aria-label': label,
        'aria-description': description,
        onClick,
        onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
            }
        },
    };
}

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="rating-container" role="group" aria-label="Exercise Rating"></div>
            {
        [1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                aria-label={`Rate ${star} out of 5 stars`}
                aria-pressed={rating >= star}
                onClick={() => handleRating(star)}
                className={`star ${rating >= star ? 'active' : ''}`}
            >
                ⭐
            </button>
        ))
    }
        </div >
    );
};