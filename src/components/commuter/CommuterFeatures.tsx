import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Bell,
  Clock,
  Star,
  ChevronRight,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCommuterFavorites } from "@/hooks/useCommuterFavorites";
import { commuterService, type ArrivalAlert, type BusRating } from "@/services/commuterService";
import { routes } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface CommuterFeaturesProps {
  selectedRoute?: any;
}

type TabType = "favorites" | "alerts" | "history" | "ratings";

const CommuterFeatures = ({ selectedRoute }: CommuterFeaturesProps) => {
  const [activeTab, setActiveTab] = useState<TabType>("favorites");
  const [alerts, setAlerts] = useState<ArrivalAlert[]>([]);
  const [ratings, setRatings] = useState<BusRating[]>([]);
  const [showNewAlert, setShowNewAlert] = useState(false);
  const [showNewRating, setShowNewRating] = useState(false);
  const [newAlertData, setNewAlertData] = useState({
    routeId: selectedRoute?.id || "",
    stopId: "",
    stopName: "",
    minutesBefore: 5,
  });
  const [newRatingData, setNewRatingData] = useState({
    busId: "",
    rating: 5,
    comment: "",
    cleanliness: 5,
    comfort: 5,
    timeliness: 5,
    driverBehavior: 5,
  });

  const { favorites, addFavorite, removeFavorite, isFavorite } = useCommuterFavorites();
  const COMMUTER_ID = "commuter-1";

  // Load alerts and ratings
  useEffect(() => {
    const loadData = async () => {
      const alertsResponse = await commuterService.getArrivalAlerts(COMMUTER_ID);
      if (alertsResponse.success && alertsResponse.data) {
        setAlerts(alertsResponse.data);
      }

      const ratingsResponse = await commuterService.getBusRatings("all");
      if (ratingsResponse.success && ratingsResponse.data) {
        setRatings(ratingsResponse.data);
      }
    };

    loadData();
  }, []);

  const handleAddAlert = async () => {
    if (!newAlertData.routeId || !newAlertData.stopId) {
      alert("Please select route and stop");
      return;
    }

    const response = await commuterService.createArrivalAlert(COMMUTER_ID, {
      routeId: newAlertData.routeId,
      stopId: newAlertData.stopId,
      stopName: newAlertData.stopName,
      minutesBefore: newAlertData.minutesBefore,
      enabled: true,
    });

    if (response.success && response.data) {
      setAlerts((prev) => [...prev, response.data]);
      setShowNewAlert(false);
      setNewAlertData({
        routeId: selectedRoute?.id || "",
        stopId: "",
        stopName: "",
        minutesBefore: 5,
      });
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
    await commuterService.deleteArrivalAlert(COMMUTER_ID, alertId);
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleSubmitRating = async () => {
    if (!newRatingData.busId) {
      alert("Please select a bus");
      return;
    }

    const response = await commuterService.submitBusRating(COMMUTER_ID, {
      busId: newRatingData.busId,
      rating: newRatingData.rating,
      comment: newRatingData.comment,
      categories: {
        cleanliness: newRatingData.cleanliness,
        comfort: newRatingData.comfort,
        timeliness: newRatingData.timeliness,
        driverBehavior: newRatingData.driverBehavior,
      },
    });

    if (response.success) {
      setShowNewRating(false);
      setNewRatingData({
        busId: "",
        rating: 5,
        comment: "",
        cleanliness: 5,
        comfort: 5,
        timeliness: 5,
        driverBehavior: 5,
      });
    }
  };

  const getRouteName = (routeId: string) => {
    const route = routes.find((r) => r.id === routeId);
    return route ? `${route.from} → ${route.to}` : "Unknown Route";
  };

  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: "favorites", label: "Favorites", icon: Heart, count: favorites.length },
    { id: "alerts", label: "Alerts", icon: Bell, count: alerts.length },
    { id: "history", label: "History", icon: Clock },
    { id: "ratings", label: "Ratings", icon: Star },
  ];

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-1 bg-primary/20 px-2 py-0.5 rounded-full text-xs">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Favorites Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "favorites" && (
          <motion.div
            key="favorites"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {favorites.length > 0 ? (
              favorites.map((fav) => (
                <Card key={fav.routeId} className="bg-background/95 border-primary/20">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{getRouteName(fav.routeId)}</p>
                      {fav.label && <p className="text-xs text-muted-foreground">{fav.label}</p>}
                    </div>
                    <button
                      onClick={() => removeFavorite(fav.routeId)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm">
                <p>No favorite routes yet</p>
                <p className="text-xs mt-1">Select a route and click the heart icon to add</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Alerts Tab */}
        {activeTab === "alerts" && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {showNewAlert ? (
              <Card className="bg-background/95 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">New Arrival Alert</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium">Route</label>
                    <select
                      value={newAlertData.routeId}
                      onChange={(e) => setNewAlertData({ ...newAlertData, routeId: e.target.value })}
                      className="w-full px-2 py-1 text-xs border border-input rounded-md bg-background"
                    >
                      <option value="">Select route</option>
                      {routes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.from} → {r.to}
                        </option>
                      ))}
                    </select>
                  </div>

                  {newAlertData.routeId && (
                    <div>
                      <label className="text-xs font-medium">Stop</label>
                      <select
                        value={newAlertData.stopId}
                        onChange={(e) => {
                          const route = routes.find((r) => r.id === newAlertData.routeId);
                          const stop = route?.stops.find((s) => s.id === e.target.value);
                          setNewAlertData({
                            ...newAlertData,
                            stopId: e.target.value,
                            stopName: stop?.name || "",
                          });
                        }}
                        className="w-full px-2 py-1 text-xs border border-input rounded-md bg-background"
                      >
                        <option value="">Select stop</option>
                        {routes
                          .find((r) => r.id === newAlertData.routeId)
                          ?.stops.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-medium">Alert (minutes before)</label>
                    <Input
                      type="number"
                      min="1"
                      max="30"
                      value={newAlertData.minutesBefore}
                      onChange={(e) =>
                        setNewAlertData({ ...newAlertData, minutesBefore: parseInt(e.target.value) })
                      }
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleAddAlert}
                      size="sm"
                      className="flex-1 h-8 text-xs"
                    >
                      Create Alert
                    </Button>
                    <Button
                      onClick={() => setShowNewAlert(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={() => setShowNewAlert(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Bell className="w-4 h-4 mr-2" />
                Create Alert
              </Button>
            )}

            {alerts.map((alert) => (
              <Card key={alert.id} className="bg-background/95 border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm">{alert.stopName}</p>
                      <p className="text-xs text-muted-foreground">
                        Alert {alert.minutesBefore} min before
                      </p>
                      <div className="mt-1">
                        {alert.enabled ? (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Enabled
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Disabled</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="p-6 text-center text-muted-foreground text-sm">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Trip history will appear here</p>
              <p className="text-xs mt-1">Board a bus to start recording trips</p>
            </div>
          </motion.div>
        )}

        {/* Ratings Tab */}
        {activeTab === "ratings" && (
          <motion.div
            key="ratings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            {showNewRating ? (
              <Card className="bg-background/95 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Rate a Bus</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <label className="text-xs font-medium">Bus</label>
                    <Input
                      placeholder="Bus name or number"
                      value={newRatingData.busId}
                      onChange={(e) => setNewRatingData({ ...newRatingData, busId: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium">Overall Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewRatingData({ ...newRatingData, rating: star })}
                          className={cn(
                            "p-1 transition-colors",
                            newRatingData.rating >= star
                              ? "text-yellow-500"
                              : "text-muted-foreground"
                          )}
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium">Comment</label>
                    <Input
                      placeholder="Share your experience"
                      value={newRatingData.comment}
                      onChange={(e) => setNewRatingData({ ...newRatingData, comment: e.target.value })}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitRating}
                      size="sm"
                      className="flex-1 h-8 text-xs"
                    >
                      Submit Rating
                    </Button>
                    <Button
                      onClick={() => setShowNewRating(false)}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={() => setShowNewRating(true)}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Star className="w-4 h-4 mr-2" />
                Rate a Bus
              </Button>
            )}

            {ratings.length > 0 ? (
              ratings.map((rating) => (
                <Card key={rating.id} className="bg-background/95 border-primary/20">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "w-3 h-3",
                                i < rating.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                              )}
                            />
                          ))}
                        </div>
                        {rating.comment && (
                          <p className="text-xs text-muted-foreground mt-1">{rating.comment}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground text-sm">
                <p>No ratings yet</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommuterFeatures;
