import { useNavigate, useLocation, useParams } from 'react-router-dom';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  ExercisePlayer: {
    exerciseId: string;
    programId: string;
    dayId: string;
  };
};

export type TabParamList = {
  Home: undefined;
  Today: undefined;
  Programs: undefined;
  Inspiration: undefined;
  Music: undefined;
  Settings: undefined;
};

// Define all possible route parameters
export interface RouteParams {
  programId: string;
  dayId: string;
  exerciseId: string;
}

// Define all possible route paths
export type RoutePath =
  | '/'
  | '/onboarding'
  | '/today'
  | '/programs'
  | '/inspiration'
  | '/music'
  | '/settings'
  | '/exercise/:programId/:dayId/:exerciseId';

// Type-safe navigation functions
export function useTypedNavigate() {
  const navigate = useNavigate();

  return {
    toHome: () => navigate('/'),
    toOnboarding: () => navigate('/onboarding'),
    toToday: () => navigate('/today'),
    toPrograms: () => navigate('/programs'),
    toInspiration: () => navigate('/inspiration'),
    toMusic: () => navigate('/music'),
    toSettings: () => navigate('/settings'),
    toExercise: (params: RouteParams) =>
      navigate(`/exercise/${params.programId}/${params.dayId}/${params.exerciseId}`),
  };
}

// Type-safe params hook
export function useTypedParams<T extends keyof RouteParams>() {
  return useParams<Record<T, string>>();
}

// Type-safe location state
export interface LocationState {
  from?: RoutePath;
}

export function useTypedLocation() {
  return useLocation() as { state: LocationState };
}
