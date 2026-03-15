"use client";

import { presentUserProfile, useUserProfileContext } from "@/app/community/[communityId]/users/features/shared";
import { UserProfileView } from "@/app/community/[communityId]/users/features/profile";
import { useAuth } from "@/contexts/AuthProvider";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { GqlMembership, GqlRole, useGetCommunitiesQuery } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";
import { AppLink } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { ArrowLeftRight, Check } from "lucide-react";

export default function MyProfilePage() {
  const { gqlUser, isOwner, portfolios } = useUserProfileContext();
  const { user: currentUser } = useAuth();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;
  const t = useTranslations();

  const memberships = useMemo(() => currentUser?.memberships ?? [], [currentUser?.memberships]);
  const joinedCommunityIds = useMemo(
    () => new Set(memberships.map((m: GqlMembership) => m.community?.id)),
    [memberships],
  );

  const { data: communitiesData } = useGetCommunitiesQuery();
  const allCommunities = useMemo(
    () => communitiesData?.communities?.edges?.map((e) => e?.node) ?? [],
    [communitiesData],
  );

  // 管理者権限チェック（現在のコミュニティ）
  const hasAdminRole = useMemo(() => {
    const membership = memberships.find(
      (m: GqlMembership) => m.community?.id === communityId,
    );
    return membership?.role === GqlRole.Owner || membership?.role === GqlRole.Manager;
  }, [memberships, communityId]);

  const showSwitcher = allCommunities.length > 1 || hasAdminRole;

  // ヘッダー設定
  const headerConfig = useMemo(
    () => ({
      action: showSwitcher ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="tertiary" size="sm">
              {t("users.profileHeader.switchButton")}
              <ArrowLeftRight className="w-4 h-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t("users.profileHeader.switchLabel")}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allCommunities.map((community) => {
              const isCurrent = community?.id === communityId;
              const isJoined = joinedCommunityIds.has(community?.id);
              return (
                <DropdownMenuItem key={community?.id} asChild disabled={isCurrent}>
                  <AppLink href="/users/me" communityId={community?.id}>
                    {isCurrent && <Check className="w-4 h-4 mr-2 shrink-0" />}
                    <span className={isCurrent ? "" : "ml-6"}>{community?.name}</span>
                    {!isJoined && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {t("users.profileHeader.notJoined")}
                      </span>
                    )}
                  </AppLink>
                </DropdownMenuItem>
              );
            })}
            {hasAdminRole && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <AppLink href="/admin">
                    {t("users.profileHeader.adminButton")}
                  </AppLink>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : undefined,
    }),
    [showSwitcher, allCommunities, joinedCommunityIds, communityId, hasAdminRole, t],
  );

  useHeaderConfig(headerConfig);

  const viewModel = presentUserProfile(gqlUser, communityId ?? "", isOwner, portfolios);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
