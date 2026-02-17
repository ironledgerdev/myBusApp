import { useState, useEffect, useCallback, useRef } from "react";
import { buses as initialBuses, routes as routeData } from "@/data/mockData";
import type { Bus } from "@/data/mockData";
import { getGlobalWebSocket } from "./useWebSocket";
import type { BusLocationUpdate } from "@/lib/websocket";

interface BusWithETA extends Bus {
  nextStop?: {
    id: string;
    name: string;
    eta: number; // ETA in seconds
  };
  currentStopIndex?: number;
  progressToNextStop?: number; // 0 to 1
}

interface RealtimeBusState {
  buses: BusWithETA[];
  activeBuses: Set<string>;
}

// Global state for real-time bus tracking
let realtimeBusState: RealtimeBusState = {
  buses: [...initialBuses],
  activeBuses: new Set(),
};

// Listeners for bus updates
const updateListeners = new Set<(buses: Bus[]) => void>();

// Flag to control whether to use WebSocket or local simulation
let useWebSocketMode = false;

export const enableWebSocketMode = () => {
  useWebSocketMode = true;
};

export const disableWebSocketMode = () => {
  useWebSocketMode = false;
};

export const notifyBusUpdate = (buses: Bus[]) => {
  updateListeners.forEach((listener) => listener(buses));
};

export const subscribeToBusUpdates = (listener: (buses: Bus[]) => void) => {
  updateListeners.add(listener);
  return () => {
    updateListeners.delete(listener);
  };
};

export const startBusRoute = (driverId: string, busId: string, routeId: string) => {
  const bus = realtimeBusState.buses.find((b) => b.id === busId);
  if (bus) {
    bus.status = "active";
    realtimeBusState.activeBuses.add(busId);
    notifyBusUpdate([...realtimeBusState.buses]);

    // Send WebSocket authentication if enabled
    if (useWebSocketMode) {
      try {
        const wsClient = getGlobalWebSocket();
        if (wsClient.isConnected()) {
          wsClient.authenticateDriver(driverId, busId);
        }
      } catch (error) {
        console.warn('WebSocket not available, falling back to local simulation:', error);
        // Fall through to local simulation
      }
    }

    // Start simulating GPS updates (fallback or concurrent with WebSocket)
    simulateGPSTracking(busId, routeId);
  }
};

export const stopBusRoute = (busId: string) => {
  const bus = realtimeBusState.buses.find((b) => b.id === busId);
  if (bus) {
    bus.status = "idle";
    realtimeBusState.activeBuses.delete(busId);
    notifyBusUpdate([...realtimeBusState.buses]);
  }
};

interface GPSSimulation {
  stopIndex: number;
  progress: number;
  intervalId: NodeJS.Timeout | null;
}

const gpsSimulations = new Map<string, GPSSimulation>();

const calculateHeading = (from: [number, number], to: [number, number]) => {
  const lat1 = (from[0] * Math.PI) / 180;
  const lat2 = (to[0] * Math.PI) / 180;
  const dLng = ((to[1] - from[1]) * Math.PI) / 180;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  const heading = (Math.atan2(y, x) * 180) / Math.PI;

  return (heading + 360) % 360;
};

const interpolatePosition = (
  from: [number, number],
  to: [number, number],
  progress: number
): [number, number] => {
  return [
    from[0] + (to[0] - from[0]) * progress,
    from[1] + (to[1] - from[1]) * progress,
  ];
};

const simulateGPSTracking = (busId: string, routeId: string) => {
  const route = routeData.find((r) => r.id === routeId);
  if (!route) return;

  // Stop any existing simulation
  const existing = gpsSimulations.get(busId);
  if (existing?.intervalId) {
    clearInterval(existing.intervalId);
  }

  const simulation: GPSSimulation = {
    stopIndex: 0,
    progress: 0,
    intervalId: null,
  };

  const calculateETA = (stopIndex: number, progress: number): { name: string; eta: number } | null => {
    const stops = route.stops;
    if (stopIndex >= stops.length - 1) {
      return null;
    }

    const nextStop = stops[stopIndex + 1];
    // Each segment takes ~2 seconds in simulation (20 updates * 100ms with 0.05 increment)
    // Remaining time for current segment = (1 - progress) * 2 seconds
    const remainingForCurrentSegment = (1 - progress) * 2;

    // Time for remaining segments = (stops.length - stopIndex - 2) * 2 seconds
    const remainingSegments = stops.length - stopIndex - 2;
    const timeForRemainingSegments = remainingSegments * 2;

    const totalETA = Math.ceil(remainingForCurrentSegment + timeForRemainingSegments);

    return {
      name: nextStop.name,
      eta: Math.max(0, totalETA),
    };
  };

  const updatePosition = () => {
    const bus = realtimeBusState.buses.find((b) => b.id === busId) as BusWithETA | undefined;
    if (!bus || !realtimeBusState.activeBuses.has(busId)) {
      if (simulation.intervalId) clearInterval(simulation.intervalId);
      gpsSimulations.delete(busId);
      return;
    }

    const stops = route.stops;
    if (simulation.stopIndex >= stops.length - 1) {
      // Route complete
      stopBusRoute(busId);
      if (simulation.intervalId) clearInterval(simulation.intervalId);
      gpsSimulations.delete(busId);
      return;
    }

    const currentStop = stops[simulation.stopIndex];
    const nextStop = stops[simulation.stopIndex + 1];

    // Simulate movement between stops (takes about 30 seconds per segment in simulation)
    simulation.progress += 0.05; // This completes a segment in ~20 updates (2 seconds)

    // Calculate and store ETA
    const etaInfo = calculateETA(simulation.stopIndex, simulation.progress);
    if (etaInfo) {
      bus.nextStop = {
        id: nextStop.id,
        name: etaInfo.name,
        eta: etaInfo.eta,
      };
    }
    bus.currentStopIndex = simulation.stopIndex;
    bus.progressToNextStop = simulation.progress;

    if (simulation.progress >= 1) {
      // Move to next stop
      simulation.stopIndex++;
      simulation.progress = 0;

      if (simulation.stopIndex >= stops.length - 1) {
        // Route complete
        const finalStop = stops[stops.length - 1];
        bus.lat = finalStop.lat;
        bus.lng = finalStop.lng;
        bus.nextStop = undefined;
        stopBusRoute(busId);
        if (simulation.intervalId) clearInterval(simulation.intervalId);
        gpsSimulations.delete(busId);
        notifyBusUpdate([...realtimeBusState.buses]);
        return;
      }

      const nextNextStop = stops[simulation.stopIndex + 1];
      const heading = calculateHeading(
        [stops[simulation.stopIndex].lat, stops[simulation.stopIndex].lng],
        [nextNextStop.lat, nextNextStop.lng]
      );
      bus.heading = heading;
    } else {
      // Interpolate position between stops
      const [interpLat, interpLng] = interpolatePosition(
        [currentStop.lat, currentStop.lng],
        [nextStop.lat, nextStop.lng],
        simulation.progress
      );
      bus.lat = interpLat;
      bus.lng = interpLng;

      // Update heading
      const heading = calculateHeading(
        [currentStop.lat, currentStop.lng],
        [nextStop.lat, nextStop.lng]
      );
      bus.heading = heading;
    }

    notifyBusUpdate([...realtimeBusState.buses]);
  };

  // Update position every 100ms (10 updates per second)
  simulation.intervalId = setInterval(updatePosition, 100);
  gpsSimulations.set(busId, simulation);
};

export const updateBusLocation = (
  busId: string,
  location: { lat: number; lng: number; heading: number; speed?: number }
) => {
  const bus = realtimeBusState.buses.find((b) => b.id === busId);
  if (bus && bus.status === "active") {
    bus.lat = location.lat;
    bus.lng = location.lng;
    bus.heading = location.heading;
    
    notifyBusUpdate([...realtimeBusState.buses]);

    // Send to WebSocket if enabled
    if (useWebSocketMode) {
      try {
        const wsClient = getGlobalWebSocket();
        if (wsClient.isConnected()) {
          wsClient.send({
            type: 'BUS_LOCATION_UPDATE',
            busId,
            lat: location.lat,
            lng: location.lng,
            heading: location.heading,
            currentStopIndex: bus.currentStopIndex || 0,
            progressToNextStop: bus.progressToNextStop || 0,
            timestamp: Date.now(),
          });
        }
      } catch (error) {
        // Silent fail
      }
    }
  }
};

export const useRealtimeBus = () => {
  const [buses, setBuses] = useState<BusWithETA[]>([...realtimeBusState.buses]);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const wsUnsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Subscribe to local bus updates
    unsubscribeRef.current = subscribeToBusUpdates((updatedBuses) => {
      setBuses([...updatedBuses]);
    });

    // Subscribe to WebSocket messages if enabled
    if (useWebSocketMode) {
      try {
        const wsClient = getGlobalWebSocket();
        wsUnsubscribeRef.current = wsClient.onMessage((message) => {
          if (message.type === 'BUS_LOCATION_UPDATE') {
            const locationUpdate = message as BusLocationUpdate;
            // Only update if it's NOT the current driver's bus (to avoid jitter)
            // But here we are just updating the global state, so it's fine.
            const bus = realtimeBusState.buses.find((b) => b.id === locationUpdate.busId) as BusWithETA | undefined;
            if (bus) {
              bus.lat = locationUpdate.lat;
              bus.lng = locationUpdate.lng;
              bus.heading = locationUpdate.heading;
              bus.currentStopIndex = locationUpdate.currentStopIndex;
              bus.progressToNextStop = locationUpdate.progressToNextStop;
              if (locationUpdate.nextStop) {
                bus.nextStop = {
                  id: locationUpdate.nextStop.id,
                  name: locationUpdate.nextStop.name,
                  eta: locationUpdate.nextStop.eta,
                };
              }
              notifyBusUpdate([...realtimeBusState.buses]);
            }
          } else if (message.type === 'BUS_STATUS_CHANGE') {
            const statusChange = message;
            const bus = realtimeBusState.buses.find((b) => b.id === statusChange.busId);
            if (bus) {
              bus.status = statusChange.status;
              notifyBusUpdate([...realtimeBusState.buses]);
            }
          }
        });
      } catch (error) {
        console.warn('Failed to subscribe to WebSocket messages:', error);
      }
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (wsUnsubscribeRef.current) {
        wsUnsubscribeRef.current();
      }
    };
  }, []);

  return {
    buses,
    activeBuses: realtimeBusState.activeBuses,
    startRoute: startBusRoute,
    stopRoute: stopBusRoute,
    updateLocation: updateBusLocation,
  };
};
