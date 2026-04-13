import { useState, useCallback } from "react";
import { ValidationErrors, ValidationErrorField } from "../types/form";

type LineConfigFields = {
  accessToken: string;
  channelId: string;
  channelSecret: string;
  liffId: string;
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
      if (!lineConfig.channelId) {
        newErrors.lineChannelId = "入力してください";
      }
      if (!lineConfig.channelSecret) {
        newErrors.lineChannelSecret = "入力してください";
      }
      if (!lineConfig.liffId) {
        newErrors.lineLiffId = "入力してください";
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
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
