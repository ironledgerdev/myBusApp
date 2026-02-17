import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { routes, type Route } from "@/data/mockData";
import { useRealtimeBus } from "@/hooks/useRealtimeBus";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const createBusIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><rect x="3" y="3" width="18" height="14" rx="2"/><line x1="3" y1="21" x2="7" y2="21"/><line x1="17" y1="21" x2="21" y2="21"/><line x1="8" y1="21" x2="16" y2="21"/></svg>
    </div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });

const createStopIcon = (color: string) =>
  L.divIcon({
    html: `<div style="background:white;width:12px;height:12px;border-radius:50%;border:3px solid ${color};box-shadow:0 1px 4px rgba(0,0,0,0.2);"></div>`,
    className: "",
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });

interface BusMapProps {
  selectedRoute: Route | null;
  onSelectRoute: (route: Route) => void;
}

function FitBounds({ route }: { route: Route | null }) {
  const map = useMap();
  useEffect(() => {
    if (route) {
      const bounds = L.latLngBounds(route.stops.map((s) => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.setView([-26.2285, 27.9200], 12);
    }
  }, [route, map]);
  return null;
}

const BusMap = ({ selectedRoute, onSelectRoute }: BusMapProps) => {
  const { buses } = useRealtimeBus();
  const displayRoutes = selectedRoute ? [selectedRoute] : routes;
  const displayBuses = selectedRoute
    ? buses.filter((b) => b.routeId === selectedRoute.id)
    : buses;

  return (
    <MapContainer
      center={[-26.2285, 27.92]}
      zoom={12}
      className="h-full w-full rounded-lg"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds route={selectedRoute} />

      {displayRoutes.map((route) => (
        <Polyline
          key={route.id}
          positions={route.stops.map((s) => [s.lat, s.lng] as [number, number])}
          color={route.color}
          weight={4}
          opacity={0.8}
          eventHandlers={{ click: () => onSelectRoute(route) }}
        />
      ))}

      {displayRoutes.map((route) =>
        route.stops.map((stop) => (
          <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={createStopIcon(route.color)}>
            <Popup>
              <div className="font-body text-sm">
                <strong>{stop.name}</strong>
                <br />
                {route.from} → {route.to}
              </div>
            </Popup>
          </Marker>
        ))
      )}

      {displayBuses
        .filter((b) => b.status === "active")
        .map((bus) => {
          const route = routes.find((r) => r.id === bus.routeId);
          const busWithETA = bus as any; // BusWithETA type
          return (
            <Marker key={bus.id} position={[bus.lat, bus.lng]} icon={createBusIcon(route?.color || "#F97316")}>
              <Popup>
                <div className="font-body text-sm">
                  <strong>{bus.name}</strong>
                  <br />
                  {bus.registration}
                  <br />
                  <span className="text-green-600 font-semibold">● Active</span>
                  {busWithETA.nextStop && (
                    <>
                      <br />
                      <br />
                      <strong className="text-xs">Next Stop:</strong>
                      <br />
                      <span className="text-xs">{busWithETA.nextStop.name}</span>
                      <br />
                      <span className="text-xs font-semibold text-green-600">ETA: {busWithETA.nextStop.eta}s</span>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default BusMap;
