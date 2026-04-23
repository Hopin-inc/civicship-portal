"use client";

import React, { useEffect, useRef, useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import {
  DEFAULT_MEMBER_FILTER,
  type MemberFilter,
} from "../hooks/useDetailControls";

type Props = {
  value: MemberFilter;
  onChange: (next: MemberFilter) => void;
  onReset: () => void;
  disabled?: boolean;
};

const FILTER_DEBOUNCE_MS = 300;

function parseIntOrNull(raw: string): number | null {
  if (raw === "") return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function countActiveFilters(filter: MemberFilter): number {
  let n = 0;
  if (filter.minSendRate !== DEFAULT_MEMBER_FILTER.minSendRate) n += 1;
  if (filter.maxSendRate !== DEFAULT_MEMBER_FILTER.maxSendRate) n += 1;
  if (filter.minDonationOutMonths !== DEFAULT_MEMBER_FILTER.minDonationOutMonths) n += 1;
  if (filter.minMonthsIn !== DEFAULT_MEMBER_FILTER.minMonthsIn) n += 1;
  return n;
}

/**
 * メンバー section heading 横に置く小さい popover。
 * slider 連続操作で毎 tick refetch を避けるため、local state + 300ms
 * debounce で commit する。
 */
export function MemberFilterPopover({ value, onChange, onReset, disabled }: Props) {
  const [localFilter, setLocalFilter] = useState<MemberFilter>(value);

  // prop → local の同期 (外部 reset 等)
  useEffect(() => {
    setLocalFilter(value);
  }, [value]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChangeRef.current(localFilter);
    }, FILTER_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [localFilter]);

  const f = sysAdminDashboardJa.detail.member.filters;
  const activeCount = countActiveFilters(localFilter);
  const filterMin = localFilter.minSendRate ?? 0;
  const filterMax = localFilter.maxSendRate ?? 1;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={activeCount > 0 ? "secondary" : "ghost"}
          size="sm"
          className="h-8 gap-1 px-2 text-xs"
          disabled={disabled}
        >
          <Filter className="h-3.5 w-3.5" />
          絞り込み
          {activeCount > 0 && (
            <span className={cn("rounded-full bg-primary/10 px-1.5 text-primary")}>
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="popover-min-send-rate" className="text-xs text-muted-foreground">
                {f.minSendRate}
              </Label>
              <span className="text-xs tabular-nums">{toPct(filterMin)}</span>
            </div>
            <Slider
              id="popover-min-send-rate"
              min={0}
              max={1}
              step={0.05}
              value={[filterMin]}
              onValueChange={(v) => {
                const next = v[0] ?? 0;
                setLocalFilter((prev) => ({
                  ...prev,
                  minSendRate: next === 0 ? null : next,
                }));
              }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="popover-max-send-rate" className="text-xs text-muted-foreground">
                {f.maxSendRate}
              </Label>
              <span className="text-xs tabular-nums">{toPct(filterMax)}</span>
            </div>
            <Slider
              id="popover-max-send-rate"
              min={0}
              max={1}
              step={0.05}
              value={[filterMax]}
              onValueChange={(v) => {
                const next = v[0] ?? 1;
                setLocalFilter((prev) => ({
                  ...prev,
                  maxSendRate: next === 1 ? null : next,
                }));
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="popover-min-donation-out-months" className="text-xs text-muted-foreground">
                {f.minDonationOutMonths}
              </Label>
              <Input
                id="popover-min-donation-out-months"
                type="number"
                inputMode="numeric"
                min={0}
                value={localFilter.minDonationOutMonths ?? ""}
                onChange={(e) =>
                  setLocalFilter((prev) => ({
                    ...prev,
                    minDonationOutMonths: parseIntOrNull(e.target.value),
                  }))
                }
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="popover-min-months-in" className="text-xs text-muted-foreground">
                {f.minMonthsIn}
              </Label>
              <Input
                id="popover-min-months-in"
                type="number"
                inputMode="numeric"
                min={0}
                value={localFilter.minMonthsIn ?? ""}
                onChange={(e) =>
                  setLocalFilter((prev) => ({
                    ...prev,
                    minMonthsIn: parseIntOrNull(e.target.value),
                  }))
                }
              />
            </div>
          </div>
          <Button variant="ghost" size="sm" type="button" onClick={onReset}>
            {f.reset}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
