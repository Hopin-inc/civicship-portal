"use client";

import { useState } from "react";
import { CommunityFormData } from "../types/form";
import { useCommunityCreate } from "./useCommunityCreate";

const initialFormData: CommunityFormData = {
  originalId: "",
  name: "",
  lineAccessToken: "",
  lineChannelId: "",
  lineChannelSecret: "",
  lineLiffId: "",
};

export function useCommunityEditor() {
  const [formData, setFormData] = useState<CommunityFormData>(initialFormData);
  const { handleSave, saving, errors, clearError } = useCommunityCreate();

  const setField = <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    setField,
    handleSave,
    saving,
    errors,
    clearError,
  };
}
