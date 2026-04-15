"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useAppRouter } from "@/lib/navigation";
import { UPDATE_PORTAL_CONFIG } from "@/graphql/account/community/mutation";
import {
  useGetCommunityPortalConfigQuery,
  GqlCommunityPortalConfig,
  GqlCommunityPortalConfigInput,
  GqlUpdatePortalConfigMutationVariables,
} from "@/types/graphql";

// 単一画像フィールドの状態
type ImageField =
  | { type: "new"; file: File; previewUrl: string }
  | { type: "existing"; url: string }
  | null;

interface FormState {
  title: string;
  description: string;
  shortDescription: string;
}

interface FormErrors {
  title?: string;
}

export function useCommunityProfileEditor(communityId: string | undefined) {
  const t = useTranslations();
  const router = useAppRouter();

  const { data, loading: queryLoading } = useGetCommunityPortalConfigQuery({
    variables: { communityId: communityId ?? "" },
    skip: !communityId,
  });

  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    shortDescription: "",
  });
  const [logoImage, setLogoImage] = useState<ImageField>(null);
  const [squareLogoImage, setSquareLogoImage] = useState<ImageField>(null);
  const [ogImageImage, setOgImageImage] = useState<ImageField>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const logoInputRef = useRef<HTMLInputElement>(null);
  const squareLogoInputRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  // 最新の画像 state を ref で追跡してアンマウント時に blob URL を解放する
  const imagesRef = useRef({ logoImage, squareLogoImage, ogImageImage });
  imagesRef.current = { logoImage, squareLogoImage, ogImageImage };

  useEffect(() => {
    return () => {
      Object.values(imagesRef.current).forEach((img) => {
        if (img?.type === "new") URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []);

  useEffect(() => {
    if (data?.communityPortalConfig) {
      const c = data.communityPortalConfig as GqlCommunityPortalConfig;
      setFormState({
        title: c.title ?? "",
        description: c.description ?? "",
        shortDescription: c.shortDescription ?? "",
      });
      if (c.logoPath) {
        setLogoImage({ type: "existing", url: c.logoPath });
      }
      if (c.squareLogoPath) {
        setSquareLogoImage({ type: "existing", url: c.squareLogoPath });
      }
      if (c.ogImagePath) {
        setOgImageImage({ type: "existing", url: c.ogImagePath });
      }
    }
  }, [data]);

  const [updatePortalConfig, { loading: saving }] = useMutation<
    { updatePortalConfig: GqlCommunityPortalConfig },
    GqlUpdatePortalConfigMutationVariables
  >(UPDATE_PORTAL_CONFIG);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleImageSelect(
    field: "logo" | "squareLogo" | "ogImage",
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const imageField: ImageField = { type: "new", file, previewUrl };

    // 同じフィールドに既存の blob URL があれば解放する
    const current = imagesRef.current;
    if (field === "logo") {
      if (current.logoImage?.type === "new") URL.revokeObjectURL(current.logoImage.previewUrl);
      setLogoImage(imageField);
    } else if (field === "squareLogo") {
      if (current.squareLogoImage?.type === "new") URL.revokeObjectURL(current.squareLogoImage.previewUrl);
      setSquareLogoImage(imageField);
    } else {
      if (current.ogImageImage?.type === "new") URL.revokeObjectURL(current.ogImageImage.previewUrl);
      setOgImageImage(imageField);
    }
    // input をリセットして同じファイルを再選択できるようにする
    e.target.value = "";
  }

  function getPreviewUrl(image: ImageField): string | null {
    if (!image) return null;
    return image.type === "new" ? image.previewUrl : image.url;
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!formState.title.trim()) {
      newErrors.title = t("adminSetting.form.error.titleRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!communityId || !validate()) return;

    try {
      const input: GqlCommunityPortalConfigInput = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        shortDescription: formState.shortDescription.trim() || null,
      };

      if (logoImage?.type === "new") {
        input.logo = { file: logoImage.file };
      }
      if (squareLogoImage?.type === "new") {
        input.squareLogo = { file: squareLogoImage.file };
      }
      if (ogImageImage?.type === "new") {
        input.ogImage = { file: ogImageImage.file };
      }

      const result = await updatePortalConfig({
        variables: { communityId, input },
        refetchQueries: ["GetCommunityPortalConfig"],
      });
      const updated = result.data?.updatePortalConfig;
      if (updated) {
        if (updated.logoPath) {
          if (logoImage?.type === "new") URL.revokeObjectURL(logoImage.previewUrl);
          setLogoImage({ type: "existing", url: updated.logoPath });
        }
        if (updated.squareLogoPath) {
          if (squareLogoImage?.type === "new") URL.revokeObjectURL(squareLogoImage.previewUrl);
          setSquareLogoImage({ type: "existing", url: updated.squareLogoPath });
        }
        if (updated.ogImagePath) {
          if (ogImageImage?.type === "new") URL.revokeObjectURL(ogImageImage.previewUrl);
          setOgImageImage({ type: "existing", url: updated.ogImagePath });
        }
      }
      toast.success(t("adminSetting.form.success"));
      router.push("/admin");
    } catch {
      toast.error(t("adminSetting.form.error.submit"));
    }
  }

  return {
    formState,
    errors,
    updateField,
    logoImage,
    squareLogoImage,
    ogImageImage,
    logoInputRef,
    squareLogoInputRef,
    ogImageInputRef,
    handleImageSelect,
    getPreviewUrl,
    onSubmit,
    saving,
    queryLoading,
  };
}
