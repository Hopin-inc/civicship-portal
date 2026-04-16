"use client";

import { Controller, useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
import { DateTimeField } from "../../../../../opportunities/features/slots/components/forms/DateTimeField";
import { VoteTopicFormValues } from "../../types/form";

export function PeriodSection() {
  const t = useTranslations();
  const { control, watch, formState } = useFormContext<VoteTopicFormValues>();
  const startsAt = watch("startsAt");
  const endsAtError = formState.errors.endsAt?.message;
  const startsAtError = formState.errors.startsAt?.message;

  const minEndDate = startsAt ? dayjs(startsAt).toDate() : undefined;

  return (
    <section className="space-y-2">
      <Controller
        control={control}
        name="startsAt"
        render={({ field }) => (
          <div className="space-y-1">
            <DateTimeField
              label={t("adminVotes.form.startsAt.label")}
              value={field.value}
              onChange={field.onChange}
              defaultTime="09:00"
            />
            {startsAtError && (
              <p className="text-xs text-destructive px-1">{startsAtError}</p>
            )}
          </div>
        )}
      />

      <Controller
        control={control}
        name="endsAt"
        render={({ field }) => (
          <div className="space-y-1">
            <DateTimeField
              label={t("adminVotes.form.endsAt.label")}
              value={field.value}
              onChange={field.onChange}
              defaultTime="18:00"
              minDate={minEndDate}
            />
            {endsAtError && (
              <p className="text-xs text-destructive px-1">{endsAtError}</p>
            )}
          </div>
        )}
      />
    </section>
  );
}
