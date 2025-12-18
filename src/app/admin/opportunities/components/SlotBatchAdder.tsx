"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import dayjs from "dayjs";
import { toast } from "react-toastify";

interface SlotBatchAdderProps {
  onAddSlots: (slots: { startAt: string; endAt: string }[]) => void;
}

export const SlotBatchAdder = ({ onAddSlots }: SlotBatchAdderProps) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:00");

  const handleAddSlots = () => {
    if (selectedDates.length === 0) {
      toast.error("日付を選択してください");
      return;
    }
    if (!startTime || !endTime) {
      toast.error("時刻を入力してください");
      return;
    }

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    if (startHour * 60 + startMinute >= endHour * 60 + endMinute) {
      toast.error("終了時刻は開始時刻より後に設定してください");
      return;
    }

    const newSlots = selectedDates.map((date) => {
      const startDateTime = dayjs(date)
        .hour(startHour)
        .minute(startMinute)
        .format("YYYY-MM-DDTHH:mm");

      const endDateTime = dayjs(date).hour(endHour).minute(endMinute).format("YYYY-MM-DDTHH:mm");

      return { startAt: startDateTime, endAt: endDateTime };
    });

    onAddSlots(newSlots);
    setSelectedDates([]);
    toast.success(`${newSlots.length}件の開催枠を追加しました`);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div>
        <div className="border rounded-lg p-2 bg-background">
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={(dates) => setSelectedDates(dates || [])}
            locale={ja}
          />
        </div>
        {selectedDates.length > 0 && (
          <div className="mt-2 text-sm">
            <p className="font-semibold mb-1">選択中: {selectedDates.length}日</p>
            <div className="flex flex-wrap gap-1">
              {selectedDates.map((date, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-primary/10 text-primary rounded text-xs"
                >
                  {format(date, "M/d(E)", { locale: ja })}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="mb-2 block">開始時刻</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        <div>
          <Label className="mb-2 block">終了時刻</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
      </div>

      {selectedDates.length > 0 && startTime && endTime && (
        <div className="p-3 bg-background rounded-lg text-sm border">
          <p className="font-semibold mb-1">追加されるスロット:</p>
          <p className="text-muted-foreground">
            {selectedDates.length}日分 × {startTime}〜{endTime}
          </p>
        </div>
      )}

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleAddSlots}
        disabled={selectedDates.length === 0}
      >
        {selectedDates.length > 0
          ? `${selectedDates.length}日分の開催枠を追加`
          : "日付を選択してください"}
      </Button>
    </div>
  );
};
