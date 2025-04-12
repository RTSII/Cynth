import React, { Suspense, ComponentType } from 'react';
import { LoadingSpinner } from '../components/language-loading';
import { ErrorBoundary } from '../components/error-boundaries';

interface LazyLoadConfig {
    fallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
    minDelay?: number;
}

// Add minimum delay to avoid loading flash
const withMinDelay = (promise: Promise<any>, delay: number) => {
    return Promise.all([
        promise,
        new Promise(resolve => setTimeout(resolve, delay))
    ]).then(([result]) => result);
};

// Wrap component with Suspense and ErrorBoundary
export function withSuspense<T extends ComponentType<any>>(
    Component: T,
    config: LazyLoadConfig = {}
) {
    const {
        fallback = <LoadingSpinner size="medium" />,
    errorFallback,
        minDelay = 300
} = config;

return function WrappedComponent(props: React.ComponentProps<T>) {
    return (
        <ErrorBoundary fallback= { errorFallback } >
        <Suspense fallback={ fallback }>
            <Component { ...props } />
            </Suspense>
            </ErrorBoundary>
        );
};
}

// Create lazy loaded component with minimum delay
export function lazyLoad(
    factory: () => Promise<{ default: ComponentType<any> }>,
    config: LazyLoadConfig = {}
) {
    const { minDelay = 300 } = config;
    const LazyComponent = React.lazy(() => withMinDelay(factory(), minDelay));
    return withSuspense(LazyComponent, config);
}

// Preload component
export function preloadComponent(
    factory: () => Promise<{ default: ComponentType<any> }>
) {
    const Component = React.lazy(factory);
    Component.preload = factory;
    return Component;
}

// Route-based code splitting helper
export function createRouteSplitting(routes: Record<string, () => Promise<{ default: ComponentType<any> }>>) {
    const components: Record<string, ReturnType<typeof preloadComponent>> = {};

    // Create preloadable components
    Object.entries(routes).forEach(([key, factory]) => {
        components[key] = preloadComponent(factory);
    });

    // Preload specific route
    const preloadRoute = (routeName: keyof typeof routes) => {
        const component = components[routeName];
        if (component?.preload) {
            component.preload();
        }
    };

    // Preload adjacent routes
    const preloadAdjacent = (currentRoute: keyof typeof routes) => {
        const routes = Object.keys(components);
        const currentIndex = routes.indexOf(currentRoute as string);

        // Preload next and previous routes if they exist
        if (currentIndex > 0) {
            preloadRoute(routes[currentIndex - 1] as keyof typeof routes);
        }
        if (currentIndex < routes.length - 1) {
            preloadRoute(routes[currentIndex + 1] as keyof typeof routes);
        }
    };

    return {
        components,
        preloadRoute,
        preloadAdjacent
    };
}