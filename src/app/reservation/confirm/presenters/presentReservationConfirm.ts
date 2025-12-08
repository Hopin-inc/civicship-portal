/**
 * Presenters for reservation confirmation
 * Convert GraphQL types to UI-specific types
 */

import {
  GqlOpportunityCategory,
  GqlOpportunitySlot,
  GqlOpportunitySlotHostingStatus,
  Maybe,
} from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { toNumberSafe } from "../utils/paymentCalculations";
import { presenterPlace } from "@/app/places/data/presenter";
import {
  presenterActivitySlot,
  presenterOpportunityHost,
} from "@/components/domains/opportunities/data/presenter";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { isDateReservable } from "@/app/reservation/data/presenter/opportunitySlot";

/**
 * 予約確認画面で使用するウォレット情報
 */
export interface ReservationWallet {
  currentPoint: number;
  tickets: never[];
}

/**
 * GraphQL opportunity データを ActivityDetail に変換 (reservation/confirm 専用)
 * GraphQLクエリ結果の型(__typename含む)を受け入れるため、柔軟な型を使用
 *
 * @param data - GraphQL query result for opportunity (includes __typename fields)
 * @returns ActivityDetail object or null if data is invalid
 */
export function presentReservationActivity(data: any): ActivityDetail | null {
  if (!data) return null;

  const { images, place, slots, articles, createdByUser } = data;
  const activitySlots = presenterActivitySlot(slots, data.id, data.feeRequired);
  const isReservable = activitySlots.some((slot) => slot.isReservable);

  return {
    communityId: COMMUNITY_ID || "",
    id: data.id || "",
    title: data.title || "",
    description: data.description || "",
    body: data.body || "",
    notes: "",
    images: images?.map((image: string) => image) || [],
    totalImageCount: images?.length || 0,
    category: data.category || GqlOpportunityCategory.Activity,
    requireApproval: data.requireApproval || false,
    targetUtilities: data.requiredUtilities?.map((u: any) => u) ?? [],
    feeRequired: data.feeRequired ?? null,
    isReservable,
    pointsRequired: data.pointsRequired ?? 0,
    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: activitySlots,
    recentOpportunities: [],
    reservableTickets: [],
    relatedActivities: [],
  };
}

/**
 * GraphQL opportunity データを QuestDetail に変換 (reservation/confirm 専用)
 * GraphQLクエリ結果の型(__typename含む)を受け入れるため、柔軟な型を使用
 *
 * @param data - GraphQL query result for opportunity (includes __typename fields)
 * @returns QuestDetail object or null if data is invalid
 */
export function presentReservationQuest(data: any): QuestDetail | null {
  if (!data) return null;

  const { images, place, slots, articles, createdByUser } = data;
  const questSlots = presentQuestSlotsLocal(slots, data.id);
  const isReservable = questSlots.some((slot: QuestSlot) => slot.isReservable);

  return {
    communityId: COMMUNITY_ID || "",
    id: data.id || "",
    title: data.title || "",
    description: data.description || "",
    body: data.body || "",
    notes: "",
    images: images?.map((image: string) => image) || [],
    totalImageCount: images?.length || 0,
    category: data.category || GqlOpportunityCategory.Quest,
    requireApproval: data.requireApproval || false,
    targetUtilities: data.requiredUtilities?.map((u: any) => u) ?? [],
    isReservable,
    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: questSlots,
    pointsToEarn: data.pointsToEarn ?? 0,
    pointsRequired: data.pointsRequired ?? 0,
    relatedQuests: [],
    recentOpportunities: [],
  };
}

/**
 * Local implementation of quest slot presenter
 * Required because presenterQuestSlot is not exported from shared presenter
 */
function presentQuestSlotsLocal(
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  activityId?: string,
): QuestSlot[] {
  const SLOT_IDS_TO_FORCE_RESERVABLE = ["cmc07ao5c0005s60nnc8ravvk"];

  return (
    slots?.map((slot): QuestSlot => {
      const startsAtDate = slot?.startsAt ? new Date(slot.startsAt) : null;

      const isForceReservable = slot?.id && SLOT_IDS_TO_FORCE_RESERVABLE.includes(slot.id);

      const isReservable = isForceReservable
        ? true
        : startsAtDate
          ? isDateReservable(startsAtDate, activityId)
          : false;

      return {
        id: slot?.id,
        hostingStatus: slot?.hostingStatus || GqlOpportunitySlotHostingStatus.Scheduled,
        startsAt: startsAtDate?.toISOString() || "",
        endsAt: slot?.endsAt ? new Date(slot.endsAt).toISOString() : "",
        capacity: slot?.capacity ?? 0,
        remainingCapacity: slot?.remainingCapacity ?? 0,
        applicantCount: 1,
        isReservable,
        pointsToEarn: 0,
      };
    }) ?? []
  );
}

/**
 * GraphQLウォレットデータから予約確認用のウォレット情報を生成
 * GraphQLクエリ結果の型(__typename含む)を受け入れるため、柔軟な型を使用
 *
 * @param wallets - GraphQLから取得したウォレット配列（コミュニティでフィルタ済み）
 * @param opportunity - 機会情報（チケットフィルタリングに使用）
 * @returns 予約確認用のウォレット情報、データがない場合はnull
 */
export function presentReservationWallet(
  wallets: any[] | null | undefined,
  opportunity: ActivityDetail | QuestDetail | null,
): ReservationWallet | null {
  if (!wallets || wallets.length === 0) return null;

  const memberWallet = wallets[0];

  const currentPoint = toNumberSafe(memberWallet?.currentPointView?.currentPoint, 0);

  // チケット機能停止: ticketsは常に空配列
  const tickets: never[] = [];

  return {
    currentPoint,
    tickets,
  };
}
