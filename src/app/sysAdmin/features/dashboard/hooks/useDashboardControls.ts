"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  DEFAULT_PERIOD,
  PERIOD_OPTIONS,
  resolvePeriodToInput,
  type PeriodPreset,
} from "@/app/sysAdmin/_shared/period";

export type DashboardControlsState = {
  period: PeriodPreset;
  tier1: number;
  tier2: number;
};

const DEFAULTS: DashboardControlsState = {
  period: DEFAULT_PERIOD,
  tier1: 0.7,
  tier2: 0.4,
};

const DEBOUNCE_MS = 500;

function parseFloatOr(raw: string | null, fallback: number): number {
  if (raw === null) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

function parsePeriod(raw: string | null): PeriodPreset {
  if (!raw) return DEFAULT_PERIOD;
  const hit = PERIOD_OPTIONS.find((o) => o.value === raw);
  return (hit?.value ?? DEFAULT_PERIOD) as PeriodPreset;
}

function hydrateFromParams(params: URLSearchParams): DashboardControlsState {
  return {
    period: parsePeriod(params.get("period")),
    tier1: parseFloatOr(params.get("tier1"), DEFAULTS.tier1),
    tier2: parseFloatOr(params.get("tier2"), DEFAULTS.tier2),
  };
}

function serialize(state: DashboardControlsState): string {
  const sp = new URLSearchParams();
  if (state.period !== DEFAULTS.period) sp.set("period", state.period);
  if (state.tier1 !== DEFAULTS.tier1) sp.set("tier1", String(state.tier1));
  if (state.tier2 !== DEFAULTS.tier2) sp.set("tier2", String(state.tier2));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function useDashboardControls() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<DashboardControlsState>(() =>
    hydrateFromParams(new URLSearchParams(searchParams?.toString() ?? "")),
  );

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync URL → state on external navigation (browser back / forward, or
  // any other consumer changing searchParams). The state→URL writer below
  // uses `window.history.replaceState`, which does NOT cause Next.js's
  // `useSearchParams` to update — so this effect doesn't re-fire on our
  // own writes. The equality guard is a belt-and-suspenders against
  // unrelated re-renders that would otherwise produce a no-op setState.
  useEffect(() => {
    const hydrated = hydrateFromParams(
      new URLSearchParams(searchParams?.toString() ?? ""),
    );
    setState((prev) =>
      prev.period === hydrated.period &&
      prev.tier1 === hydrated.tier1 &&
      prev.tier2 === hydrated.tier2
        ? prev
        : hydrated,
    );
  }, [searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const qs = serialize(state);
      window.history.replaceState(null, "", `${pathname}${qs}`);
    }, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state, pathname]);

  const setPeriod = useCallback((period: PeriodPreset) => {
    setState((prev) => ({ ...prev, period }));
  }, []);

  const setThresholds = useCallback((next: { tier1: number; tier2: number }) => {
    setState((prev) => ({ ...prev, tier1: next.tier1, tier2: next.tier2 }));
  }, []);

  const reset = useCallback(() => setState(DEFAULTS), []);

  // API に渡す derived 値。period → (asOf, windowMonths) に変換する。
  const resolved = useMemo(() => resolvePeriodToInput(state.period), [state.period]);

  return { state, resolved, setPeriod, setThresholds, reset };
}

export const DASHBOARD_CONTROLS_DEFAULTS = DEFAULTS;
