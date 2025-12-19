"use client";

import * as React from "react";
import dayjs from "dayjs";
import { ChevronDownIcon, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

/* =========================
 * 内部コンポーネント
 * ========================= */

interface DateTimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultTime: string;
}

function DateTimeField({ label, value, onChange, defaultTime }: DateTimeFieldProps) {
  const date = value ? dayjs(value).toDate() : undefined;
  const time = value ? dayjs(value).format("HH:mm") : defaultTime;

  const handleDateChange = (d?: Date) => {
    if (!d) return;
    const [h, m] = time.split(":").map(Number);
    onChange(dayjs(d).hour(h).minute(m).format("YYYY-MM-DDTHH:mm"));
  };

  const handleTimeChange = (t: string) => {
    if (!date) return;
    const [h, m] = t.split(":").map(Number);
    onChange(dayjs(date).hour(h).minute(m).format("YYYY-MM-DDTHH:mm"));
  };

  return (
    <div className="space-y-1">
      <Label className="px-1 text-muted-foreground">{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="tertiary" className="w-full justify-between font-normal">
            {value ? dayjs(value).format("YYYY/MM/DD HH:mm") : "日時を選択"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3 space-y-3" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={(d) => d < new Date()}
          />
          <Input type="time" value={time} onChange={(e) => handleTimeChange(e.target.value)} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

/* =========================
 * 公開コンポーネント
 * ========================= */

interface SingleSlotFormProps {
  startAt: string;
  endAt: string;
  onStartAtChange: (value: string) => void;
  onEndAtChange: (value: string) => void;
  onAdd: () => void;
  variant?: "primary" | "secondary";
  title?: string;
}

export function SingleSlotForm({
  startAt,
  endAt,
  onStartAtChange,
  onEndAtChange,
  onAdd,
  variant = "primary",
  title,
}: SingleSlotFormProps) {
  const isDisabled = !startAt || !endAt;

  return (
    <div className="space-y-3">
      {title && <p className="text-sm font-medium">{title}</p>}

      <DateTimeField
        label="開始日時"
        value={startAt}
        onChange={onStartAtChange}
        defaultTime="10:00"
      />

      <DateTimeField label="終了日時" value={endAt} onChange={onEndAtChange} defaultTime="12:00" />

      <Button onClick={onAdd} disabled={isDisabled} className="w-full" variant={variant}>
        <Plus className="h-4 w-4 mr-2" />
        追加
      </Button>
    </div>
  );
}
