"use client";

import { useState, useEffect, useRef } from "react";
import { GqlWalletsConnection } from "@/types/graphql";
import { toast } from "react-toastify";

interface DonateMember {
  user: {
    id: string;
    name?: string | null;
    image?: string | null;
    didIssuanceRequests?: Array<{
      status: string;
      didValue?: string | null;
    } | null> | null;
  };
  wallet: {
    currentPointView: {
      currentPoint: bigint;
    };
  };
}

interface UseInfiniteMembersProps {
  initialMembers: GqlWalletsConnection;
  fetchMore: (cursor: string, first: number) => Promise<GqlWalletsConnection>;
  currentUserId?: string;
}

interface UseInfiniteMembersReturn {
  members: DonateMember[];
  hasNextPage: boolean;
  loading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

const transformWalletsToMembers = (
  edges: GqlWalletsConnection['edges'],
  currentUserId?: string
): DonateMember[] => {
  return (edges ?? [])
    .map(edge => edge?.node)
    .filter(wallet => wallet?.user && wallet.user.id !== currentUserId)
    .map(wallet => ({
      user: wallet!.user!,
      wallet: {
        currentPointView: {
          currentPoint: BigInt(wallet!.currentPointView?.currentPoint ?? 0),
        },
      },
    }));
};

export const useInfiniteMembers = ({
  initialMembers,
  fetchMore,
  currentUserId,
}: UseInfiniteMembersProps): UseInfiniteMembersReturn => {
  const [members, setMembers] = useState<DonateMember[]>(
    transformWalletsToMembers(initialMembers.edges, currentUserId)
  );
  const [hasNextPage, setHasNextPage] = useState(initialMembers.pageInfo?.hasNextPage ?? false);
  const [endCursor, setEndCursor] = useState(initialMembers.pageInfo?.endCursor ?? null);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasNextPage || !endCursor) return;

    setLoading(true);
    
    try {
      const data = await fetchMore(endCursor, 20);
      
      const newMembers = transformWalletsToMembers(data.edges, currentUserId);
      
      setMembers(prev => [...prev, ...newMembers]);
      setHasNextPage(data.pageInfo?.hasNextPage ?? false);
      setEndCursor(data.pageInfo?.endCursor ?? null);
    } catch (error) {
      console.error('Error loading more members:', error);
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    setLoading(true);
    try {
      const data = await fetchMore(undefined as any, 20);
      
      const newMembers = transformWalletsToMembers(data.edges, currentUserId);
      
      setMembers(newMembers);
      setHasNextPage(data.pageInfo?.hasNextPage ?? false);
      setEndCursor(data.pageInfo?.endCursor ?? null);
    } catch (error) {
      console.error('Error refetching members:', error);
      toast.error('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, loading, endCursor, loadMore]);

  return {
    members,
    hasNextPage,
    loading,
    loadMoreRef,
    loadMore,
    refetch,
  };
};
