import { useState, useEffect, useCallback } from "react";

/**
 * Hook for managing loading states
 */
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);

  const start = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stop = useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggle = useCallback(() => {
    setIsLoading((prev) => !prev);
  }, []);

  return {
    isLoading,
    setIsLoading,
    start,
    stop,
    toggle,
  };
}

/**
 * Hook for managing network connectivity
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

/**
 * Hook for debouncing loading states
 * Useful to prevent flickering loading spinners on fast requests
 */
export function useDebouncedLoading(isLoading: boolean, delay = 300) {
  const [debouncedIsLoading, setDebouncedIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      // Start loading immediately
      setDebouncedIsLoading(true);
    } else {
      // Delay stopping loading to prevent flicker
      const timeout = setTimeout(() => {
        setDebouncedIsLoading(false);
      }, delay);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, delay]);

  return debouncedIsLoading;
}

/**
 * Hook for managing async operation states
 */
interface AsyncState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export function useAsync<T>(
  asyncFunction: () => Promise<T>,
  immediate = true
) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    isLoading: immediate,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, isLoading: true, error: null });
    try {
      const result = await asyncFunction();
      setState({ data: result, isLoading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      setState({ data: null, isLoading: false, error: err });
      throw err;
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    ...state,
    execute,
  };
}
