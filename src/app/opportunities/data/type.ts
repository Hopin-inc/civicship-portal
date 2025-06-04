import { GqlOpportunityCategory } from "@/types/graphql";
import { CommunityId } from "@/types";
import { TArticleCard } from "@/app/articles/data/type";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";

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

export type ActivityDetail = OpportunityDetail & {
  feeRequired: number | null;
  slots: ActivitySlot[];

  reservableTickets: ReservableActivityTicket[];
  relatedActivities: ActivityCard[];
};

export type QuestDetail = OpportunityDetail & {
  slots: QuestSlot[];
  relatedQuests: QuestCard[];
};

export type OpportunityDetail = CommunityId & {
  id: string;
  title: string;
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
  
  slots: (ActivitySlot | QuestSlot)[];
  feeRequired?: number | null;
  pointsToEarn?: number | null;
  reservableTickets?: ReservableActivityTicket[];
};

export type OpportunityHost = {
  id: string;
  name: string;
  image: string | null;
  bio: string;

  interview?: TArticleCard;
};

export type OpportunityPlace = {
  id: string;
  name: string;
  description: string;
  address: string;

  latitude: number;
  longitude: number;
};

export type ReservableActivityTicket = {
  id: string;
};

export type RequiredUtility = {
  id: string;
};
