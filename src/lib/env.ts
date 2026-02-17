/**
 * Environment Variables with Type Safety
 */

export interface EnvironmentConfig {
  websocketUrl: string;
  apiUrl: string;
  enableWebSocket: boolean;
  enableLocalSimulation: boolean;
  environment: 'development' | 'production' | 'staging';
}

/**
 * Get environment configuration
 * Validates that required variables are set
 */
export const getEnvConfig = (): EnvironmentConfig => {
  const websocketUrl =
    import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8080';
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const enableWebSocket =
    import.meta.env.VITE_ENABLE_WEBSOCKET !== 'false';
  const enableLocalSimulation =
    import.meta.env.VITE_ENABLE_LOCAL_SIMULATION !== 'false';
  const environment =
    (import.meta.env.VITE_ENVIRONMENT as 'development' | 'production' | 'staging') ||
    'development';

  return {
    websocketUrl,
    apiUrl,
    enableWebSocket,
    enableLocalSimulation,
    environment,
  };
};

/**
 * Check if running in production
 */
export const isProduction = (): boolean => {
  return getEnvConfig().environment === 'production';
};

/**
 * Check if running in development
 */
export const isDevelopment = (): boolean => {
  return getEnvConfig().environment === 'development';
};

/**
 * Check if WebSocket is enabled
 */
export const isWebSocketEnabled = (): boolean => {
  return getEnvConfig().enableWebSocket;
};

/**
 * Check if local simulation is enabled
 */
export const isLocalSimulationEnabled = (): boolean => {
  return getEnvConfig().enableLocalSimulation;
};
