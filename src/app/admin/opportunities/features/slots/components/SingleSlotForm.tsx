"use client";

import * as React from "react";
import { useState } from "react";
import dayjs from "dayjs";
import { ChevronDownIcon, RepeatIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { RecurrenceSheet } from "./RecurrenceSheet";
import { SlotData } from "../../types";

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
      <Label className="px-1 text-label-xs">{label}</Label>

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

        <PopoverContent className="w-auto p-3 space-y-1" align="start">
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
  onAddSlotsBatch: (slots: SlotData[]) => void;
  variant?: ButtonProps["variant"];
}

export function SingleSlotForm({
  startAt,
  endAt,
  onStartAtChange,
  onEndAtChange,
  onAdd,
  onAddSlotsBatch,
  variant = "ghost",
}: SingleSlotFormProps) {
  const [isRepeatOpen, setIsRepeatOpen] = useState(false);

  const handleOpenRepeat = () => {
    setIsRepeatOpen(true);
  };

  const startDate = startAt ? dayjs(startAt).toDate() : undefined;
  const canAdd = !!startAt && !!endAt && dayjs(endAt).isAfter(dayjs(startAt));
  const showError = !!startAt && !!endAt && !dayjs(endAt).isAfter(dayjs(startAt));

  return (
    <>
      <Card className={"bg-background"}>
        <CardContent className="pt-4 space-y-4">
          {/* =====================
           * 入力ブロック
           * ===================== */}
          <div className="space-y-3">
            <DateTimeField
              label="開始日時"
              value={startAt}
              onChange={(v) => {
                onStartAtChange(v);

                // 開始日時を変更したとき、終了が不正ならリセット
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
          </div>

          {/* =====================
           * アクションブロック
           * ===================== */}
          <div className="pt-2 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenRepeat}
              aria-label="繰り返し設定"
              className="gap-1 px-2"
              disabled={!canAdd}
            >
              <RepeatIcon className="h-4 w-4" />
              <span className="text-xs">繰り返し</span>
            </Button>

            <Button onClick={onAdd} disabled={!canAdd} className="flex-1" size="sm">
              追加
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* RecurrenceSheet */}
      <RecurrenceSheet
        open={isRepeatOpen}
        onOpenChange={setIsRepeatOpen}
        baseStartAt={startAt}
        baseEndAt={endAt}
        onConfirm={(slots) => {
          onAddSlotsBatch(slots);
          // 入力値は維持（要件通り）
        }}
      />
    </>
  );
}
