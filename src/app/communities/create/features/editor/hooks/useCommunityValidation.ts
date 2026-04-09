import { useState, useCallback } from "react";
import { toast } from "react-toastify";
import { ValidationErrors, ValidationErrorField } from "../types/form";

type LineConfigFields = {
  accessToken: string;
  liffId: string;
  channelId: string;
  channelSecret: string;
};

export function useCommunityValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = useCallback(
    (name: string, lineConfig: LineConfigFields): boolean => {
      const newErrors: ValidationErrors = {};

      if (!name.trim()) {
        newErrors.name = "コミュニティ名を入力してください";
      }
      if (!lineConfig.accessToken) {
        newErrors.lineAccessToken = "入力してください";
      }
      if (!lineConfig.liffId) {
        newErrors.lineLiffId = "入力してください";
      }
      if (!lineConfig.channelId) {
        newErrors.lineChannelId = "入力してください";
      }
      if (!lineConfig.channelSecret) {
        newErrors.lineChannelSecret = "入力してください";
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length > 0) {
        toast.error("必須項目を入力してください");
        return false;
      }

      return true;
    },
    [],
  );

  const clearError = useCallback((field: ValidationErrorField) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return { errors, validateForm, clearError };
}
