import { z } from "zod";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";

export const opportunityFormSchema = z.object({
  category: z.enum([GqlOpportunityCategory.Activity, GqlOpportunityCategory.Quest]),
  title: z.string().min(1, "タイトルは必須です"),
  summary: z.string().min(1, "概要は必須です"),
  description: z.string().optional(),
  capacity: z.coerce.number().int().positive("1以上で入力してください"),
  pricePerPerson: z.coerce.number().int().min(0),
  pointPerPerson: z.coerce.number().int().min(0),
  placeId: z.string().nullable(), // 場所マスタ参照 （なければ null）
  hostUserId: z.string().min(1, "主催者を選択してください"),
  requireHostApproval: z.boolean(),
  slots: z
    .array(
      z.object({
        startAt: z.string(), // "2025-09-15T12:00" など
        endAt: z.string(),
      }),
    )
    .min(1, "少なくとも1つの開催枠が必要です"),
  images: z.array(z.any()).min(2, "最低2枚の画像を登録してください").max(5),
  publishStatus: z.enum([GqlPublishStatus.Public, GqlPublishStatus.Private]),
});

export type OpportunityFormValues = z.infer<typeof opportunityFormSchema>;
