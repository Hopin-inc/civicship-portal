"use client";

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { RecurrenceType, RecurrenceSettings, RecurrenceInput, RecurrenceError, SlotData } from "../types";
import { generateRecurrenceSlots } from "../utils/recurrenceGenerator";
import dayjs from "dayjs";

interface RecurrenceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  baseStartAt: string;  // 起点の開始日時
  baseEndAt: string;    // 起点の終了日時
  onConfirm: (slots: SlotData[]) => void; // 生成したスロットを親に渡す
}

const WEEKDAYS = [
  { value: 1, label: '月' },
  { value: 2, label: '火' },
  { value: 3, label: '水' },
  { value: 4, label: '木' },
  { value: 5, label: '金' },
  { value: 6, label: '土' },
  { value: 0, label: '日' },
];

export function RecurrenceSheet({
  open,
  onOpenChange,
  baseStartAt,
  baseEndAt,
  onConfirm,
}: RecurrenceSheetProps) {
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('daily');
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDateInput, setEndDateInput] = useState<string>('');
  const [errors, setErrors] = useState<RecurrenceError>({});

  // バリデーション
  const validate = (): boolean => {
    const newErrors: RecurrenceError = {};

    // 毎週かつ曜日未選択
    if (recurrenceType === 'weekly' && selectedDays.length === 0) {
      newErrors.days = '曜日を1つ以上選択してください';
    }

    // 終了日指定かつ未入力
    if (hasEndDate && !endDateInput) {
      newErrors.endDate = '終了日を入力してください';
    }

    // 終了日が起点日より前
    if (hasEndDate && endDateInput) {
      const baseDate = dayjs(baseStartAt).format('YYYY-MM-DD');
      if (dayjs(endDateInput).isBefore(baseDate)) {
        newErrors.endDate = '終了日は開始日以降を指定してください';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // プレビュー計算
  const previewSlots = useMemo(() => {
    if (!baseStartAt || !baseEndAt) return [];

    // バリデーションエラーがある場合は生成しない
    if (Object.keys(errors).length > 0) return [];

    const settings: RecurrenceSettings = {
      type: recurrenceType,
      endDate: hasEndDate ? endDateInput || null : null,
      selectedDays: recurrenceType === 'weekly' ? selectedDays : undefined,
    };

    const input: RecurrenceInput = {
      baseStartAt,
      baseEndAt,
      settings,
    };

    return generateRecurrenceSlots(input);
  }, [baseStartAt, baseEndAt, recurrenceType, selectedDays, hasEndDate, endDateInput, errors]);

  // 曜日トグル
  const toggleDay = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // 確定ボタン
  const handleConfirm = () => {
    if (!validate()) return;

    onConfirm(previewSlots);
    onOpenChange(false);
  };

  // キャンセル
  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl max-w-md mx-auto p-8 overflow-y-auto max-h-[80vh]"
      >
        <SheetHeader className="text-left pb-6">
          <SheetTitle className="text-title-sm">繰り返し</SheetTitle>
          <p className="text-body-sm text-muted-foreground pt-2">
            同じ時間帯の開催枠をまとめて作成します
          </p>
        </SheetHeader>

        <div className="space-y-6">
          {/* 繰り返し種別 */}
          <div>
            <label className="block text-label-sm font-bold mb-3">繰り返し種別</label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={recurrenceType === 'daily' ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setRecurrenceType('daily')}
                className="flex-1"
              >
                毎日
              </Button>
              <Button
                type="button"
                variant={recurrenceType === 'weekly' ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setRecurrenceType('weekly')}
                className="flex-1"
              >
                毎週
              </Button>
            </div>
          </div>

          {/* 曜日選択（毎週の場合のみ） */}
          {recurrenceType === 'weekly' && (
            <div>
              <label className="block text-label-sm font-bold mb-3">曜日選択</label>
              <div className="grid grid-cols-4 gap-2">
                {WEEKDAYS.map(({ value, label }) => (
                  <Button
                    key={value}
                    type="button"
                    variant={selectedDays.includes(value) ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => toggleDay(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              {errors.days && (
                <p className="text-body-sm text-destructive mt-2">{errors.days}</p>
              )}
            </div>
          )}

          {/* 終了日 */}
          <div>
            <label className="block text-label-sm font-bold mb-3">終了日</label>
            <div className="space-y-3">
              <Button
                type="button"
                variant={!hasEndDate ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setHasEndDate(false)}
                className="w-full"
              >
                指定しない
              </Button>
              <Button
                type="button"
                variant={hasEndDate ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setHasEndDate(true)}
                className="w-full"
              >
                日付を指定
              </Button>
              {hasEndDate && (
                <div>
                  <input
                    type="date"
                    value={endDateInput}
                    onChange={(e) => setEndDateInput(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground"
                  />
                  {errors.endDate && (
                    <p className="text-body-sm text-destructive mt-2">{errors.endDate}</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* プレビュー */}
          {previewSlots.length > 0 && (
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-body-sm text-foreground">
                💡 {previewSlots.length}件の開催枠が作成されます
              </p>
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="text"
              size="md"
              onClick={handleCancel}
              className="flex-1"
            >
              やめる
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleConfirm}
              disabled={previewSlots.length === 0}
              className="flex-1"
            >
              追加
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
