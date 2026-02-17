import { ArrowLeft, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightActions?: React.ReactNode;
  showBackButton?: boolean;
  className?: string;
  sticky?: boolean;
}

/**
 * Mobile-optimized header with back button and action slots
 */
export const MobileHeader = ({
  title,
  subtitle,
  onBack,
  rightActions,
  showBackButton = true,
  className,
  sticky = true,
}: MobileHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = onBack ? onBack : () => navigate(-1);

  return (
    <header
      className={cn(
        "bg-secondary text-secondary-foreground px-4 py-3 flex items-center justify-between shrink-0 shadow-md z-10",
        "safe-pt",
        sticky && "sticky top-0",
        className
      )}
    >
      {/* Left side - back button */}
      <div className="flex items-center gap-3 flex-1">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="touch-target p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <h1 className="font-display text-base sm:text-lg truncate">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm opacity-75 truncate">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right side - actions */}
      {rightActions && (
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {rightActions}
        </div>
      )}
    </header>
  );
};

export default MobileHeader;
