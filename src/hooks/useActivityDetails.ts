'use client';

import { useQuery } from '@apollo/client';
import { useOpportunity } from './useOpportunity';
import { useSimilarOpportunities } from './useSimilarOpportunities';
import { useAuth } from '../contexts/AuthContext';
import { GetUserWalletDocument } from '../gql/graphql';
import { useMemo, useEffect } from 'react';
import { useLoading } from './useLoading';
import { Opportunity } from '../types';

interface UseActivityDetailsProps {
  id: string;
}

interface UseActivityDetailsResult {
  opportunity: Opportunity | null;
  similarOpportunities: Opportunity[];
  availableTickets: number;
  availableDates: Array<{
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
  loading: boolean;
  error: Error | null;
}

export const useActivityDetails = ({ id }: UseActivityDetailsProps): UseActivityDetailsResult => {
  const { opportunity, loading, error } = useOpportunity(id);
  const { similarOpportunities, loading: similarLoading } = useSimilarOpportunities({
    opportunityId: id
  });
  const { user: currentUser } = useAuth();
  const { setIsLoading } = useLoading();
  
  const { data: walletData } = useQuery(GetUserWalletDocument, {
    variables: { id: currentUser?.id || "" },
    skip: !currentUser?.id,
  });

  const availableTickets = useMemo(() => {
    if (!opportunity?.requiredUtilities?.length) {
      return walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.length || 0;
    }

    const requiredUtilityIds = new Set(opportunity.requiredUtilities.map((u) => u.id));

    const availableTickets =
      walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.filter((edge: any) => {
        const utilityId = edge?.node?.utility?.id;
        return utilityId ? requiredUtilityIds.has(utilityId) : false;
      }) || [];

    return availableTickets.length;
  }, [opportunity?.requiredUtilities, walletData]);

  useEffect(() => {
    setIsLoading(loading || similarLoading);
  }, [loading, similarLoading, setIsLoading]);

  const availableDates = useMemo(() => {
    if (!opportunity || !opportunity.slots?.edges) return [];
    
    return opportunity.slots.edges
      .map((edge) => ({
        startsAt: edge?.node?.startsAt
          ? new Date(edge.node.startsAt).toISOString()
          : "",
        endsAt: edge?.node?.endsAt
          ? new Date(edge.node.endsAt).toISOString()
          : "",
        participants: edge?.node?.participations?.edges?.length || 0,
        price: opportunity.feeRequired || 0,
      }))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [opportunity]);

  return {
    opportunity,
    similarOpportunities,
    availableTickets,
    availableDates,
    loading: loading || similarLoading,
    error
  };
};
