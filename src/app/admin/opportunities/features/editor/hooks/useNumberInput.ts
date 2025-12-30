/**
 * 数字入力フック
 * 0を削除可能にしつつ、適切なバリデーションを提供
 */

import { useState, useCallback, useEffect } from "react";

interface UseNumberInputOptions {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  defaultValue?: number;
}

export const useNumberInput = ({
  value,
  onChange,
  min = 0,
  max,
  defaultValue,
}: UseNumberInputOptions) => {
  // 表示用の値（空文字列を許容）
  const [displayValue, setDisplayValue] = useState<string>(String(value));

  // 親から値が変更された場合、表示も更新
  useEffect(() => {
    setDisplayValue(String(value));
  }, [value]);

  // 入力時のハンドラ（空文字列を許容）
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      // 空文字列の場合はそのまま表示（削除を許可）
      if (inputValue === "") {
        setDisplayValue("");
        return;
      }

      // 数字のみ許可
      const numValue = Number(inputValue);
      if (isNaN(numValue)) {
        return;
      }

      // 最大値チェック
      if (max !== undefined && numValue > max) {
        return;
      }

      // 表示値を更新
      setDisplayValue(inputValue);

      // 即座に親に通知（リアルタイム更新）
      onChange(numValue);
    },
    [onChange, max]
  );

  // フォーカスアウト時のハンドラ（空の場合デフォルト値を設定）
  const handleBlur = useCallback(() => {
    if (displayValue === "") {
      // デフォルト値を決定（優先順位: defaultValue > min > 0）
      const fallbackValue = defaultValue !== undefined ? defaultValue : min;
      setDisplayValue(String(fallbackValue));
      onChange(fallbackValue);
    }
  }, [displayValue, onChange, min, defaultValue]);

  return {
    displayValue,
    handleChange,
    handleBlur,
  };
};
