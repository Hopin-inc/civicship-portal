"use client";

import { useState, useEffect, useRef } from "react";
import { GqlMembership, GqlMembershipsConnection } from "@/types/graphql";
import { toast } from "react-toastify";
import { getServerCommunityMembersWithCursor } from "./server-community-members";
import { presentMember } from "../presenters/presentMember";
import { PresentedMember } from "../types/PresentedMember";

interface UseInfiniteMembersProps {
  initialMembers: GqlMembershipsConnection;
}

interface UseInfiniteMembersReturn {
  members: PresentedMember[];
  hasNextPage: boolean;
  loading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  loadMore: () => Promise<void>;
}

export const useInfiniteMembers = ({
  initialMembers,
}: UseInfiniteMembersProps): UseInfiniteMembersReturn => {
  const [members, setMembers] = useState<PresentedMember[]>(
    (initialMembers.edges?.map(edge => edge?.node).filter(Boolean) as GqlMembership[])
      .map(presentMember)
  );
  const [hasNextPage, setHasNextPage] = useState(initialMembers.pageInfo?.hasNextPage ?? false);
  const [endCursor, setEndCursor] = useState(initialMembers.pageInfo?.endCursor ?? null);
  const [loading, setLoading] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const loadMore = async () => {
    if (loading || !hasNextPage || !endCursor) return;

    setLoading(true);
    
    try {
      const data = await getServerCommunityMembersWithCursor(endCursor, 20);
      
      const newMembers = (data.edges?.map(edge => edge?.node).filter(Boolean) as GqlMembership[])
        .map(presentMember);
      
      setMembers(prev => {
        const existingIds = new Set(prev.map(m => m.id));
        const uniqueNewMembers = newMembers.filter(m => !existingIds.has(m.id));
        return [...prev, ...uniqueNewMembers];
      });
      setHasNextPage(data.pageInfo?.hasNextPage ?? false);
      setEndCursor(data.pageInfo?.endCursor ?? null);
    } catch (error) {
      console.error('Error loading more members:', error);
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
  };
};
