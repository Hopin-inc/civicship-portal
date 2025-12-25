"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { RecurrenceError, RecurrenceInput, RecurrenceSettings, RecurrenceType } from "../types/recurrence";
import { SlotData } from "../../shared/types/slot";
import { generateRecurrenceSlots } from "../utils/recurrenceGenerator";

interface UseRecurrenceStateProps {
  baseStartAt: string;
  baseEndAt: string;
}

export const useRecurrenceState = ({
  baseStartAt,
  baseEndAt,
}: UseRecurrenceStateProps) => {
  // 状態管理
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("daily");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [hasEndDate, setHasEndDate] = useState(false);
  const [endDateInput, setEndDateInput] = useState<string>("");
  const [errors, setErrors] = useState<RecurrenceError>({});

  // バリデーション
  const validate = (): boolean => {
    const newErrors: RecurrenceError = {};

    // 毎週かつ曜日未選択
    if (recurrenceType === "weekly" && selectedDays.length === 0) {
      newErrors.days = "曜日を1つ以上選択してください";
    }

    // 終了日指定かつ未入力
    if (hasEndDate && !endDateInput) {
      newErrors.endDate = "終了日を入力してください";
    }

    // 終了日が起点日より前
    if (hasEndDate && endDateInput) {
      const baseDate = dayjs(baseStartAt).format("YYYY-MM-DD");
      if (dayjs(endDateInput).isBefore(baseDate)) {
        newErrors.endDate = "終了日は開始日以降を指定してください";
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
      selectedDays: recurrenceType === "weekly" ? selectedDays : undefined,
    };

    const input: RecurrenceInput = {
      baseStartAt,
      baseEndAt,
      settings,
    };

    return generateRecurrenceSlots(input);
  }, [baseStartAt, baseEndAt, recurrenceType, selectedDays, hasEndDate, endDateInput, errors]);

  // リセット
  const reset = () => {
    setRecurrenceType("daily");
    setSelectedDays([]);
    setHasEndDate(false);
    setEndDateInput("");
    setErrors({});
  };

  return {
    // 状態
    recurrenceType,
    setRecurrenceType,
    selectedDays,
    setSelectedDays,
    hasEndDate,
    setHasEndDate,
    endDateInput,
    setEndDateInput,
    errors,

    // 計算値
    previewSlots,

    // メソッド
    validate,
    reset,
  };
};
