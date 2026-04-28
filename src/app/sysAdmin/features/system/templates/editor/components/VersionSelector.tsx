"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  versions: number[];
  selected: number | null;
  onSelect: (version: number | null) => void;
};

const ALL_VALUE = "all";

/**
 * version の chip selector。
 * `selected = null` で「全 version 表示」を意味する。
 *
 * radix `ToggleGroup type="single"` で実装すると、roving tabindex /
 * 矢印キー操作 / ARIA 属性が radix 任せになる。空 value (= 全部 deselect)
 * は許可しないので、内部的には `"all"` を「全 version」値として扱う。
 */
export function VersionSelector({ versions, selected, onSelect }: Props) {
  if (versions.length === 0) return null;

  const value = selected == null ? ALL_VALUE : `v${selected}`;
  const handleChange = (next: string) => {
    if (next === "" || next === ALL_VALUE) {
      onSelect(null);
      return;
    }
    const num = Number(next.replace(/^v/, ""));
    onSelect(Number.isFinite(num) ? num : null);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-body-xs text-muted-foreground">version:</span>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={handleChange}
        className="flex-wrap justify-start"
        aria-label="表示する version"
      >
        <ToggleGroupItem value={ALL_VALUE} className="h-7 px-2 text-body-xs">
          全て
        </ToggleGroupItem>
        {versions.map((v) => (
          <ToggleGroupItem
            key={v}
            value={`v${v}`}
            className="h-7 px-2 text-body-xs tabular-nums"
          >
            v{v}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
