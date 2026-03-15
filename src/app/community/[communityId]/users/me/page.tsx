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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
  const allCommunities = useMemo(() => {
    const communities =
      communitiesData?.communities?.edges
        ?.map((e) => e?.node)
        .filter((c): c is NonNullable<typeof c> => !!c) ?? [];
    return [...communities].sort((a, b) => {
      const aJoined = joinedCommunityIds.has(a.id) ? 0 : 1;
      const bJoined = joinedCommunityIds.has(b.id) ? 0 : 1;
      return aJoined - bJoined;
    });
  }, [communitiesData, joinedCommunityIds]);

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
              const isCurrent = community.id === communityId;
              const isJoined = joinedCommunityIds.has(community.id);
              return (
                <DropdownMenuItem key={community.id} asChild disabled={isCurrent}>
                  <AppLink href="/users/me" communityId={community.id} className="flex items-center gap-3 py-2">
                    <div className="relative shrink-0">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={community.image ?? undefined} alt={community.name ?? ""} />
                        <AvatarFallback className="text-xs font-medium">
                          {community.name?.charAt(0) ?? "?"}
                        </AvatarFallback>
                      </Avatar>
                      {isCurrent && (
                        <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-2 ring-background">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </span>
                      )}
                    </div>
                    <span className="flex-1 truncate text-sm">{community.name}</span>
                    {!isJoined && (
                      <Badge variant="outline" size="sm" className="shrink-0 text-muted-foreground px-1.5 py-0 text-[10px]">
                        {t("users.profileHeader.notJoined")}
                      </Badge>
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
