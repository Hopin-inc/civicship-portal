import { useState } from "react";
import { SlotData } from "../../shared/types/slot";

export function useSlotManager(initialSlots: SlotData[] = []) {
  const [slots, setSlots] = useState<SlotData[]>(initialSlots);
  const [hasChanges, setHasChanges] = useState(false);

  const addSlot = () => {
    setSlots((prev) => [...prev, { startAt: "", endAt: "" }]);
    setHasChanges(true);
  };

  const addSlotsBatch = (newSlots: { startAt: string; endAt: string }[]) => {
    setSlots((prev) => [...prev, ...newSlots]);
    setHasChanges(true);
  };

  const updateSlot = <K extends keyof SlotData>(
    index: number,
    field: K,
    value: SlotData[K]
  ) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
    setHasChanges(true);
  };

  const updateSlotSilent = <K extends keyof SlotData>(
    index: number,
    field: K,
    value: SlotData[K]
  ) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
    // Don't set hasChanges for mutation-based operations
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const resetChanges = () => {
    setHasChanges(false);
  };

  return {
    slots,
    addSlot,
    addSlotsBatch,
    updateSlot,
    updateSlotSilent,
    removeSlot,
    hasChanges,
    resetChanges,
  };
}
