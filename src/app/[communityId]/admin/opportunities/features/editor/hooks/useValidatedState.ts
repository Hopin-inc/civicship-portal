import { useState, useCallback } from "react";
import { ValidationErrors, ValidationErrorField } from "../types/form";

/**
 * エラー自動クリア機能付きの状態管理フック
 *
 * @param initialValue 初期値
 * @param errorKey バリデーションエラーのキー
 * @param errors 現在のエラー状態
 * @param clearError エラーをクリアする関数
 * @returns [value, setValue] タプル
 */
export function useValidatedState<T>(
  initialValue: T,
  errorKey: ValidationErrorField,
  errors: ValidationErrors,
  clearError: (field: ValidationErrorField) => void
) {
  const [value, setValue] = useState<T>(initialValue);

  const setValueWithClear = useCallback(
    (newValue: T) => {
      setValue(newValue);
      if (errors[errorKey]) {
        clearError(errorKey);
      }
    },
    [errorKey, errors, clearError]
  );

  return [value, setValueWithClear] as const;
}
