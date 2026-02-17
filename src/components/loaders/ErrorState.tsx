import { motion } from "framer-motion";
import { AlertCircle, RefreshCw, Home, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ApiError } from "@/services/api";

interface ErrorStateProps {
  error: ApiError | Error | string | null;
  onRetry?: () => void;
  onDismiss?: () => void;
  fallbackMessage?: string;
}

/**
 * Error state with retry option
 */
export const ErrorState = ({
  error,
  onRetry,
  onDismiss,
  fallbackMessage = "Something went wrong",
}: ErrorStateProps) => {
  const getMessage = (): string => {
    if (typeof error === "string") {
      return error;
    }
    if (error instanceof Error) {
      return error.message;
    }
    if (error && "message" in error) {
      return error.message;
    }
    return fallbackMessage;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center justify-center py-12 px-4"
    >
      <Card className="bg-red-50/50 border-red-200 max-w-md w-full">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-red-900 mb-1">
              Error
            </h3>
            <p className="text-sm text-red-700 font-body">
              {getMessage()}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            {onRetry && (
              <Button
                onClick={onRetry}
                size="sm"
                className="flex-1"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Retry
              </Button>
            )}
            {onDismiss && (
              <Button
                onClick={onDismiss}
                size="sm"
                variant="ghost"
                className="flex-1"
              >
                Dismiss
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Empty state
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState = ({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-12 px-4 text-center"
  >
    {icon && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="mb-4 p-3 bg-muted rounded-full"
      >
        {icon}
      </motion.div>
    )}
    <h3 className="font-display text-lg font-semibold mb-1">{title}</h3>
    {description && (
      <p className="text-sm text-muted-foreground font-body mb-4 max-w-xs">
        {description}
      </p>
    )}
    {action && (
      <Button onClick={action.onClick} size="sm">
        {action.label}
      </Button>
    )}
  </motion.div>
);

/**
 * Network error with offline detection
 */
interface NetworkErrorProps {
  isOnline?: boolean;
  onRetry?: () => void;
}

export const NetworkError = ({
  isOnline = false,
  onRetry,
}: NetworkErrorProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-center gap-3"
  >
    <Zap className="w-5 h-5 text-amber-600 flex-shrink-0" />
    <div className="flex-1">
      <p className="text-sm font-semibold text-amber-900">
        {isOnline
          ? "Connection restored"
          : "No internet connection"}
      </p>
      <p className="text-xs text-amber-800 mt-1">
        {isOnline
          ? "Your connection is back. Try again."
          : "Check your internet and try again."}
      </p>
    </div>
    {isOnline && onRetry && (
      <Button
        onClick={onRetry}
        size="sm"
        variant="outline"
        className="flex-shrink-0"
      >
        Retry
      </Button>
    )}
  </motion.div>
);

/**
 * Validation error list
 */
interface ValidationErrorsProps {
  errors: Array<{ field: string; message: string }>;
  onDismiss?: () => void;
}

export const ValidationErrors = ({
  errors,
  onDismiss,
}: ValidationErrorsProps) => {
  if (errors.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 border border-red-200 rounded-lg p-4"
    >
      <div className="flex gap-3">
        <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm text-red-900 mb-2">
            Please fix the following errors:
          </h4>
          <ul className="space-y-1">
            {errors.map((error, idx) => (
              <li key={idx} className="text-sm text-red-700 font-body">
                <span className="font-semibold">{error.field}:</span> {error.message}
              </li>
            ))}
          </ul>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-700 flex-shrink-0"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

/**
 * Retry button component
 */
interface RetryButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  error?: ApiError | Error | string | null;
}

export const RetryButton = ({
  onClick,
  isLoading,
  error,
}: RetryButtonProps) => {
  if (!error && !isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-2"
    >
      <Button
        onClick={onClick}
        disabled={isLoading}
        variant="outline"
        size="sm"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
            </motion.div>
            Retrying...
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-1" />
            Try Again
          </>
        )}
      </Button>
    </motion.div>
  );
};
