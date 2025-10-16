import { GqlOpportunityCategory, GqlOpportunitySlot } from "@/types/graphql";
import { CommunityId } from "@/types";
import { TArticleCard } from "@/app/articles/data/type";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { ReactElement } from "react";

// ---------------------------------------------
// 📦 Opportunity カード型（サマリ表示用）
// ---------------------------------------------
export type OpportunityCard = ActivityCard | QuestCard;

export type ActivityCard = OpportunityBaseCard & {
  feeRequired: number | null;
  pointsRequired: number | null;
  slots: GqlOpportunitySlot[];
};

export type QuestCard = OpportunityBaseCard & {
  pointsToEarn: number | null;
  slots: GqlOpportunitySlot[];
  pointsRequired: number | null;
};

export type OpportunityBaseCard = CommunityId & {
  id: string;
  category: GqlOpportunityCategory;
  title: string;
  images: string[];
  location: string | null;

  hasReservableTicket: boolean;
};

// ---------------------------------------------
// 🎨 フォーマット済みOpportunityカード型（UI表示用）
// ---------------------------------------------
export type FormattedOpportunityCard = Omit<ActivityCard | QuestCard, 'pointsToEarn'> & {
  href: string;
  price?: number | null;
  badge?: string;
  image?: string;
  pointsToEarn?: number | null;
};

// ---------------------------------------------
// 📄 Opportunity 詳細型（個別ページ用）
// ---------------------------------------------
export type ActivityDetail = OpportunityDetail & {
  feeRequired: number | null;
  slots: ActivitySlot[];

  reservableTickets: ReservableActivityTicket[];
  relatedActivities: ActivityCard[];
};

// ⚠️直近では使わない⚠️
export type QuestDetail = OpportunityDetail & {
  slots: QuestSlot[];
  category: GqlOpportunityCategory;
  relatedQuests: QuestCard[];
  pointsToEarn: number;
  pointsRequired: number;
};

export type OpportunityDetail = CommunityId & {
  id: string;
  title: string;
  place: OpportunityPlace;

  requireApproval: boolean;
  targetUtilities: RequiredUtility[];
  pointsRequired: number;
  isReservable: boolean;

  description: string;
  body: string;
  images: string[];
  totalImageCount: number;
  category: GqlOpportunityCategory;

  host: OpportunityHost;
  recentOpportunities: OpportunityCard[];
  notes: string;
};

// ---------------------------------------------
// 👤 主催者情報
// ---------------------------------------------
export type OpportunityHost = {
  id: string;
  name: string;
  image: string | null;
  bio: string;

  interview?: TArticleCard;
};

// ---------------------------------------------
// 🏠 開催場所
// ---------------------------------------------
export type OpportunityPlace = {
  id: string;
  name: string | null;
  description: string;
  address: string | null;

  latitude: number;
  longitude: number;
};

// ---------------------------------------------
// 🎫 チケット
// ---------------------------------------------
export type ReservableActivityTicket = {
  id: string;
};

export type RequiredUtility = {
  id: string;
};

export const isActivityCategory = (opportunity: ActivityDetail | QuestDetail | ActivityCard | QuestCard): opportunity is ActivityDetail | ActivityCard => {
  return opportunity.category === GqlOpportunityCategory.Activity;
};

export const isQuestCategory = (opportunity: ActivityDetail | QuestDetail | ActivityCard | QuestCard): opportunity is QuestDetail | QuestCard => {
  return opportunity.category === GqlOpportunityCategory.Quest;
};

export const isActivitySlotType = (slot: ActivitySlot | QuestSlot): slot is ActivitySlot => {
  return 'feeRequired' in slot;
};

export const isQuestSlotType = (slot: ActivitySlot | QuestSlot): slot is QuestSlot => {
  return 'pointsToEarn' in slot;
};
