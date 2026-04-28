import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  rating: number;
  /** 1 個あたりの大きさ (Tailwind size class)。デフォルト `h-3.5 w-3.5`。 */
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZE_CLASS: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-3 w-3",
  md: "h-3.5 w-3.5",
  lg: "h-5 w-5",
};

/**
 * read-only な 5 段星表示。アクセシビリティのため
 * `role="img"` + `aria-label` で「N / 5」を発音させる。
 */
export function Stars({ rating, size = "md", className }: Props) {
  return (
    <span
      role="img"
      aria-label={`${rating} / 5`}
      className={cn("inline-flex shrink-0", className)}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            SIZE_CLASS[size],
            n <= rating ? "fill-amber-400 text-amber-400" : "text-muted",
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}
