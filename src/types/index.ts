import { User } from "@/gql/graphql";
import { Required } from "utility-types";

export type AuthInfo = {
  uid?: string;
  providerIds?: string[];
  user?: Required<Partial<User>, "id" | "lastName" | "firstName"> | null;
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
  startsAt: string;
  endsAt: string;
  createdAt: Date;
  updatedAt: Date;
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
