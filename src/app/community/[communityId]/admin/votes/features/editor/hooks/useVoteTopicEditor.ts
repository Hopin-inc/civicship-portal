import { useMemo } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { GqlRole, GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";
import { createVoteTopicSchema } from "../validation/schema";
import { VoteTopicFormValues } from "../types/form";

function createDefaultValues(): VoteTopicFormValues {
  const tomorrow = dayjs().add(1, "day");
  return {
    title: "",
    description: "",
    startsAt: tomorrow.hour(9).minute(0).format("YYYY-MM-DDTHH:mm"),
    endsAt: tomorrow.add(7, "day").hour(18).minute(0).format("YYYY-MM-DDTHH:mm"),
    options: [{ label: "" }, { label: "" }],
    gate: {
      type: GqlVoteGateType.Membership,
      requiredRole: GqlRole.Member,
      nftTokenId: null,
    },
    powerPolicy: {
      type: GqlVotePowerPolicyType.Flat,
      nftTokenId: null,
    },
  };
}

export function useVoteTopicEditor(
  initialValues?: VoteTopicFormValues,
): UseFormReturn<VoteTopicFormValues> {
  const t = useTranslations();
  const schema = useMemo(() => createVoteTopicSchema(t as (k: string) => string), [t]);
  const defaultValues = useMemo(
    () => initialValues ?? createDefaultValues(),
    [initialValues],
  );

  return useForm<VoteTopicFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onSubmit",
  });
}
