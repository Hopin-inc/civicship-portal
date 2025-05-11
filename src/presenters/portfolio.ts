'use client';

import { format } from 'date-fns';
import { GqlPortfolio, GqlUser } from "@/types/graphql";
import { AppPortfolio } from "@/types/user";
import { Participant } from "@/types/utils";

export const presenterPortfolio = (gqlPortfolio: GqlPortfolio): AppPortfolio => {
  return {
    id: gqlPortfolio.id,
    source: gqlPortfolio.source,
    category: gqlPortfolio.category,
    reservationStatus: gqlPortfolio.reservationStatus ?? null,
    title: gqlPortfolio.title,
    image: gqlPortfolio.thumbnailUrl ?? null,
    date: new Date(gqlPortfolio.date).toISOString() ?? null,
    location: gqlPortfolio.place?.name ?? null,
    participants: (gqlPortfolio.participants ?? []).map(presentParticipant),
  };
};

export const presentParticipant = (gqlParticipant: GqlUser): Participant => {
  return {
    id: gqlParticipant.id,
    image: gqlParticipant.image ?? null,
    name: gqlParticipant.name,
  };
};


export type PortfolioType = 'opportunity' | 'activity_report' | 'quest';
export type PortfolioCategory = 'QUEST' | 'ACTIVITY_REPORT' | 'INTERVIEW' | 'OPPORTUNITY';
export type ReservationStatus = 'RESERVED' | 'CANCELED' | 'COMPLETED';

export interface Portfolio {
  id: string;
  type: PortfolioType;
  title: string;
  date: string;
  location: string | null;
  category: PortfolioCategory;
  reservationStatus?: ReservationStatus | null;
  participants: Array<{
    id: string;
    name: string;
    image: string | null;
  }>;
  image: string | null;
  source?: string;
}

export const isValidPortfolioType = (category: string): category is PortfolioType => {
  return ['opportunity', 'activity_report', 'quest'].includes(category.toLowerCase());
};


export const isValidPortfolioCategory = (category: string): category is PortfolioCategory => {
  return ['QUEST', 'ACTIVITY_REPORT', 'INTERVIEW', 'OPPORTUNITY'].includes(category.toUpperCase());
};

export const transformPortfolio = (portfolio: GqlPortfolio): Portfolio => {
  const category = portfolio.category.toLowerCase();
  if (!isValidPortfolioType(category)) {
    console.warn(`Invalid portfolio category: ${portfolio.category}`);
  }

  const portfolioCategory = portfolio.category.toUpperCase();
  if (!isValidPortfolioCategory(portfolioCategory)) {
    console.warn(`Invalid portfolio category: ${portfolio.category}`);
  }
  
  return {
    id: portfolio.id,
    type: category as PortfolioType,
    title: portfolio.title,
    date: format(new Date(portfolio.date), 'yyyy/MM/dd'),
    location: portfolio.place?.name ?? null,
    category: portfolioCategory as PortfolioCategory,
    reservationStatus: portfolio.reservationStatus as ReservationStatus | null | undefined,
    participants: portfolio.participants?.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image ?? null
    })) ?? [],
    image: portfolio.thumbnailUrl ?? null,
    source: portfolio.source
  };
};
