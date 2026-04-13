"use client";

import { useState, useEffect, FormEvent } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { COMMUNITY_UPDATE_PROFILE } from "@/graphql/account/community/mutation";
import { GET_COMMUNITY_PROFILE } from "@/graphql/account/community/query";
import {
  GqlCommunityUpdateProfilePayload,
  GqlMutationCommunityUpdateProfileArgs,
  GqlCommunity,
} from "@/types/graphql";

interface FormState {
  name: string;
  pointName: string;
  bio: string;
  website: string;
  establishedAt: string;
}

interface FormErrors {
  name?: string;
  pointName?: string;
}

export function useCommunityProfileEditor(communityId: string | undefined) {
  const t = useTranslations();

  const { data, loading: queryLoading } = useQuery<{ community: GqlCommunity }>(
    GET_COMMUNITY_PROFILE,
    {
      variables: { id: communityId ?? "" },
      skip: !communityId,
    },
  );

  const [formState, setFormState] = useState<FormState>({
    name: "",
    pointName: "",
    bio: "",
    website: "",
    establishedAt: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (data?.community) {
      const c = data.community;
      setFormState({
        name: c.name ?? "",
        pointName: c.pointName ?? "",
        bio: c.bio ?? "",
        website: c.website ?? "",
        establishedAt: c.establishedAt
          ? new Date(c.establishedAt).toISOString().split("T")[0]
          : "",
      });
    }
  }, [data]);

  const [updateProfile, { loading: saving }] = useMutation<
    { communityUpdateProfile: GqlCommunityUpdateProfilePayload },
    GqlMutationCommunityUpdateProfileArgs
  >(COMMUNITY_UPDATE_PROFILE);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setFormState((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!formState.name.trim()) {
      newErrors.name = t("adminSetting.form.error.nameRequired");
    }
    if (!formState.pointName.trim()) {
      newErrors.pointName = t("adminSetting.form.error.pointNameRequired");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!communityId || !validate()) return;

    try {
      await updateProfile({
        variables: {
          id: communityId,
          communityId,
          input: {
            name: formState.name.trim(),
            pointName: formState.pointName.trim(),
            bio: formState.bio.trim() || undefined,
            website: formState.website.trim() || undefined,
            establishedAt: formState.establishedAt
              ? new Date(formState.establishedAt)
              : undefined,
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
