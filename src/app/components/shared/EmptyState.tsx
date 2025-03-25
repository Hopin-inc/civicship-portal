import { Button } from "@/components/ui/button";
import { Gift, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  hideActionButton?: boolean;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  hideActionButton = false,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">
      {icon && (
        <div className="w-16 h-16 flex items-center justify-center rounded-full bg-muted">
          {icon}
        </div>
      )}
      <div className="space-y-2 max-w-sm">
        <p className="text-base font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {!hideActionButton && actionLabel && onAction && (
        <div className="flex flex-col items-center gap-4">
          <Button onClick={onAction} variant={"default"}>
            <span>{actionLabel}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
