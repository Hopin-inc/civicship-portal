"use client";

import { useCallback, useState } from "react";
import { useCancelReservationMutation } from "@/types/graphql";
import { useAuth } from "@/contexts/AuthContext";

type Result =
  | { success: true }
  | { success: false; error: string; typename?: string };

export const useCancelReservation = () => {
  const [cancelReservation, { loading }] = useCancelReservationMutation();
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useAuth();

  const handleCancel = useCallback(
    async (reservationId: string): Promise<Result> => {
      if (loading || isCancelling) {
        return { success: false, error: "Reservation cancellation is already in progress." };
      }

      if (!reservationId || !user?.id) {
        return { success: false, error: "Missing reservation ID or user information." };
      }

      setIsCancelling(true);
      try {
        const res = await cancelReservation({
          variables: {
            id: reservationId,
            input: {
              paymentMethod: "FEE",  // Adjust as necessary
            },
            permission: {
              userId: user.id,
            },
          },
        });

        const data = res.data?.reservationCancel;

        if (data?.__typename === "ReservationSetStatusSuccess") {
          return { success: true };
        } else if (data?.__typename === "ReservationCancellationTimeoutError") {
          return { success: false, error: data.message, typename: "ReservationCancellationTimeoutError" };
        } else {
          return { success: false, error: "An unknown error occurred.", typename: "UnknownError" };
        }
      } catch (e) {
        console.error("Reservation cancellation mutation failed", e);
        return { success: false, error: "Network error occurred.", typename: "NetworkError" };
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
