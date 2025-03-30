import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
    isOnboarded: boolean;
    completeOnboarding: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [isOnboarded, setIsOnboarded] = useState(false);

    const completeOnboarding = () => {
        setIsOnboarded(true);
    };

    return (
        <UserContext.Provider value={{ isOnboarded, completeOnboarding }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}