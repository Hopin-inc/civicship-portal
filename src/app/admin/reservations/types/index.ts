/**
 * Types for admin reservation pages
 */

import { GqlOpportunityCategory } from "@/types/graphql";

export interface PriceInfo {
  participationFee: number;
  participantCount: number;
  pointsRequired: number;
  totalPointsRequired: number;
  isPointsOnly: boolean;
  category: GqlOpportunityCategory;
  pointsToEarn?: number;
  totalPointsToEarn?: number;
}
