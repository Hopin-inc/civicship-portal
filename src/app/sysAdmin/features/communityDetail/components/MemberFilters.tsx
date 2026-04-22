"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import type { MemberFilter } from "../hooks/useDetailControls";

type Props = {
  value: MemberFilter;
  onChange: (next: MemberFilter) => void;
  onReset: () => void;
  disabled?: boolean;
};

const DEBOUNCE_MS = 300;

function parseIntOrNull(raw: string): number | null {
  if (raw === "") return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function MemberFilters({ value, onChange, onReset, disabled }: Props) {
  const [local, setLocal] = useState<MemberFilter>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChangeRef.current(local), DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [local]);

  const f = sysAdminDashboardJa.detail.member.filters;
  const min = local.minSendRate ?? 0;
  const max = local.maxSendRate ?? 1;

  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="minSendRate" className="text-xs text-muted-foreground">
            {f.minSendRate}
          </Label>
          <span className="text-xs tabular-nums">{toPct(min)}</span>
        </div>
        <Slider
          id="minSendRate"
          min={0}
          max={1}
          step={0.05}
          value={[min]}
          onValueChange={(v) =>
            setLocal((prev) => ({
              ...prev,
              minSendRate: v[0] === 0 ? null : v[0] ?? null,
            }))
          }
          disabled={disabled}
          className="w-44"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="maxSendRate" className="text-xs text-muted-foreground">
            {f.maxSendRate}
          </Label>
          <span className="text-xs tabular-nums">{toPct(max)}</span>
        </div>
        <Slider
          id="maxSendRate"
          min={0}
          max={1}
          step={0.05}
          value={[max]}
          onValueChange={(v) =>
            setLocal((prev) => ({
              ...prev,
              maxSendRate: v[0] === 1 ? null : v[0] ?? null,
            }))
          }
          disabled={disabled}
          className="w-44"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="minDonationOutMonths" className="text-xs text-muted-foreground">
          {f.minDonationOutMonths}
        </Label>
        <Input
          id="minDonationOutMonths"
          type="number"
          inputMode="numeric"
          min={0}
          value={local.minDonationOutMonths ?? ""}
          onChange={(e) =>
            setLocal((prev) => ({
              ...prev,
              minDonationOutMonths: parseIntOrNull(e.target.value),
            }))
          }
          disabled={disabled}
          className="h-9 w-24"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="minMonthsIn" className="text-xs text-muted-foreground">
          {f.minMonthsIn}
        </Label>
        <Input
          id="minMonthsIn"
          type="number"
          inputMode="numeric"
          min={0}
          value={local.minMonthsIn ?? ""}
          onChange={(e) =>
            setLocal((prev) => ({
              ...prev,
              minMonthsIn: parseIntOrNull(e.target.value),
            }))
          }
          disabled={disabled}
          className="h-9 w-24"
        />
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={onReset} disabled={disabled}>
        {f.reset}
      </Button>
    </div>
  );
}
