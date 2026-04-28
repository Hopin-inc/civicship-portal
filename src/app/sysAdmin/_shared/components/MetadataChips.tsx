import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Item = ReactNode | { label: ReactNode; emphasis?: boolean };

type Props = {
  /**
   * メタ chip の一覧。`null` / `undefined` は無視するので、条件付きの値も
   * `value && { label: ... }` の形でそのまま渡せる。
   */
  items: Array<Item | null | undefined | false>;
  className?: string;
};

/**
 * 「v3」「配信比率 70%」のようなメタ情報を Badge で横並びに出す共通 chip 群。
 * テンプレ詳細の inline header / Report detail header で使う。
 */
export function MetadataChips({ items, className }: Props) {
  const filtered = items.filter(
    (i): i is Item => i != null && i !== false,
  );
  if (filtered.length === 0) return null;
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {filtered.map((item, i) => {
        const isObj =
          typeof item === "object" && item !== null && "label" in item;
        const label = isObj ? (item as { label: ReactNode }).label : item;
        const emphasis = isObj && (item as { emphasis?: boolean }).emphasis;
        return (
          <Badge
            key={i}
            variant={emphasis ? "primary" : "outline"}
            size="sm"
            className="font-normal text-body-xs tabular-nums"
          >
            {label}
          </Badge>
        );
      })}
    </div>
  );
}
