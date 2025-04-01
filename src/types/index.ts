import { User as GraphQLUser } from "@/gql/graphql";
import { Required } from "utility-types";

export type AuthInfo = {
  uid?: string;
  providerIds?: string[];
  user?: GraphQLUser | null;
};

export type User = {
  id: string;
  name: string;
  image?: string | null;
  bio?: string | null;
  sysRole?: string | null;
  urlFacebook?: string | null;
  urlInstagram?: string | null;
  urlWebsite?: string | null;
  urlX?: string | null;
  urlYoutube?: string | null;
};

export type SocialLinkType = 'x' | 'instagram' | 'facebook' | 'youtube' | 'website';

export type SocialLink = {
  type: SocialLinkType;
  url: string;
};


export type Community = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  location: {
    prefecture: string;
    city: string;
    address: string;
    lat?: number;
    lng?: number;
  };
  members: {
    id: string;
    name: string;
    title: string;
    bio?: string;
    image?: string;
  }[];
  socialLinks?: {
    type: "twitter" | "instagram" | "facebook" | "website" | "youtube";
    url: string;
  }[];
  customLinks?: {
    title: string;
    url: string;
  }[];
  speakerDeckEmbed?: {
    title: string;
    embedUrl: string;
  };
  opportunities: Opportunity[];
  createdAt: Date;
  updatedAt: Date;
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: "EVENT" | "QUEST";
  status: "open" | "in_progress" | "closed";
  communityId: string;
  hostId: string;
  startsAt: Date | string;
  endsAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  host: {
    name: string;
    image: string;
    title: string;
    bio: string;
  };
  image?: string;
  images?: {
    url: string;
    caption?: string;
  }[];
  location: {
    name: string;
    address: string;
    isOnline: boolean;
    meetingUrl?: string;
    lat?: number;
    lng?: number;
  };
  community?: {
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
    image?: string;
    articlesAboutMe?: {
      edges: Array<{
        node: {
          title: string;
          description: string;
          image?: string;
        };
      }>;
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
                image?: string;
              };
            };
          }>;
        };
      };
    }>;
  };
};

export type RelatedArticle = {
  title: string;
  url: string;
  type: "interview" | "article";
  image?: string;
  description?: string;
  publishedAt: string;
};

export type ArticleType = "activity_report" | "interview" | "column";

export type Article = {
  id: string;
  title: string;
  description: string;
  content: string;
  type: ArticleType;
  thumbnail: string;
  publishedAt: string;
  author: {
    name: string;
    image: string;
    bio?: string;
  };
  relatedActivityId?: string;
  relatedUserId?: string;
  tags: string[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  communityId: string;
  price: number;
  duration: number; // minutes
  location: {
    name: string;
    address: string;
    prefecture: string;
    city: string;
    lat?: number;
    lng?: number;
  };
  images: string[];
  capacity: number;
  participants?: User[];
  schedule: {
    startTime: string;
    endTime: string;
    daysOfWeek: number[]; // 0-6, 0 is Sunday
  };
  timeSchedule: {
    time: string;
    description: string;
  }[];
  precautions: string[];
  host: {
    name: string;
    image: string;
    bio: string;
  };
  status: "open" | "closed";
  createdAt: string;
  updatedAt: string;
};

export type Participant = {
  id: string;
  name: string;
  image?: string;
};

export type ContentType = "EXPERIENCE" | "QUEST" | "EVENT" | "ARTICLE";

export type DateFilter = {
  startDate: Date | null;
  endDate: Date | null;
};

// Portfolio related types
export type PortfolioCategory = 'QUEST' | 'ACTIVITY_REPORT' | 'INTERVIEW' | 'OPPORTUNITY';
export type PortfolioType = 'opportunity' | 'activity_report' | 'quest';

export interface PortfolioStyle {
  bg: string;
  text: string;
}

export const PORTFOLIO_CATEGORY_STYLES: Record<PortfolioCategory, PortfolioStyle> = {
  QUEST: { bg: '#FEF9C3', text: '#854D0E' },
  ACTIVITY_REPORT: { bg: '#DCE7DD', text: '#166534' },
  INTERVIEW: { bg: '#DCE7DD', text: '#166534' },
  OPPORTUNITY: { bg: '#DBEAFE', text: '#1E40AF' },
} as const;

export interface PortfolioParticipant {
  id: string;
  name: string;
  image: string | null;
}

export interface Portfolio {
  id: string;
  type: PortfolioType;
  title: string;
  date: string;
  location: string | null;
  category: PortfolioCategory;
  participants: PortfolioParticipant[];
  image: string | null;
  source?: string;
}
