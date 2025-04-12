import { useState, useEffect, useCallback } from 'react';
import { logError } from '../utils/analytics';

export function useStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            // Parse stored json or return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            logError(error as Error, { context: 'Storage Initialization', key });
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that persists the new value to localStorage
    const setValue = useCallback((value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to localStorage
            localStorage.setItem(key, JSON.stringify(valueToStore));

            // Dispatch storage event for cross-tab sync
            window.dispatchEvent(new StorageEvent('storage', {
                key: key,
                newValue: JSON.stringify(valueToStore),
                storageArea: localStorage
            }));
        } catch (error) {
            logError(error as Error, { context: 'Storage Update', key });
        }
    }, [key, storedValue]);

    // Listen for changes in other tabs/windows
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === key && e.newValue !== null) {
                try {
                    setStoredValue(JSON.parse(e.newValue));
                } catch (error) {
                    logError(error as Error, { context: 'Storage Sync', key });
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [key]);

    return [storedValue, setValue] as const;
}

// Utility hook for managing multiple storage keys
export function useMultiStorage<T extends Record<string, any>>(
    keys: Record<keyof T, string>,
    initialValues: T
) {
    const storage = {} as Record<keyof T, ReturnType<typeof useStorage<any>>>;

    // Create individual storage hooks for each key
    (Object.keys(keys) as Array<keyof T>).forEach(key => {
        storage[key] = useStorage(keys[key], initialValues[key]);
    });

    // Create a unified interface
    const values = {} as T;
    const setters = {} as Record<keyof T, (value: T[keyof T]) => void>;

    (Object.keys(keys) as Array<keyof T>).forEach(key => {
        const [value, setValue] = storage[key];
        values[key] = value;
        setters[key] = setValue;
    });

    // Batch update function
    const setMultiple = useCallback((updates: Partial<T>) => {
        Object.entries(updates).forEach(([key, value]) => {
            const setter = setters[key as keyof T];
            if (setter) {
                setter(value);
            }
        });
    }, [setters]);

    return { values, setters, setMultiple };
}

// Typed storage hook with schema validation
export function useTypedStorage<T>(
    key: string,
    initialValue: T,
    validate: (value: unknown) => value is T
) {
    const [storedValue, setStoredValue] = useStorage<T>(key, initialValue);

    // Wrapper around setStoredValue that includes validation
    const setValidatedValue = useCallback((value: T | ((val: T) => T)) => {
        const newValue = value instanceof Function ? value(storedValue) : value;

        if (validate(newValue)) {
            setStoredValue(newValue);
        } else {
            logError(
                new Error('Invalid storage value'),
                { context: 'Storage Validation', key, value: newValue }
            );
        }
    }, [key, storedValue, setStoredValue]);

    return [storedValue, setValidatedValue] as const;
}