import React from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FilterButtonProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  active?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  icon,
  label,
  value,
  active = false,
  onClick,
  children,
}) => (
  <Button
    onClick={onClick}
    variant="tertiary"
    className="w-full px-4 py-4 flex items-center justify-between text-left"
  >
    <div className="flex flex-col space-y-0.5 flex-1">
      <div className="flex items-center space-x-4">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="pl-10">
        <span
          className={`text-base ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}
        >
          {value}
        </span>
        {children}
      </div>
    </div>
    <ChevronRight className="h-5 w-5 text-gray-400" />
  </Button>
);

export default FilterButton;
