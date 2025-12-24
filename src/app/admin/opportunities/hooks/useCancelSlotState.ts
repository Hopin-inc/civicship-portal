import { useState } from "react";
import { SlotData } from "../types";

/**
 * スロット中止の状態を管理するフック
 */
export const useCancelSlotState = () => {
  const [selectedSlot, setSelectedSlot] = useState<{ slot: SlotData; index: number } | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const openCancelSheet = (slot: SlotData, index: number) => {
    setSelectedSlot({ slot, index });
    setIsSheetOpen(true);
  };

  const closeCancelSheet = () => {
    setIsSheetOpen(false);
    // アニメーション後にクリア
    setTimeout(() => setSelectedSlot(null), 300);
  };

  return {
    selectedSlot,
    isSheetOpen,
    openCancelSheet,
    closeCancelSheet,
  };
};
