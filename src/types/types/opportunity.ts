import { GqlOpportunityCategory } from "@/types/graphql";
import { CommunityId } from "@/types";
import { AppImage } from "@/types/types/utils";
import { ArticleCard } from "@/types/types/article";

// ---------------------------------------------
// 📦 Opportunity カード型（サマリ表示用）
// ---------------------------------------------
export type OpportunityCard = ActivityCard | QuestCard;

export type ActivityCard = BaseCard & {
  feeRequired: number;
};

export type QuestCard = BaseCard & {
  pointsToEarn: number;
};

export type BaseCard = CommunityId & {
  id: string;
  category: GqlOpportunityCategory;
  title: string;
  images: string[];
  location: string;

  hasReservableTicket: boolean;
};

// ---------------------------------------------
// 📄 Opportunity 詳細型（個別ページ用）
// ---------------------------------------------
export type ActivityDetail = OpportunityDetail & {
  reservableTickets: ReservableActivityTicket[];
  relatedActivities: ActivityCard[];
};

// ⚠️直近では使わない⚠️
export type QuestDetail = OpportunityDetail & {
  relatedQuests: QuestCard[];
};

export type OpportunityDetail = CommunityId & {
  id: string;
  title: string;
  place: OpportunityPlace;

  description: string;
  images: AppImage[];
  totalImageCount: number;

  host: OpportunityHost;
  recentOpportunities: OpportunityCard[];

  slots: OpportunitySlot[];
  notes: string;
};

// ---------------------------------------------
// 👤 主催者情報
// ---------------------------------------------
export type OpportunityHost = {
  id: string;
  name: string;
  image: string;
  bio: string;

  interview?: ArticleCard;
};

// ---------------------------------------------
// 📆 スロット（開催枠）情報
// ---------------------------------------------
export type ActivitySlot = OpportunitySlot & {
  feeRequired: number;
};

export type QuestSlot = OpportunitySlot & {
  pointsToEarn: number;
};

type OpportunitySlot = {
  id: string;
  capacity: number;
  remainingCapacity: number;

  startsAt: string;
  endsAt: string;
};

// ---------------------------------------------
// 🏠 開催場所
// ---------------------------------------------
export type OpportunityPlace = {
  id: string;
  name: string;
  description: string;
  address: string;

  latitude: number;
  longitude: number;
};

// ---------------------------------------------
// 🎫 チケット
// ---------------------------------------------
export type ReservableActivityTicket = {
  id: string;
};

