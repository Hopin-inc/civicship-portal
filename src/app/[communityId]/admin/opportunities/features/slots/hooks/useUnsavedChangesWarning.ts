import { useEffect, useCallback } from "react";

interface UseUnsavedChangesWarningOptions {
  isDirty: boolean;
  isSubmitting: boolean;
}

/**
 * 未保存の変更がある場合、ページ離脱時に警告を表示する
 */
export function useUnsavedChangesWarning({ isDirty, isSubmitting }: UseUnsavedChangesWarningOptions) {
  // ブラウザ離脱時の警告
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitting) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitting]);

  // ナビゲーション前の確認
  const confirmNavigation = useCallback(() => {
    if (isDirty && !isSubmitting) {
      return window.confirm("保存されていない変更があります。破棄しますか？");
    }
    return true;
  }, [isDirty, isSubmitting]);

  return { confirmNavigation };
}
