import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

/**
 * Animated loading spinner
 */
export const LoadingSpinner = ({
  size = "md",
  text,
  className,
}: LoadingSpinnerProps) => {
  const sizeClass = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("flex flex-col items-center justify-center gap-3", className)}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className={cn(sizeClass, "text-primary")} />
      </motion.div>
      {text && (
        <p className="text-sm text-muted-foreground font-body">{text}</p>
      )}
    </motion.div>
  );
};

/**
 * Full page loading overlay
 */
interface LoadingOverlayProps {
  isOpen: boolean;
  message?: string;
}

export const LoadingOverlay = ({ isOpen, message }: LoadingOverlayProps) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <LoadingSpinner size="lg" text={message} />
    </motion.div>
  );
};

/**
 * Inline loading state
 */
interface InlineLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export const InlineLoading = ({ isLoading, children }: InlineLoadingProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center py-8"
    >
      <LoadingSpinner size="md" text="Loading..." />
    </motion.div>
  );
};

/**
 * Button loading state
 */
interface ButtonLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ButtonLoading = ({
  isLoading,
  children,
  className,
}: ButtonLoadingProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <motion.span
      className={cn("flex items-center gap-2", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-4 h-4" />
      </motion.div>
      <span>{children}</span>
    </motion.span>
  );
};

/**
 * Skeleton loading text (pulsing dots)
 */
export const PulsingDots = () => (
  <motion.span>
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      .
    </motion.span>
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
    >
      .
    </motion.span>
    <motion.span
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
    >
      .
    </motion.span>
  </motion.span>
);
