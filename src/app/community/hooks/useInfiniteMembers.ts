"use client";

import { useRef, useEffect, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { GET_COMMUNITY_MEMBERS } from "@/graphql/account/membership/community-members";
import {
  GqlGetCommunityMembersQuery,
  GqlGetCommunityMembersQueryVariables,
  GqlMembershipStatus,
  GqlSortDirection,
  GqlMembership,
} from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { presentMember } from "../presenters/presentMember";
import { PresentedMember } from "../types/PresentedMember";
import { toast } from "react-toastify";

interface UseInfiniteMembersReturn {
  members: PresentedMember[];
  hasNextPage: boolean;
  loading: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  loadMore: () => Promise<void>;
}

export const useInfiniteMembers = (): UseInfiniteMembersReturn => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, loading, fetchMore } = useQuery<
    GqlGetCommunityMembersQuery,
    GqlGetCommunityMembersQueryVariables
  >(GET_COMMUNITY_MEMBERS, {
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        status: GqlMembershipStatus.Active,
      },
      first: 20,
      sort: {
        createdAt: GqlSortDirection.Desc,
      },
    },
    notifyOnNetworkStatusChange: true,
  });

  const members = (data?.memberships?.edges?.map(edge => edge?.node).filter(Boolean) as GqlMembership[])
    ?.map(presentMember) ?? [];

  const hasNextPage = data?.memberships?.pageInfo?.hasNextPage ?? false;
  const lastEdge = data?.memberships?.edges?.[data.memberships.edges.length - 1];

  const loadMore = useCallback(async () => {
    if (loading || !hasNextPage || !lastEdge?.node?.user?.id) return;

    try {
      await fetchMore({
        variables: {
          cursor: {
            communityId: COMMUNITY_ID,
            userId: lastEdge.node.user.id,
          },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.memberships?.edges) return prev;

          const existingIds = new Set(
            prev.memberships?.edges?.map(edge => edge?.node?.user?.id).filter(Boolean)
          );

          const newEdges = fetchMoreResult.memberships.edges.filter(
            edge => edge?.node?.user?.id && !existingIds.has(edge.node.user.id)
          );

          return {
            memberships: {
              ...fetchMoreResult.memberships,
              edges: [...(prev.memberships?.edges ?? []), ...newEdges],
            },
          };
        },
      });
    } catch (error) {
      console.error('Error loading more members:', error);
      toast.error('データの取得に失敗しました');
    }
  }, [loading, hasNextPage, lastEdge, fetchMore]);

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
  }, [hasNextPage, loading, loadMore]);

  return {
    members,
    hasNextPage,
    loading,
    loadMoreRef,
    loadMore,
  };
};
