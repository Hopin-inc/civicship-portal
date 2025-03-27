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
