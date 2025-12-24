"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { RepeatIcon } from "lucide-react";

import { Button, ButtonProps } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DateTimeField } from "./DateTimeField";
import { RecurrenceSheet } from "../sheets/RecurrenceSheet";
import { SlotData } from "../../../../types";

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
