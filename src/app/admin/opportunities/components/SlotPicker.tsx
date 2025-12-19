"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import dayjs from "dayjs";

interface SlotPickerProps {
  index: number;
  slot: { id?: string; startAt: string; endAt: string };
  onUpdate: (index: number, field: "startAt" | "endAt", value: string) => void;
  onRemove: (index: number) => void;
}

export const SlotPicker = ({ index, slot, onUpdate, onRemove }: SlotPickerProps) => {
  return (
    <div className="space-y-3 rounded-xl border p-4 bg-muted/30">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          {slot.startAt && slot.endAt ? (
            <div>
              <p className="font-semibold text-sm">
                {dayjs(slot.startAt).format("YYYY年M月D日(dd)")}
              </p>
              <p className="text-sm text-muted-foreground">
                {dayjs(slot.startAt).format("HH:mm")} 〜 {dayjs(slot.endAt).format("HH:mm")}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">未設定</p>
          )}
        </div>
        <Button type="button" variant="destructive-text" size="sm" onClick={() => onRemove(index)}>
          <Trash2 className="h-4 w-4" />
          削除
        </Button>
      </div>
    </div>
  );
};
