"use client";

import { useCallback } from "react";
import { toast } from "react-toastify";
import { useCommunityCreateMutation, GqlCommunityCreateInput } from "@/types/graphql";
import { CommunityFormData } from "../types/form";
import { useCommunityValidation } from "./useCommunityValidation";

export function useCommunityCreate() {
  const { errors, validateForm, clearError } = useCommunityValidation();

  const [communityCreate, { loading }] = useCommunityCreateMutation();

  const handleSave = useCallback(
    async (formData: CommunityFormData): Promise<string | undefined> => {
      const liffId = formData.lineLiffId.trim();

      if (
        !validateForm(formData.name, {
          accessToken: formData.lineAccessToken.trim(),
          channelId: formData.lineChannelId.trim(),
          channelSecret: formData.lineChannelSecret.trim(),
          liffId,
        })
      ) {
        return undefined;
      }

      const input: GqlCommunityCreateInput = {
        name: formData.name.trim(),
        pointName: formData.name.trim(),
        image: formData.imageFile ? { file: formData.imageFile } : undefined,
        originalId: formData.originalId.trim() || undefined,
        config: {
          lineConfig: {
            accessToken: formData.lineAccessToken.trim(),
            channelId: formData.lineChannelId.trim(),
            channelSecret: formData.lineChannelSecret.trim(),
            liffBaseUrl: `https://liff.line.me/${liffId}`,
            liffId,
            richMenus: [],
          },
        },
      };

      try {
        const result = await communityCreate({ variables: { input } });
        const community = result.data?.communityCreate?.community ?? null;

        if (!community) {
          toast.error("コミュニティの作成に失敗しました");
          return undefined;
        }

        toast.success("コミュニティを作成しました");
        return community.id;
      } catch (error) {
        console.error(error);
        toast.error("コミュニティの作成に失敗しました");
        return undefined;
      }
    },
    [validateForm, communityCreate],
  );

  return { handleSave, saving: loading, errors, clearError };
}
