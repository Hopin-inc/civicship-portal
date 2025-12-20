import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import dayjs from "dayjs";

interface SlotPickerProps {
  index: number;
  slot: {
    id?: string;
    startAt: string;
    endAt: string;
  };
  onUpdate: (index: number, field: "startAt" | "endAt", value: string) => void;
  onRemove: (index: number) => void;
}

export const SlotPicker = ({ index, slot, onUpdate, onRemove }: SlotPickerProps) => {
  if (!slot.startAt || !slot.endAt) {
    return (
      <div className="space-y-3 rounded-xl border p-4 bg-muted/30">
        <p className="text-sm text-muted-foreground">未設定</p>
      </div>
    );
  }

  const { dateLabel, timeRangeLabel } = formatSlotRange(slot.startAt, slot.endAt);

  return (
    <div className="space-y-3 rounded-xl border p-4 bg-muted/30">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <p className="font-semibold text-sm">{dateLabel}</p>
          <p className="text-sm text-muted-foreground">{timeRangeLabel}</p>
        </div>

        <Button type="button" variant="destructive-text" size="sm" onClick={() => onRemove(index)}>
          <Trash2 className="h-4 w-4" />
          削除
        </Button>
      </div>
    </div>
  );
};

function formatSlotRange(startAt: string, endAt: string) {
  const start = dayjs(startAt);
  const end = dayjs(endAt);

  const diffDays = end.startOf("day").diff(start.startOf("day"), "day");

  const startText = start.format("YYYY年M月D日(dd)");
  const startTime = start.format("HH:mm");
  const endTime = end.format("HH:mm");

  let endLabel = endTime;

  if (diffDays === 1) {
    endLabel = `翌日 ${endTime}`;
  } else if (diffDays === 2) {
    endLabel = `翌々日 ${endTime}`;
  } else if (diffDays >= 3) {
    endLabel = `${diffDays}日後 ${endTime}`;
  }

  return {
    dateLabel: startText,
    timeRangeLabel: `${startTime} 〜 ${endLabel}`,
  };
}
