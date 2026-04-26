import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  height?: number;
};

export function ChartSkeleton({ height = 260 }: Props) {
  return <Skeleton className="w-full" style={{ height }} />;
}
