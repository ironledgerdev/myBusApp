// Drivers Service

import { apiClient, type ApiResponse } from "./api";
import { drivers as mockDrivers } from "@/data/mockData";
import type { Driver } from "@/data/mockData";

export interface CreateDriverRequest {
  name: string;
  phone: string;
  pin: string;
  routeId?: string;
}

export interface UpdateDriverRequest {
  name?: string;
  phone?: string;
  pin?: string;
  routeId?: string;
}

export interface InviteDriverRequest {
  phone: string;
  pin: string;
}

class DriversService {
  /**
   * Get all drivers
   */
  async getAllDrivers(): Promise<ApiResponse<Driver[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Driver[]>("/drivers");

    // Mock data response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: mockDrivers,
        });
      }, 500);
    });
  }

  /**
   * Get single driver by ID
   */
  async getDriver(driverId: string): Promise<ApiResponse<Driver>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<Driver>(`/drivers/${driverId}`);

    // Mock data response
    return new Promise((resolve) => {
      const driver = mockDrivers.find((d) => d.id === driverId);
      setTimeout(() => {
        resolve({
          success: true,
          data: driver,
        });
      }, 500);
    });
  }

  /**
   * Create new driver
   */
  async createDriver(data: CreateDriverRequest): Promise<ApiResponse<Driver>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<Driver>("/drivers", data);

    // Mock data response
    return new Promise((resolve) => {
      const newDriver: Driver = {
        id: `driver-${Date.now()}`,
        name: data.name,
        phone: data.phone,
        pin: data.pin,
        routeId: data.routeId || null,
        status: "active",
        tripHistory: [],
      };

      setTimeout(() => {
        resolve({
          success: true,
          data: newDriver,
        });
      }, 500);
    });
  }

  /**
   * Update driver
   */
  async updateDriver(driverId: string, data: UpdateDriverRequest): Promise<ApiResponse<Driver>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.put<Driver>(`/drivers/${driverId}`, data);

    // Mock data response
    return new Promise((resolve) => {
      const driver = mockDrivers.find((d) => d.id === driverId);
      if (driver) {
        const updated = {
          ...driver,
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
          error: "Driver not found",
        });
      }
    });
  }

  /**
   * Delete driver
   */
  async deleteDriver(driverId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.delete(`/drivers/${driverId}`);

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
   * Invite driver by phone
   */
  async inviteDriver(data: InviteDriverRequest): Promise<ApiResponse<Driver>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<Driver>("/drivers/invite", data);

    // Mock data response
    return new Promise((resolve) => {
      const newDriver: Driver = {
        id: `driver-${Date.now()}`,
        name: "New Driver",
        phone: data.phone,
        pin: data.pin,
        routeId: null,
        status: "active",
        tripHistory: [],
      };

      setTimeout(() => {
        resolve({
          success: true,
          data: newDriver,
          message: `Invitation sent to ${data.phone}`,
        });
      }, 500);
    });
  }

  /**
   * Get driver statistics
   */
  async getDriverStats(): Promise<ApiResponse<{ totalDrivers: number; activeDrivers: number }>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get("/drivers/stats");

    // Mock data response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            totalDrivers: mockDrivers.length,
            activeDrivers: mockDrivers.filter((d) => d.status === "active").length,
          },
        });
      }, 500);
    });
  }
}

export const driversService = new DriversService();
