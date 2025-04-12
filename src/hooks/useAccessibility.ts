import { useEffect, useCallback, useRef } from 'react';
import { registerKeyboardHandler, KeyboardAction, focusUtils } from '../utils/keyboard-navigation';
import { logEvent, AnalyticsEvent } from '../utils/analytics';

interface UseAccessibilityOptions {
    containerId?: string;
    shortcuts?: Partial<Record<KeyboardAction, () => void>>;
    focusOnMount?: boolean;
    trapFocus?: boolean;
    restoreFocus?: boolean;
    announcePageChange?: boolean;
}

export function useAccessibility({
    containerId,
    shortcuts = {},
    focusOnMount = false,
    trapFocus = false,
    restoreFocus = false,
    announcePageChange = false
}: UseAccessibilityOptions = {}) {
    // Keep track of element that had focus before mounting
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Register keyboard shortcuts
    useEffect(() => {
        const cleanupFns = Object.entries(shortcuts).map(([action, handler]) => {
            return registerKeyboardHandler({
                action: action as KeyboardAction,
                handler: () => {
                    handler();
                    // Log shortcut usage
                    logEvent(AnalyticsEvent.PAGE_VIEW, {
                        action: 'accessibility_shortcut_used',
                        shortcut: action
                    });
                }
            });
        });

        return () => cleanupFns.forEach(cleanup => cleanup());
    }, [shortcuts]);

    // Handle focus management
    useEffect(() => {
        if (!containerId) return;

        // Store previously focused element
        if (restoreFocus) {
            previousFocusRef.current = document.activeElement as HTMLElement;
        }

        // Focus container on mount if needed
        if (focusOnMount) {
            const container = document.getElementById(containerId);
            if (container) {
                container.focus();
            }
        }

        // Setup focus trapping if needed
        let cleanupTrapFocus: (() => void) | undefined;
        if (trapFocus) {
            cleanupTrapFocus = focusUtils.trapFocus(containerId);
        }

        // Cleanup function
        return () => {
            // Cleanup focus trap
            if (cleanupTrapFocus) {
                cleanupTrapFocus();
            }

            // Restore focus
            if (restoreFocus && previousFocusRef.current) {
                previousFocusRef.current.focus();
            }
        };
    }, [containerId, focusOnMount, trapFocus, restoreFocus]);

    // Handle page change announcements
    useEffect(() => {
        if (announcePageChange && containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                const pageTitle = container.getAttribute('aria-label') ||
                    document.title;

                // Announce page change to screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.classList.add('sr-only'); // Screen reader only
                announcement.textContent = `Navigated to ${pageTitle}`;

                document.body.appendChild(announcement);

                // Remove announcement after it's been read
                setTimeout(() => {
                    document.body.removeChild(announcement);
                }, 1000);
            }
        }
    }, [containerId, announcePageChange]);

    // Create focus group for the container
    const focusGroup = useCallback(() => {
        if (!containerId) return null;
        return focusUtils.createFocusGroup(`#${containerId}`);
    }, [containerId]);

    // Helper to move focus to a specific element
    const moveFocus = useCallback((elementId: string) => {
        focusUtils.moveFocusToElement(elementId);
    }, []);

    return {
        focusGroup,
        moveFocus
    };
}