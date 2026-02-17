import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route card skeleton loader
 */
export const RouteCardSkeleton = () => (
  <div className="border-b border-border p-4 space-y-3">
    <div className="flex items-start gap-3">
      <Skeleton className="w-3 h-3 rounded-full mt-1.5" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="w-4 h-4" />
    </div>
  </div>
);

/**
 * Route list skeleton loader
 */
export const RouteListSkeleton = ({ count = 5 } = {}) => (
  <div className="flex flex-col h-full">
    <div className="p-4 border-b border-border">
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
    <div className="flex-1 overflow-y-auto">
      {Array.from({ length: count }).map((_, i) => (
        <RouteCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

/**
 * Driver list skeleton loader
 */
export const DriverListSkeleton = ({ count = 5 } = {}) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-background/95 border border-primary/20 rounded-lg p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

/**
 * Map skeleton loader
 */
export const MapSkeleton = () => (
  <Skeleton className="w-full h-full rounded-lg" />
);

/**
 * Card skeleton loader
 */
export const CardSkeleton = () => (
  <div className="bg-background/95 border border-primary/20 rounded-lg p-4 space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-32" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);

/**
 * Form skeleton loader
 */
export const FormSkeleton = ({ fields = 3 } = {}) => (
  <div className="space-y-4">
    {Array.from({ length: fields }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    ))}
    <Skeleton className="h-10 w-full rounded-md mt-4" />
  </div>
);

/**
 * Text skeleton loader
 */
export const TextSkeleton = ({ lines = 3, lastLineWidth = "75%" } = {}) => (
  <div className="space-y-2">
    {Array.from({ length: lines - 1 }).map((_, i) => (
      <Skeleton key={i} className="h-3 w-full" />
    ))}
    <Skeleton className="h-3" style={{ width: lastLineWidth }} />
  </div>
);

/**
 * Table row skeleton loader
 */
export const TableRowSkeleton = ({ columns = 4 } = {}) => (
  <div className="flex gap-4 p-4">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} className="h-6 flex-1" />
    ))}
  </div>
);

/**
 * Dashboard stats skeleton loader
 */
export const StatsSkeleton = ({ count = 3 } = {}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-background/95 border border-primary/20 rounded-lg p-4">
        <div className="pb-3 space-y-2">
          <Skeleton className="h-4 w-24" />
        </div>
        <div>
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Feature panel skeleton loader
 */
export const FeaturePanelSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-2 overflow-x-auto pb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-24 rounded-lg flex-shrink-0" />
      ))}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  </div>
);
