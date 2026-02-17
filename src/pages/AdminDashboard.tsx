import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Users, MapPin, BarChart3, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MobileHeader } from "@/components/mobile";
import { drivers, routes, buses } from "@/data/mockData";
import { useRealtimeBus } from "@/hooks/useRealtimeBus";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const { buses: realtimeBuses } = useRealtimeBus();

  useEffect(() => {
    const adminId = sessionStorage.getItem("adminId");
    if (!adminId) {
      navigate("/admin/login");
    }
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return null;
  }

  const activeBuses = realtimeBuses.filter((b) => b.status === "active").length;
  const totalDrivers = drivers.length;
  const totalRoutes = routes.length;

  const handleLogout = () => {
    sessionStorage.removeItem("adminId");
    navigate("/");
  };

  const stats = [
    {
      label: "Active Buses",
      value: activeBuses,
      icon: "🚌",
      color: "bg-blue-50 dark:bg-blue-950/30",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Total Drivers",
      value: totalDrivers,
      icon: "👥",
      color: "bg-green-50 dark:bg-green-950/30",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      label: "Total Routes",
      value: totalRoutes,
      icon: "📍",
      color: "bg-purple-50 dark:bg-purple-950/30",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-secondary">
      {/* Mobile Header */}
      <MobileHeader
        title="Admin Dashboard"
        subtitle="Manage drivers & routes"
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
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className={`${stat.color} border ${stat.borderColor} h-full`}>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-medium text-secondary-foreground">
                        {stat.label}
                      </span>
                      <span className="text-xl sm:text-2xl">{stat.icon}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl sm:text-3xl md:text-4xl font-display text-primary">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Management Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Driver Management */}
            <Card
              className="bg-background/95 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer touch-target"
              onClick={() => navigate("/admin/drivers")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                  Driver Management
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Add, edit, and manage drivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">{totalDrivers}</span> drivers
                  </p>
                  <Button className="w-full h-10 text-sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Route Management */}
            <Card
              className="bg-background/95 border-primary/20 hover:shadow-lg transition-shadow cursor-pointer touch-target"
              onClick={() => navigate("/admin/routes")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <MapPin className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                  Route Management
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Create and manage routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm">
                    <span className="font-semibold text-primary">{totalRoutes}</span> routes
                  </p>
                  <Button className="w-full h-10 text-sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Analytics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-background/95 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BarChart3 className="w-4 sm:w-5 h-4 sm:h-5 text-primary" />
                  System Analytics
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Real-time system metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 sm:p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Active</p>
                    <p className="text-lg sm:text-2xl font-display text-primary">
                      {activeBuses}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Idle</p>
                    <p className="text-lg sm:text-2xl font-display text-primary">
                      {buses.length - activeBuses}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Total</p>
                    <p className="text-lg sm:text-2xl font-display text-primary">
                      {buses.length}
                    </p>
                  </div>
                  <div className="p-3 sm:p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Coverage</p>
                    <p className="text-lg sm:text-2xl font-display text-primary">
                      100%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Coming Soon */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 sm:p-6 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3"
          >
            <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm mb-1">
                Coming Soon
              </p>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300">
                Advanced features: bulk invitations, route analytics, earnings reports, and notifications.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
