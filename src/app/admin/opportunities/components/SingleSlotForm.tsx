"use client";

import * as React from "react";
import dayjs from "dayjs";
import { ChevronDownIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";

/* =========================
 * 内部コンポーネント
 * ========================= */

interface DateTimeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  defaultTime: string;
  disabled?: boolean;
  minDate?: Date;
}

function DateTimeField({
  label,
  value,
  onChange,
  defaultTime,
  disabled,
  minDate,
}: DateTimeFieldProps) {
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
      <Label className="px-1 text-muted-foreground text-sm">{label}</Label>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="tertiary"
            size="sm"
            disabled={disabled}
            className="w-full justify-between font-normal"
          >
            {value ? dayjs(value).format("YYYY/MM/DD HH:mm") : "日時を選択"}
            <ChevronDownIcon className={disabled ? "opacity-30" : undefined} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-3 space-y-3" align="start">
          {/* 日付 */}
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            disabled={(d) => {
              if (d < new Date()) return true;
              if (minDate && dayjs(d).isBefore(dayjs(minDate), "day")) return true;
              return false;
            }}
          />

          {/* 時刻 */}
          <div className="pt-2">
            <Input
              type="time"
              value={time}
              onChange={(e) => handleTimeChange(e.target.value)}
              disabled={disabled}
            />
          </div>
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
  variant?: ButtonProps["variant"];
}

export function SingleSlotForm({
  startAt,
  endAt,
  onStartAtChange,
  onEndAtChange,
  onAdd,
  variant = "ghost",
}: SingleSlotFormProps) {
  const startDate = startAt ? dayjs(startAt).toDate() : undefined;
  const canAdd = !!startAt && !!endAt && dayjs(endAt).isAfter(dayjs(startAt));
  const showError = !!startAt && !!endAt && !dayjs(endAt).isAfter(dayjs(startAt));

  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <DateTimeField
          label="開始日時"
          value={startAt}
          onChange={(v) => {
            onStartAtChange(v);

            // 開始日時を変えたら、終了が不正ならリセット
            if (endAt && dayjs(endAt).isBefore(v)) {
              onEndAtChange("");
            }
          }}
          defaultTime="10:00"
        />

        <DateTimeField
          label="終了日時"
          value={endAt}
          onChange={onEndAtChange}
          defaultTime="12:00"
          disabled={!startAt}
          minDate={startDate}
        />

        {showError && (
          <p className="text-sm text-destructive">開始時刻以降の日時を指定してください</p>
        )}

        <Button onClick={onAdd} disabled={!canAdd} className="w-full" variant={variant} size="sm">
          追加
        </Button>
      </CardContent>
    </Card>
  );
}
