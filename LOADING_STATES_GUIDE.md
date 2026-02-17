# Loading States & Skeleton Screens Guide

## Overview

This guide covers all loading, error, and empty state components for better UX during async operations.

## Components

### Loading Spinners

#### LoadingSpinner

Basic animated spinner with optional text:

```typescript
import { LoadingSpinner } from "@/components/loaders";

<LoadingSpinner
  size="md"              // "sm" | "md" | "lg"
  text="Loading..."      // Optional text below spinner
  className="py-8"      // Additional classes
/>
```

#### LoadingOverlay

Full-page loading overlay with blur background:

```typescript
import { LoadingOverlay } from "@/components/loaders";

<LoadingOverlay
  isOpen={isLoading}
  message="Please wait..."
/>
```

#### InlineLoading

Shows spinner in place of content:

```typescript
import { InlineLoading } from "@/components/loaders";

<InlineLoading isLoading={isLoading}>
  {/* Your content here */}
</InlineLoading>
```

#### ButtonLoading

Loading state for buttons:

```typescript
import { ButtonLoading } from "@/components/loaders";

<Button disabled={isLoading}>
  <ButtonLoading isLoading={isLoading}>
    Save Changes
  </ButtonLoading>
</Button>
```

#### PulsingDots

Simple pulsing dots indicator:

```typescript
import { PulsingDots } from "@/components/loaders";

<p>Loading<PulsingDots /></p>
// Outputs: "Loading..."
```

### Skeleton Loaders

Pre-built skeletons for different content types:

```typescript
import {
  RouteCardSkeleton,
  RouteListSkeleton,
  DriverListSkeleton,
  MapSkeleton,
  CardSkeleton,
  FormSkeleton,
  TextSkeleton,
  TableRowSkeleton,
  StatsSkeleton,
  FeaturePanelSkeleton,
} from "@/components/loaders";

// Show skeleton while loading data
{loading ? <RouteListSkeleton count={5} /> : <RouteList {...props} />}

// Dashboard stats loading
{loading ? <StatsSkeleton count={3} /> : <Stats {...props} />}

// Form fields loading
{loading ? <FormSkeleton fields={4} /> : <Form {...props} />}
```

### Error States

#### ErrorState

Error message with retry option:

```typescript
import { ErrorState } from "@/components/loaders";

<ErrorState
  error={error}
  onRetry={async () => {
    // Retry function
  }}
  onDismiss={() => {
    // Clear error
  }}
  fallbackMessage="Something went wrong"
/>
```

#### EmptyState

Empty state with optional action:

```typescript
import { EmptyState } from "@/components/loaders";
import { Heart } from "lucide-react";

<EmptyState
  icon={<Heart className="w-8 h-8 text-muted-foreground" />}
  title="No favorites yet"
  description="Routes you save will appear here"
  action={{
    label: "Browse routes",
    onClick: () => navigate("/routes"),
  }}
/>
```

#### NetworkError

Network connection error:

```typescript
import { NetworkError } from "@/components/loaders";

{!isOnline && (
  <NetworkError
    isOnline={isOnline}
    onRetry={retry}
  />
)}
```

#### ValidationErrors

Display form validation errors:

```typescript
import { ValidationErrors } from "@/components/loaders";

<ValidationErrors
  errors={[
    { field: "Phone", message: "Must be 10 digits" },
    { field: "PIN", message: "Must be 4 digits" },
  ]}
  onDismiss={() => setErrors([])}
/>
```

## Hooks

### useLoadingState

Manage loading state:

```typescript
import { useLoadingState } from "@/hooks/useLoadingState";

const { isLoading, start, stop, toggle } = useLoadingState();

const handleClick = async () => {
  start();
  try {
    await someAsyncOperation();
  } finally {
    stop();
  }
};
```

### useNetworkStatus

Detect network connectivity:

```typescript
import { useNetworkStatus } from "@/hooks/useLoadingState";

const isOnline = useNetworkStatus();

return (
  <div>
    {isOnline ? "Online" : "Offline"}
  </div>
);
```

### useDebouncedLoading

Prevent flickering on fast requests:

```typescript
import { useDebouncedLoading } from "@/hooks/useLoadingState";

const debouncedIsLoading = useDebouncedLoading(isLoading, 300);

// Spinner won't show if request completes in < 300ms
{debouncedIsLoading && <LoadingSpinner />}
```

### useAsync

Manage async operation state:

```typescript
import { useAsync } from "@/hooks/useLoadingState";

const { data, isLoading, error, execute } = useAsync(
  async () => {
    const response = await driversService.getAllDrivers();
    return response.data;
  },
  true // immediate - run on mount
);

// Later, retry manually
await execute();
```

## Real-World Examples

### Example 1: Route List with Skeleton

```typescript
function RouteListContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [routes, setRoutes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRoutes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await routesService.getAllRoutes();
        setRoutes(response.data || []);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoutes();
  }, []);

  if (error) {
    return (
      <ErrorState
        error={error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return isLoading ? (
    <RouteListSkeleton count={5} />
  ) : routes.length === 0 ? (
    <EmptyState
      icon={<MapPin className="w-8 h-8" />}
      title="No routes available"
      description="Check back later"
    />
  ) : (
    <RouteList routes={routes} />
  );
}
```

### Example 2: Form with Validation & Loading

```typescript
function CreateDriverForm() {
  const form = useFormValidation(initialValues, {
    validate: schemas.createDriver,
    onSubmit: async (data) => {
      // Form loading is handled by isSubmitting from hook
      const response = await driversService.createDriver(data);
      if (!response.success) {
        form.setFieldError("email", response.error);
      }
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <ValidationErrors errors={form.errors} />

      <FormField
        name="name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.getFieldError("name")}
        touched={form.showFieldError("name")}
        disabled={form.isSubmitting}
      />

      <Button type="submit" disabled={form.isSubmitting}>
        <ButtonLoading isLoading={form.isSubmitting}>
          Create Driver
        </ButtonLoading>
      </Button>
    </form>
  );
}
```

### Example 3: Network-Aware Data Loading

```typescript
function DataDashboard() {
  const isOnline = useNetworkStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!isOnline) {
      setError("No internet connection");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getData();
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [isOnline]);

  return (
    <div>
      {!isOnline && (
        <NetworkError isOnline={false} onRetry={loadData} />
      )}

      {error && (
        <ErrorState error={error} onRetry={loadData} />
      )}

      {isLoading ? (
        <StatsSkeleton count={3} />
      ) : data ? (
        <Dashboard data={data} />
      ) : (
        <EmptyState title="No data" />
      )}
    </div>
  );
}
```

### Example 4: Data Table with Debounced Loading

```typescript
function DriverTable() {
  const [isLoading, setIsLoading] = useState(false);
  const debouncedIsLoading = useDebouncedLoading(isLoading, 300);
  const [drivers, setDrivers] = useState([]);

  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const response = await driversService.searchDrivers(query);
      setDrivers(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search drivers..."
      />

      {debouncedIsLoading && (
        <div className="p-4 text-center">
          <PulsingDots /> Searching
        </div>
      )}

      {drivers.length === 0 && !debouncedIsLoading ? (
        <EmptyState title="No drivers found" />
      ) : (
        <table>
          {/* Table content */}
        </table>
      )}
    </div>
  );
}
```

## Pattern: Complete Async Data Loading

```typescript
function MyComponent() {
  const { data, isLoading, error, execute } = useAsync(
    async () => {
      const response = await service.getData();
      return response.data;
    },
    true // Load on mount
  );

  return (
    <div>
      {isLoading && <LoadingSpinner text="Loading data..." />}

      {error && (
        <ErrorState
          error={error}
          onRetry={execute}
        />
      )}

      {data && !isLoading && (
        <DataDisplay data={data} />
      )}

      {!isLoading && !error && !data && (
        <EmptyState title="No data found" />
      )}
    </div>
  );
}
```

## Best Practices

1. **Prevent Flicker**: Use `useDebouncedLoading` for fast requests
2. **Always Show Error**: Every loading state should have error handling
3. **Empty States**: Show empty state when data exists but is empty
4. **Network Aware**: Check connectivity before loading
5. **User Feedback**: Always show what's happening to the user
6. **Retry Options**: Provide retry buttons for failed requests
7. **Debounce Search**: Use debouncing for search input loading

## Skeleton Best Practices

1. **Match Content Shape**: Skeleton should look like the final content
2. **Appropriate Count**: Show same number of skeletons as expected items
3. **Avoid Flicker**: Use debounced loading if requests are very fast
4. **Smooth Transitions**: Skeleton to content should fade smoothly

## CSS Animation Details

All loaders use Tailwind's `animate-pulse` or Framer Motion for smooth animations:

- Spinners: 360° rotation over 2 seconds
- Skeletons: Pulse animation with varying opacity
- Overlays: Fade in/out with backdrop blur
- Buttons: Rotating spinner inside button

## Customization

Create custom skeletons by using the base `Skeleton` component:

```typescript
import { Skeleton } from "@/components/ui/skeleton";

const CustomSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-1/2" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
  </div>
);
```
