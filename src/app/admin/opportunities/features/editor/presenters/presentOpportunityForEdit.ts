import dayjs from "dayjs";
import { GqlGetOpportunityQuery, GqlOpportunityCategory } from "@/types/graphql";
import { OpportunityFormData } from "../types/form";
import { DEFAULT_CAPACITY } from "../constants/form";

/**
 * GraphQL取得データをフォーム編集用に変換
 */
export function presentOpportunityForEdit(
  opportunity: NonNullable<GqlGetOpportunityQuery["opportunity"]>
): Partial<OpportunityFormData> {
  const isActivity = opportunity.category === GqlOpportunityCategory.Activity;

  // capacity を先に取得（slots より前）
  const firstSlot = (opportunity.slots || []).find((slot) => slot != null);
  const capacity = firstSlot?.capacity || DEFAULT_CAPACITY;
  console.log('[presentOpportunityForEdit] Extracted capacity from first slot:', {
    firstSlotCapacity: firstSlot?.capacity,
    finalCapacity: capacity,
    allSlots: opportunity.slots?.map(s => ({ id: s?.id, capacity: s?.capacity })),
  });

  // slots の型安全な変換
  const slots = (opportunity.slots || [])
    .filter((slot): slot is NonNullable<typeof slot> => slot != null)
    .map((slot) => ({
      id: slot.id,
      startAt:
        typeof slot.startsAt === "number"
          ? dayjs.unix(slot.startsAt).format("YYYY-MM-DDTHH:mm")
          : dayjs(slot.startsAt).format("YYYY-MM-DDTHH:mm"),
      endAt:
        typeof slot.endsAt === "number"
          ? dayjs.unix(slot.endsAt).format("YYYY-MM-DDTHH:mm")
          : dayjs(slot.endsAt).format("YYYY-MM-DDTHH:mm"),
      hostingStatus: slot.hostingStatus,
    }));

  return {
    category: opportunity.category,
    title: opportunity.title,
    summary: opportunity.description,
    description: opportunity.body || "",
    capacity,

    // カテゴリ別フィールド
    ...(isActivity
      ? {
          feeRequired: opportunity.feeRequired || 0,
          pointsRequired: opportunity.pointsRequired || 0,
        }
      : {
          pointsToEarn: opportunity.pointsToEarn || 0,
        }),

    placeId: opportunity.place?.id || null,
    placeName: opportunity.place?.name || null,
    hostUserId: opportunity.createdByUser?.id || "",
    hostName: opportunity.createdByUser?.name || null,
    requireHostApproval: opportunity.requireApproval,
    slots,
    images: (opportunity.images || []).map((url) => ({
      type: 'existing' as const,
      url
    })),
    publishStatus: opportunity.publishStatus,
  };
}
