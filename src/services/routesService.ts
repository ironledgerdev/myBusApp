// Routes Service

import { apiClient, type ApiResponse } from "./api";
import { routes as mockRoutes } from "@/data/mockData";
import type { Route, Stop } from "@/data/mockData";

export interface CreateRouteRequest {
  name: string;
  from: string;
  to: string;
  busNumber: string;
  busName: string;
  estimatedDuration: string;
  color: string;
  stops?: Stop[];
}

export interface UpdateRouteRequest {
  name?: string;
  from?: string;
  to?: string;
  busNumber?: string;
  busName?: string;
  estimatedDuration?: string;
  color?: string;
}

export interface AddStopRequest {
  name: string;
  lat: number;
  lng: number;
}

class RoutesService {
  /**
   * Get all routes
   */
  async getAllRoutes(): Promise<ApiResponse<Route[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Route[]>("/routes");

    // Mock data response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockRoutes,
        });
      }, 500);
    });
  }

  /**
   * Get single route by ID
   */
  async getRoute(routeId: string): Promise<ApiResponse<Route>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Route>(`/routes/${routeId}`);

    // Mock data response
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId);
      setTimeout(() => {
        resolve({
          success: true,
          data: route,
        });
      }, 500);
    });
  }

  /**
   * Create new route
   */
  async createRoute(data: CreateRouteRequest): Promise<ApiResponse<Route>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<Route>("/routes", data);

    // Mock data response
    return new Promise((resolve) => {
      const newRoute: Route = {
        id: `route-${Date.now()}`,
        name: data.name,
        from: data.from,
        to: data.to,
        busNumber: data.busNumber,
        busName: data.busName,
        estimatedDuration: data.estimatedDuration,
        color: data.color,
        stops: data.stops || [
          { id: "s1", name: data.from, lat: -26.2285, lng: 27.8965 },
          { id: "s2", name: data.to, lat: -26.2041, lng: 28.0473 },
        ],
      };

      setTimeout(() => {
        resolve({
          success: true,
          data: newRoute,
        });
      }, 500);
    });
  }

  /**
   * Update route
   */
  async updateRoute(routeId: string, data: UpdateRouteRequest): Promise<ApiResponse<Route>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.put<Route>(`/routes/${routeId}`, data);

    // Mock data response
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId);
      if (route) {
        const updated = {
          ...route,
          ...data,
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
          error: "Route not found",
        });
      }
    });
  }

  /**
   * Delete route
   */
  async deleteRoute(routeId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.delete(`/routes/${routeId}`);

    // Mock data response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
        });
      }, 500);
    });
  }

  /**
   * Add stop to route
   */
  async addStop(routeId: string, data: AddStopRequest): Promise<ApiResponse<Route>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<Route>(`/routes/${routeId}/stops`, data);

    // Mock data response
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId);
      if (route) {
        const newStop: Stop = {
          id: `s${route.stops.length + 1}`,
          name: data.name,
          lat: data.lat,
          lng: data.lng,
        };
        const updated = {
          ...route,
          stops: [...route.stops, newStop],
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
          error: "Route not found",
        });
      }
    });
  }

  /**
   * Delete stop from route
   */
  async deleteStop(routeId: string, stopId: string): Promise<ApiResponse<Route>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.delete(`/routes/${routeId}/stops/${stopId}`);

    // Mock data response
    return new Promise((resolve) => {
      const route = mockRoutes.find((r) => r.id === routeId);
      if (route) {
        const updated = {
          ...route,
          stops: route.stops.filter((s) => s.id !== stopId),
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
          error: "Route not found",
        });
      }
    });
  }

  /**
   * Get route statistics
   */
  async getRouteStats(): Promise<ApiResponse<{ totalRoutes: number; activeRoutes: number }>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get("/routes/stats");

    // Mock data response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalRoutes: mockRoutes.length,
            activeRoutes: mockRoutes.length,
          },
        });
      }, 500);
    });
  }
}

export const routesService = new RoutesService();
