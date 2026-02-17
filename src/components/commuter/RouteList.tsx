import { useState } from "react";
import { Search, MapPin, Clock, Bus, ChevronDown, ChevronUp, Zap, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { routes, type Route } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useRealtimeBus } from "@/hooks/useRealtimeBus";
import { useCommuterFavorites } from "@/hooks/useCommuterFavorites";

interface RouteListProps {
  selectedRoute: Route | null;
  onSelectRoute: (route: Route | null) => void;
}

const RouteList = ({ selectedRoute, onSelectRoute }: RouteListProps) => {
  const [search, setSearch] = useState("");
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null);
  const { buses } = useRealtimeBus();
  const { isFavorite, addFavorite, removeFavorite } = useCommuterFavorites();

  const filtered = routes.filter(
    (r) =>
      r.from.toLowerCase().includes(search.toLowerCase()) ||
      r.to.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.stops.some((s) => s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleExpand = (routeId: string) => {
    setExpandedRoute(expandedRoute === routeId ? null : routeId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search routes, stops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.map((route) => {
          const activeBuses = buses.filter(
            (b) => b.routeId === route.id && b.status === "active"
          );
          const isExpanded = expandedRoute === route.id;
          const isSelected = selectedRoute?.id === route.id;

          return (
            <div key={route.id} className="border-b border-border">
              <div
                className={cn(
                  "w-full p-4 text-left flex items-start gap-3 hover:bg-muted/50 transition-colors",
                  isSelected && "bg-primary/10"
                )}
              >
                <button
                  onClick={() => {
                    onSelectRoute(isSelected ? null : route);
                    toggleExpand(route.id);
                  }}
                  className="flex-1 flex items-start gap-3"
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: route.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display text-sm">{route.name}</span>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full font-body">
                        {route.busNumber}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium font-body">
                      {route.from} → {route.to}
                    </p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground font-body">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.estimatedDuration}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {route.stops.length} stops
                      </span>
                      <span className="flex items-center gap-1">
                        <Bus className="w-3 h-3" />
                        {activeBuses.length} active
                      </span>
                    </div>

                    {/* Show ETA for active buses */}
                    {activeBuses.length > 0 && activeBuses[0].nextStop && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 text-xs">
                          <Zap className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="font-medium text-green-700 dark:text-green-300">
                              Next: {activeBuses[0].nextStop.name}
                            </p>
                            <p className="text-green-600 dark:text-green-400 text-xs mt-0.5">
                              ETA: {activeBuses[0].nextStop.eta}s
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFavorite(route.id)) {
                        removeFavorite(route.id);
                      } else {
                        addFavorite(route.id, route.name);
                      }
                    }}
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                    title={isFavorite(route.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart
                      className="w-4 h-4"
                      fill={isFavorite(route.id) ? "currentColor" : "none"}
                    />
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground mt-1" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground mt-1" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pl-10">
                  <p className="text-xs font-display text-muted-foreground mb-2 uppercase tracking-wider">
                    Stops
                  </p>
                  <div className="space-y-1.5">
                    {route.stops.map((stop, i) => (
                      <div key={stop.id} className="flex items-center gap-2 text-sm font-body">
                        <div className="flex flex-col items-center">
                          <div
                            className="w-2.5 h-2.5 rounded-full border-2"
                            style={{ borderColor: route.color, backgroundColor: i === 0 || i === route.stops.length - 1 ? route.color : "transparent" }}
                          />
                          {i < route.stops.length - 1 && (
                            <div className="w-0.5 h-4" style={{ backgroundColor: route.color, opacity: 0.3 }} />
                          )}
                        </div>
                        <span>{stop.name}</span>
                        {i === 0 && <span className="text-xs text-muted-foreground ml-auto">Depart</span>}
                        {i === route.stops.length - 1 && <span className="text-xs text-muted-foreground ml-auto">Arrive</span>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground font-body">
                    Bus: <strong>{route.busName}</strong>
                  </p>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="p-8 text-center text-muted-foreground font-body">
            No routes found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteList;
