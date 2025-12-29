import { useCallback } from "react";
import { usePlaceCreateMutation, usePlaceUpdateMutation } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { PlaceEditorFormState } from "../types/form";
import { toast } from "sonner";

interface UsePlaceSaveOptions {
  placeId?: string;
  onSuccess?: (id: string) => void;
}

export const usePlaceSave = ({ placeId, onSuccess }: UsePlaceSaveOptions = {}) => {
  const [createPlace] = usePlaceCreateMutation();
  const [updatePlace] = usePlaceUpdateMutation();

  const handleSave = useCallback(
    async (formState: PlaceEditorFormState) => {
      try {
        // バリデーション
        if (!formState.name.trim()) {
          toast.error("場所名を入力してください");
          return null;
        }

        if (!formState.address.trim()) {
          toast.error("住所を入力してください");
          return null;
        }

        if (formState.latitude === null || formState.longitude === null) {
          toast.error("座標を取得できませんでした。住所を確認してください");
          return null;
        }

        if (!formState.cityCode) {
          toast.error("市区町村を選択してください");
          return null;
        }

        const input = {
          name: formState.name.trim(),
          address: formState.address.trim(),
          latitude: formState.latitude,
          longitude: formState.longitude,
          cityCode: formState.cityCode,
          googlePlaceId: formState.googlePlaceId,
          isManual: formState.isManual,
          mapLocation: formState.mapLocation,
        };

        if (placeId) {
          // 更新
          const { data } = await updatePlace({
            variables: {
              id: placeId,
              input: { ...input, id: placeId },
              permission: { communityId: COMMUNITY_ID },
            },
          });
          const updatedId = data?.placeUpdate?.place?.id;
          if (updatedId) {
            toast.success("場所を更新しました");
            onSuccess?.(updatedId);
            return updatedId;
          }
        } else {
          // 新規作成
          const { data } = await createPlace({
            variables: {
              input: { ...input, communityId: COMMUNITY_ID },
              permission: { communityId: COMMUNITY_ID },
            },
          });
          const createdId = data?.placeCreate?.place?.id;
          if (createdId) {
            toast.success("場所を作成しました");
            onSuccess?.(createdId);
            return createdId;
          }
        }
      } catch (error) {
        console.error("Place save failed:", error);
        toast.error(placeId ? "場所の更新に失敗しました" : "場所の作成に失敗しました");
        return null;
      }
    },
    [placeId, onSuccess, createPlace, updatePlace]
  );

  return {
    handleSave,
  };
};
