"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { toPct } from "@/app/sysAdmin/_shared/format/number";

type Props = {
  tier1: number;
  tier2: number;
  onChange: (next: { tier1: number; tier2: number }) => void;
  disabled?: boolean;
};

export function SegmentThresholdsControl({ tier1, tier2, onChange, disabled }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="tier1" className="text-xs text-muted-foreground">
            {sysAdminDashboardJa.controls.tier1Label}
          </Label>
          <span className="text-xs tabular-nums">{toPct(tier1)}</span>
        </div>
        <Slider
          id="tier1"
          min={0}
          max={1}
          step={0.05}
          value={[tier1]}
          onValueChange={(v) => {
            const next = v[0] ?? 0;
            onChange({ tier1: next, tier2: Math.min(tier2, next) });
          }}
          disabled={disabled}
          className="w-48"
        />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="tier2" className="text-xs text-muted-foreground">
            {sysAdminDashboardJa.controls.tier2Label}
          </Label>
          <span className="text-xs tabular-nums">{toPct(tier2)}</span>
        </div>
        <Slider
          id="tier2"
          min={0}
          max={1}
          step={0.05}
          value={[tier2]}
          onValueChange={(v) => {
            const next = v[0] ?? 0;
            onChange({ tier1: Math.max(tier1, next), tier2: next });
          }}
          disabled={disabled}
          className="w-48"
        />
      </div>
    </div>
  );
}
