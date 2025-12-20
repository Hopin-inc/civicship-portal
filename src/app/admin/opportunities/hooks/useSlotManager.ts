import { useState } from "react";
import { SlotData } from "../types";

export function useSlotManager(initialSlots: SlotData[] = []) {
  const [slots, setSlots] = useState<SlotData[]>(initialSlots);

  const addSlot = () => {
    setSlots((prev) => [...prev, { startAt: "", endAt: "" }]);
  };

  const addSlotsBatch = (newSlots: { startAt: string; endAt: string }[]) => {
    setSlots((prev) => [...prev, ...newSlots]);
  };

  const updateSlot = (index: number, field: keyof SlotData, value: string) => {
    setSlots((prev) => prev.map((slot, i) => (i === index ? { ...slot, [field]: value } : slot)));
  };

  const removeSlot = (index: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== index));
  };

  return {
    slots,
    addSlot,
    addSlotsBatch,
    updateSlot,
    removeSlot,
  };
}
