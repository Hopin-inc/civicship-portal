import { useState, useCallback } from "react";
import { toast } from "react-toastify";

type FieldType =
  | "title"
  | "description"
  | "squareLogoPath"
  | "logoPath"
  | "ogImagePath"
  | "faviconPrefix"
  | "enableFeatures";

interface UsePortalConfigSaveOptions {
  communityId: string;
}

export function usePortalConfigSave({ communityId }: UsePortalConfigSaveOptions) {
  const [saving, setSaving] = useState(false);

  const saveField = useCallback(
    async (field: FieldType, value: string | string[] | File | null) => {
      setSaving(true);

      try {
        // TODO: 実際のGraphQL mutationを呼び出す
        // await upsertPortalConfig({
        //   variables: {
        //     input: { [field]: value },
        //     permission: { communityId },
        //   },
        // });

        // 仮実装: 1秒待機してローカル保存をシミュレート
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log(`[Portal Config] Saving ${field}:`, value);
        toast.success("保存しました");
        return true;
      } catch (error) {
        console.error(`[Portal Config] Failed to save ${field}:`, error);
        toast.error("保存に失敗しました");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [communityId]
  );

  const saveFeatures = useCallback(
    async (features: string[]) => {
      return saveField("enableFeatures", features);
    },
    [saveField]
  );

  const saveTitle = useCallback(
    async (title: string) => {
      return saveField("title", title);
    },
    [saveField]
  );

  const saveDescription = useCallback(
    async (description: string) => {
      return saveField("description", description);
    },
    [saveField]
  );

  const saveSquareLogo = useCallback(
    async (file: File | null) => {
      // TODO: 画像アップロード処理を実装
      return saveField("squareLogoPath", file);
    },
    [saveField]
  );

  const saveLogo = useCallback(
    async (file: File | null) => {
      // TODO: 画像アップロード処理を実装
      return saveField("logoPath", file);
    },
    [saveField]
  );

  const saveOgImage = useCallback(
    async (file: File | null) => {
      // TODO: 画像アップロード処理を実装
      return saveField("ogImagePath", file);
    },
    [saveField]
  );

  const saveFavicon = useCallback(
    async (file: File | null) => {
      // TODO: 画像アップロード処理を実装
      return saveField("faviconPrefix", file);
    },
    [saveField]
  );

  return {
    saving,
    saveTitle,
    saveDescription,
    saveSquareLogo,
    saveLogo,
    saveOgImage,
    saveFavicon,
    saveFeatures,
  };
}
