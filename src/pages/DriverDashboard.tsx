import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bus, LogOut, MapPin, Clock, Activity, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileHeader } from "@/components/mobile";
import { useState, useEffect } from "react";
import { useRealtimeBus } from "@/hooks/useRealtimeBus";
import { drivers, routes as routeData } from "@/data/mockData";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { startRoute, stopRoute, updateLocation } = useRealtimeBus();
  const [driverId, setDriverId] = useState<string | null>(null);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);
  const [onlineTime, setOnlineTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get driver from session or redirect to login
  useEffect(() => {
    const storedDriverId = sessionStorage.getItem("driverId");
    if (!storedDriverId) {
      navigate("/driver/login");
    } else {
      setDriverId(storedDriverId);
    }
    setIsLoading(false);
  }, [navigate]);

  // Geolocation tracking
  useEffect(() => {
    let watchId: number;

    if (activeRoute && driverId) {
      // Find bus ID
      const driver = drivers.find((d) => d.id === driverId);
      const bus = driver?.routeId ? { id: `bus-${driver.id.split("-")[1]}` } : null;

      if (bus && navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, heading, speed } = position.coords;
            updateLocation(bus.id, {
              lat: latitude,
              lng: longitude,
              heading: heading || 0,
              speed: speed || 0
            });
            setLocationError(null);
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLocationError("Unable to access GPS location. Please check permissions.");
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
          }
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [activeRoute, driverId, updateLocation]);

  // Timer for online time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeRoute) {
      interval = setInterval(() => {
        setOnlineTime((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeRoute]);

  // Early returns after all hooks are declared
  if (isLoading || !driverId) {
    return null; // Loading or redirecting
  }

  const driver = drivers.find((d) => d.id === driverId);
  const route = driver?.routeId ? routeData.find((r) => r.id === driver.routeId) : null;
  const bus = driver?.routeId ? { id: `bus-${driver.id.split("-")[1]}` } : null;

  if (!driver) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-background/95 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Driver information not found.</p>
            <Button
              onClick={() => {
                sessionStorage.removeItem("driverId");
                navigate("/driver/login");
              }}
              className="w-full"
            >
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleStartRoute = () => {
    if (route && bus) {
      setActiveRoute(route.id);
      startRoute(driverId, bus.id, route.id);
    }
  };

  const handleStopRoute = () => {
    if (bus) {
      stopRoute(bus.id);
      setActiveRoute(null);
      setOnlineTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
  };

  const handleLogout = () => {
    if (activeRoute) {
      handleStopRoute();
    }
    sessionStorage.removeItem("driverId");
    navigate("/driver/login");
  };

  const driverStats = [
    { label: "Current Route", value: route ? route.name : "None", icon: MapPin },
    { label: "Status", value: activeRoute ? "On Trip" : "Off Duty", icon: Activity },
    { label: "Time Online", value: formatTime(onlineTime), icon: Clock },
  ];

  return (
    <div className="h-screen flex flex-col bg-secondary">
      {/* Mobile Header */}
      <MobileHeader
        title={activeRoute && route ? `${route.from} → ${route.to}` : "Driver Dashboard"}
        subtitle={activeRoute ? "● Live Tracking Active" : "Off Duty"}
        rightActions={
          <button
            onClick={handleLogout}
            className="touch-target p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        }
        sticky
      />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl mx-auto space-y-6">
          {/* Location Error Alert */}
          {locationError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">GPS Error: </strong>
              <span className="block sm:inline">{locationError}</span>
            </div>
          )}

          {/* Status Indicator */}
          {activeRoute && !locationError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-600 text-white rounded-xl p-4 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                <div>
                  <p className="font-display text-sm">Route Active</p>
                  <p className="text-xs opacity-90">
                    Your bus location is being tracked in real-time
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ staggerChildren: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {driverStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-background/95 border-primary/20 h-full">
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-medium text-secondary-foreground">
                          {stat.label}
                        </span>
                        <Icon className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xl sm:text-2xl md:text-3xl font-display text-primary line-clamp-1">
                        {stat.value}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-background/95 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Quick Actions</CardTitle>
                <CardDescription>
                  {route ? `${route.from} → ${route.to}` : "No route assigned"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {route && (
                  <>
                    {!activeRoute ? (
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 h-12 text-base"
                        onClick={handleStartRoute}
                      >
                        <Play className="w-5 h-5" />
                        Start Route
                      </Button>
                    ) : (
                      <Button
                        className="w-full bg-red-600 hover:bg-red-700 flex items-center justify-center gap-2 h-12 text-base"
                        onClick={handleStopRoute}
                      >
                        <Square className="w-5 h-5" />
                        Stop Route
                      </Button>
                    )}
                  </>
                )}
                <Button
                  variant="outline"
                  className="w-full h-12"
                >
                  View Schedule
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12"
                >
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Welcome Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 sm:p-6 bg-primary/10 border border-primary/20 rounded-lg"
          >
            <p className="text-center text-secondary-foreground font-body text-sm sm:text-base">
              {activeRoute ? (
                <>
                  <strong>Route Active!</strong> Your bus location is being tracked in real-time for commuters.
                </>
              ) : (
                <>
                  Welcome, <strong>{driver?.name}</strong>! Start a route to begin tracking and show commuters your bus location.
                </>
              )}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
