"use client";

import { FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldControl,
  FieldMessage,
} from "@/components/ui/field";
import { useCommunityProfileEditor } from "../hooks/useCommunityProfileEditor";

interface CommunitySettingFormProps {
  editor: ReturnType<typeof useCommunityProfileEditor>;
  onSubmit: (e: FormEvent) => void;
}

export function CommunitySettingForm({ editor, onSubmit }: CommunitySettingFormProps) {
  const t = useTranslations();

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Field>
        <FieldLabel required>{t("adminSetting.form.name")}</FieldLabel>
        <FieldControl>
          <Input
            value={editor.formState.name}
            onChange={(e) => editor.updateField("name", e.target.value)}
            placeholder={t("adminSetting.form.name")}
          />
        </FieldControl>
        {editor.errors.name && (
          <FieldMessage error>{editor.errors.name}</FieldMessage>
        )}
      </Field>

      <Field>
        <FieldLabel required>{t("adminSetting.form.pointName")}</FieldLabel>
        <FieldControl>
          <Input
            value={editor.formState.pointName}
            onChange={(e) => editor.updateField("pointName", e.target.value)}
            placeholder={t("adminSetting.form.pointName")}
          />
        </FieldControl>
        {editor.errors.pointName && (
          <FieldMessage error>{editor.errors.pointName}</FieldMessage>
        )}
      </Field>

      <Field>
        <FieldLabel>{t("adminSetting.form.bio")}</FieldLabel>
        <FieldControl>
          <Textarea
            value={editor.formState.bio}
            onChange={(e) => editor.updateField("bio", e.target.value)}
            placeholder={t("adminSetting.form.bio")}
            className="min-h-[120px] resize-none"
          />
        </FieldControl>
      </Field>

      <Field>
        <FieldLabel>{t("adminSetting.form.website")}</FieldLabel>
        <FieldControl>
          <Input
            type="url"
            value={editor.formState.website}
            onChange={(e) => editor.updateField("website", e.target.value)}
            placeholder="https://example.com"
          />
        </FieldControl>
      </Field>

      <Field>
        <FieldLabel>{t("adminSetting.form.establishedAt")}</FieldLabel>
        <FieldControl>
          <Input
            type="date"
            value={editor.formState.establishedAt}
            onChange={(e) => editor.updateField("establishedAt", e.target.value)}
          />
        </FieldControl>
      </Field>

      <Button
        type="submit"
        variant="primary"
        className="w-full h-[56px]"
        disabled={editor.saving}
      >
        {editor.saving ? t("adminSetting.form.saving") : t("adminSetting.form.submit")}
      </Button>
    </form>
  );
}
