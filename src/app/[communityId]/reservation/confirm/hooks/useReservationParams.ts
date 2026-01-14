import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export const useReservationParams = () => {
  const searchParams = useSearchParams();
  return useMemo(
    () => ({
      opportunityId: searchParams.get("id") ?? "",
      communityId: searchParams.get("community_id") ?? "",
      slotId: searchParams.get("slot_id") ?? "",
      participantCount: parseInt(searchParams.get("guests") ?? "1", 10),
    }),
    [searchParams],
  );
};
