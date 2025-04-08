import React, { createContext, useContext, useState } from 'react';

interface ProgressContextType {
    progress: number;
    setProgress: (value: number) => void;
}

const ProgressContext = createContext<ProgressContextType>({
    progress: 0,
    setProgress: () => { },
});

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [progress, setProgress] = useState(0);

    return (
        <ProgressContext.Provider value={{ progress, setProgress }}>
            {children}
        </ProgressContext.Provider>
    );
};