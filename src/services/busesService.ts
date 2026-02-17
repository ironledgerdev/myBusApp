// Buses Service

import { apiClient, type ApiResponse } from "./api";
import { buses as mockBuses } from "@/data/mockData";
import type { Bus } from "@/data/mockData";

export interface StartRouteRequest {
  driverId: string;
  busId: string;
  routeId: string;
}

export interface StopRouteRequest {
  busId: string;
}

export interface BusLocationUpdate {
  busId: string;
  lat: number;
  lng: number;
  heading: number;
}

class BusesService {
  /**
   * Get all buses
   */
  async getAllBuses(): Promise<ApiResponse<Bus[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Bus[]>("/buses");

    // Mock data response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockBuses,
        });
      }, 500);
    });
  }

  /**
   * Get single bus by ID
   */
  async getBus(busId: string): Promise<ApiResponse<Bus>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Bus>(`/buses/${busId}`);

    // Mock data response
    return new Promise((resolve) => {
      const bus = mockBuses.find((b) => b.id === busId);
      setTimeout(() => {
        resolve({
          success: true,
          data: bus,
        });
      }, 500);
    });
  }

  /**
   * Get buses by route
   */
  async getBusesByRoute(routeId: string): Promise<ApiResponse<Bus[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Bus[]>(`/buses?routeId=${routeId}`);

    // Mock data response
    return new Promise((resolve) => {
      const routeBuses = mockBuses.filter((b) => b.routeId === routeId);
      setTimeout(() => {
        resolve({
          success: true,
          data: routeBuses,
        });
      }, 500);
    });
  }

  /**
   * Get active buses
   */
  async getActiveBuses(): Promise<ApiResponse<Bus[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Bus[]>("/buses?status=active");

    // Mock data response
    return new Promise((resolve) => {
      const activeBuses = mockBuses.filter((b) => b.status === "active");
      setTimeout(() => {
        resolve({
          success: true,
          data: activeBuses,
        });
      }, 500);
    });
  }

  /**
   * Start a route (driver starts the bus)
   */
  async startRoute(data: StartRouteRequest): Promise<ApiResponse<Bus>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<Bus>("/buses/start-route", data);

    // Mock data response
    return new Promise((resolve) => {
      const bus = mockBuses.find((b) => b.id === data.busId);
      if (bus) {
        const updated = {
          ...bus,
          status: "active" as const,
        };
        setTimeout(() => {
          resolve({
            success: true,
            data: updated,
          });
        }, 500);
      } else {
        resolve({
          success: false,
          error: "Bus not found",
        });
      }
    });
  }

  /**
   * Stop a route (driver stops the bus)
   */
  async stopRoute(data: StopRouteRequest): Promise<ApiResponse<Bus>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<Bus>("/buses/stop-route", data);

    // Mock data response
    return new Promise((resolve) => {
      const bus = mockBuses.find((b) => b.id === data.busId);
      if (bus) {
        const updated = {
          ...bus,
          status: "idle" as const,
        };
        setTimeout(() => {
          resolve({
            success: true,
            data: updated,
          });
        }, 500);
      } else {
        resolve({
          success: false,
          error: "Bus not found",
        });
      }
    });
  }

  /**
   * Update bus location
   */
  async updateLocation(data: BusLocationUpdate): Promise<ApiResponse<Bus>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<Bus>("/buses/location", data);

    // Mock data response
    return new Promise((resolve) => {
      const bus = mockBuses.find((b) => b.id === data.busId);
      if (bus) {
        const updated = {
          ...bus,
          lat: data.lat,
          lng: data.lng,
          heading: data.heading,
        };
        setTimeout(() => {
          resolve({
            success: true,
            data: updated,
          });
        }, 500);
      } else {
        resolve({
          success: false,
          error: "Bus not found",
        });
      }
    });
  }

  /**
   * Get bus statistics
   */
  async getBusStats(): Promise<ApiResponse<{ totalBuses: number; activeBuses: number; idleBuses: number }>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get("/buses/stats");

    // Mock data response
    return new Promise((resolve) => {
      const totalBuses = mockBuses.length;
      const activeBuses = mockBuses.filter((b) => b.status === "active").length;
      const idleBuses = mockBuses.filter((b) => b.status === "idle").length;

      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalBuses,
            activeBuses,
            idleBuses,
          },
        });
      }, 500);
    });
  }
}

export const busesService = new BusesService();
