'use client';

import { useCreateReservationMutation, useGetUserWalletQuery } from "@/types/graphql";

export const useReservationConfirmQuery = (userId: string | undefined) => {
  const { data: walletData, loading: walletLoading, error: walletError } = useGetUserWalletQuery( {
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });
  const [createReservation, { loading: creatingReservation }] = useCreateReservationMutation({
    variables: {
      input: {
        opportunitySlotId: "",
        paymentMethod: "FREE" as any,
        totalParticipantCount: 1
      }
    }
  })
  
  return {
    walletData,
    walletLoading,
    walletError,
    createReservation,
    creatingReservation
  };
};
