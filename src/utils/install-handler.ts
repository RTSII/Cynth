import { logEvent, AnalyticsEvent } from './analytics';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Listen for install prompt
export function setupInstallHandler(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Save the event to use it later
        deferredPrompt = e as BeforeInstallPromptEvent;

        // Log that installation is available
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'install_available'
        });
    });

    // Track successful installations
    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'app_installed'
        });
    });
}

// Check if the app can be installed
export function canInstall(): boolean {
    return !!deferredPrompt;
}

// Show installation prompt
export async function promptInstall(): Promise<'accepted' | 'dismissed' | 'failed'> {
    if (!deferredPrompt) {
        return 'failed';
    }

    try {
        // Show the prompt
        await deferredPrompt.prompt();
        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;
        // Reset the deferred prompt
        deferredPrompt = null;

        return outcome;
    } catch (error) {
        console.error('Error prompting for install:', error);
        return 'failed';
    }
}

// Check if app is in standalone mode (installed)
export function isInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
        navigator.standalone === true;
}

// iOS specific install detection
export function isiOSDevice(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// Show iOS install instructions
export function getIOSInstallInstructions(): string {
    return 'To install CynthAI on your iOS device:\n' +
        '1. Tap the Share button in Safari\n' +
        '2. Scroll down and tap "Add to Home Screen"\n' +
        '3. Tap "Add" to confirm';
}

// Get platform-specific install button text
export function getInstallButtonText(): string {
    if (isiOSDevice()) {
        return 'How to Install';
    }
    return 'Install App';
}

// Initialize install handling
export function initializeInstallHandling(): void {
    setupInstallHandler();

    // Track standalone mode
    if (isInstalled()) {
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'app_launched_standalone'
        });
    }

    // Track iOS devices
    if (isiOSDevice()) {
        logEvent(AnalyticsEvent.PAGE_VIEW, {
            action: 'ios_device_detected'
        });
    }
}