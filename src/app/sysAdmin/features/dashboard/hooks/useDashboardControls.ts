"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export type DashboardControlsState = {
  asOf: string | null;
  tier1: number;
  tier2: number;
};

const DEFAULTS: DashboardControlsState = {
  asOf: null,
  tier1: 0.7,
  tier2: 0.4,
};

const DEBOUNCE_MS = 500;

function parseFloatOr(raw: string | null, fallback: number): number {
  if (raw === null) return fallback;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : fallback;
}

function hydrateFromParams(params: URLSearchParams): DashboardControlsState {
  return {
    asOf: params.get("asOf"),
    tier1: parseFloatOr(params.get("tier1"), DEFAULTS.tier1),
    tier2: parseFloatOr(params.get("tier2"), DEFAULTS.tier2),
  };
}

function serialize(state: DashboardControlsState): string {
  const sp = new URLSearchParams();
  if (state.asOf) sp.set("asOf", state.asOf);
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

  const setAsOf = useCallback((asOf: string | null) => {
    setState((prev) => ({ ...prev, asOf }));
  }, []);

  const setThresholds = useCallback((next: { tier1: number; tier2: number }) => {
    setState((prev) => ({ ...prev, tier1: next.tier1, tier2: next.tier2 }));
  }, []);

  const reset = useCallback(() => setState(DEFAULTS), []);

  return { state, setAsOf, setThresholds, reset };
}

export const DASHBOARD_CONTROLS_DEFAULTS = DEFAULTS;
