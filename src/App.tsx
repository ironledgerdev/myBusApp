import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CommuterDashboard from "./pages/CommuterDashboard";
import DriverLogin from "./pages/DriverLogin";
import DriverDashboard from "./pages/DriverDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDrivers from "./pages/AdminDrivers";
import AdminRoutes from "./pages/AdminRoutes";
import NotFound from "./pages/NotFound";
import { initializeGlobalWebSocket } from "@/hooks/useWebSocket";
import { enableWebSocketMode } from "@/hooks/useRealtimeBus";
import { isWebSocketEnabled } from "@/lib/env";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Initialize WebSocket if enabled
    if (isWebSocketEnabled()) {
      try {
        const wsClient = initializeGlobalWebSocket();
        enableWebSocketMode();

        // Set up connection monitoring
        const unsubscribeError = wsClient.onError((error) => {
          if (import.meta.env.DEV) {
            console.warn("WebSocket error:", error.message);
          }
        });

        const unsubscribeConnection = wsClient.onConnectionChange((connected) => {
          if (import.meta.env.DEV) {
            console.log("WebSocket connection:", connected ? "connected" : "disconnected");
          }
        });

        return () => {
          unsubscribeError();
          unsubscribeConnection();
        };
      } catch (error) {
        if (import.meta.env.DEV) {
          console.warn("WebSocket setup failed, using local simulation:", error);
        }
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/commuter" element={<CommuterDashboard />} />
            <Route path="/driver/login" element={<DriverLogin />} />
            <Route path="/driver/dashboard" element={<DriverDashboard />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/drivers" element={<AdminDrivers />} />
            <Route path="/admin/routes" element={<AdminRoutes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
