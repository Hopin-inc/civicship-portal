"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VoteTopicFormValues } from "../../types/form";

export function BasicInfoSection() {
  const t = useTranslations();
  const {
    register,
    formState: { errors },
  } = useFormContext<VoteTopicFormValues>();

  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">
            {t("adminVotes.form.title.label")}
          </span>
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </div>
        <Input
          {...register("title")}
          placeholder={t("adminVotes.form.title.placeholder")}
          className={`placeholder:text-sm ${
            errors.title ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {errors.title && (
          <p className="text-xs text-destructive px-1">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">
            {t("adminVotes.form.description.label")}
          </span>
        </div>
        <Textarea
          {...register("description")}
          placeholder={t("adminVotes.form.description.placeholder")}
          className={`min-h-[80px] placeholder:text-sm ${
            errors.description ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
        />
        {errors.description && (
          <p className="text-xs text-destructive px-1">{errors.description.message}</p>
        )}
      </div>
    </section>
  );
}
