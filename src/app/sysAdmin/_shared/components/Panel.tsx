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
 * L2 detail のパネル基底。カード枠を持たず、title + actions + content だけを
 * 垂直に並べる。親側 (CommunityDashboardDetail) の gap でセクション間の
 * breathing room を確保する。
 *
 * 旧 ChartCard から border+shadow+padding を剥がした版。同じ視覚重量の
 * カードが縦に連なることによるリズムの消失を解消する意図。
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
