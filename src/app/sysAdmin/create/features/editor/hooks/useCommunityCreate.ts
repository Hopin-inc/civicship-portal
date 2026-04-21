"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { CommunityFormData } from "../types/form";
import { useCommunityValidation } from "./useCommunityValidation";
import { createCommunityAction } from "../actions/communityCreate";

export function useCommunityCreate() {
  const { errors, validateForm, clearError } = useCommunityValidation();
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(
    async (formData: CommunityFormData): Promise<string | undefined> => {
      const name = formData.name.trim();
      const accessToken = formData.lineAccessToken.trim();
      const channelId = formData.lineChannelId.trim();
      const channelSecret = formData.lineChannelSecret.trim();
      const liffId = formData.lineLiffId.trim();
      const originalId = formData.originalId.trim();

      if (!validateForm(name, { accessToken, channelId, channelSecret, liffId })) {
        toast.error("必須項目を入力してください");
        return undefined;
      }

      setSaving(true);
      try {
        const result = await createCommunityAction({
          name,
          originalId: originalId || undefined,
          lineAccessToken: accessToken,
          lineChannelId: channelId,
          lineChannelSecret: channelSecret,
          lineLiffId: liffId,
        });

        if (result.error) {
          toast.error(result.error);
          return undefined;
        }

        toast.success("コミュニティを作成しました");
        return result.communityId;
      } catch (error) {
        console.error(error);
        toast.error("コミュニティの作成に失敗しました");
        return undefined;
      } finally {
        setSaving(false);
      }
    },
    [validateForm],
  );

  return { handleSave, saving, errors, clearError };
}
