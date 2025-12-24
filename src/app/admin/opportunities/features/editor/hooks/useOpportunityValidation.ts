import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { ValidationErrors, ValidationErrorField } from "../../types";

export function useOpportunityValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const buildValidationErrors = useCallback(
    (title: string, summary: string, hostUserId: string): ValidationErrors => {
      const newErrors: ValidationErrors = {};

      if (!title.trim()) {
        newErrors.title = "タイトルを入力してください";
      }
      if (!summary.trim()) {
        newErrors.summary = "概要を入力してください";
      }
      if (!hostUserId) {
        newErrors.hostUserId = "主催者を選択してください";
      }

      return newErrors;
    },
    []
  );

  const validateForm = useCallback(
    (title: string, summary: string, hostUserId: string): boolean => {
      const newErrors = buildValidationErrors(title, summary, hostUserId);
      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        toast.error("必須項目を入力してください");
        return false;
      }

      return true;
    },
    [buildValidationErrors]
  );

  const clearError = useCallback((field: ValidationErrorField) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return {
    errors,
    validateForm,
    clearError,
  };
}
