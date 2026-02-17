import { useGlobalWebSocket } from "@/hooks/useWebSocket";
import { isDevelopment } from "@/lib/env";

/**
 * WebSocket connection status indicator
 * Only visible in development mode
 */
export const WebSocketStatus = () => {
  const { connected, error } = useGlobalWebSocket();

  // Only show in development
  if (!isDevelopment()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 text-xs font-mono z-50">
      <div
        className={`px-3 py-2 rounded border-2 ${
          connected
            ? "border-green-500 bg-green-50 text-green-700"
            : "border-red-500 bg-red-50 text-red-700"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              connected ? "bg-green-500" : "bg-red-500"
            } ${connected ? "animate-pulse" : ""}`}
          />
          <span>WebSocket: {connected ? "Connected" : "Disconnected"}</span>
        </div>
        {error && (
          <div className="text-xs mt-1 opacity-75">
            Error: {error.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default WebSocketStatus;
