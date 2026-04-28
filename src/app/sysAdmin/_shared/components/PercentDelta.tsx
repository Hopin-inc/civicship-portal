import { cn } from "@/lib/utils";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  value: number | null | undefined;
  className?: string;
  /** 矢印 (↑/↓) を separate span で出して別サイズに調整したいときに渡す。
   * 未指定なら数値と同じスタイルで連結表示。 */
  arrowClassName?: string;
};

export function PercentDelta({ value, className, arrowClassName }: Props) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return <span className={cn("text-muted-foreground", className)}>{sysAdminDashboardJa.delta.noData}</span>;
  }
  const isPositive = value > 0;
  const isNegative = value < 0;
  const arrow = isPositive ? "↑" : isNegative ? "↓" : "";
  const formatted = toPct(Math.abs(value));
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
      {arrow && <span className={arrowClassName}>{arrow}</span>}
      {formatted}
    </span>
  );
}
