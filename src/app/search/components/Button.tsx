import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  active?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
  verticalLayout?: boolean;
  className?: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon,
  label,
  value,
  active = false,
  onClick,
  children,
  verticalLayout = false,
  className,
}) => (
  <Button
    onClick={onClick}
    variant="tertiary"
    className={cn("w-full px-4 py-3 flex items-center justify-between text-left bg-background rounded-none border-b hover:bg-background/80 h-auto", className)}
  >
    <div className={cn("flex", {
      "items-start": verticalLayout,
      "items-center": !verticalLayout,
    })}>
      <div className="text-muted-foreground mr-3">
        {icon}
      </div>
      <div className="flex-1">
        {verticalLayout ? (
          <div>
            <div className="text-caption text-label-sm">{label}</div>
            {(value || children) && (
              <div className="mt-1 text-body-md font-medium text-foreground">
                {value}
                {children}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-baseline">
            <span className="text-caption text-label-sm mr-2">{label}</span>
            <span className="text-body-md font-medium text-foreground">
              {value}
            </span>
          </div>
        )}
      </div>
    </div>

    <ChevronRight className="h-5 w-5 text-muted-foreground" />
  </Button>
);

export default FilterButton;
