"use client";

import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";

type Props = {
  tier1: number;
  tier2: number;
  onChange: (next: { tier1: number; tier2: number }) => void;
  disabled?: boolean;
};

/**
 * ステージ分布 panel の見出し横に置く小さい popover。
 * tier 閾値はステージ分類に直接効くため、見てる場所で即変更できるようにする。
 */
export function TierThresholdsPopover({ tier1, tier2, onChange, disabled }: Props) {
  const t = sysAdminDashboardJa.controls;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 gap-1 px-2 text-xs"
          disabled={disabled}
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          分類設定
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="tier1" className="text-sm font-medium">
                {t.tier1Label}
              </Label>
              <span className="text-xs tabular-nums">{toPct(tier1)}</span>
            </div>
            <Slider
              id="tier1"
              min={0.5}
              max={0.9}
              step={0.05}
              value={[tier1]}
              onValueChange={(v) => {
                const next = v[0] ?? 0;
                onChange({ tier1: next, tier2: Math.min(tier2, next) });
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="tier2" className="text-sm font-medium">
                {t.tier2Label}
              </Label>
              <span className="text-xs tabular-nums">{toPct(tier2)}</span>
            </div>
            <Slider
              id="tier2"
              min={0.2}
              max={0.6}
              step={0.05}
              value={[tier2]}
              onValueChange={(v) => {
                const next = v[0] ?? 0;
                onChange({ tier1: Math.max(tier1, next), tier2: next });
              }}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
