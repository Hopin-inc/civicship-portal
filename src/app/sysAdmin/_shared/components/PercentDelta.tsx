import { cn } from "@/lib/utils";
import { toArrowPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  value: number | null | undefined;
  className?: string;
};

export function PercentDelta({ value, className }: Props) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return <span className={cn("text-muted-foreground", className)}>{sysAdminDashboardJa.delta.noData}</span>;
  }
  const isPositive = value > 0;
  const isNegative = value < 0;
  return (
    <span
      className={cn(
        "tabular-nums font-medium",
        isPositive && "text-green-600",
        isNegative && "text-red-600",
        !isPositive && !isNegative && "text-muted-foreground",
        className,
      )}
    >
      {toArrowPct(value)}
    </span>
  );
}
