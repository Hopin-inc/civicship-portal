'use client';

import { useMutation, useQuery } from '@apollo/client';
import { CREATE_RESERVATION_MUTATION } from '../../../graphql/mutations/reservation';
import { GetUserWalletDocument } from '@/types/graphql';

/**
 * Hook for fetching wallet data for reservation confirmation
 * @param userId User ID to fetch wallet data for
 */
export const useWalletQuery = (userId: string | undefined) => {
  return useQuery(GetUserWalletDocument, {
    variables: { id: userId || '' },
    skip: !userId,
  });
};

/**
 * Hook for creating a reservation
 */
export const useCreateReservationMutation = () => {
  return useMutation(CREATE_RESERVATION_MUTATION);
};

/**
 * Combined hook for all reservation confirmation queries
 * @param userId User ID to fetch wallet data for
 */
export const useReservationConfirmQuery = (userId: string | undefined) => {
  const { data: walletData, loading: walletLoading, error: walletError } = useWalletQuery(userId);
  const [createReservation, { loading: creatingReservation }] = useCreateReservationMutation();
  
  return {
    walletData,
    walletLoading,
    walletError,
    createReservation,
    creatingReservation
  };
};
