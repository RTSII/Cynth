import React, { Suspense, useState } from 'react';

interface LoadingProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<LoadingProps> = ({
    message = 'Loading...',
    size = 'medium'
}) => {
    const spinnerSizes = {
        small: 'w-6 h-6',
        medium: 'w-12 h-12',
        large: 'w-16 h-16'
    };

    return (
        <div
            className="flex flex-col items-center justify-center p-4"
            role="alert"
            aria-busy="true"
            aria-live="polite"
        >
            <div
                className={`${spinnerSizes[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}
                aria-hidden="true"
            />
            {message && (
                <p className="mt-4 text-gray-600 text-center font-medium">
                    {message}
                </p>
            )}
        </div>
    );
};

interface ErrorFallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
    error,
    resetErrorBoundary
}) => (
    <div
        className="p-6 bg-red-50 rounded-lg"
        role="alert"
        aria-live="assertive"
    >
        <h2 className="text-lg font-semibold text-red-700 mb-2">
            Error Loading Content
        </h2>
        <p className="text-red-600 mb-4">
            {error.message}
        </p>
        <button
            onClick={resetErrorBoundary}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
            Try Again
        </button>
    </div>
);

interface SuspendedContentProps {
    children: React.ReactNode;
    loadingMessage?: string;
    loadingSize?: 'small' | 'medium' | 'large';
    fallback?: React.ReactNode;
}

export const SuspendedContent: React.FC<SuspendedContentProps> = ({
    children,
    loadingMessage,
    loadingSize = 'medium',
    fallback
}) => (
    <Suspense
        fallback={
            fallback || <LoadingSpinner message={loadingMessage} size={loadingSize} />
        }
    >
        {children}
    </Suspense>
);

const VideoPlayer: React.FC<{ videoUrl: string }> = ({ videoUrl }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <SuspendedContent
            loadingMessage="Loading video..."
            loadingSize="large"
        >
            <video
                src={videoUrl}
                onLoadStart={() => setIsLoading(true)}
                onLoadedData={() => setIsLoading(false)}
                preload="metadata"
                playsInline
                controls
            >
                <track kind="captions" src={`${videoUrl}/captions.vtt`} />
            </video>
        </SuspendedContent>
    );
};

export { LoadingSpinner, ErrorFallback };
export default VideoPlayer;