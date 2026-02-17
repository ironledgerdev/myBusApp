import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketClient, WebSocketMessage } from '@/lib/websocket';
import { getEnvConfig } from '@/lib/env';

interface UseWebSocketOptions {
  url?: string;
  autoConnect?: boolean;
  onMessage?: (message: WebSocketMessage) => void;
  onConnectionChange?: (connected: boolean) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for managing WebSocket connection lifecycle
 */
export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    url = getEnvConfig().websocketUrl,
    autoConnect = true,
    onMessage,
    onConnectionChange,
    onError,
  } = options;

  const clientRef = useRef<WebSocketClient | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Initialize WebSocket client
  useEffect(() => {
    if (!clientRef.current) {
      clientRef.current = new WebSocketClient({ url });
    }
  }, [url]);

  // Connect to WebSocket
  useEffect(() => {
    if (!autoConnect || !clientRef.current) return;

    const client = clientRef.current;

    // Set up event handlers
    const unsubscribeMessage = client.onMessage((message) => {
      onMessage?.(message);
    });

    const unsubscribeConnection = client.onConnectionChange((isConnected) => {
      setConnected(isConnected);
      onConnectionChange?.(isConnected);
    });

    const unsubscribeError = client.onError((err) => {
      setError(err);
      onError?.(err);
    });

    // Attempt connection
    client.connect().catch((err) => {
      setError(err);
      onError?.(err);
    });

    // Cleanup
    return () => {
      unsubscribeMessage();
      unsubscribeConnection();
      unsubscribeError();
      // Don't disconnect on unmount - let the connection persist across components
    };
  }, [autoConnect, onMessage, onConnectionChange, onError]);

  const send = useCallback((message: WebSocketMessage) => {
    clientRef.current?.send(message);
  }, []);

  const disconnect = useCallback(() => {
    clientRef.current?.disconnect();
  }, []);

  return {
    client: clientRef.current,
    connected,
    error,
    send,
    disconnect,
  };
};

/**
 * Global WebSocket instance for app-wide use
 */
let globalWebSocketClient: WebSocketClient | null = null;

/**
 * Initialize global WebSocket client
 * Note: Connection happens asynchronously in the background
 */
export const initializeGlobalWebSocket = (
  url: string = getEnvConfig().websocketUrl
): WebSocketClient => {
  if (!globalWebSocketClient) {
    globalWebSocketClient = new WebSocketClient({ url });
    // Connect asynchronously without blocking initialization
    globalWebSocketClient.connect().catch((error) => {
      // Silently fail - app will use local simulation
      if (import.meta.env.DEV) {
        console.warn('WebSocket server unavailable, using local simulation:', error.message);
      }
    });
  }
  return globalWebSocketClient;
};

/**
 * Get global WebSocket client (must be initialized first)
 */
export const getGlobalWebSocket = (): WebSocketClient => {
  if (!globalWebSocketClient) {
    throw new Error('Global WebSocket not initialized. Call initializeGlobalWebSocket first.');
  }
  return globalWebSocketClient;
};

/**
 * Disconnect global WebSocket
 */
export const disconnectGlobalWebSocket = () => {
  if (globalWebSocketClient) {
    globalWebSocketClient.disconnect();
    globalWebSocketClient = null;
  }
};

/**
 * Hook for using global WebSocket instance
 */
export const useGlobalWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const client = getGlobalWebSocket();
    setConnected(client.isConnected());

    const unsubscribeConnection = client.onConnectionChange((isConnected) => {
      setConnected(isConnected);
    });

    const unsubscribeError = client.onError((err) => {
      setError(err);
    });

    return () => {
      unsubscribeConnection();
      unsubscribeError();
    };
  }, []);

  const send = useCallback((message: WebSocketMessage) => {
    try {
      getGlobalWebSocket().send(message);
    } catch (error) {
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  }, []);

  return {
    client: getGlobalWebSocket(),
    connected,
    error,
    send,
  };
};
