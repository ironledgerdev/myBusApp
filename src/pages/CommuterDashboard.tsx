import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Map, List, Tag, Settings, X } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import BusMap from "@/components/commuter/BusMap";
import RouteList from "@/components/commuter/RouteList";
import CommuterFeatures from "@/components/commuter/CommuterFeatures";
import { MobileHeader, BottomSheet } from "@/components/mobile";
import { type Route } from "@/data/mockData";
import { cn } from "@/lib/utils";

const CommuterDashboard = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"map" | "list">("map");
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showRouteSheet, setShowRouteSheet] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Mobile Header */}
      <MobileHeader
        title="MyBusApp"
        onBack={() => navigate("/")}
        rightActions={
          <div className="flex items-center gap-1">
            {/* Features button */}
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className={cn(
                "touch-target p-2 rounded-lg text-xs font-body font-medium transition-colors hidden sm:flex items-center gap-1",
                showFeatures
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Features</span>
            </button>

            {/* Bus Tag button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="touch-target p-2 bg-accent/20 text-accent rounded-lg text-xs font-body font-medium cursor-not-allowed opacity-70 hover:opacity-70">
                  <Tag className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="text-xs">Coming Soon! 🚀</TooltipContent>
            </Tooltip>

            {/* View toggle - desktop only */}
            <div className="hidden md:flex bg-muted rounded-lg p-0.5">
              <button
                onClick={() => setView("map")}
                className={cn(
                  "touch-target flex items-center gap-1 px-2 py-1 rounded-md text-xs font-body font-medium transition-colors",
                  view === "map"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Map className="w-4 h-4" />
                <span className="hidden lg:inline">Map</span>
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "touch-target flex items-center gap-1 px-2 py-1 rounded-md text-xs font-body font-medium transition-colors",
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="w-4 h-4" />
                <span className="hidden lg:inline">Routes</span>
              </button>
            </div>
          </div>
        }
      />

      {/* Content - Mobile: full map, Desktop: side-by-side */}
      <div className="flex-1 flex overflow-hidden">
        {/* Map (always visible on mobile, hidden when list is active on desktop) */}
        <div
          className={cn(
            "flex-1",
            "md:flex",
            view === "list" && "hidden md:block"
          )}
        >
          <BusMap selectedRoute={selectedRoute} onSelectRoute={setSelectedRoute} />
        </div>

        {/* Routes/Features panel (desktop only) */}
        <div
          className={cn(
            "md:w-96 md:border-l md:border-border bg-card overflow-hidden",
            "hidden md:flex md:flex-col",
            view === "list" && "md:hidden"
          )}
        >
          {showFeatures ? (
            <div className="flex-1 overflow-y-auto p-4">
              <CommuterFeatures selectedRoute={selectedRoute} />
            </div>
          ) : (
            <RouteList selectedRoute={selectedRoute} onSelectRoute={setSelectedRoute} />
          )}
        </div>
      </div>

      {/* Mobile: Bottom sheet for routes/features */}
      <BottomSheet
        isOpen={showRouteSheet}
        onClose={() => setShowRouteSheet(false)}
        title={showFeatures ? "Features" : "Routes"}
        height="full"
      >
        {showFeatures ? (
          <CommuterFeatures selectedRoute={selectedRoute} />
        ) : (
          <RouteList
            selectedRoute={selectedRoute}
            onSelectRoute={(route) => {
              setSelectedRoute(route);
              setShowRouteSheet(false);
            }}
          />
        )}
      </BottomSheet>

      {/* Mobile: View toggle floating button */}
      <div className="md:hidden fixed bottom-6 right-4 flex gap-2 z-40 safe-pb">
        {/* Routes/Features toggle */}
        <button
          onClick={() => setShowRouteSheet(!showRouteSheet)}
          className={cn(
            "touch-target flex items-center gap-2 px-4 py-2.5 rounded-full font-body font-medium transition-colors shadow-lg active:scale-95",
            showRouteSheet
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/90"
          )}
        >
          {showRouteSheet ? (
            <>
              <X className="w-4 h-4" />
              <span>Close</span>
            </>
          ) : (
            <>
              <List className="w-4 h-4" />
              <span>Routes</span>
            </>
          )}
        </button>

        {/* Features toggle */}
        <button
          onClick={() => setShowFeatures(!showFeatures)}
          className={cn(
            "touch-target flex items-center justify-center p-2.5 rounded-full font-body font-medium transition-colors shadow-lg active:scale-95",
            showFeatures
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Selected route info bar - mobile */}
      {selectedRoute && (
        <div className="md:hidden bg-card border-t border-border px-4 py-3 flex items-center justify-between shrink-0 safe-pb">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedRoute.color }} />
            <div className="min-w-0 flex-1">
              <span className="font-display text-sm block truncate">
                {selectedRoute.from} → {selectedRoute.to}
              </span>
              <span className="text-xs text-muted-foreground font-body">
                {selectedRoute.estimatedDuration}
              </span>
            </div>
          </div>
          <button
            onClick={() => setSelectedRoute(null)}
            className="text-xs text-primary font-body font-medium hover:underline flex-shrink-0 ml-2 touch-target p-2"
          >
            Clear
          </button>
        </div>
      )}

      {/* Desktop: Selected route bar */}
      {selectedRoute && (
        <div className="hidden md:flex bg-card border-t border-border px-4 py-3 items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: selectedRoute.color }}
            />
            <span className="font-display text-sm">
              {selectedRoute.from} → {selectedRoute.to}
            </span>
            <span className="text-xs text-muted-foreground font-body">
              {selectedRoute.estimatedDuration}
            </span>
          </div>
          <button
            onClick={() => setSelectedRoute(null)}
            className="text-xs text-primary font-body font-medium hover:underline touch-target p-2"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default CommuterDashboard;
