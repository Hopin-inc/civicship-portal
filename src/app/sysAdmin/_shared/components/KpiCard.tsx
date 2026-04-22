import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: ReactNode;
  sublabel?: ReactNode;
  size?: "sm" | "lg";
  className?: string;
};

export function KpiCard({ label, value, sublabel, size = "sm", className }: Props) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardContent
        className={cn(
          "flex flex-col gap-1",
          size === "sm" ? "p-4" : "p-6",
        )}
      >
        <div
          className={cn(
            "text-muted-foreground",
            size === "sm" ? "text-xs" : "text-sm",
          )}
        >
          {label}
        </div>
        <div
          className={cn(
            "font-semibold tabular-nums",
            size === "sm" ? "text-xl" : "text-3xl",
          )}
        >
          {value}
        </div>
        {sublabel && (
          <div className="text-xs text-muted-foreground">{sublabel}</div>
        )}
      </CardContent>
    </Card>
  );
}
