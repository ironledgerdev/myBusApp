import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import React from "react";

const mobileButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-body font-medium transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed touch-target",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
        outline:
          "border-2 border-primary text-primary hover:bg-primary/10 bg-transparent",
        ghost:
          "bg-transparent text-foreground hover:bg-muted active:bg-muted/50",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        sm: "px-3 py-2 text-sm h-10",
        md: "px-4 py-2.5 text-base h-12",
        lg: "px-6 py-3 text-lg h-14",
        icon: "p-2 h-10 w-10",
        "icon-lg": "p-3 h-12 w-12",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface MobileButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof mobileButtonVariants> {}

/**
 * Mobile-optimized button with proper touch target sizes (48x48px minimum)
 */
const MobileButton = React.forwardRef<HTMLButtonElement, MobileButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        mobileButtonVariants({ variant, size, fullWidth }),
        className
      )}
      {...props}
    />
  )
);
MobileButton.displayName = "MobileButton";

export { MobileButton, mobileButtonVariants };
