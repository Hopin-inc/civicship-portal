import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { HOSTING_STATUS_LABELS, HOSTING_STATUS_COLORS } from "../constants/slot";
import { cn } from "@/lib/utils";
import { SlotData } from "../types";
import { canDeleteSlot, canCancelSlot } from "../utils/slotPermissions";
import { formatSlotRange } from "../utils/dateFormat";

interface SlotPickerProps {
  index: number;
  slot: SlotData;
  onUpdate: (index: number, field: "startAt" | "endAt", value: string) => void;
  onRemove: (index: number) => void;
  onCancel?: () => void;
}

export const SlotPicker = ({ index, slot, onUpdate, onRemove, onCancel }: SlotPickerProps) => {
  if (!slot.startAt || !slot.endAt) {
    return (
      <div className="space-y-3 rounded-xl border p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground">未設定</p>
      </div>
    );
  }

  const { dateLabel, timeRangeLabel } = formatSlotRange(slot.startAt, slot.endAt);

  // アクション判定
  const canDelete = canDeleteSlot(slot);
  const canCancel = canCancelSlot(slot);

  return (
    <div className="space-y-3 rounded-xl border p-4 bg-muted/30">
      {/* ステータス表示（admin/opportunities スタイル） */}
      {slot.hostingStatus && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className={cn(
              "size-2.5 rounded-full",
              HOSTING_STATUS_COLORS[slot.hostingStatus]
            )}
            aria-label={HOSTING_STATUS_LABELS[slot.hostingStatus]}
          />
          <span>{HOSTING_STATUS_LABELS[slot.hostingStatus]}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="font-semibold text-sm">{dateLabel}</p>
          <p className="text-sm text-muted-foreground">{timeRangeLabel}</p>
        </div>

        {/* 条件付きアクションボタン */}
        <div className="flex gap-2">
          {canCancel && onCancel && (
            <Button type="button" variant="destructive" size="sm" onClick={onCancel}>
              開催中止
            </Button>
          )}

          {canDelete && (
            <Button type="button" variant="destructive-text" size="sm" onClick={() => onRemove(index)}>
              <Trash2 className="h-4 w-4" />
              削除
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
