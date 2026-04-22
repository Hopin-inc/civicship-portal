import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function ChartCard({ title, description, actions, children, footer, className }: Props) {
  return (
    <Card className={cn("shadow-none", className)}>
      <CardHeader className="flex flex-col gap-2 pb-2 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-0.5">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>
      <CardContent className="pt-0">
        {children}
        {footer && <div className="mt-2 text-xs text-muted-foreground">{footer}</div>}
      </CardContent>
    </Card>
  );
}
