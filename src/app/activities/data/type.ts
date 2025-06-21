import { GqlOpportunityCategory } from "@/types/graphql";
import { CommunityId } from "@/types";
import { TArticleCard } from "@/app/articles/data/type";
import { IOpportunitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";

// ---------------------------------------------
// 📦 Opportunity カード型（サマリ表示用）
// ---------------------------------------------
export type OpportunityCard = ActivityCard | QuestCard;

export type ActivityCard = OpportunityBaseCard & {
  feeRequired: number | null;
};

export type QuestCard = OpportunityBaseCard & {
  pointsToEarn: number | null;
};

export type OpportunityBaseCard = CommunityId & {
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
export type OpportunityDetail = ActivityDetail | QuestDetail;

export type ActivityDetail = OpportunityBaseDetail & {
  feeRequired: number | null;
  slots: IOpportunitySlot[];

  reservableTickets: ReservableActivityTicket[];
  relatedActivities: ActivityCard[];
};

export type QuestDetail = OpportunityBaseDetail & {
  pointsToEarn: number | null;
  slots: QuestSlot[];

  relatedQuests: QuestCard[];
};

export type OpportunityBaseDetail = CommunityId & {
  id: string;
  title: string;
  category: GqlOpportunityCategory;
  place: OpportunityPlace;

  requiredApproval: boolean;
  requiredTicket: RequiredUtility[];

  isReservable: boolean;

  description: string;
  body: string;
  images: string[];
  totalImageCount: number;

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

export type RequiredUtility = {
  id: string;
};
