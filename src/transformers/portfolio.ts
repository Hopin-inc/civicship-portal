'use client';

import { format } from 'date-fns';
import { GqlPortfolio } from '@/hooks/features/user/useUserPortfolioQuery';

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

/**
 * Checks if a category string is a valid PortfolioType
 */
export const isValidPortfolioType = (category: string): category is PortfolioType => {
  return ['opportunity', 'activity_report', 'quest'].includes(category.toLowerCase());
};

/**
 * Checks if a category string is a valid PortfolioCategory
 */
export const isValidPortfolioCategory = (category: string): category is PortfolioCategory => {
  return ['QUEST', 'ACTIVITY_REPORT', 'INTERVIEW', 'OPPORTUNITY'].includes(category.toUpperCase());
};

/**
 * Transforms a GraphQL portfolio object to a UI-friendly portfolio object
 */
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
    participants: portfolio.participants.map(p => ({
      id: p.id,
      name: p.name,
      image: p.image ?? null
    })),
    image: portfolio.thumbnailUrl ?? null,
    source: portfolio.source
  };
};
