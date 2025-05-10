import {
  OpportunityCard,
  OpportunityHost,
  OpportunityPlace,
} from "@/types/opportunity";
import { CommunityId } from "@/types/index";
import {
  GqlOpportunityCategory,
  GqlOpportunitySlotHostingStatus,
  GqlParticipationStatus,
  GqlReservationStatus,
} from "@/types/graphql";
import { AppImage } from "@/types/utils";
import { ArticleWithAuthor } from "@/types/article";

// ---------------------------------------------
// 🎯 予約型の全体ユニオン
// ---------------------------------------------

export type ReservationDetail =
  | AfterApplyActivityReservation
  | AfterApplyQuestReservation
  | ParticipatingActivityReservation
  | ParticipatingQuestReservation
  | ParticipatedActivityReservation
  | ParticipatedQuestReservation;

// ---------------------------------------------
// 📌 共通型定義: ステージ・カテゴリ・タグ型
// ---------------------------------------------

export const ReservationStage = {
  AfterApply: "afterApply",
  Participating: "participating",
  Participated: "participated",
} as const;

export type ReservationStage = typeof ReservationStage[keyof typeof ReservationStage];

export type ReservationCategory =
  typeof GqlOpportunityCategory.Activity |
  typeof GqlOpportunityCategory.Quest;

type StageTag<S extends ReservationStage> = { stage: S };
type CategoryTag<C extends ReservationCategory> = { category: C };

// ---------------------------------------------
// 📌 ベース予約情報（すべての予約に共通）
// ---------------------------------------------

type ReservationInfo = PublicReservationInfo & Partial<PrivateReservationInfo>;

type PublicReservationInfo = CommunityId & {
  id: string;

  reservationStatus: typeof GqlReservationStatus;
  participationStatus: typeof GqlParticipationStatus;
  slotStatus: typeof GqlOpportunitySlotHostingStatus;

  opportunity: ReserveOpportunity;

  images: AppImage[];
  totalImageCount: number;

  date: string;
  participantsCount: number;
  place: OpportunityPlace;
};

type PrivateReservationInfo = {
  emergencyContactPhone: string;
};


// ---------------------------------------------
// 🧱 ステージ別の予約拡張情報
// ---------------------------------------------

// 予約直後（申込完了）でのみ存在するフィールド
type ReservationDetailAfterApply = ReservationInfo & {
  interview: ArticleWithAuthor;
  relatedOpportunity: OpportunityCard[];
};

// 開催前（参加予定）状態の拡張
type ParticipatingReservationDetail = ReservationInfo & {
  isCancelable: boolean; // キャンセル可能か（例: 開始24時間前まで）
  cancelDue: string;
};

// 開催後（参加完了）状態では新たな情報は追加されない
type ParticipatedReservationDetail = ReservationInfo;

// ---------------------------------------------
// 🎫 種別別の追加フィールド（activity / quest）
// ---------------------------------------------

type ActivityField = {
  feeRequired: number;
  totalFeeRequired: number;
};

type QuestField = {
  pointsToEarn: number;
  totalPointsToEarn: number;
};

// ---------------------------------------------
// 🔀 ステージ × カテゴリ の掛け合わせ型（全6種）
// ---------------------------------------------

// 👇 予約直後（AfterApply）
type AfterApplyActivityReservation =
  ReservationDetailAfterApply &
  ActivityField &
  StageTag<"afterApply"> &
  CategoryTag<typeof GqlOpportunityCategory.Activity>;

type AfterApplyQuestReservation =
  ReservationDetailAfterApply &
  QuestField &
  StageTag<"afterApply"> &
  CategoryTag<typeof GqlOpportunityCategory.Quest>;

// 👇 参加中（Participating）
type ParticipatingActivityReservation =
  ParticipatingReservationDetail &
  ActivityField &
  StageTag<"participating"> &
  CategoryTag<typeof GqlOpportunityCategory.Activity>;

type ParticipatingQuestReservation =
  ParticipatingReservationDetail &
  QuestField &
  StageTag<"participating"> &
  CategoryTag<typeof GqlOpportunityCategory.Quest>;

// 👇 参加済（Participated）
type ParticipatedActivityReservation =
  ParticipatedReservationDetail &
  ActivityField &
  StageTag<"participated"> &
  CategoryTag<typeof GqlOpportunityCategory.Activity>;

type ParticipatedQuestReservation =
  ParticipatedReservationDetail &
  QuestField &
  StageTag<"participated"> &
  CategoryTag<typeof GqlOpportunityCategory.Quest>;

// ---------------------------------------------
// 🔗 関連型（予約内の機会情報）
// ---------------------------------------------

type ReserveOpportunity = {
  id: string;
  title: string;
  image: string;
  host: OpportunityHost;
};
