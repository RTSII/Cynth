import { registerSW as registerViteSW } from 'virtual:pwa-register';

export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker from vite-plugin-pwa
    const updateSW = registerViteSW({
      // Show a custom prompt when updates are available
      onNeedRefresh() {
        if (confirm('New content is available. Reload to update?')) {
          updateSW(true);
        }
      },
      // Handle registration errors
      onRegisterError(error) {
        console.error('Service worker registration error:', error);
      },
      // Immediate register the service worker
      immediate: true
    });

    // Handle manual refresh request (e.g., from settings page)
    window.updateSW = () => {
      updateSW(true);
    };

    // Enhanced offline detection
    window.addEventListener('online', () => {
      document.body.classList.remove('offline-mode');
      
      // Show a notification that connection is restored
      showNotification('Connection restored', 'You are back online.');
    });

    window.addEventListener('offline', () => {
      document.body.classList.add('offline-mode');
      
      // Show a notification that we're offline
      showNotification('Offline mode', 'App will continue to work with limited functionality.');
    });

    // Check initial offline state
    if (!navigator.onLine) {
      document.body.classList.add('offline-mode');
    }
  }
};

// Helper function to show in-app notifications
const showNotification = (title: string, message: string) => {
  // Create notification element
  const notificationElement = document.createElement('div');
  notificationElement.className = 'fixed top-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border border-neutral-200 p-4 transform transition-transform duration-300 ease-in-out';
  notificationElement.style.transform = 'translateY(-100%)';
  
  notificationElement.innerHTML = `
    <div class="flex">
      <div class="ml-3">
        <p class="text-sm font-medium text-neutral-900">${title}</p>
        <p class="mt-1 text-sm text-neutral-600">${message}</p>
      </div>
      <div class="ml-auto pl-3">
        <button class="inline-flex text-neutral-400 hover:text-neutral-600 focus:outline-none">
          <span class="sr-only">Close</span>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    </div>
  `;
  
  // Add to DOM
  document.body.appendChild(notificationElement);
  
  // Animate in
  setTimeout(() => {
    notificationElement.style.transform = 'translateY(0)';
  }, 10);
  
  // Add click handler to close button
  const closeButton = notificationElement.querySelector('button');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      notificationElement.style.transform = 'translateY(-100%)';
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        document.body.removeChild(notificationElement);
      }, 300);
    });
  }
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notificationElement)) {
      notificationElement.style.transform = 'translateY(-100%)';
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (document.body.contains(notificationElement)) {
          document.body.removeChild(notificationElement);
        }
      }, 300);
    }
  }, 5000);
};

// Extend the Window interface to include our custom functions
declare global {
  interface Window {
    updateSW: () => void;
  }
}
