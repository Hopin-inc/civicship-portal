import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Stars } from "./Stars";

type DistributionBucket = {
  rating: number;
  count: number;
};

type Props = {
  /** 0 件のとき null。表示は "—" に落ちる。 */
  avgRating: number | null;
  totalCount: number;
  /**
   * backend の `reportTemplateFeedbackStats.ratingDistribution` をそのまま渡す。
   * dense 5 行 (1..5) で count=0 を含むのが backend 仕様。
   * undefined の場合は distribution bar を出さない (= summary だけ)。
   */
  distribution?: DistributionBucket[];
  className?: string;
};

/**
 * shadcnblocks の Customer Reviews 上部風 summary。
 *
 * 表示:
 *   ┌──────────────────────────────────┐
 *   │              4.3                 │
 *   │           ★★★★☆                  │
 *   │       全 6 件のフィードバック    │
 *   │                                  │
 *   │  5★ [████████░░░░░░░] 3          │
 *   │  4★ [█████░░░░░░░░░░] 2          │
 *   │  3★ [██░░░░░░░░░░░░░] 1          │
 *   │  2★ [░░░░░░░░░░░░░░░] 0          │
 *   │  1★ [░░░░░░░░░░░░░░░] 0          │
 *   └──────────────────────────────────┘
 *
 * `distribution` が無いときは下半分 (bar chart) を省略し、上の集計値だけ出す。
 */
export function RatingSummary({
  avgRating,
  totalCount,
  distribution,
  className,
}: Props) {
  const rounded = avgRating != null ? Math.round(avgRating) : 0;
  const max = distribution
    ? Math.max(1, ...distribution.map((b) => b.count))
    : 0;

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex flex-col items-center gap-2">
        <p className="text-6xl font-bold tabular-nums leading-none">
          {avgRating != null ? avgRating.toFixed(1) : "—"}
        </p>
        <Stars rating={rounded} size="lg" />
        <p className="text-body-sm text-muted-foreground tabular-nums">
          全 {totalCount} 件のフィードバック
        </p>
      </div>

      {distribution && distribution.length > 0 && (
        <ul className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const bucket = distribution.find((b) => b.rating === rating);
            const count = bucket?.count ?? 0;
            const ratio = max > 0 ? count / max : 0;
            return (
              <li
                key={rating}
                className="grid grid-cols-[3rem_1fr_2rem] items-center gap-3 text-body-sm text-muted-foreground"
              >
                <span className="inline-flex items-center gap-1 tabular-nums">
                  <span>{rating}</span>
                  <Star
                    className="h-3.5 w-3.5 fill-foreground text-foreground"
                    aria-hidden
                  />
                </span>
                <span className="relative h-3 overflow-hidden rounded-full bg-muted">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-foreground"
                    style={{ width: `${ratio * 100}%` }}
                    aria-hidden
                  />
                </span>
                <span className="text-right tabular-nums">{count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
