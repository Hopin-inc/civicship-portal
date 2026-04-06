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
      if (!validateForm(formData.name, formData.pointName)) {
        return undefined;
      }

      // LINE設定の全フィールド入力チェック（Tier2: 部分入力を防止）
      const lineFields = [
        formData.lineAccessToken.trim(),
        formData.lineChannelId.trim(),
        formData.lineChannelSecret.trim(),
        formData.lineLiffBaseUrl.trim(),
        formData.lineLiffId.trim(),
      ];
      const filledCount = lineFields.filter(Boolean).length;
      if (filledCount > 0 && filledCount < lineFields.length) {
        toast.error("LINE設定を使用する場合はすべてのフィールドを入力してください");
        return undefined;
      }
      const hasLineConfig = filledCount === lineFields.length;

      const input: GqlCommunityCreateInput = {
        name: formData.name.trim(),
        pointName: formData.pointName.trim(),
        bio: formData.bio.trim() || undefined,
        website: formData.website.trim() || undefined,
        image: formData.imageFile ? { file: formData.imageFile } : undefined,
        establishedAt: formData.establishedAt ? new Date(formData.establishedAt) : undefined,
        originalId: formData.originalId.trim() || undefined,
        createdBy: formData.createdBy.trim() || undefined,
        config: hasLineConfig
          ? {
              lineConfig: {
                accessToken: formData.lineAccessToken.trim(),
                channelId: formData.lineChannelId.trim(),
                channelSecret: formData.lineChannelSecret.trim(),
                liffBaseUrl: formData.lineLiffBaseUrl.trim(),
                liffId: formData.lineLiffId.trim(),
                richMenus: [],
              },
            }
          : undefined,
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


  const handleSave = useCallback(
    async (formData: CommunityFormData): Promise<string | undefined> => {
      if (!validateForm(formData.name, formData.pointName)) {
        return undefined;
      }

      // LINE設定の全フィールド入力チェック（Tier2: 部分入力を防止）
      const lineFields = [
        formData.lineAccessToken.trim(),
        formData.lineChannelId.trim(),
        formData.lineChannelSecret.trim(),
        formData.lineLiffBaseUrl.trim(),
        formData.lineLiffId.trim(),
      ];
      const filledCount = lineFields.filter(Boolean).length;
      if (filledCount > 0 && filledCount < lineFields.length) {
        toast.error("LINE設定を使用する場合はすべてのフィールドを入力してください");
        return undefined;
      }
      const hasLineConfig = filledCount === lineFields.length;

      const input: GqlCommunityCreateInput = {
        name: formData.name.trim(),
        pointName: formData.pointName.trim(),
        bio: formData.bio.trim() || undefined,
        website: formData.website.trim() || undefined,
        image: formData.imageFile ? { file: formData.imageFile } : undefined,
        establishedAt: formData.establishedAt ? new Date(formData.establishedAt) : undefined,
        originalId: formData.originalId.trim() || undefined,
        createdBy: formData.createdBy.trim() || undefined,
        config: hasLineConfig
          ? {
              lineConfig: {
                accessToken: formData.lineAccessToken.trim(),
                channelId: formData.lineChannelId.trim(),
                channelSecret: formData.lineChannelSecret.trim(),
                liffBaseUrl: formData.lineLiffBaseUrl.trim(),
                liffId: formData.lineLiffId.trim(),
                richMenus: [],
              },
            }
          : undefined,
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
