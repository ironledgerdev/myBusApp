# WebSocket Troubleshooting Guide

## Current Status

Your app is currently running in **Local Simulation Mode**. This is the default configuration and works perfectly without a WebSocket server.

**WebSocket is DISABLED by default** (`VITE_ENABLE_WEBSOCKET=false`) to prevent connection errors when the server isn't available.

## How to Enable WebSocket

### Step 1: Start Your WebSocket Server

First, you need a WebSocket server running. See [WEBSOCKET_SETUP_GUIDE.md](WEBSOCKET_SETUP_GUIDE.md) for examples using:
- **Express + ws library**
- **Socket.io**
- **Your own custom server**

Example using `ws` library:

```bash
npm install ws express

# Create server.js
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('message', (data) => {
    console.log('Received:', data);
  });
});

server.listen(8080, () => {
  console.log('WebSocket server running on ws://localhost:8080');
});
```

Run it:
```bash
node server.js
```

### Step 2: Enable WebSocket in Environment

Once your server is running, update `.env`:

```env
# Change from:
VITE_ENABLE_WEBSOCKET=false

# To:
VITE_ENABLE_WEBSOCKET=true
```

### Step 3: Verify Connection

1. Refresh your browser
2. Open DevTools (F12)
3. Look for success message in console:
   - ✅ "WebSocket connection: connected"
   - ⚠️ "WebSocket connection: disconnected" (server issues)

## Common Errors & Fixes

### Error: "WebSocket server unavailable"

**Cause:** Server isn't running on the configured URL

**Fix:**
```bash
# 1. Make sure server is running
# 2. Check the port matches (default: 8080)
# 3. If using different port, update .env:
VITE_WEBSOCKET_URL=ws://localhost:YOUR_PORT
# 4. Restart dev server (npm run dev)
```

### Error: "Connection refused"

**Cause:** Server isn't listening or wrong URL

**Fix:**
```bash
# 1. Check server is running
netstat -an | grep 8080  # macOS/Linux

# 2. Verify correct address
VITE_WEBSOCKET_URL=ws://localhost:8080  # local development
VITE_WEBSOCKET_URL=wss://api.example.com/ws  # production
```

### App Still Uses Local Simulation Despite WebSocket Enabled

**Cause:** Connection failed silently

**Fix:**
```bash
# 1. Open DevTools (F12)
# 2. Check Console tab for warnings
# 3. Check Network tab for failed WebSocket upgrade
# 4. Verify server is sending proper WebSocket headers

# From server, make sure you:
# - Handle the WebSocket upgrade (http → ws)
# - Accept connections properly
# - Test with wscat:
npm install -g wscat
wscat -c ws://localhost:8080
```

## Debugging WebSocket Connection

### Check Connection Status

Open DevTools Console and run:

```javascript
// Get global WebSocket client
const ws = window.getGlobalWebSocket?.();

// Check if connected
console.log('Connected:', ws?.isConnected());

// Listen to messages
ws?.onMessage((msg) => {
  console.log('Received:', msg);
});

// Listen to connection changes
ws?.onConnectionChange((connected) => {
  console.log('Connection changed:', connected);
});

// Listen to errors
ws?.onError((error) => {
  console.log('WebSocket error:', error);
});
```

### Check Network Activity

1. Open DevTools → Network tab
2. Filter by "WS"
3. Look for WebSocket connection attempts
4. Check the "Messages" tab for sent/received data

Expected successful upgrade:
- Initial HTTP upgrade request
- Status: 101 Switching Protocols
- Then WS handshake complete

### Server-Side Debugging

Add logging to your server:

```javascript
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('✅ Client connected:', ws._socket.remoteAddress);
  
  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    console.log('📨 Received:', msg.type);
  });
  
  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
  
  ws.on('close', () => {
    console.log('👋 Client disconnected');
  });
});
```

## What Works Without WebSocket

Everything works perfectly with **Local Simulation Mode**:

✅ Bus real-time tracking (simulated)  
✅ ETA calculations  
✅ Driver dashboard  
✅ Commuter features (favorites, alerts, ratings)  
✅ Admin management  
✅ Route management  

Local simulation uses:
- Mock GPS data
- Interpolated positions between stops
- 100ms update interval
- In-memory state

Perfect for development and testing!

## Switching Back to Local Simulation

If you want to disable WebSocket again:

```env
VITE_ENABLE_WEBSOCKET=false
VITE_ENABLE_LOCAL_SIMULATION=true
```

Then refresh your browser. The app will work exactly the same, just using simulated GPS instead of real server data.

## Phased Rollout Strategy

### Phase 1: Development (Current)
- Keep WebSocket disabled
- Use local simulation
- Test features without server dependency

### Phase 2: Testing with Server
```env
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_LOCAL_SIMULATION=true  # Keep as fallback
```
- Run both systems concurrently
- Verify WebSocket messaging
- Test reconnection logic

### Phase 3: Production Ready
```env
VITE_ENABLE_WEBSOCKET=true
VITE_ENABLE_LOCAL_SIMULATION=false  # Remove fallback
```
- Disable local simulation
- Monitor real-time performance
- Handle edge cases

## Still Having Issues?

1. **Check browser console** for error messages
2. **Verify server is running**: Test with wscat or similar
3. **Confirm network connectivity**: ping your server
4. **Check CORS/HTTPS**: WebSocket security headers
5. **Review WebSocket protocol**: Ensure server sends correct handshake
6. **Test with simple client**: Before integrating into app

## Next Steps

Once you have a WebSocket server running:

1. Update `VITE_ENABLE_WEBSOCKET=true` in `.env`
2. Restart dev server: `npm run dev`
3. Check console for connection status
4. Test real-time updates (start a route as driver)
5. Monitor Network tab for WebSocket messages

See [WEBSOCKET_SETUP_GUIDE.md](WEBSOCKET_SETUP_GUIDE.md) for complete server implementation examples!
