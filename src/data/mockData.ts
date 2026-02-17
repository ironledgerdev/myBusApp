export interface Stop {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface Route {
  id: string;
  name: string;
  from: string;
  to: string;
  color: string;
  stops: Stop[];
  busNumber: string;
  busName: string;
  estimatedDuration: string;
}

export interface Bus {
  id: string;
  name: string;
  registration: string;
  routeId: string;
  lat: number;
  lng: number;
  status: "active" | "idle" | "maintenance";
  heading: number;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  pin: string;
  routeId: string | null;
  status: "active" | "off-duty" | "on-trip";
  tripHistory: { date: string; routeId: string; status: string }[];
}

export const routes: Route[] = [
  {
    id: "route-1",
    name: "Route 1",
    from: "Meadowlands",
    to: "Johannesburg CBD",
    color: "#F97316",
    busNumber: "P-101",
    busName: "PUTCO Meadowlands Express",
    estimatedDuration: "45 min",
    stops: [
      { id: "s1-1", name: "Meadowlands Zone 1", lat: -26.2285, lng: 27.8965 },
      { id: "s1-2", name: "Meadowlands Zone 6", lat: -26.2350, lng: 27.9020 },
      { id: "s1-3", name: "Ndofaya", lat: -26.2200, lng: 27.9100 },
      { id: "s1-4", name: "Baragwanath", lat: -26.2612, lng: 27.9443 },
      { id: "s1-5", name: "Booysens", lat: -26.2250, lng: 28.0300 },
      { id: "s1-6", name: "Johannesburg CBD", lat: -26.2041, lng: 28.0473 },
    ],
  },
  {
    id: "route-2",
    name: "Route 2",
    from: "Diepkloof",
    to: "Johannesburg CBD",
    color: "#EAB308",
    busNumber: "P-202",
    busName: "PUTCO Diepkloof Liner",
    estimatedDuration: "40 min",
    stops: [
      { id: "s2-1", name: "Diepkloof Zone 3", lat: -26.2500, lng: 27.9300 },
      { id: "s2-2", name: "Diepkloof Zone 1", lat: -26.2450, lng: 27.9400 },
      { id: "s2-3", name: "Uncle Tom's", lat: -26.2400, lng: 27.9500 },
      { id: "s2-4", name: "Nasrec", lat: -26.2350, lng: 27.9800 },
      { id: "s2-5", name: "Johannesburg CBD", lat: -26.2041, lng: 28.0473 },
    ],
  },
  {
    id: "route-3",
    name: "Route 3",
    from: "Dobsonville",
    to: "Randburg",
    color: "#1E40AF",
    busNumber: "P-303",
    busName: "PUTCO Dobsonville Shuttle",
    estimatedDuration: "55 min",
    stops: [
      { id: "s3-1", name: "Dobsonville Gardens", lat: -26.2180, lng: 27.8600 },
      { id: "s3-2", name: "Dobsonville Mall", lat: -26.2150, lng: 27.8650 },
      { id: "s3-3", name: "Roodepoort", lat: -26.1620, lng: 27.8725 },
      { id: "s3-4", name: "Florida", lat: -26.1700, lng: 27.9200 },
      { id: "s3-5", name: "Randburg CBD", lat: -26.0950, lng: 28.0050 },
    ],
  },
  {
    id: "route-4",
    name: "Route 4",
    from: "Protea Glen",
    to: "Midrand",
    color: "#DC2626",
    busNumber: "P-404",
    busName: "PUTCO Protea Glen Cruiser",
    estimatedDuration: "65 min",
    stops: [
      { id: "s4-1", name: "Protea Glen Mall", lat: -26.2800, lng: 27.8400 },
      { id: "s4-2", name: "Protea Glen Ext 11", lat: -26.2750, lng: 27.8500 },
      { id: "s4-3", name: "Lenasia", lat: -26.3200, lng: 27.8400 },
      { id: "s4-4", name: "Johannesburg South", lat: -26.2700, lng: 28.0200 },
      { id: "s4-5", name: "Sandton", lat: -26.1076, lng: 28.0567 },
      { id: "s4-6", name: "Midrand", lat: -25.9884, lng: 28.1272 },
    ],
  },
  {
    id: "route-5",
    name: "Route 5",
    from: "Orlando",
    to: "Johannesburg CBD",
    color: "#7C3AED",
    busNumber: "P-505",
    busName: "PUTCO Orlando Runner",
    estimatedDuration: "35 min",
    stops: [
      { id: "s5-1", name: "Orlando Stadium", lat: -26.2380, lng: 27.9100 },
      { id: "s5-2", name: "Orlando West", lat: -26.2330, lng: 27.9150 },
      { id: "s5-3", name: "Mofolo", lat: -26.2500, lng: 27.9200 },
      { id: "s5-4", name: "Baragwanath", lat: -26.2612, lng: 27.9443 },
      { id: "s5-5", name: "Johannesburg CBD", lat: -26.2041, lng: 28.0473 },
    ],
  },
  {
    id: "route-6",
    name: "Route 6",
    from: "Pimville",
    to: "Sandton",
    color: "#059669",
    busNumber: "P-606",
    busName: "PUTCO Pimville Express",
    estimatedDuration: "50 min",
    stops: [
      { id: "s6-1", name: "Pimville Zone 4", lat: -26.2750, lng: 27.8900 },
      { id: "s6-2", name: "Pimville Zone 2", lat: -26.2700, lng: 27.9000 },
      { id: "s6-3", name: "Kliptown", lat: -26.2650, lng: 27.9150 },
      { id: "s6-4", name: "Booysens", lat: -26.2250, lng: 28.0300 },
      { id: "s6-5", name: "Rosebank", lat: -26.1450, lng: 28.0440 },
      { id: "s6-6", name: "Sandton City", lat: -26.1076, lng: 28.0567 },
    ],
  },
];

export const buses: Bus[] = [
  { id: "bus-1", name: "PUTCO Meadowlands Express", registration: "GP 101 ZAR", routeId: "route-1", lat: -26.2400, lng: 27.9200, status: "active", heading: 45 },
  { id: "bus-2", name: "PUTCO Diepkloof Liner", registration: "GP 202 ZAR", routeId: "route-2", lat: -26.2420, lng: 27.9500, status: "active", heading: 90 },
  { id: "bus-3", name: "PUTCO Dobsonville Shuttle", registration: "GP 303 ZAR", routeId: "route-3", lat: -26.1800, lng: 27.8700, status: "active", heading: 0 },
  { id: "bus-4", name: "PUTCO Protea Glen Cruiser", registration: "GP 404 ZAR", routeId: "route-4", lat: -26.2900, lng: 27.8800, status: "idle", heading: 180 },
  { id: "bus-5", name: "PUTCO Orlando Runner", registration: "GP 505 ZAR", routeId: "route-5", lat: -26.2450, lng: 27.9180, status: "active", heading: 60 },
  { id: "bus-6", name: "PUTCO Pimville Express", registration: "GP 606 ZAR", routeId: "route-6", lat: -26.2600, lng: 27.9100, status: "active", heading: 30 },
];

export const drivers: Driver[] = [
  {
    id: "driver-1",
    name: "Thabo Mokoena",
    phone: "0712345678",
    pin: "1234",
    routeId: "route-1",
    status: "on-trip",
    tripHistory: [
      { date: "2026-02-14", routeId: "route-1", status: "completed" },
      { date: "2026-02-13", routeId: "route-1", status: "completed" },
      { date: "2026-02-12", routeId: "route-2", status: "completed" },
    ],
  },
  {
    id: "driver-2",
    name: "Sipho Ndlovu",
    phone: "0723456789",
    pin: "5678",
    routeId: "route-2",
    status: "active",
    tripHistory: [
      { date: "2026-02-14", routeId: "route-2", status: "completed" },
      { date: "2026-02-13", routeId: "route-2", status: "completed" },
    ],
  },
  {
    id: "driver-3",
    name: "Lerato Dlamini",
    phone: "0734567890",
    pin: "9012",
    routeId: "route-3",
    status: "off-duty",
    tripHistory: [
      { date: "2026-02-13", routeId: "route-3", status: "completed" },
    ],
  },
  {
    id: "driver-4",
    name: "Kagiso Molefe",
    phone: "0745678901",
    pin: "3456",
    routeId: "route-5",
    status: "active",
    tripHistory: [
      { date: "2026-02-14", routeId: "route-5", status: "completed" },
      { date: "2026-02-13", routeId: "route-5", status: "completed" },
      { date: "2026-02-12", routeId: "route-4", status: "completed" },
    ],
  },
];

export const invitedPhones = ["0712345678", "0723456789", "0734567890", "0745678901"];
