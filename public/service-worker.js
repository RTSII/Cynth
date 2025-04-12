// Service worker version
const VERSION = '1.0.0';

// Cache names matching register-sw.ts
const CACHE_NAMES = {
    STATIC: 'cynthai-static-v1',
    DYNAMIC: 'cynthai-dynamic-v1',
    EXERCISES: 'cynthai-exercises-v1'
};

// Cache static resources on install
self.addEventListener('install', (event) => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAMES.STATIC),
            caches.open(CACHE_NAMES.DYNAMIC),
            caches.open(CACHE_NAMES.EXERCISES)
        ]).then(([staticCache]) => {
            // Initial static cache will be populated via message from register-sw.ts
            console.log('Service Worker installed');
        })
    );
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!Object.values(CACHE_NAMES).includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker activated');
        })
    );
});

// Handle fetch requests with appropriate caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // API requests - Network first with cache fallback
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAMES.DYNAMIC).then((cache) => {
                        cache.put(request, clonedResponse);
                    });
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Exercise video requests - Cache first with network fallback
    if (url.pathname.includes('/assets/videos/')) {
        event.respondWith(
            caches.match(request)
                .then((response) => response || fetch(request))
                .then((response) => {
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAMES.EXERCISES).then((cache) => {
                        cache.put(request, clonedResponse);
                    });
                    return response;
                })
        );
        return;
    }

    // Static assets - Cache first with network fallback
    if (
        url.pathname.startsWith('/assets/') ||
        url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.css') ||
        url.pathname.endsWith('.html')
    ) {
        event.respondWith(
            caches.match(request)
                .then((response) => response || fetch(request))
        );
        return;
    }

    // HTML navigation - Network first with cache fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => caches.match('/index.html'))
        );
        return;
    }

    // All other requests - Network first
    event.respondWith(
        fetch(request)
            .catch(() => caches.match(request))
    );
});

// Handle messages from the client
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'CACHE_URLS':
            event.waitUntil(
                caches.open(CACHE_NAMES.STATIC).then((cache) => {
                    return cache.addAll(payload.staticUrls);
                })
            );
            break;

        case 'CACHE_EXERCISE_VIDEOS':
            event.waitUntil(
                caches.open(CACHE_NAMES.EXERCISES).then((cache) => {
                    return cache.addAll(payload.videoUrls);
                })
            );
            break;

        case 'CLEAR_EXERCISE_CACHE':
            event.waitUntil(
                caches.delete(CACHE_NAMES.EXERCISES).then(() => {
                    return caches.open(CACHE_NAMES.EXERCISES);
                })
            );
            break;
    }
});

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'syncExerciseProgress') {
        event.waitUntil(
            // Implement progress sync logic here
            Promise.resolve()
        );
    }
});

// Handle push notifications
self.addEventListener('push', (event) => {
    if (!event.data) return;

    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/icons/icon-192x192.png',
        badge: '/assets/icons/badge-96x96.png',
        tag: data.tag,
        data: data.data,
        actions: data.actions || [],
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action) {
        // Handle custom actions
        const { action } = event;
        const data = event.notification.data;

        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                // Navigate existing client or open new window
                if (clientList.length > 0) {
                    clientList[0].focus();
                    clientList[0].postMessage({
                        type: 'NOTIFICATION_ACTION',
                        action,
                        data
                    });
                } else {
                    clients.openWindow('/');
                }
            })
        );
    }
});