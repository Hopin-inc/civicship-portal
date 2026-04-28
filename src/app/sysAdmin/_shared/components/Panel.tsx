import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

/**
 * Generic panel: card 枠なしで title + actions + content を垂直に並べる。
 * 親 layout 側の gap で breathing room を確保する。L2 detail の旧構成 で
 * 使われていた helper だが、現 L2 overview (CommunityDashboardOverview) は
 * 直接の card で組んでおり Panel は使用していない。subpage の deep-dive
 * (Phase 2) で再利用候補。
 */
export function Panel({ title, description, actions, children, footer, className }: Props) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-0.5">
          <h3 className="text-base font-semibold">{title}</h3>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div>
        {children}
        {footer && <div className="mt-2 text-xs text-muted-foreground">{footer}</div>}
      </div>
    </section>
  );
}
