import { logError } from './analytics';

// Cache names
const CACHE_NAMES = {
  STATIC: 'cynthai-static-v1',
  DYNAMIC: 'cynthai-dynamic-v1',
  EXERCISES: 'cynthai-exercises-v1'
};

// Resources to pre-cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Send list of URLs to cache to the service worker
function sendInitialCacheList(worker: ServiceWorker) {
  worker.postMessage({
    type: 'CACHE_URLS',
    payload: {
      staticUrls: STATIC_RESOURCES,
      cacheNames: CACHE_NAMES
    }
  });
}

// Notify user of available update
function notifyUserOfUpdate() {
  const event = new CustomEvent('serviceWorkerUpdate', {
    detail: {
      message: 'New version available',
      reload: () => window.location.reload()
    }
  });
  window.dispatchEvent(event);
}

// Check if app is installed
export function isAppInstalled(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as any).standalone === true);
}

// Check if offline
export function isOffline(): boolean {
  return !navigator.onLine;
}

// Listen for online/offline events
export function setupConnectivityListeners(
  onOnline: () => void,
  onOffline: () => void
) {
  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// Cache exercise videos for offline use
export async function cacheExerciseVideos(videoUrls: string[]) {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({
    type: 'CACHE_EXERCISE_VIDEOS',
    payload: {
      videoUrls,
      cacheName: CACHE_NAMES.EXERCISES
    }
  });
}

// Clear exercise video cache
export async function clearExerciseCache() {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage({
    type: 'CLEAR_EXERCISE_CACHE',
    payload: {
      cacheName: CACHE_NAMES.EXERCISES
    }
  });
}

// Check cache storage usage
export async function checkCacheStorage(): Promise<{
  usage: number;
  quota: number;
  percentage: number;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const { usage, quota } = await navigator.storage.estimate();
    return {
      usage: usage || 0,
      quota: quota || 0,
      percentage: usage && quota ? (usage / quota) * 100 : 0
    };
  }
  return {
    usage: 0,
    quota: 0,
    percentage: 0
  };
}

// Resources to pre-cache
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available
              notifyUserOfUpdate();
            }
          });
        }
      });

      // Initial service worker setup
      if (registration.active) {
        sendInitialCacheList(registration.active);
      }

      return registration;
    } catch (error) {
      logError(error as Error, { context: 'Service Worker Registration' });
      console.error('Service worker registration failed:', error);
    }
  }
}
