"use client";

import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";

interface SlotPickerProps {
  index: number;
  slot: { id?: string; startAt: string; endAt: string };
  onUpdate: (index: number, field: "startAt" | "endAt", value: string) => void;
  onRemove: (index: number) => void;
}

export const SlotPicker = ({ index, slot, onUpdate, onRemove }: SlotPickerProps) => {
  const [date, setDate] = useState<Date | undefined>(
    slot.startAt ? new Date(slot.startAt) : undefined,
  );
  const [startTime, setStartTime] = useState(
    slot.startAt ? dayjs(slot.startAt).format("HH:mm") : "",
  );
  const [endTime, setEndTime] = useState(slot.endAt ? dayjs(slot.endAt).format("HH:mm") : "");

  // slot.startAt/endAt が外部から変更された場合の同期
  useEffect(() => {
    if (slot.startAt) {
      setDate(new Date(slot.startAt));
      setStartTime(dayjs(slot.startAt).format("HH:mm"));
    }
    if (slot.endAt) {
      setEndTime(dayjs(slot.endAt).format("HH:mm"));
    }
  }, [slot.startAt, slot.endAt]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) return;
    setDate(selectedDate);

    if (startTime) {
      const [hour, minute] = startTime.split(":");
      const startDateTime = dayjs(selectedDate)
        .hour(Number(hour))
        .minute(Number(minute))
        .format("YYYY-MM-DDTHH:mm");
      onUpdate(index, "startAt", startDateTime);
    }

    if (endTime) {
      const [hour, minute] = endTime.split(":");
      const endDateTime = dayjs(selectedDate)
        .hour(Number(hour))
        .minute(Number(minute))
        .format("YYYY-MM-DDTHH:mm");
      onUpdate(index, "endAt", endDateTime);
    }
  };

  const handleStartTimeChange = (time: string) => {
    setStartTime(time);

    if (date && time) {
      const [hour, minute] = time.split(":");
      const startDateTime = dayjs(date)
        .hour(Number(hour))
        .minute(Number(minute))
        .format("YYYY-MM-DDTHH:mm");
      onUpdate(index, "startAt", startDateTime);
    }
  };

  const handleEndTimeChange = (time: string) => {
    setEndTime(time);

    if (date && time) {
      const [hour, minute] = time.split(":");
      const endDateTime = dayjs(date)
        .hour(Number(hour))
        .minute(Number(minute))
        .format("YYYY-MM-DDTHH:mm");
      onUpdate(index, "endAt", endDateTime);
    }
  };

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
        <Button
          type="button"
          variant="destructive-outline"
          size="sm"
          onClick={() => onRemove(index)}
        >
          <Trash2 className="h-4 w-4" />
          削除
        </Button>
      </div>

      {/* 編集UI */}
      <div className="space-y-3 pt-2 border-t">
        {/* 日付選択 */}
        <div>
          <Label className="mb-2 block text-xs">開催日</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="tertiary"
                className={cn(
                  "w-full justify-start text-left font-normal h-9 text-sm",
                  !date && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy年M月d日(E)", { locale: ja }) : "日付を選択"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={handleDateSelect} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* 時間選択 */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="mb-2 block text-xs">開始時刻</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => handleStartTimeChange(e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>
          <div>
            <Label className="mb-2 block text-xs">終了時刻</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => handleEndTimeChange(e.target.value)}
              className="h-9 text-sm"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};
