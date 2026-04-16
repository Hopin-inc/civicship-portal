import { useState } from "react";

type SheetKey = "gate" | "powerPolicy";

/**
 * Tracks which full-screen sheet is currently open for sub-section editing.
 * Only one sheet is open at a time (opportunities uses per-sheet state;
 * votes has fewer sheets so a single active-key is enough).
 */
export function useFormSheets() {
  const [active, setActive] = useState<SheetKey | null>(null);

  return {
    active,
    openGate: () => setActive("gate"),
    openPowerPolicy: () => setActive("powerPolicy"),
    close: () => setActive(null),
  };
}
