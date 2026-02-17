// Authentication Service

import { apiClient, type ApiResponse } from "./api";

export interface DriverLoginRequest {
  phone: string;
  pin: string;
}

export interface AdminLoginRequest {
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  role: "driver" | "admin" | "commuter";
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

class AuthService {
  /**
   * Driver login with phone and PIN
   */
  async driverLogin(data: DriverLoginRequest): Promise<ApiResponse<AuthResponse>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<AuthResponse>("/auth/driver/login", data);

    // For now, validate against mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            token: "mock-driver-token",
            userId: "driver-1",
            name: "Driver Name",
            role: "driver",
          },
        });
      }, 500);
    });
  }

  /**
   * Admin login with password
   */
  async adminLogin(data: AdminLoginRequest): Promise<ApiResponse<AuthResponse>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<AuthResponse>("/auth/admin/login", data);

    // For now, validate against mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          data: {
            token: "mock-admin-token",
            userId: "admin-001",
            name: "Admin",
            role: "admin",
          },
        });
      }, 500);
    });
  }

  /**
   * Logout
   */
  async logout(): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post("/auth/logout", {});

    // Clear local session
    sessionStorage.removeItem("driverId");
    sessionStorage.removeItem("adminId");
    apiClient.clearAuthToken();

    return Promise.resolve({
      success: true,
    });
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });

    return Promise.resolve({
      success: true,
      data: {
        token: "mock-refreshed-token",
        userId: "user-id",
        name: "User Name",
        role: "driver",
      },
    });
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<ApiResponse<AuthResponse>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<AuthResponse>("/auth/me");

    return Promise.resolve({
      success: true,
      data: {
        token: "mock-token",
        userId: "user-id",
        name: "User Name",
        role: "driver",
      },
    });
  }
}

export const authService = new AuthService();
