import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function DashboardSection({ title, description, actions, children, className }: Props) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      {(title || actions) && (
        <header className="flex flex-row items-end justify-between gap-2">
          <div className="flex flex-col gap-0.5">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
