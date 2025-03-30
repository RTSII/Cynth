import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useUser } from './contexts/UserContext';

// Components
import Layout from './components/Layout';

// Pages
import Dashboard from './pages/Dashboard';
import TodayPractice from './pages/TodayPractice';
import Programs from './pages/Programs';
import ExercisePlayer from './pages/ExercisePlayer';
import Inspiration from './pages/Inspiration';
import Music from './pages/Music';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';

const App: React.FC = () => {
    const { isOnboarded, completeOnboarding } = useUser();
    const location = useLocation();

    const handleSkipOnboarding = () => {
        if (import.meta.env.DEV) {
            completeOnboarding();
        }
    };

    const shouldShowNav = () => {
        return isOnboarded &&
            !location.pathname.startsWith('/exercise') &&
            !location.pathname.startsWith('/onboarding');
    };

    return (
        <Routes>
            {!isOnboarded ? (
                <>
                    {import.meta.env.DEV && (
                        <Route
                            path="/dev-skip-onboarding"
                            element={
                                <div className="p-8">
                                    <h1 className="text-2xl font-bold mb-4">Developer Shortcut</h1>
                                    <button
                                        onClick={handleSkipOnboarding}
                                        className="btn btn-primary"
                                    >
                                        Skip Onboarding
                                    </button>
                                </div>
                            }
                        />
                    )}
                    <Route path="/onboarding" element={<Onboarding />} />
                    <Route path="*" element={<Navigate to="/onboarding" replace />} />
                </>
            ) : (
                <Route element={<Layout showNav={shouldShowNav()} />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/today" element={<TodayPractice />} />
                    <Route path="/programs" element={<Programs />} />
                    <Route path="/inspiration" element={<Inspiration />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route
                        path="/exercise/:programId/:dayId/:exerciseId"
                        element={<ExercisePlayer />}
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            )}
        </Routes>
    );
};

export default App;