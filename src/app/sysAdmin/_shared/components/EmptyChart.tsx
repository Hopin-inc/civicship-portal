import { Inbox } from "lucide-react";
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
        "flex min-h-[220px] flex-col items-center justify-center gap-2 py-8 text-sm text-muted-foreground",
        className,
      )}
    >
      <Inbox className="h-6 w-6" aria-hidden />
      <span>{message ?? sysAdminDashboardJa.state.chartEmpty}</span>
    </div>
  );
}
