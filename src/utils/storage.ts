import { UserProfile, UserProgress, Settings, Exercise } from '../types';

// Storage keys
const KEYS = {
    USER_PROFILE: '@cynthai_user_profile',
    USER_PROGRESS: '@cynthai_user_progress',
    SETTINGS: '@cynthai_settings',
    CACHED_EXERCISES: '@cynthai_cached_exercises',
    CACHED_TIMESTAMP: '@cynthai_cache_timestamp',
} as const;

// Cache expiration time (24 hours)
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

// Generic storage operations
const storage = {
    async get<T>(key: string): Promise<T | null> {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from storage (${key}):`, error);
            return null;
        }
    },

    async set<T>(key: string, value: T): Promise<void> {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing to storage (${key}):`, error);
            throw error;
        }
    },

    async remove(key: string): Promise<void> {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from storage (${key}):`, error);
            throw error;
        }
    },

    async clear(): Promise<void> {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Error clearing storage:', error);
            throw error;
        }
    }
};

// Specific storage operations with type safety
export const userStorage = {
    async getProfile(): Promise<UserProfile | null> {
        return storage.get<UserProfile>(KEYS.USER_PROFILE);
    },

    async setProfile(profile: UserProfile): Promise<void> {
        return storage.set(KEYS.USER_PROFILE, profile);
    },

    async clearProfile(): Promise<void> {
        return storage.remove(KEYS.USER_PROFILE);
    }
};

export const progressStorage = {
    async getProgress(): Promise<UserProgress | null> {
        return storage.get<UserProgress>(KEYS.USER_PROGRESS);
    },

    async setProgress(progress: UserProgress): Promise<void> {
        return storage.set(KEYS.USER_PROGRESS, progress);
    },

    async updateProgress(update: Partial<UserProgress>): Promise<void> {
        const current = await this.getProgress();
        if (current) {
            return this.setProgress({ ...current, ...update });
        }
    }
};

export const settingsStorage = {
    async getSettings(): Promise<Settings | null> {
        return storage.get<Settings>(KEYS.SETTINGS);
    },

    async setSettings(settings: Settings): Promise<void> {
        return storage.set(KEYS.SETTINGS, settings);
    },

    async updateSettings(update: Partial<Settings>): Promise<void> {
        const current = await this.getSettings();
        if (current) {
            return this.setSettings({ ...current, ...update });
        }
    }
};

// Cache management for offline support
export const exerciseCache = {
    async getCachedExercises(): Promise<Exercise[]> {
        return storage.get<Exercise[]>(KEYS.CACHED_EXERCISES) || [];
    },

    async cacheExercises(exercises: Exercise[]): Promise<void> {
        await storage.set(KEYS.CACHED_EXERCISES, exercises);
        await storage.set(KEYS.CACHED_TIMESTAMP, Date.now());
    },

    async isCacheValid(): Promise<boolean> {
        const timestamp = await storage.get<number>(KEYS.CACHED_TIMESTAMP);
        if (!timestamp) return false;
        return Date.now() - timestamp < CACHE_EXPIRATION;
    },

    async clearCache(): Promise<void> {
        await storage.remove(KEYS.CACHED_EXERCISES);
        await storage.remove(KEYS.CACHED_TIMESTAMP);
    }
};

// Storage event listener for cross-tab synchronization
if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e) => {
        // Dispatch custom events for storage changes
        if (e.key && e.newValue) {
            const event = new CustomEvent('storageChange', {
                detail: {
                    key: e.key,
                    value: JSON.parse(e.newValue)
                }
            });
            window.dispatchEvent(event);
        }
    });
}

export default storage;