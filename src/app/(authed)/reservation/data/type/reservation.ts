import { GqlOpportunityCategory, GqlReservationStatus } from "@/types/graphql";
import { CommunityId } from "@/types";
import {
  OpportunityCard,
  OpportunityHost,
  OpportunityPlace,
} from "@/components/domains/opportunities/types";
import { TArticleWithAuthor } from "@/app/articles/data/type";

// ---------------------------------------------
// 📌 カテゴリ
// ---------------------------------------------

export type ReservationCategory =
  | typeof GqlOpportunityCategory.Activity
  | typeof GqlOpportunityCategory.Quest;

// ---------------------------------------------
// 📌 基本構造（責務分離を維持）
// ---------------------------------------------

export type ReservationInfo = PublicReservationInfo & Partial<PrivateReservationInfo>;

type PublicReservationInfo = CommunityId & {
  id: string;
  status: GqlReservationStatus;

  opportunity: ReserveOpportunity;

  images: string[];
  totalImageCount: number;

  date: string;
  participantsCount: number;
  place: OpportunityPlace;
};

type PrivateReservationInfo = {
  emergencyContactPhone: string;
};

// ---------------------------------------------
// 📌 カテゴリ別拡張（フィールドだけで分岐）
// ---------------------------------------------

export type ActivityField = {
  feeRequired: number;
  totalFeeRequired: number;
};

export type QuestField = {
  pointsToEarn: number;
  totalPointsToEarn: number;
};

// ---------------------------------------------
// 📌 最終ユニオン型（ReservationDetail）
// ---------------------------------------------

export type ReservationOptionalInfo = {
  interview?: TArticleWithAuthor;
  relatedOpportunity?: OpportunityCard[];
  isCancelable?: boolean;
  cancelDue?: string;
};

export type ActivityReservation = ReservationInfo &
  ActivityField &
  ReservationOptionalInfo & {
    category: typeof GqlOpportunityCategory.Activity;
  };

export type QuestReservation = ReservationInfo &
  QuestField &
  ReservationOptionalInfo & {
    category: typeof GqlOpportunityCategory.Quest;
  };

export type ReservationDetail = ActivityReservation | QuestReservation;

// ---------------------------------------------
// 🔗 関連型
// ---------------------------------------------

export type ReserveOpportunity = {
  id: string;
  title: string;
  images: string[];
  host: OpportunityHost;
};
