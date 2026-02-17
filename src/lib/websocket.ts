/**
 * WebSocket Client for Real-time Bus Tracking
 * Handles connection, reconnection, and message handling
 */

export type WebSocketMessage = 
  | BusLocationUpdate
  | BusStatusChange
  | RouteStarted
  | RouteStopped
  | ConnectionAck
  | DriverAuthenticated
  | ErrorMessage;

export interface BusLocationUpdate {
  type: 'BUS_LOCATION_UPDATE';
  busId: string;
  lat: number;
  lng: number;
  heading: number;
  currentStopIndex: number;
  progressToNextStop: number;
  nextStop?: {
    id: string;
    name: string;
    eta: number;
  };
  timestamp: number;
}

export interface BusStatusChange {
  type: 'BUS_STATUS_CHANGE';
  busId: string;
  status: 'active' | 'idle' | 'completed';
  routeId?: string;
  driverId?: string;
  timestamp: number;
}

export interface RouteStarted {
  type: 'ROUTE_STARTED';
  busId: string;
  routeId: string;
  driverId: string;
  timestamp: number;
}

export interface RouteStopped {
  type: 'ROUTE_STOPPED';
  busId: string;
  routeId: string;
  reason?: string;
  timestamp: number;
}

export interface ConnectionAck {
  type: 'CONNECTION_ACK';
  clientId: string;
  timestamp: number;
}

export interface DriverAuthenticated {
  type: 'DRIVER_AUTHENTICATED';
  driverId: string;
  busId: string;
  timestamp: number;
}

export interface ErrorMessage {
  type: 'ERROR';
  code: string;
  message: string;
  timestamp: number;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  reconnectBackoffMultiplier?: number;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = (connected: boolean) => void;
type ErrorHandler = (error: Error) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectBackoffMultiplier: number;
  private reconnectAttempts: number = 0;
  private reconnectTimeoutId: NodeJS.Timeout | null = null;
  private messageHandlers = new Set<MessageHandler>();
  private connectionHandlers = new Set<ConnectionHandler>();
  private errorHandlers = new Set<ErrorHandler>();
  private messageQueue: WebSocketMessage[] = [];
  private clientId: string;
  private isManuallyClosed: boolean = false;
  private resolveConnect: (() => void) | null = null;

  constructor(config: WebSocketConfig) {
    this.url = config.url;
    this.reconnectInterval = config.reconnectInterval || 1000;
    this.maxReconnectAttempts = config.maxReconnectAttempts || 10;
    this.reconnectBackoffMultiplier = config.reconnectBackoffMultiplier || 1.5;
    this.clientId = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.isManuallyClosed = false;
        this.resolveConnect = resolve;
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers(true);
          this.flushMessageQueue();
          if (this.resolveConnect) {
            this.resolveConnect();
            this.resolveConnect = null;
          }
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.notifyMessageHandlers(message);
          } catch (error) {
            this.notifyErrorHandlers(new Error(`Failed to parse message: ${event.data}`));
          }
        };

        this.ws.onerror = (event) => {
          const error = new Error('WebSocket connection failed');
          this.notifyErrorHandlers(error);
          // Error is handled by onclose, don't reject here
        };

        this.ws.onclose = () => {
          this.notifyConnectionHandlers(false);
          if (!this.isManuallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
            // Attempt reconnection
            this.attemptReconnect();
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.isManuallyClosed = true;
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.notifyConnectionHandlers(false);
  }

  /**
   * Send message to server
   */
  public send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message));
      } catch (error) {
        this.notifyErrorHandlers(new Error(`Failed to send message: ${error}`));
        this.messageQueue.push(message);
      }
    } else {
      // Queue message if not connected
      this.messageQueue.push(message);
    }
  }

  /**
   * Subscribe to messages
   */
  public onMessage(handler: MessageHandler): () => void {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to connection status changes
   */
  public onConnectionChange(handler: ConnectionHandler): () => void {
    this.connectionHandlers.add(handler);
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to errors
   */
  public onError(handler: ErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  /**
   * Get connection status
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get client ID
   */
  public getClientId(): string {
    return this.clientId;
  }

  /**
   * Authenticate driver connection
   */
  public authenticateDriver(driverId: string, busId: string): void {
    this.send({
      type: 'DRIVER_AUTHENTICATED',
      driverId,
      busId,
      timestamp: Date.now(),
    });
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.notifyErrorHandlers(
        new Error(
          `Failed to reconnect after ${this.maxReconnectAttempts} attempts`
        )
      );
      return;
    }

    const delay =
      this.reconnectInterval *
      Math.pow(this.reconnectBackoffMultiplier, this.reconnectAttempts);
    this.reconnectAttempts++;

    this.reconnectTimeoutId = setTimeout(() => {
      this.connect().catch((error) => {
        this.notifyErrorHandlers(error);
      });
    }, delay);
  }

  /**
   * Flush queued messages
   */
  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  /**
   * Notify all message handlers
   */
  private notifyMessageHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => {
      try {
        handler(message);
      } catch (error) {
        this.notifyErrorHandlers(
          new Error(`Error in message handler: ${error}`)
        );
      }
    });
  }

  /**
   * Notify all connection handlers
   */
  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => {
      try {
        handler(connected);
      } catch (error) {
        this.notifyErrorHandlers(
          new Error(`Error in connection handler: ${error}`)
        );
      }
    });
  }

  /**
   * Notify all error handlers
   */
  private notifyErrorHandlers(error: Error): void {
    this.errorHandlers.forEach((handler) => {
      try {
        handler(error);
      } catch (innerError) {
        console.error('Error in error handler:', innerError);
      }
    });
  }
}

/**
 * Create a WebSocket client instance
 */
export const createWebSocketClient = (url: string): WebSocketClient => {
  return new WebSocketClient({ url });
};
