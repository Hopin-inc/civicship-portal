"use client";

import { presentUserProfile, useUserProfileContext } from "@/app/community/[communityId]/users/features/shared";
import { UserProfileView } from "@/app/community/[communityId]/users/features/profile";
import { useAuth } from "@/contexts/AuthProvider";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { GqlMembership, GqlRole, useGetCommunitiesQuery } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";
import { CommunitySwitcher } from "./CommunitySwitcher";

export default function MyProfilePage() {
  const { gqlUser, isOwner, portfolios } = useUserProfileContext();
  const { user: currentUser } = useAuth();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const memberships = useMemo(() => currentUser?.memberships ?? [], [currentUser?.memberships]);
  const joinedCommunityIds = useMemo(
    () => new Set(memberships.map((m: GqlMembership) => m.community?.id).filter((id): id is string => !!id)),
    [memberships],
  );

  // 管理者権限チェック（現在のコミュニティ）
  const hasAdminRole = useMemo(() => {
    const membership = memberships.find(
      (m: GqlMembership) => m.community?.id === communityId,
    );
    return membership?.role === GqlRole.Owner || membership?.role === GqlRole.Manager;
  }, [memberships, communityId]);

  const showSwitcher = joinedCommunityIds.size > 1 || hasAdminRole;

  const { data: communitiesData, loading: communitiesLoading } = useGetCommunitiesQuery({
    skip: !showSwitcher,
  });
  const joinedCommunities = useMemo(() => {
    const communities =
      communitiesData?.communities?.edges?.flatMap((e) => (e?.node ? [e.node] : [])) ?? [];
    return communities
      .filter((c) => joinedCommunityIds.has(c.id))
      .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
  }, [communitiesData, joinedCommunityIds]);

  const headerConfig = useMemo(
    () => ({
      action: showSwitcher ? (
        <CommunitySwitcher
          communities={joinedCommunities}
          currentCommunityId={communityId}
          hasAdminRole={hasAdminRole}
          loading={communitiesLoading}
        />
      ) : undefined,
    }),
    [showSwitcher, joinedCommunities, communityId, hasAdminRole, communitiesLoading],
  );

  useHeaderConfig(headerConfig);

  const viewModel = presentUserProfile(gqlUser, communityId ?? "", isOwner, portfolios);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
