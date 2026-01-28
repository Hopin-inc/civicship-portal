import { useState } from "react";

export type SheetType = "title" | "description" | "squareLogo" | "logo" | "ogImage" | "favicon" | null;

export function usePortalConfigSheets() {
  const [activeSheet, setActiveSheet] = useState<SheetType>(null);

  const openSheet = (sheet: SheetType) => setActiveSheet(sheet);
  const closeSheet = () => setActiveSheet(null);

  return {
    activeSheet,
    openSheet,
    closeSheet,
    isOpen: (sheet: SheetType) => activeSheet === sheet,
  };
}
