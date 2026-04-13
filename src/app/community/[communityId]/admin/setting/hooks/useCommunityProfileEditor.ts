"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { UPDATE_PORTAL_CONFIG } from "@/graphql/account/community/mutation";
import {
  useGetCommunityPortalConfigQuery,
  GqlCommunityPortalConfig,
  GqlMutationUpdatePortalConfigArgs,
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
  faviconPrefix: string;
}

interface FormErrors {
  title?: string;
}

export function useCommunityProfileEditor(communityId: string | undefined) {
  const t = useTranslations();

  const { data, loading: queryLoading } = useGetCommunityPortalConfigQuery({
    variables: { communityId: communityId ?? "" },
    skip: !communityId,
  });

  const [formState, setFormState] = useState<FormState>({
    title: "",
    description: "",
    shortDescription: "",
    faviconPrefix: "",
  });
  const [logoImage, setLogoImage] = useState<ImageField>(null);
  const [squareLogoImage, setSquareLogoImage] = useState<ImageField>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const logoInputRef = useRef<HTMLInputElement>(null);
  const squareLogoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.communityPortalConfig) {
      const c = data.communityPortalConfig as GqlCommunityPortalConfig;
      setFormState({
        title: c.title ?? "",
        description: c.description ?? "",
        shortDescription: c.shortDescription ?? "",
        faviconPrefix: c.faviconPrefix ?? "",
      });
      if (c.logoPath) {
        setLogoImage({ type: "existing", url: c.logoPath });
      }
      if (c.squareLogoPath) {
        setSquareLogoImage({ type: "existing", url: c.squareLogoPath });
      }
    }
  }, [data]);

  const [updatePortalConfig, { loading: saving }] = useMutation<
    { updatePortalConfig: GqlCommunityPortalConfig },
    GqlMutationUpdatePortalConfigArgs
  >(UPDATE_PORTAL_CONFIG);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function handleImageSelect(
    field: "logo" | "squareLogo",
    e: ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const imageField: ImageField = { type: "new", file, previewUrl };
    if (field === "logo") {
      setLogoImage(imageField);
    } else {
      setSquareLogoImage(imageField);
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
      // バックエンドが logo/squareLogo: ImageInput に対応後、型は codegen で更新される
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input: any = {
        title: formState.title.trim(),
        description: formState.description.trim() || undefined,
        shortDescription: formState.shortDescription.trim() || undefined,
        faviconPrefix: formState.faviconPrefix.trim() || undefined,
      };

      if (logoImage?.type === "new") {
        input.logo = { file: logoImage.file };
      }
      if (squareLogoImage?.type === "new") {
        input.squareLogo = { file: squareLogoImage.file };
      }

      await updatePortalConfig({ variables: { communityId, input } });
      toast.success(t("adminSetting.form.success"));
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
    logoInputRef,
    squareLogoInputRef,
    handleImageSelect,
    getPreviewUrl,
    onSubmit,
    saving,
    queryLoading,
  };
}
