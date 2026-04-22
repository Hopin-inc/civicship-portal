import { cn } from "@/lib/utils";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  message?: string;
  className?: string;
};

export function EmptyChart({ message, className }: Props) {
  return (
    <div
      role="status"
      className={cn(
        "flex min-h-[260px] items-center justify-center text-sm text-muted-foreground",
        className,
      )}
    >
      {message ?? sysAdminDashboardJa.state.chartEmpty}
    </div>
  );
}
