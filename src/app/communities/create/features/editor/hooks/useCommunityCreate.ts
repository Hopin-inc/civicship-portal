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
      const name = formData.name.trim();
      const accessToken = formData.lineAccessToken.trim();
      const channelId = formData.lineChannelId.trim();
      const channelSecret = formData.lineChannelSecret.trim();
      const liffId = formData.lineLiffId.trim();
      const originalId = formData.originalId.trim();
      const loginChannelId = formData.lineLoginChannelId.trim();
      const loginChannelSecret = formData.lineLoginChannelSecret.trim();

      if (
        !validateForm(name, {
          accessToken,
          channelId,
          channelSecret,
          liffId,
          loginChannelId,
          loginChannelSecret,
        })
      ) {
        return undefined;
      }

      // TODO: lineLoginChannelId / lineLoginChannelSecret はバックエンドスキーマ対応後に追加
      const input: GqlCommunityCreateInput = {
        name,
        pointName: name,
        image: formData.imageFile ? { file: formData.imageFile } : undefined,
        originalId: originalId || undefined,
        config: {
          lineConfig: {
            accessToken,
            channelId,
            channelSecret,
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
