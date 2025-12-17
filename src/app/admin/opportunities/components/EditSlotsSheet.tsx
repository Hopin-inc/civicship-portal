"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";
import { SlotData } from "../types";
import { Calendar } from "lucide-react";

interface EditSlotsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slots: SlotData[];
  onAddSlotsBatch: (slots: SlotData[]) => void;
  onUpdateSlot: (index: number, field: keyof SlotData, value: string) => void;
  onRemoveSlot: (index: number) => void;
}

export function EditSlotsSheet({
  open,
  onOpenChange,
  slots,
  onAddSlotsBatch,
  onUpdateSlot,
  onRemoveSlot,
}: EditSlotsSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>開催枠を編集</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div>
            <Label className="mb-2 flex items-center gap-x-2">
              <Calendar className="h-3.5 w-3.5" />
              開催枠
              {slots.length > 0 && (
                <span className="text-xs text-muted-foreground">({slots.length}件)</span>
              )}
            </Label>

            {/* 一括追加UI */}
            <SlotBatchAdder onAddSlots={onAddSlotsBatch} />

            {/* 既存スロット一覧 */}
            {slots.length > 0 && (
              <div className="mt-4 space-y-3">
                {slots.map((slot, index) => (
                  <SlotPicker
                    key={index}
                    index={index}
                    slot={slot}
                    onUpdate={onUpdateSlot}
                    onRemove={onRemoveSlot}
                  />
                ))}
              </div>
            )}

            {slots.length === 0 && (
              <div className="mt-4 text-center py-8 text-muted-foreground text-sm rounded-lg border border-dashed">
                開催枠が登録されていません。
                <br />
                上のカレンダーから日付を選択して追加してください。
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
