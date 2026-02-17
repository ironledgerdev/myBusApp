// Hook for managing favorite routes

import { useState, useEffect, useCallback } from "react";
import { commuterService, type FavoriteRoute } from "@/services/commuterService";

const COMMUTER_ID = "commuter-1"; // In real app, would come from auth context

export function useCommuterFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRoute[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await commuterService.getFavoriteRoutes(COMMUTER_ID);
        if (response.success && response.data) {
          setFavorites(response.data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const addFavorite = useCallback(
    async (routeId: string, label?: string) => {
      setError(null);
      try {
        const response = await commuterService.addFavoriteRoute(COMMUTER_ID, routeId, label);
        if (response.success && response.data) {
          setFavorites((prev) => [...prev, response.data]);
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to add favorite");
        return false;
      }
    },
    []
  );

  const removeFavorite = useCallback(
    async (routeId: string) => {
      setError(null);
      try {
        const response = await commuterService.removeFavoriteRoute(COMMUTER_ID, routeId);
        if (response.success) {
          setFavorites((prev) => prev.filter((f) => f.routeId !== routeId));
          return true;
        }
        return false;
      } catch (err: any) {
        setError(err.message || "Failed to remove favorite");
        return false;
      }
    },
    []
  );

  const isFavorite = useCallback(
    (routeId: string) => {
      return favorites.some((f) => f.routeId === routeId);
    },
    [favorites]
  );

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}
