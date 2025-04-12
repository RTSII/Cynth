import { logError } from './analytics';

interface NotificationAction {
    action: string;
    title: string;
    icon?: string;
}

interface NotificationOptions {
    title: string;
    body: string;
    tag?: string;
    icon?: string;
    badge?: string;
    actions?: NotificationAction[];
    data?: any;
}

export async function requestNotificationPermission(): Promise<boolean> {
    try {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    } catch (error) {
        logError(error as Error, { context: 'Notification Permission Request' });
        return false;
    }
}

export async function subscribeToPushNotifications(): Promise<PushSubscription | null> {
    try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            console.log('Push notifications not supported');
            return null;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            // Replace with your VAPID public key
            applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY'
        });

        // Send subscription to backend
        await sendSubscriptionToServer(subscription);

        return subscription;
    } catch (error) {
        logError(error as Error, { context: 'Push Notification Subscription' });
        return null;
    }
}

async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
        const response = await fetch('/api/push-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(subscription),
        });

        if (!response.ok) {
            throw new Error('Failed to save push subscription');
        }
    } catch (error) {
        logError(error as Error, { context: 'Push Subscription Server Sync' });
        throw error;
    }
}

export async function unsubscribeFromPushNotifications(): Promise<boolean> {
    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();

        if (subscription) {
            await subscription.unsubscribe();
            // Notify backend about unsubscription
            await fetch('/api/push-subscription', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subscription),
            });
            return true;
        }
        return false;
    } catch (error) {
        logError(error as Error, { context: 'Push Notification Unsubscribe' });
        return false;
    }
}

export async function showNotification(options: NotificationOptions): Promise<void> {
    try {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }

        if (Notification.permission !== 'granted') {
            console.log('Notification permission not granted');
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(options.title, {
            body: options.body,
            icon: options.icon || '/assets/icons/icon-192x192.png',
            badge: options.badge || '/assets/icons/badge-96x96.png',
            tag: options.tag,
            actions: options.actions,
            data: options.data,
            requireInteraction: true,
            silent: false
        });
    } catch (error) {
        logError(error as Error, { context: 'Show Notification' });
    }
}

// Schedule reminder notification
export async function scheduleReminder(
    title: string,
    body: string,
    scheduledTime: Date
): Promise<void> {
    const delay = scheduledTime.getTime() - Date.now();
    if (delay <= 0) return;

    setTimeout(async () => {
        await showNotification({
            title,
            body,
            tag: 'reminder',
            actions: [
                {
                    action: 'open',
                    title: 'Open App'
                },
                {
                    action: 'dismiss',
                    title: 'Dismiss'
                }
            ]
        });
    }, delay);
}

// Handle notification action clicks
export function setupNotificationActionHandlers(handlers: {
    [key: string]: (data?: any) => void;
}): void {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_ACTION') {
            const { action, data } = event.data;
            if (handlers[action]) {
                handlers[action](data);
            }
        }
    });
}