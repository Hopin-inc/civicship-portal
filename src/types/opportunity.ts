import { Article, Participant, RelatedArticle } from "@/types/index";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";
import { AppUser } from "@/types/user";

export type AppOpportunity = {
  id: string;
  category: GqlOpportunityCategory
  status: GqlPublishStatus;
  title: string;
  description: string;
  images: string[];

  communityId: string;
  hostId: string;

  startsAt: Date | string;
  endsAt: Date | string;

  isReservableWithTicket?: boolean;
  host: AppUser,
  location: {
    name: string;
    address: string;
    isOnline: boolean;
    meetingUrl?: string;
    lat?: number;
    lng?: number;
  };
  community?: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
  recommendedFor: string[];
  relatedArticles?: RelatedArticle[];
  capacity: number;
  pointsForComplete?: number;
  pointsForJoin?: number;
  participants: Participant[];
  body?: string;
  createdByUser?: {
    id: string;
    name: string;
    image: string | null;
    articlesAboutMe?: {
      edges: Array<{
        node: Partial<Article>;
      }>;
    };
    opportunitiesCreatedByMe?: {
      edges: Opportunity[];
    };
  };
  place?: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  requireApproval?: boolean;
  pointsRequired?: number;
  feeRequired?: number;
  slots?: {
    edges: Array<{
      node: {
        id: string;
        startsAt: Date | string;
        endsAt: Date | string;
        participations?: {
          edges: Array<{
            node: {
              id: string;
              status: string;
              user: {
                id: string;
                name: string;
                image: string | null;
              };
            };
          }>;
        };
      };
    }>;
  };
  requiredUtilities?: {
    id: string;
  }[];
};