import { z } from "zod";
import dayjs from "dayjs";
import { GqlRole, GqlVoteGateType, GqlVotePowerPolicyType } from "@/types/graphql";

type Translator = (key: string) => string;

export const createVoteTopicSchema = (t: Translator) => {
  const roleEnum = z.nativeEnum(GqlRole);
  const nftTokenIdRequired = z
    .string({ required_error: t("adminVotes.form.errors.nftTokenRequired") })
    .trim()
    .min(1, t("adminVotes.form.errors.nftTokenRequired"));

  const gateSchema = z.discriminatedUnion("type", [
    z.object({
      type: z.literal(GqlVoteGateType.Membership),
      requiredRole: roleEnum,
      nftTokenId: z.null(),
    }),
    z.object({
      type: z.literal(GqlVoteGateType.Nft),
      requiredRole: z.null(),
      nftTokenId: nftTokenIdRequired,
    }),
  ]);

  const powerPolicySchema = z.discriminatedUnion("type", [
    z.object({
      type: z.literal(GqlVotePowerPolicyType.Flat),
      nftTokenId: z.null(),
    }),
    z.object({
      type: z.literal(GqlVotePowerPolicyType.NftCount),
      nftTokenId: nftTokenIdRequired,
    }),
  ]);

  return z
    .object({
      title: z
        .string({ required_error: t("adminVotes.form.errors.titleRequired") })
        .trim()
        .min(1, t("adminVotes.form.errors.titleRequired")),
      description: z.string(),
      startsAt: z
        .string({ required_error: t("adminVotes.form.errors.startsAtRequired") })
        .min(1, t("adminVotes.form.errors.startsAtRequired")),
      endsAt: z
        .string({ required_error: t("adminVotes.form.errors.endsAtRequired") })
        .min(1, t("adminVotes.form.errors.endsAtRequired")),
      options: z
        .array(
          z.object({
            label: z
              .string({ required_error: t("adminVotes.form.errors.optionLabelRequired") })
              .trim()
              .min(1, t("adminVotes.form.errors.optionLabelRequired")),
          }),
        )
        .min(2, t("adminVotes.form.errors.minTwoOptions")),
      gate: gateSchema,
      powerPolicy: powerPolicySchema,
    })
    .refine(
      (values) => {
        if (!values.startsAt || !values.endsAt) return true;
        return dayjs(values.endsAt).isAfter(dayjs(values.startsAt));
      },
      {
        path: ["endsAt"],
        message: t("adminVotes.form.errors.endsAfterStart"),
      },
    )
    .refine(
      (values) => {
        // Both NFT-based: gate.nftTokenId must equal powerPolicy.nftTokenId
        // (BE enforces this with VALIDATION_ERROR; we validate client-side for UX).
        if (
          values.gate.type === GqlVoteGateType.Nft &&
          values.powerPolicy.type === GqlVotePowerPolicyType.NftCount
        ) {
          return values.gate.nftTokenId === values.powerPolicy.nftTokenId;
        }
        return true;
      },
      {
        path: ["powerPolicy", "nftTokenId"],
        message: t("adminVotes.form.errors.nftTokenMismatch"),
      },
    );
};
