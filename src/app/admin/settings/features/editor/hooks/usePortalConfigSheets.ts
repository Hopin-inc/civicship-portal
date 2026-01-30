import { useState, useCallback } from "react";
import { SheetType } from "../types/settings";

export function usePortalConfigSheets() {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const openSheet = useCallback((sheet: SheetType) => {
    setActiveSheet(sheet);
  }, []);

  const closeSheet = useCallback(() => {
    setActiveSheet(null);
  }, []);

  return {
    activeSheet,
    setActiveSheet,
    openSheet,
    closeSheet,
    isOpen: (sheet: SheetType) => activeSheet === sheet,
  };
}
