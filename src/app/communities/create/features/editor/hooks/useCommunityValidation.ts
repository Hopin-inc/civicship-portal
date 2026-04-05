import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { ValidationErrors, ValidationErrorField } from "../types/form";

export function useCommunityValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback((name: string, pointName: string): boolean => {
    const newErrors: ValidationErrors = {};

    if (!name.trim()) {
      newErrors.name = "コミュニティ名を入力してください";
    }
    if (!pointName.trim()) {
      newErrors.pointName = "ポイント名称を入力してください";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("必須項目を入力してください");
      return false;
    }

    return true;
  }, []);

  const clearError = useCallback((field: ValidationErrorField) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return { errors, validateForm, clearError };
}
