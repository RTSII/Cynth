import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const { userProfile } = useUser();
    const location = useLocation();

    // Redirect to onboarding if user is not authenticated
    if (!userProfile) {
        return (
            <Navigate
                to="/onboarding"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    // User is authenticated, render protected content
    return <>{children}</>;
};