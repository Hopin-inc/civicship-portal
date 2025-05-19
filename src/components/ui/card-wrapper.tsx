import { cn } from "@/lib/utils";

interface CardWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  withDot?: boolean;
  clickable?: boolean;
  className?: string;
}

export function CardWrapper({
  children,
  withDot = false,
  clickable = false,
  className,
  ...props
}: CardWrapperProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-background transition-all overflow-hidden",
        withDot &&
          "relative before:absolute before:left-[-20px] before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full before:bg-border before:ring-4 before:ring-background",
        clickable && "hover:bg-background-hover hover:border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
