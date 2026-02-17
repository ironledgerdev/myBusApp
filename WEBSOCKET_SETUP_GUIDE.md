# WebSocket Setup Guide

Complete guide for setting up and using WebSocket for real-time bus tracking in the Soweto Bus Tracker application.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Environment Configuration](#environment-configuration)
4. [Client Setup](#client-setup)
5. [Server Implementation](#server-implementation)
6. [Message Types](#message-types)
7. [Migration Guide](#migration-guide)
8. [Troubleshooting](#troubleshooting)
9. [Production Deployment](#production-deployment)

## Overview

The WebSocket implementation enables real-time, bidirectional communication between the bus tracking server and clients. This provides:

- **Real-time Location Updates**: Buses send GPS coordinates as they move
- **Live Status Changes**: Route start/stop events propagated instantly
- **ETA Calculations**: Real-time estimated time of arrival calculations
- **Automatic Reconnection**: Exponential backoff reconnection with up to 10 attempts
- **Fallback Support**: Local simulation continues if WebSocket unavailable
- **Message Queuing**: Messages queued while offline, sent when connection restored

## Architecture

### Components

```
┌─────────────────────────────────────────────────────┐
│           WebSocket Server (Node.js)                │
│  - ws library (WebSocket protocol)                  │
│  - Socket.io (optional, for better fallback)        │
│  - Real-time bus location service                   │
└────────────────────┬────────────────────────────────┘
                     │ WebSocket Connection
                     │ (ws:// or wss://)
     ┌───────────────┴─────────────────┐
     │                                 │
┌────▼────────────────┐      ┌────────▼──────────────┐
│  Driver Client      │      │  Commuter Client     │
│  (Bus Tracker)      │      │  (Route Viewer)      │
│                     │      │                      │
│ useWebSocket Hook   │      │ useWebSocket Hook    │
│ useRealtimeBus Hook │      │ RouteList Component  │
└─────────────────────┘      └──────────────────────┘
```

### WebSocket Client Stack

1. **WebSocketClient** (`src/lib/websocket.ts`)
   - Low-level WebSocket communication
   - Connection management
   - Automatic reconnection with exponential backoff
   - Message queueing
   - Event subscription system

2. **useWebSocket Hook** (`src/hooks/useWebSocket.ts`)
   - Global WebSocket instance management
   - Component-level hook for local instances
   - Automatic connection lifecycle handling
   - Error handling and recovery

3. **useRealtimeBus Hook** (`src/hooks/useRealtimeBus.ts`)
   - Bus tracking logic
   - WebSocket message interpretation
   - Fallback to local simulation
   - Bus state management

## Environment Configuration

### Development Setup

1. **Create or update `.env` file:**

```env
# WebSocket URL (development)
VITE_WEBSOCKET_URL=ws://localhost:8080

# API Endpoint for HTTP requests
VITE_API_URL=http://localhost:3000

# Feature flags
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_LOCAL_SIMULATION=true

# Environment
VITE_ENVIRONMENT=development
```

### Staging Setup

```env
VITE_WEBSOCKET_URL=wss://staging-api.yourapp.com/ws
VITE_API_URL=https://staging-api.yourapp.com
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_LOCAL_SIMULATION=false
VITE_ENVIRONMENT=staging
```

### Production Setup

```env
VITE_WEBSOCKET_URL=wss://api.yourapp.com/ws
VITE_API_URL=https://api.yourapp.com
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_LOCAL_SIMULATION=false
VITE_ENVIRONMENT=production
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_WEBSOCKET_URL` | `ws://localhost:8080` | WebSocket server URL (use `wss://` for production) |
| `VITE_API_URL` | `http://localhost:3000` | REST API base URL |
| `VITE_ENABLE_WEBSOCKET` | `true` | Enable WebSocket connections |
| `VITE_ENABLE_LOCAL_SIMULATION` | `true` | Enable local GPS simulation (fallback) |
| `VITE_ENVIRONMENT` | `development` | Deployment environment |

## Client Setup

### 1. Initialize Global WebSocket

In your app root (e.g., `src/App.tsx`):

```typescript
import { initializeGlobalWebSocket } from '@/hooks/useWebSocket';
import { enableWebSocketMode } from '@/hooks/useRealtimeBus';
import { isWebSocketEnabled } from '@/lib/env';

export default function App() {
  useEffect(() => {
    if (isWebSocketEnabled()) {
      try {
        initializeGlobalWebSocket();
        enableWebSocketMode();
      } catch (error) {
        console.warn('WebSocket initialization failed, using local simulation:', error);
      }
    }
  }, []);

  return (
    // ... rest of your app
  );
}
```

### 2. Use Global WebSocket in Components

```typescript
import { useGlobalWebSocket } from '@/hooks/useWebSocket';

function BusTracking() {
  const { client, connected, error } = useGlobalWebSocket();

  return (
    <div>
      <ConnectionStatus connected={connected} />
      {error && <ErrorAlert error={error} />}
      {/* ... rest of component */}
    </div>
  );
}
```

### 3. Real-time Bus Tracking

The `useRealtimeBus` hook automatically listens to WebSocket messages:

```typescript
import { useRealtimeBus } from '@/hooks/useRealtimeBus';

function RouteMap() {
  const { buses, startRoute, stopRoute } = useRealtimeBus();

  const handleStartRoute = (driverId: string, busId: string, routeId: string) => {
    startRoute(driverId, busId, routeId);
    // WebSocket authentication sent automatically if enabled
  };

  return (
    <div>
      {buses.map(bus => (
        <BusMarker key={bus.id} bus={bus} />
      ))}
    </div>
  );
}
```

## Server Implementation

### Example Node.js Server (Express + ws)

```typescript
import express from 'express';
import WebSocket from 'ws';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

interface ConnectedDriver {
  ws: WebSocket;
  driverId: string;
  busId: string;
}

const drivers = new Map<string, ConnectedDriver>();

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());

      switch (message.type) {
        case 'DRIVER_AUTHENTICATED':
          // Store driver connection
          drivers.set(message.driverId, {
            ws,
            driverId: message.driverId,
            busId: message.busId,
          });
          
          console.log(`Driver ${message.driverId} authenticated`);
          
          // Send connection acknowledgement
          ws.send(JSON.stringify({
            type: 'CONNECTION_ACK',
            clientId: message.driverId,
            timestamp: Date.now(),
          }));
          break;

        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });

  ws.on('close', () => {
    // Remove driver on disconnect
    for (const [driverId, driver] of drivers.entries()) {
      if (driver.ws === ws) {
        drivers.delete(driverId);
        console.log(`Driver ${driverId} disconnected`);
        break;
      }
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Broadcast bus location updates
function broadcastBusLocation(busId: string, location: any) {
  const message = {
    type: 'BUS_LOCATION_UPDATE',
    busId,
    ...location,
    timestamp: Date.now(),
  };

  // Send to all connected clients
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

// Example: Broadcast bus location every second
setInterval(() => {
  // Get current bus locations from your service
  buses.forEach((bus) => {
    broadcastBusLocation(bus.id, {
      lat: bus.lat,
      lng: bus.lng,
      heading: bus.heading,
      currentStopIndex: bus.currentStopIndex,
      progressToNextStop: bus.progressToNextStop,
      nextStop: bus.nextStop,
    });
  });
}, 1000);

server.listen(8080, () => {
  console.log('WebSocket server listening on ws://localhost:8080');
});
```

### Alternative: Using Socket.io (Better Browser Support)

```typescript
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('driver:authenticate', (data) => {
    console.log('Driver authenticated:', data);
    socket.emit('auth:success', { driverId: data.driverId });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Broadcast bus updates
function broadcastBusLocation(busId: string, location: any) {
  io.emit('bus:location', {
    busId,
    ...location,
    timestamp: Date.now(),
  });
}

httpServer.listen(8080, () => {
  console.log('Socket.io server listening on port 8080');
});
```

## Message Types

### Client → Server Messages

#### DRIVER_AUTHENTICATED
Sent when a driver starts a route.

```typescript
{
  type: 'DRIVER_AUTHENTICATED',
  driverId: 'driver-123',
  busId: 'bus-456',
  timestamp: 1705678800000
}
```

### Server → Client Messages

#### BUS_LOCATION_UPDATE
Real-time bus position and ETA.

```typescript
{
  type: 'BUS_LOCATION_UPDATE',
  busId: 'bus-456',
  lat: -26.1234,
  lng: 28.5678,
  heading: 45,
  currentStopIndex: 2,
  progressToNextStop: 0.5,
  nextStop: {
    id: 'stop-3',
    name: 'Orlando Station',
    eta: 45
  },
  timestamp: 1705678800000
}
```

#### BUS_STATUS_CHANGE
Bus status changed (active/idle/completed).

```typescript
{
  type: 'BUS_STATUS_CHANGE',
  busId: 'bus-456',
  status: 'active',
  routeId: 'route-789',
  driverId: 'driver-123',
  timestamp: 1705678800000
}
```

#### CONNECTION_ACK
Server acknowledgement of connection.

```typescript
{
  type: 'CONNECTION_ACK',
  clientId: 'driver-123',
  timestamp: 1705678800000
}
```

#### ERROR
Error message from server.

```typescript
{
  type: 'ERROR',
  code: 'AUTH_FAILED',
  message: 'Driver authentication failed',
  timestamp: 1705678800000
}
```

## Migration Guide

### From Local Simulation to WebSocket

The system maintains backward compatibility. To migrate:

1. **Keep both systems running initially** (local simulation + WebSocket)

```typescript
// useRealtimeBus.ts
enableWebSocketMode(); // Enable WebSocket
// Local simulation continues as fallback
```

2. **Monitor WebSocket reliability** (typically 1-2 weeks)

```typescript
// Check WebSocket connection status in monitoring dashboard
const { connected } = useGlobalWebSocket();
```

3. **Once stable, disable local simulation**

```env
VITE_ENABLE_LOCAL_SIMULATION=false
```

4. **Gradually roll out to production**

- Staging environment (1 week)
- Production (phased 10% → 50% → 100%)

### Step-by-Step Implementation

#### Phase 1: Development (Your Current Stage)

✅ Done:
- WebSocket client library
- Hook implementations
- Environment configuration

🔄 Next:
- Start WebSocket server locally
- Test with local simulation running concurrently
- Verify message types and formats

#### Phase 2: Testing & Staging

- Deploy server to staging
- Full system testing with both systems
- Load testing (monitor connection limits)
- Error scenario testing

#### Phase 3: Production Rollout

- Deploy to production with local simulation enabled
- Monitor for 1 week
- Disable local simulation once stable

## Troubleshooting

### WebSocket Connection Failed

**Symptoms**: Console shows "Failed to initialize global WebSocket"

**Solutions**:
1. Check server is running: `telnet localhost 8080`
2. Verify `VITE_WEBSOCKET_URL` is correct
3. Check browser network tab for WebSocket upgrade errors
4. Ensure server allows CORS headers

**Debug**:
```typescript
const ws = getGlobalWebSocket();
console.log('Connected:', ws.isConnected());
console.log('ClientID:', ws.getClientId());
```

### Messages Not Received

**Symptoms**: Bus location not updating in real-time

**Solutions**:
1. Check server is broadcasting messages
2. Verify message format matches types
3. Check `useRealtimeBus` is enabled with `enableWebSocketMode()`
4. Verify bus component is subscribing to updates

**Debug**:
```typescript
const { client } = useGlobalWebSocket();
client.onMessage((msg) => {
  console.log('Received message:', msg);
});
```

### High Latency

**Symptoms**: Real-time updates are slow or delayed

**Solutions**:
1. Check network latency: `ping websocket-server`
2. Reduce message frequency on server (current: 1/sec)
3. Implement client-side interpolation
4. Check server CPU/memory usage

### Frequent Disconnections

**Symptoms**: WebSocket constantly reconnecting

**Solutions**:
1. Check server logs for errors
2. Verify server uptime (process manager needed)
3. Check network stability
4. Increase reconnection timeouts

**Server Process Manager (PM2)**:
```bash
pm2 start server.js --name "bus-websocket"
pm2 save
pm2 startup
```

## Production Deployment

### Server Setup

1. **Use HTTPS/WSS in Production**

```typescript
import fs from 'fs';
import https from 'https';

const server = https.createServer({
  key: fs.readFileSync('private.key'),
  cert: fs.readFileSync('certificate.crt'),
}, app);
```

2. **Set Up Process Manager (PM2)**

```bash
npm install -g pm2

# ecosystem.config.js
module.exports = {
  apps: [{
    name: 'bus-websocket',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    }
  }]
};

pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

3. **Set Up Reverse Proxy (Nginx)**

```nginx
upstream websocket_backend {
  server localhost:8080;
  server localhost:8081;  # Load balancing
}

server {
  listen 443 ssl http2;
  server_name api.yourapp.com;

  ssl_certificate /etc/letsencrypt/live/api.yourapp.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/api.yourapp.com/privkey.pem;

  location /ws {
    proxy_pass http://websocket_backend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

### Monitoring

1. **Connection Metrics**
   - Active connections
   - Connection errors
   - Reconnection rate

2. **Message Metrics**
   - Messages sent/received per second
   - Message size distribution
   - Processing latency

3. **Infrastructure Metrics**
   - CPU usage
   - Memory usage
   - Network bandwidth

**Example Monitoring (using prom-client)**:

```typescript
import promClient from 'prom-client';

const wsConnections = new promClient.Gauge({
  name: 'websocket_connections',
  help: 'Active WebSocket connections'
});

const messagesReceived = new promClient.Counter({
  name: 'websocket_messages_received',
  help: 'Total messages received'
});

wss.on('connection', (ws) => {
  wsConnections.inc();

  ws.on('close', () => {
    wsConnections.dec();
  });

  ws.on('message', () => {
    messagesReceived.inc();
  });
});
```

### Performance Optimization

1. **Message Compression**
   - Use `permessage-deflate` in ws library
   - Reduces bandwidth by 80%+

2. **Connection Pooling**
   - Limit max concurrent connections
   - Implement request queuing

3. **Message Batching**
   - Send multiple updates in single message
   - Reduce protocol overhead

4. **Memory Management**
   - Monitor memory per connection
   - Implement connection timeouts
   - Clean up stale connections

## Next Steps

1. **Implement WebSocket Server**
   - Use provided examples (ws or Socket.io)
   - Deploy to development/staging

2. **Test Integration**
   - Verify real-time updates in browser
   - Test fallback to local simulation

3. **Load Testing**
   - Test with 100+ concurrent connections
   - Monitor latency and CPU usage

4. **Production Deployment**
   - Follow phased rollout strategy
   - Monitor error rates and latency

## Additional Resources

- [MDN WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [ws Library Documentation](https://github.com/websockets/ws)
- [Socket.io Documentation](https://socket.io/docs/)
- [Nginx WebSocket Setup](https://nginx.org/en/docs/http/websocket.html)
