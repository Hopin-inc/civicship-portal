'use client';

import { useAvailableTicketsController } from './useAvailableTicketsController';
import { Opportunity } from "@/types";

/**
 * Custom hook for checking available tickets
 * This is a backward-compatible wrapper around useAvailableTicketsController
 * @param opportunity Opportunity to check tickets for
 * @param userId User ID to check tickets for
 */
export const useAvailableTickets = (
  opportunity: Opportunity | null,
  userId: string | undefined
): number => {
  return useAvailableTicketsController(opportunity, userId);
};
