"use client";

import { useEffect } from "react";
import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useSortedSlotsByStartsAt } from "@/app/activities/[id]/hooks/useSortedSlotsByStartsAt";
import { ActivityCard, ActivityDetail } from "@/app/activities/data/type";
import { useOpportunityDetail } from "@/app/activities/[id]/hooks/useOpportunityDetail";
import { useSameStateActivities } from "@/app/activities/[id]/hooks/useSameStateActivities";
import { useLoading } from "@/hooks/useLoading";
import { useAuth } from "@/contexts/AuthContext";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

interface UseActivityDetailsResult {
  opportunity: ActivityDetail | null;
  sameStateActivities: ActivityCard[];
  availableTickets: number;
  sortedSlots: ActivitySlot[];
  isLoading: boolean;
  initialLoading: boolean;
  error: Error | null;
}

export const useActivityDetails = (id: string): UseActivityDetailsResult => {
  const { user } = useAuth();
  const { setIsLoading } = useLoading();

  const { data, opportunity, loading: loadingOpportunity, error } = useOpportunityDetail(id);
  const { sameStateActivities, loading: loadingSimilar } = useSameStateActivities(
    id,
    data?.opportunity?.place?.city?.state?.code ?? "",
  );
  const availableTickets = useAvailableTickets(opportunity, user?.id);
  const sortedSlots = useSortedSlotsByStartsAt(opportunity?.slots);

  const isLoading = loadingOpportunity || loadingSimilar;
  const initialLoading = isLoading && !opportunity && !error;

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  return {
    opportunity,
    sameStateActivities,
    availableTickets,
    sortedSlots,
    isLoading,
    initialLoading,
    error: error ?? null,
  };
};
