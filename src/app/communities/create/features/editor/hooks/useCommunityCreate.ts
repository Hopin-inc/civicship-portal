"use client";

import { useCallback } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { COMMUNITY_CREATE } from "@/graphql/account/community/mutation";
import {
  GqlCommunityCreateInput,
  GqlMutation,
  GqlMutationCommunityCreateArgs,
} from "@/types/graphql";
import { CommunityFormData } from "../types/form";
import { useCommunityValidation } from "./useCommunityValidation";

export function useCommunityCreate() {
  const { errors, validateForm, clearError } = useCommunityValidation();

  const [communityCreate, { loading }] = useMutation<
    Pick<GqlMutation, "communityCreate">,
    GqlMutationCommunityCreateArgs
  >(COMMUNITY_CREATE);

  const handleSave = useCallback(
    async (formData: CommunityFormData): Promise<string | undefined> => {
      if (!validateForm(formData.name, formData.pointName)) {
        return undefined;
      }

      const hasLineConfig =
        formData.lineAccessToken.trim() ||
        formData.lineChannelId.trim() ||
        formData.lineChannelSecret.trim() ||
        formData.lineLiffBaseUrl.trim() ||
        formData.lineLiffId.trim();

      const input: GqlCommunityCreateInput = {
        name: formData.name.trim(),
        pointName: formData.pointName.trim(),
        bio: formData.bio.trim() || undefined,
        website: formData.website.trim() || undefined,
        image: formData.imageFile ? { file: formData.imageFile } : undefined,
        establishedAt: formData.establishedAt || undefined,
        originalId: formData.originalId.trim() || undefined,
        createdBy: formData.createdBy.trim() || undefined,
        config: hasLineConfig
          ? {
              lineConfig: {
                accessToken: formData.lineAccessToken,
                channelId: formData.lineChannelId,
                channelSecret: formData.lineChannelSecret,
                liffBaseUrl: formData.lineLiffBaseUrl,
                liffId: formData.lineLiffId,
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
