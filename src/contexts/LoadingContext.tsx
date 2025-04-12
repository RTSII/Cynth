import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingState {
    [key: string]: boolean;
}

interface LoadingContextType {
    isLoading: (key: string) => boolean;
    startLoading: (key: string) => void;
    stopLoading: (key: string) => void;
    setLoadingState: (key: string, state: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loadingStates, setLoadingStates] = useState<LoadingState>({});

    const isLoading = useCallback((key: string) => {
        return !!loadingStates[key];
    }, [loadingStates]);

    const startLoading = useCallback((key: string) => {
        setLoadingStates(prev => ({ ...prev, [key]: true }));
    }, []);

    const stopLoading = useCallback((key: string) => {
        setLoadingStates(prev => ({ ...prev, [key]: false }));
    }, []);

    const setLoadingState = useCallback((key: string, state: boolean) => {
        setLoadingStates(prev => ({ ...prev, [key]: state }));
    }, []);

    return (
        <LoadingContext.Provider value={{
            isLoading,
            startLoading,
            stopLoading,
            setLoadingState,
        }}>
            {children}
        </LoadingContext.Provider>
    );
};