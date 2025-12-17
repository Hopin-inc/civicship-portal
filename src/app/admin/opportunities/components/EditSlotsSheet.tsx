"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlotBatchAdder } from "./SlotBatchAdder";
import { SlotPicker } from "./SlotPicker";
import { SlotData } from "../types";

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
      <SheetContent side="right" className="w-full overflow-y-auto">
        <SheetHeader>
          <SheetTitle>開催枠を編集</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {/* 一括追加UI */}
          <SlotBatchAdder onAddSlots={onAddSlotsBatch} />

          {/* 既存スロット一覧 */}
          {slots.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">登録済み: {slots.length}件</p>
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
            <div className="text-center py-8 text-muted-foreground text-sm rounded-lg border border-dashed">
              開催枠が登録されていません。
              <br />
              上のカレンダーから日付を選択して追加してください。
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
