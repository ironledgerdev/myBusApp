// Commuter Service

import { apiClient, type ApiResponse } from "./api";

export interface FavoriteRoute {
  routeId: string;
  addedAt: string;
  label?: string;
}

export interface ArrivalAlert {
  id: string;
  routeId: string;
  stopId: string;
  stopName: string;
  minutesBefore: number; // Alert X minutes before arrival
  enabled: boolean;
  createdAt: string;
}

export interface TripHistory {
  id: string;
  routeId: string;
  routeName: string;
  boardedAt: string;
  alightedAt?: string;
  duration?: string;
}

export interface BusRating {
  id: string;
  busId: string;
  rating: number; // 1-5
  comment?: string;
  categories: {
    cleanliness: number;
    comfort: number;
    timeliness: number;
    driverBehavior: number;
  };
  createdAt: string;
}

class CommuterService {
  /**
   * Get favorite routes for commuter
   */
  async getFavoriteRoutes(commuteId: string): Promise<ApiResponse<FavoriteRoute[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<FavoriteRoute[]>(`/commuters/${commuteId}/favorites`);

    // Mock data response
    return new Promise((resolve) => {
      const favorites = localStorage.getItem(`favorites-${commuteId}`) || "[]";
      setTimeout(() => {
        resolve({
          success: true,
          data: JSON.parse(favorites),
        });
      }, 300);
    });
  }

  /**
   * Add route to favorites
   */
  async addFavoriteRoute(
    commuteId: string,
    routeId: string,
    label?: string
  ): Promise<ApiResponse<FavoriteRoute>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post(`/commuters/${commuteId}/favorites`, { routeId, label });

    // Mock data response
    return new Promise((resolve) => {
      const favorites = JSON.parse(localStorage.getItem(`favorites-${commuteId}`) || "[]");
      const newFavorite: FavoriteRoute = {
        routeId,
        addedAt: new Date().toISOString(),
        label,
      };
      favorites.push(newFavorite);
      localStorage.setItem(`favorites-${commuteId}`, JSON.stringify(favorites));

      setTimeout(() => {
        resolve({
          success: true,
          data: newFavorite,
        });
      }, 300);
    });
  }

  /**
   * Remove route from favorites
   */
  async removeFavoriteRoute(commuteId: string, routeId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.delete(`/commuters/${commuteId}/favorites/${routeId}`);

    // Mock data response
    return new Promise((resolve) => {
      const favorites = JSON.parse(localStorage.getItem(`favorites-${commuteId}`) || "[]");
      const updated = favorites.filter((f: FavoriteRoute) => f.routeId !== routeId);
      localStorage.setItem(`favorites-${commuteId}`, JSON.stringify(updated));

      setTimeout(() => {
        resolve({
          success: true,
        });
      }, 300);
    });
  }

  /**
   * Get arrival alerts for commuter
   */
  async getArrivalAlerts(commuteId: string): Promise<ApiResponse<ArrivalAlert[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<ArrivalAlert[]>(`/commuters/${commuteId}/alerts`);

    // Mock data response
    return new Promise((resolve) => {
      const alerts = localStorage.getItem(`alerts-${commuteId}`) || "[]";
      setTimeout(() => {
        resolve({
          success: true,
          data: JSON.parse(alerts),
        });
      }, 300);
    });
  }

  /**
   * Create arrival alert
   */
  async createArrivalAlert(
    commuteId: string,
    data: Omit<ArrivalAlert, "id" | "createdAt">
  ): Promise<ApiResponse<ArrivalAlert>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post(`/commuters/${commuteId}/alerts`, data);

    // Mock data response
    return new Promise((resolve) => {
      const alerts = JSON.parse(localStorage.getItem(`alerts-${commuteId}`) || "[]");
      const newAlert: ArrivalAlert = {
        id: `alert-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      alerts.push(newAlert);
      localStorage.setItem(`alerts-${commuteId}`, JSON.stringify(alerts));

      setTimeout(() => {
        resolve({
          success: true,
          data: newAlert,
        });
      }, 300);
    });
  }

  /**
   * Update arrival alert
   */
  async updateArrivalAlert(
    commuteId: string,
    alertId: string,
    data: Partial<ArrivalAlert>
  ): Promise<ApiResponse<ArrivalAlert>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.put(`/commuters/${commuteId}/alerts/${alertId}`, data);

    // Mock data response
    return new Promise((resolve) => {
      const alerts = JSON.parse(localStorage.getItem(`alerts-${commuteId}`) || "[]");
      const updated = alerts.map((a: ArrivalAlert) =>
        a.id === alertId ? { ...a, ...data } : a
      );
      localStorage.setItem(`alerts-${commuteId}`, JSON.stringify(updated));

      setTimeout(() => {
        resolve({
          success: true,
          data: updated.find((a: ArrivalAlert) => a.id === alertId),
        });
      }, 300);
    });
  }

  /**
   * Delete arrival alert
   */
  async deleteArrivalAlert(commuteId: string, alertId: string): Promise<ApiResponse<void>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.delete(`/commuters/${commuteId}/alerts/${alertId}`);

    // Mock data response
    return new Promise((resolve) => {
      const alerts = JSON.parse(localStorage.getItem(`alerts-${commuteId}`) || "[]");
      const updated = alerts.filter((a: ArrivalAlert) => a.id !== alertId);
      localStorage.setItem(`alerts-${commuteId}`, JSON.stringify(updated));

      setTimeout(() => {
        resolve({
          success: true,
        });
      }, 300);
    });
  }

  /**
   * Get trip history
   */
  async getTripHistory(commuteId: string): Promise<ApiResponse<TripHistory[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<TripHistory[]>(`/commuters/${commuteId}/trips`);

    // Mock data response
    return new Promise((resolve) => {
      const trips = localStorage.getItem(`trips-${commuteId}`) || "[]";
      setTimeout(() => {
        resolve({
          success: true,
          data: JSON.parse(trips),
        });
      }, 300);
    });
  }

  /**
   * Record trip
   */
  async recordTrip(commuteId: string, data: Omit<TripHistory, "id">): Promise<ApiResponse<TripHistory>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post(`/commuters/${commuteId}/trips`, data);

    // Mock data response
    return new Promise((resolve) => {
      const trips = JSON.parse(localStorage.getItem(`trips-${commuteId}`) || "[]");
      const newTrip: TripHistory = {
        id: `trip-${Date.now()}`,
        ...data,
      };
      trips.push(newTrip);
      localStorage.setItem(`trips-${commuteId}`, JSON.stringify(trips));

      setTimeout(() => {
        resolve({
          success: true,
          data: newTrip,
        });
      }, 300);
    });
  }

  /**
   * Get ratings for a bus
   */
  async getBusRatings(busId: string): Promise<ApiResponse<BusRating[]>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get<BusRating[]>(`/buses/${busId}/ratings`);

    // Mock data response
    return new Promise((resolve) => {
      const ratings = localStorage.getItem(`ratings-${busId}`) || "[]";
      setTimeout(() => {
        resolve({
          success: true,
          data: JSON.parse(ratings),
        });
      }, 300);
    });
  }

  /**
   * Submit bus rating
   */
  async submitBusRating(commuteId: string, data: Omit<BusRating, "id" | "createdAt">): Promise<ApiResponse<BusRating>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.post(`/commuters/${commuteId}/ratings`, data);

    // Mock data response
    return new Promise((resolve) => {
      const ratings = JSON.parse(localStorage.getItem(`ratings-${data.busId}`) || "[]");
      const newRating: BusRating = {
        id: `rating-${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString(),
      };
      ratings.push(newRating);
      localStorage.setItem(`ratings-${data.busId}`, JSON.stringify(ratings));

      setTimeout(() => {
        resolve({
          success: true,
          data: newRating,
        });
      }, 300);
    });
  }

  /**
   * Get average rating for a bus
   */
  async getBusAverageRating(busId: string): Promise<ApiResponse<{ average: number; count: number }>> {
    // TODO: Replace with actual API call when backend is ready
    // return apiClient.get(`/buses/${busId}/rating-summary`);

    // Mock data response
    return new Promise((resolve) => {
      const ratings = JSON.parse(localStorage.getItem(`ratings-${busId}`) || "[]");
      const average =
        ratings.length > 0 ? ratings.reduce((sum: number, r: BusRating) => sum + r.rating, 0) / ratings.length : 0;

      setTimeout(() => {
        resolve({
          success: true,
          data: {
            average: Math.round(average * 10) / 10,
            count: ratings.length,
          },
        });
      }, 300);
    });
  }
}

export const commuterService = new CommuterService();
