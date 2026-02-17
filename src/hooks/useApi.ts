// Custom hook for API calls with loading and error handling

import { useState, useCallback } from "react";
import type { ApiError, ApiResponse } from "@/services/api";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

/**
 * Custom hook for managing API calls with loading and error states
 * 
 * @example
 * const { data, loading, error, execute } = useApi<DriverType>(driversService.getAllDrivers);
 * 
 * const handleFetch = async () => {
 *   await execute();
 * };
 */
export function useApi<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options?: UseApiOptions
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });

    try {
      const response = await apiFunction();

      if (response.success && response.data) {
        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        options?.onSuccess?.(response.data);
        return response.data;
      } else {
        const error: ApiError = {
          message: response.error || "An error occurred",
        };

        setState({
          data: null,
          loading: false,
          error,
        });

        options?.onError?.(error);
        throw error;
      }
    } catch (err: any) {
      const error: ApiError = {
        message: err.message || "An unexpected error occurred",
        status: err.status,
        data: err.data,
      };

      setState({
        data: null,
        loading: false,
        error,
      });

      options?.onError?.(error);
      throw error;
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}

/**
 * Custom hook for managing async API calls with automatic execution
 * 
 * @example
 * const { data, loading, error } = useApiQuery<DriverType>(driversService.getAllDrivers);
 */
export function useApiQuery<T>(
  apiFunction: () => Promise<ApiResponse<T>>,
  options?: UseApiOptions
) {
  const { data, loading, error, execute } = useApi(apiFunction, options);

  // Execute on mount
  const [hasExecuted, setHasExecuted] = useState(false);
  if (!hasExecuted && !loading) {
    execute().then(() => setHasExecuted(true)).catch(() => setHasExecuted(true));
  }

  return {
    data,
    loading,
    error,
    refetch: execute,
  };
}

/**
 * Custom hook for managing API mutations with loading and error states
 * 
 * @example
 * const { loading, error, execute: createDriver } = useApiMutation(
 *   (data) => driversService.createDriver(data)
 * );
 */
export function useApiMutation<T, Variables = any>(
  apiFunction: (variables: Variables) => Promise<ApiResponse<T>>,
  options?: UseApiOptions
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (variables: Variables) => {
      setState({ data: null, loading: true, error: null });

      try {
        const response = await apiFunction(variables);

        if (response.success && response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });

          options?.onSuccess?.(response.data);
          return response.data;
        } else {
          const error: ApiError = {
            message: response.error || "An error occurred",
          };

          setState({
            data: null,
            loading: false,
            error,
          });

          options?.onError?.(error);
          throw error;
        }
      } catch (err: any) {
        const error: ApiError = {
          message: err.message || "An unexpected error occurred",
          status: err.status,
          data: err.data,
        };

        setState({
          data: null,
          loading: false,
          error,
        });

        options?.onError?.(error);
        throw error;
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    data: state.data,
    loading: state.loading,
    error: state.error,
    execute,
    reset,
  };
}
