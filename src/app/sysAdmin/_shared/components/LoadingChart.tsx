import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export function LoadingChart({ className }: Props) {
  return (
    <div className={cn("min-h-[260px] p-2", className)}>
      <Skeleton className="h-[240px] w-full" />
    </div>
  );
}
