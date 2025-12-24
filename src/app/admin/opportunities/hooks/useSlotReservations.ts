import { useQuery } from "@apollo/client";
import { GET_SLOT_RESERVATIONS } from "@/graphql/experience/opportunitySlot/query";

/**
 * スロットの予約情報を取得するフック
 */
export const useSlotReservations = (slotId?: string) => {
  const { data, loading, error } = useQuery(GET_SLOT_RESERVATIONS, {
    variables: { slotId },
    skip: !slotId,
  });

  const reservations = data?.opportunitySlot?.reservations ?? [];
  const reservationCount = reservations.length;

  return {
    reservations,
    reservationCount,
    loading,
    error,
  };
};
