import React, { Component, ErrorInfo, ReactNode } from 'react';
import { reportError } from '../utils/analytics';
import { useUser } from '../contexts/UserContext';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

// Error boundary wrapper with user context
const ErrorBoundaryWithUser: React.FC<Props> = ({ children, fallback }) => {
    const { userProfile } = useUser();
    return (
        <ErrorBoundaryInternal fallback={fallback} userId={userProfile?.id}>
            {children}
        </ErrorBoundaryInternal>
    );
};

class ErrorBoundaryInternal extends Component<Props & { userId?: string }, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        reportError(error, {
            componentStack: errorInfo.componentStack,
            userId: this.props.userId
        }, this.props.userId);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    public render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div
                    className="min-h-[200px] flex items-center justify-center p-6"
                    role="alert"
                    aria-live="assertive"
                >
                    <div className="text-center">
                        <div className="w-12 h-12 text-warning-500 mx-auto mb-4" aria-hidden="true">
                            ⚠️
                        </div>
                        <h2 className="text-xl font-semibold mb-2">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button
                            onClick={this.handleReset}
                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundaryWithUser;