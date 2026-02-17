import { Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileNavItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}

interface MobileNavProps {
  items: MobileNavItem[];
  title?: string;
  className?: string;
}

/**
 * Mobile navigation menu with hamburger toggle
 */
export const MobileNav = ({
  items,
  title,
  className,
}: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("md:hidden", className)}>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="touch-target p-2 hover:bg-muted rounded-lg transition-colors"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border rounded-b-lg shadow-lg">
          {title && (
            <div className="px-4 py-3 border-b border-border font-display text-sm">
              {title}
            </div>
          )}
          <nav className="flex flex-col">
            {items.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 text-left border-b border-border/50 last:border-b-0",
                  "hover:bg-muted transition-colors touch-target",
                  item.active && "bg-primary/10 text-primary font-medium"
                )}
              >
                {item.icon && <div className="flex-shrink-0">{item.icon}</div>}
                <span className="flex-1">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
