import { useGetReservationQuery } from "@/types/graphql";

export const useReservationComplete = (reservationId: string | null) => {
  const { data, loading, error, refetch } = useGetReservationQuery({
    variables: { id: reservationId! },
    skip: !reservationId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const reservation = data?.reservation ?? null;
  const gqlOpportunitySlot = reservation?.opportunitySlot ?? null;
  const gqlOpportunity = gqlOpportunitySlot?.opportunity ?? null;

  return {
    reservation,
    gqlOpportunity,
    gqlOpportunitySlot,
    loading,
    error,
    refetch,
  };
};
