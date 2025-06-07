"use client";

import { useCallback, useState } from "react";
import { ApolloError } from "@apollo/client";
import { GqlErrorCode, useCancelReservationMutation } from "@/types/graphql";
import { useAuth } from "@/contexts/AuthProvider";
import { logger } from "@/lib/logging";

type Result = { success: true } | { success: false; code: GqlErrorCode };

const useCancelReservation = () => {
  const [cancelReservation, { loading }] = useCancelReservationMutation();
  const [isCancelling, setIsCancelling] = useState(false);
  const { user } = useAuth();

  const handleCancel = useCallback(
    async (reservationId: string): Promise<Result> => {
      if (loading || isCancelling) return { success: false, code: GqlErrorCode.Unknown };
      if (!reservationId || !user?.id)
        return { success: false, code: GqlErrorCode.ValidationError };

      setIsCancelling(true);

      try {
        const res = await cancelReservation({
          variables: {
            id: reservationId,
            input: {
              paymentMethod: "FEE", // 必要に応じて変更
            },
            permission: {
              userId: user.id,
            },
          },
        });

        const data = res.data?.reservationCancel;
        if (data?.__typename === "ReservationSetStatusSuccess") {
          return { success: true };
        } else {
          return { success: false, code: GqlErrorCode.Unknown };
        }
      } catch (e) {
        if (e instanceof ApolloError) {
          const gqlError = e.graphQLErrors[0];
          const code = gqlError.extensions?.code as GqlErrorCode | undefined;
          return {
            success: false,
            code: code ?? GqlErrorCode.Unknown,
          };
        }

        logger.error("Reservation cancellation mutation failed", {
          error: e instanceof Error ? e.message : String(e),
          component: "useCancelReservation",
          reservationId
        });
        return { success: false, code: GqlErrorCode.Unknown };
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

export default useCancelReservation;
