import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
};

export function StatCell({ label, value, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold tabular-nums">{value}</div>
    </div>
  );
}
