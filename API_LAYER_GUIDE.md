# API Service Layer Documentation

## Overview

The API Service Layer provides a centralized, scalable way to manage all HTTP requests and API interactions. It abstracts API logic from components and makes it easy to switch from mock data to real backend calls.

## Architecture

### Core Components

1. **API Client** (`src/services/api.ts`)
   - HTTP client with base configuration
   - Handles GET, POST, PUT, DELETE requests
   - Manages authentication tokens
   - Error handling and response transformation

2. **Service Modules**
   - `authService.ts` - Authentication (login, logout, token refresh)
   - `driversService.ts` - Driver management
   - `routesService.ts` - Route management
   - `busesService.ts` - Bus tracking and location updates

3. **Custom Hooks** (`src/hooks/useApi.ts`)
   - `useApi` - For manual API calls
   - `useApiQuery` - For automatic queries on mount
   - `useApiMutation` - For data mutations (create, update, delete)

## Quick Start

### Setup Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:3000/api
```

If not set, defaults to `http://localhost:3000/api`

### Using Services in Components

#### Option 1: Using the useApiMutation Hook

```typescript
import { useApiMutation } from "@/hooks/useApi";
import { driversService } from "@/services";

function AddDriver() {
  const { loading, error, execute: createDriver } = useApiMutation(
    (data) => driversService.createDriver(data)
  );

  const handleSubmit = async (formData) => {
    try {
      const newDriver = await createDriver(formData);
      console.log("Driver created:", newDriver);
    } catch (err) {
      console.error("Failed to create driver:", err.message);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({ /* form data */ });
    }}>
      {/* form fields */}
      <button disabled={loading}>
        {loading ? "Creating..." : "Create Driver"}
      </button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

#### Option 2: Using the useApiQuery Hook

```typescript
import { useApiQuery } from "@/hooks/useApi";
import { driversService } from "@/services";

function DriversList() {
  const { data: drivers, loading, error, refetch } = useApiQuery(
    () => driversService.getAllDrivers()
  );

  if (loading) return <p>Loading drivers...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {drivers?.map((driver) => (
        <div key={driver.id}>{driver.name}</div>
      ))}
      <button onClick={refetch}>Refresh</button>
    </div>
  );
}
```

#### Option 3: Direct Service Call

```typescript
import { driversService } from "@/services";

async function fetchDrivers() {
  try {
    const response = await driversService.getAllDrivers();
    if (response.success) {
      console.log("Drivers:", response.data);
    } else {
      console.error("Error:", response.error);
    }
  } catch (error) {
    console.error("Network error:", error);
  }
}
```

## Service Modules

### Authentication Service

```typescript
import { authService } from "@/services";

// Driver login
const response = await authService.driverLogin({
  phone: "0712345678",
  pin: "1234",
});

// Admin login
const response = await authService.adminLogin({
  password: "admin123",
});

// Logout
await authService.logout();

// Refresh token
const response = await authService.refreshToken(refreshToken);
```

### Drivers Service

```typescript
import { driversService } from "@/services";

// Get all drivers
const response = await driversService.getAllDrivers();

// Get single driver
const response = await driversService.getDriver("driver-1");

// Create driver
const response = await driversService.createDriver({
  name: "John Doe",
  phone: "0712345678",
  pin: "1234",
  routeId: "route-1",
});

// Update driver
const response = await driversService.updateDriver("driver-1", {
  name: "Jane Doe",
  routeId: "route-2",
});

// Delete driver
const response = await driversService.deleteDriver("driver-1");

// Invite driver
const response = await driversService.inviteDriver({
  phone: "0712345678",
  pin: "1234",
});

// Get statistics
const response = await driversService.getDriverStats();
```

### Routes Service

```typescript
import { routesService } from "@/services";

// Get all routes
const response = await routesService.getAllRoutes();

// Get single route
const response = await routesService.getRoute("route-1");

// Create route
const response = await routesService.createRoute({
  name: "Route 1",
  from: "Meadowlands",
  to: "Johannesburg CBD",
  busNumber: "P-101",
  busName: "PUTCO Express",
  estimatedDuration: "45 min",
  color: "#F97316",
});

// Update route
const response = await routesService.updateRoute("route-1", {
  name: "Route 1 Updated",
});

// Delete route
const response = await routesService.deleteRoute("route-1");

// Add stop to route
const response = await routesService.addStop("route-1", {
  name: "Bus Stop Name",
  lat: -26.2285,
  lng: 27.8965,
});

// Delete stop from route
const response = await routesService.deleteStop("route-1", "s1");

// Get statistics
const response = await routesService.getRouteStats();
```

### Buses Service

```typescript
import { busesService } from "@/services";

// Get all buses
const response = await busesService.getAllBuses();

// Get single bus
const response = await busesService.getBus("bus-1");

// Get buses by route
const response = await busesService.getBusesByRoute("route-1");

// Get active buses
const response = await busesService.getActiveBuses();

// Start route
const response = await busesService.startRoute({
  driverId: "driver-1",
  busId: "bus-1",
  routeId: "route-1",
});

// Stop route
const response = await busesService.stopRoute({
  busId: "bus-1",
});

// Update location
const response = await busesService.updateLocation({
  busId: "bus-1",
  lat: -26.2285,
  lng: 27.8965,
  heading: 45,
});

// Get statistics
const response = await busesService.getBusStats();
```

## Migrating to Real Backend

When you're ready to connect to your real backend:

1. **Update API URLs** in `.env`:
   ```env
   REACT_APP_API_URL=https://your-api.com/api
   ```

2. **Uncomment backend calls** in service files:
   ```typescript
   // OLD: Mock data
   // return new Promise((resolve) => { ... });

   // NEW: Real API call
   return apiClient.get<Driver[]>("/drivers");
   ```

3. **Ensure your backend implements** the expected endpoints:
   - `GET /drivers`
   - `POST /drivers`
   - `PUT /drivers/:id`
   - `DELETE /drivers/:id`
   - `GET /routes`
   - `POST /routes`
   - etc.

## Error Handling

All API calls return an `ApiResponse<T>` with:
- `success: boolean` - Whether the request succeeded
- `data?: T` - Response data if successful
- `error?: string` - Error message if failed
- `message?: string` - Additional message

Or throw an `ApiError` with:
- `message: string` - Error description
- `status?: number` - HTTP status code
- `data?: any` - Additional error data

## Best Practices

1. **Always use services, not direct fetch calls**
   - Services centralize logic
   - Easy to add logging, caching, etc.

2. **Use hooks for component integration**
   - `useApiQuery` for fetching data
   - `useApiMutation` for modifying data

3. **Handle loading and error states**
   ```typescript
   if (loading) return <Spinner />;
   if (error) return <ErrorMessage error={error} />;
   return <DataDisplay data={data} />;
   ```

4. **Use environment variables for URLs**
   - Don't hardcode API endpoints
   - Support multiple environments (dev, staging, prod)

5. **Add request/response logging in development**
   ```typescript
   if (process.env.NODE_ENV === 'development') {
     console.log('API Request:', endpoint, data);
     console.log('API Response:', response);
   }
   ```

## Response Format

All API responses follow this format:

```typescript
{
  success: true,
  data: { /* response data */ },
  message: "Optional success message"
}

// Or on error:
{
  success: false,
  error: "Error message"
}
```

## Testing

To test API calls in development:

```typescript
// In browser console
import { driversService } from "@/services";

// Test driver fetch
driversService.getAllDrivers().then(res => console.log(res));

// Test driver creation
driversService.createDriver({
  name: "Test Driver",
  phone: "0712345678",
  pin: "1234"
}).then(res => console.log(res));
```

## Next Steps

1. Build your backend with the expected API endpoints
2. Update environment variables with backend URLs
3. Uncomment real API calls in service files
4. Test each endpoint thoroughly
5. Add request/response interceptors for common features (auth, caching)
