import { cn } from "@/lib/utils";

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withDot?: boolean;
  className?: string;
}

export function CardWrapper({
  children,
  withDot = false,
  className,
  ...props
}: CardWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border/40 bg-card/50 hover:bg-card hover:border-border transition-all overflow-hidden",
        withDot &&
          "relative before:absolute before:left-[-20px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-border before:ring-4 before:ring-background",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
