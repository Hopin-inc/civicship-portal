"use client";

import { useState, useEffect, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { UPDATE_PORTAL_CONFIG } from "@/graphql/account/community/mutation";
import {
  useGetCommunityPortalConfigQuery,
  GqlCommunityPortalConfig,
  GqlMutationUpdatePortalConfigArgs,
} from "@/types/graphql";

interface FormState {
  title: string;
  description: string;
  shortDescription: string;
  logoPath: string;
  squareLogoPath: string;
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
    logoPath: "",
    squareLogoPath: "",
    faviconPrefix: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (data?.communityPortalConfig) {
      const c = data.communityPortalConfig as GqlCommunityPortalConfig;
      setFormState({
        title: c.title ?? "",
        description: c.description ?? "",
        shortDescription: c.shortDescription ?? "",
        logoPath: c.logoPath ?? "",
        squareLogoPath: c.squareLogoPath ?? "",
        faviconPrefix: c.faviconPrefix ?? "",
      });
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
      await updatePortalConfig({
        variables: {
          communityId,
          input: {
            title: formState.title.trim(),
            description: formState.description.trim() || undefined,
            shortDescription: formState.shortDescription.trim() || undefined,
            logoPath: formState.logoPath.trim() || undefined,
            squareLogoPath: formState.squareLogoPath.trim() || undefined,
            faviconPrefix: formState.faviconPrefix.trim() || undefined,
          },
        },
      });
      toast.success(t("adminSetting.form.success"));
    } catch {
      toast.error(t("adminSetting.form.error.submit"));
    }
  }

  return {
    formState,
    errors,
    updateField,
    onSubmit,
    saving,
    queryLoading,
  };
}
