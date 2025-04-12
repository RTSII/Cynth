import { KeyboardEvent } from 'react';
import { logEvent, AnalyticsEvent } from './analytics';

// Keyboard shortcut configuration
export const KEYBOARD_SHORTCUTS = {
    PLAY_PAUSE: ['Space'],
    VOLUME_UP: ['ArrowUp'],
    VOLUME_DOWN: ['ArrowDown'],
    SEEK_FORWARD: ['ArrowRight'],
    SEEK_BACKWARD: ['ArrowLeft'],
    TOGGLE_MUTE: ['m', 'M'],
    TOGGLE_FULLSCREEN: ['f', 'F'],
    SPEED_INCREASE: ['+', '='],
    SPEED_DECREASE: ['-', '_'],
    NEXT_EXERCISE: ['n', 'N'],
    PREVIOUS_EXERCISE: ['p', 'P'],
    HELP: ['?', 'h', 'H'],
    CLOSE: ['Escape']
} as const;

// Types for keyboard actions
export type KeyboardAction = keyof typeof KEYBOARD_SHORTCUTS;

interface KeyboardHandler {
    action: KeyboardAction;
    handler: () => void;
    requiresFocus?: boolean;
    allowInInput?: boolean;
}

// Track active keyboard handlers
const activeHandlers: KeyboardHandler[] = [];

// Register a keyboard shortcut handler
export function registerKeyboardHandler(handler: KeyboardHandler): () => void {
    activeHandlers.push(handler);

    // Return unregister function
    return () => {
        const index = activeHandlers.indexOf(handler);
        if (index > -1) {
            activeHandlers.splice(index, 1);
        }
    };
}

// Handle keyboard events
export function handleKeyboardEvent(event: KeyboardEvent): void {
    // Skip if target is an input or textarea and handler doesn't allow it
    const isInputElement =
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement;

    if (isInputElement && !event.target.readOnly) {
        const handler = activeHandlers.find(h =>
            h.allowInInput &&
            KEYBOARD_SHORTCUTS[h.action].includes(event.key)
        );

        if (!handler) return;
    }

    // Find matching handler
    const handler = activeHandlers.find(h => {
        const shortcuts = KEYBOARD_SHORTCUTS[h.action];
        const matchesKey = shortcuts.includes(event.key);

        if (!matchesKey) return false;

        // Check if handler requires focus
        if (h.requiresFocus) {
            const element = document.activeElement;
            if (!element || !('dataset' in element)) return false;

            // Check if element has matching data-action attribute
            return element.dataset.action === h.action;
        }

        return true;
    });

    if (handler) {
        event.preventDefault();
        handler.handler();

        // Log keyboard shortcut usage
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'keyboard_shortcut_used',
            shortcut: handler.action
        });
    }
}

// Setup global keyboard event listener
export function setupKeyboardNavigation(): () => void {
    const handleKeyDown = (event: KeyboardEvent) => {
        handleKeyboardEvent(event);
    };

    window.addEventListener('keydown', handleKeyDown as any);
    return () => window.removeEventListener('keydown', handleKeyDown as any);
}

// Focus management utility functions
export const focusUtils = {
    moveFocusToElement(elementId: string): void {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    },

    trapFocus(containerId: string): () => void {
        const container = document.getElementById(containerId);
        if (!container) return () => { };

        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        const firstFocusable = focusableElements[0] as HTMLElement;
        const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            if (event.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    event.preventDefault();
                    lastFocusable.focus();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    event.preventDefault();
                    firstFocusable.focus();
                }
            }
        };

        container.addEventListener('keydown', handleTabKey);
        return () => container.removeEventListener('keydown', handleTabKey);
    },

    createFocusGroup(containerSelector: string): {
        next: () => void;
        previous: () => void;
        first: () => void;
        last: () => void;
    } {
        return {
            next: () => {
                const elements = document.querySelectorAll(`${containerSelector} [tabindex]:not([tabindex="-1"])`);
                const currentIndex = Array.from(elements).indexOf(document.activeElement as Element);
                const nextElement = elements[(currentIndex + 1) % elements.length] as HTMLElement;
                if (nextElement) nextElement.focus();
            },
            previous: () => {
                const elements = document.querySelectorAll(`${containerSelector} [tabindex]:not([tabindex="-1"])`);
                const currentIndex = Array.from(elements).indexOf(document.activeElement as Element);
                const previousIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1;
                const previousElement = elements[previousIndex] as HTMLElement;
                if (previousElement) previousElement.focus();
            },
            first: () => {
                const firstElement = document.querySelector(`${containerSelector} [tabindex]:not([tabindex="-1"])`) as HTMLElement;
                if (firstElement) firstElement.focus();
            },
            last: () => {
                const elements = document.querySelectorAll(`${containerSelector} [tabindex]:not([tabindex="-1"])`);
                const lastElement = elements[elements.length - 1] as HTMLElement;
                if (lastElement) lastElement.focus();
            }
        };
    }
};