"use client";

import { useCallback, useState } from "react";
import { useCancelReservationMutation } from "@/types/graphql";
import { useAuth } from "@/contexts/AuthContext";

type Result = { success: true } | { success: false; error: string };

export const useCancelReservation = () => {
  const [cancelReservation, { loading }] = useCancelReservationMutation();
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useAuth();

  const handleCancel = useCallback(
    async (reservationId: string): Promise<Result> => {
      if (loading || isCancelling) {
        return { success: false, error: "IN_PROGRESS" };
      }

      if (!reservationId || !user?.id) {
        return { success: false, error: "MISSING_PARAMS" };
      }

      setIsCancelling(true);
      try {
        const res = await cancelReservation({
          variables: {
            id: reservationId,
            input: {
              paymentMethod: "FEE",
            },
            permission: {
              userId: user.id,
            },
          },
        });

        const reservation = res.data?.reservationCancel?.reservation;
        return reservation ? { success: true } : { success: false, error: "CANCEL_FAILED" };
      } catch {
        return { success: false, error: "REQUEST_FAILED" };
      } finally {
        setIsCancelling(false);
      }
    },
    [cancelReservation, loading, isCancelling, user?.id],
  );

  return {
    handleCancel,
    isCancelling,
  };
};
