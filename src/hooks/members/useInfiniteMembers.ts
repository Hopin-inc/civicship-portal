"use client";

import { useState, useEffect, useRef } from "react";
import { GqlWallet, GqlWalletsConnection } from "@/types/graphql";
import { toast } from "react-toastify";

interface UseInfiniteMembersProps {
  initialMembers: GqlWalletsConnection;
  fetchMore: (cursor: string, first: number) => Promise<GqlWalletsConnection>;
  currentUserId?: string;
}

interface UseInfiniteMembersReturn {
  members: GqlWallet[];
  hasNextPage: boolean;
  loading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  loadMore: () => Promise<void>;
  refetch: () => Promise<void>;
}

export const useInfiniteMembers = ({
  initialMembers,
  fetchMore,
  currentUserId,
}: UseInfiniteMembersProps): UseInfiniteMembersReturn => {
  const [members, setMembers] = useState<GqlWallet[]>(
    (initialMembers.edges?.map(edge => edge?.node) ?? [])
      .filter(Boolean)
      .filter(wallet => wallet.user?.id !== currentUserId) as GqlWallet[]
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
      
      const newMembers = (data.edges?.map(edge => edge?.node) ?? [])
        .filter(Boolean)
        .filter(wallet => wallet.user?.id !== currentUserId) as GqlWallet[];
      
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
      
      const newMembers = (data.edges?.map(edge => edge?.node) ?? [])
        .filter(Boolean)
        .filter(wallet => wallet.user?.id !== currentUserId) as GqlWallet[];
      
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
