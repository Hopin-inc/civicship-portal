"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AsOfControl } from "@/app/sysAdmin/_shared/components/AsOfControl";
import { SegmentThresholdsControl } from "@/app/sysAdmin/_shared/components/SegmentThresholdsControl";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import type { DashboardControlsState } from "../hooks/useDashboardControls";

type Props = {
  state: DashboardControlsState;
  onAsOfChange: (value: string | null) => void;
  onThresholdsChange: (next: { tier1: number; tier2: number }) => void;
  onReset: () => void;
  disabled?: boolean;
};

export function DashboardControls({
  state,
  onAsOfChange,
  onThresholdsChange,
  onReset,
  disabled,
}: Props) {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <AsOfControl value={state.asOf} onChange={onAsOfChange} disabled={disabled} />
      <SegmentThresholdsControl
        tier1={state.tier1}
        tier2={state.tier2}
        onChange={onThresholdsChange}
        disabled={disabled}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onReset}
        disabled={disabled}
      >
        {sysAdminDashboardJa.controls.reset}
      </Button>
    </div>
  );
}
