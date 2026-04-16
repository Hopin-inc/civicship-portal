"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VoteTopicFormValues } from "../../types/form";

export function OptionsSection() {
  const t = useTranslations();
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<VoteTopicFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const canRemove = fields.length > 2;
  const canAdd = fields.length < 20;
  const rootError = errors.options?.root?.message ?? errors.options?.message;

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">
          {t("adminVotes.form.options.label")}
        </span>
        <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
          必須
        </span>
      </div>

      <div className="space-y-2">
        {fields.map((field, index) => {
          const optionError = errors.options?.[index]?.label?.message;
          return (
            <div key={field.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <Input
                  {...register(`options.${index}.label` as const)}
                  placeholder={t("adminVotes.form.options.placeholder")}
                  className={`placeholder:text-sm ${
                    optionError ? "border-destructive focus-visible:ring-destructive" : ""
                  }`}
                />
                <Button
                  type="button"
                  variant="tertiary"
                  size="icon"
                  aria-label={t("adminVotes.form.options.removeLabel")}
                  disabled={!canRemove}
                  onClick={() => remove(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {optionError && (
                <p className="text-xs text-destructive px-1">{optionError}</p>
              )}
            </div>
          );
        })}
      </div>

      {rootError && <p className="text-xs text-destructive px-1">{rootError}</p>}

      <Button
        type="button"
        variant="tertiary"
        size="sm"
        className="w-full"
        disabled={!canAdd}
        onClick={() => append({ label: "" })}
      >
        {t("adminVotes.form.options.addButton")}
      </Button>
    </section>
  );
}
