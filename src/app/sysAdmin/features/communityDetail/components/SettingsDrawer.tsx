"use client";

import React, { useEffect, useRef, useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import type { MemberFilter } from "../hooks/useDetailControls";

type Props = {
  tier1: number;
  tier2: number;
  filter: MemberFilter;
  onThresholdsChange: (next: { tier1: number; tier2: number }) => void;
  onFilterChange: (next: MemberFilter) => void;
  onResetFilter: () => void;
  /**
   * Defaults indicator — when true, the trigger button shows an asterisk
   * to signal that one or more settings differ from defaults.
   */
  hasNonDefaults: boolean;
};

const FILTER_DEBOUNCE_MS = 300;

function parseIntOrNull(raw: string): number | null {
  if (raw === "") return null;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function SettingsDrawer({
  tier1,
  tier2,
  filter,
  onThresholdsChange,
  onFilterChange,
  onResetFilter,
  hasNonDefaults,
}: Props) {
  const [open, setOpen] = useState(false);

  // Filter は slider 連続操作が多いので 300ms debounce で immediate commit。
  // tier と挙動を揃えるため Apply ボタンは撤廃。
  const [localFilter, setLocalFilter] = useState<MemberFilter>(filter);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onFilterChangeRef = useRef(onFilterChange);
  onFilterChangeRef.current = onFilterChange;

  // prop → local に同期 (外部から filter が変わった場合)
  useEffect(() => {
    setLocalFilter(filter);
  }, [filter]);

  // local → prop に debounced commit
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onFilterChangeRef.current(localFilter);
    }, FILTER_DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [localFilter]);

  const t = sysAdminDashboardJa.controls;
  const f = sysAdminDashboardJa.detail.member.filters;

  const filterMin = localFilter.minSendRate ?? 0;
  const filterMax = localFilter.maxSendRate ?? 1;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Settings className="h-4 w-4" />
          {t.settingsButton}
          {hasNonDefaults && <span aria-hidden>*</span>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t.drawerTitle}</DrawerTitle>
        </DrawerHeader>

        <div className="flex flex-col gap-6 px-4 pb-4">
          <section className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="drawer-tier1" className="text-sm font-medium">
                  {t.tier1Label}
                </Label>
                <span className="text-xs tabular-nums">{toPct(tier1)}</span>
              </div>
              <Slider
                id="drawer-tier1"
                min={0.5}
                max={0.9}
                step={0.05}
                value={[tier1]}
                onValueChange={(v) => {
                  const next = v[0] ?? 0;
                  onThresholdsChange({ tier1: next, tier2: Math.min(tier2, next) });
                }}
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="drawer-tier2" className="text-sm font-medium">
                  {t.tier2Label}
                </Label>
                <span className="text-xs tabular-nums">{toPct(tier2)}</span>
              </div>
              <Slider
                id="drawer-tier2"
                min={0.2}
                max={0.6}
                step={0.05}
                value={[tier2]}
                onValueChange={(v) => {
                  const next = v[0] ?? 0;
                  onThresholdsChange({ tier1: Math.max(tier1, next), tier2: next });
                }}
              />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">{t.filterSection}</h3>
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="drawer-min-send-rate" className="text-xs text-muted-foreground">
                  {f.minSendRate}
                </Label>
                <span className="text-xs tabular-nums">{toPct(filterMin)}</span>
              </div>
              <Slider
                id="drawer-min-send-rate"
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
                <Label htmlFor="drawer-max-send-rate" className="text-xs text-muted-foreground">
                  {f.maxSendRate}
                </Label>
                <span className="text-xs tabular-nums">{toPct(filterMax)}</span>
              </div>
              <Slider
                id="drawer-max-send-rate"
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
                <Label
                  htmlFor="drawer-min-donation-out-months"
                  className="text-xs text-muted-foreground"
                >
                  {f.minDonationOutMonths}
                </Label>
                <Input
                  id="drawer-min-donation-out-months"
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
                <Label htmlFor="drawer-min-months-in" className="text-xs text-muted-foreground">
                  {f.minMonthsIn}
                </Label>
                <Input
                  id="drawer-min-months-in"
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
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => {
                onResetFilter();
              }}
            >
              {f.reset}
            </Button>
          </section>
        </div>

        <DrawerFooter>
          <DrawerClose asChild>
            <Button type="button" variant="primary">
              {t.drawerClose}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
