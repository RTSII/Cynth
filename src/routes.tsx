import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingSpinner } from './components/language-loading';
import AuthGuard from './components/AuthGuard';

// Lazy load routes for better performance
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const TodayPractice = React.lazy(() => import('./pages/TodayPractice'));
const Programs = React.lazy(() => import('./pages/Programs'));
const ExercisePlayer = React.lazy(() => import('./pages/ExercisePlayer'));
const Inspiration = React.lazy(() => import('./pages/Inspiration'));
const Music = React.lazy(() => import('./pages/Music'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));

// Protected route wrapper component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => (
    <AuthGuard>
        {element}
    </AuthGuard>
);

const AppRoutes: React.FC = () => {
    return (
        <Suspense fallback={<LoadingSpinner size="large" message="Loading..." />}>
            <Routes>
                {/* Public routes */}
                <Route path="/onboarding" element={<Onboarding />} />

                {/* Protected routes */}
                <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
                <Route path="/today" element={<ProtectedRoute element={<TodayPractice />} />} />
                <Route path="/programs" element={<ProtectedRoute element={<Programs />} />} />
                <Route
                    path="/exercise/:programId/:dayId/:exerciseId"
                    element={<ProtectedRoute element={<ExercisePlayer />} />}
                />
                <Route path="/inspiration" element={<ProtectedRoute element={<Inspiration />} />} />
                <Route path="/music" element={<ProtectedRoute element={<Music />} />} />
                <Route path="/settings" element={<ProtectedRoute element={<Settings />} />} />

                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;