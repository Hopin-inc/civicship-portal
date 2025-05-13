"use client";

import { GqlWallet, useCreateReservationMutation, useGetUserWalletQuery } from "@/types/graphql";

export const useReservationConfirmQuery = (userId: string | undefined) => {
  const { data, loading: walletLoading, error: walletError } = useGetUserWalletQuery({
    variables: userId ? { id: userId } : undefined,
    skip: !userId,
  });
  const wallets: GqlWallet[] | null = data?.user?.wallets ?? null;

  // const [createReservation, { loading: creatingReservation }] = useCreateReservationMutation();

  return {
    wallets,
    walletLoading,
    walletError,
    // createReservation,
    // creatingReservation
  };
};
