"use client";

import { cn } from "@/lib/utils";

type Props = {
  versions: number[];
  selected: number | null;
  onSelect: (version: number | null) => void;
};

/**
 * version の chip selector。
 * `selected = null` で「全 version 表示」を意味する。
 */
export function VersionSelector({ versions, selected, onSelect }: Props) {
  if (versions.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1">
      <span className="text-body-xs text-muted-foreground mr-1">version:</span>
      <Chip selected={selected === null} onClick={() => onSelect(null)}>
        全て
      </Chip>
      {versions.map((v) => (
        <Chip
          key={v}
          selected={selected === v}
          onClick={() => onSelect(v)}
        >
          v{v}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-0.5 text-body-xs transition-colors",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-transparent text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}
