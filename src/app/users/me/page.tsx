"use client";

import { presentUserProfile, useUserProfileContext } from "@/app/users/features/shared";
import { UserProfileView } from "@/app/users/features/profile";
import { useAuth } from "@/contexts/AuthProvider";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { GqlMembership, GqlRole } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { ArrowLeftRight } from "lucide-react";

export default function MyProfilePage() {
  const { gqlUser, isOwner, portfolios } = useUserProfileContext();
  const { user: currentUser } = useAuth();
  const { communityId } = useCommunityConfig();
  const t = useTranslations();

  // 管理者権限チェック
  const hasAdminRole = useMemo(() => {
    if (!currentUser?.memberships) return false;
    const membership = currentUser.memberships.find(
      (m: GqlMembership) => m.community?.id === communityId,
    );
    return membership?.role === GqlRole.Owner || membership?.role === GqlRole.Manager;
  }, [currentUser, communityId]);

  // ヘッダー設定
  const headerConfig = useMemo(
    () => ({
      action: hasAdminRole ? (
        <Link href="/admin">
          <Button variant="tertiary" size="sm">
            {t("users.profileHeader.adminButton")}
            <ArrowLeftRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      ) : undefined,
    }),
    [hasAdminRole, t],
  );

  useHeaderConfig(headerConfig);

  const viewModel = presentUserProfile(gqlUser, isOwner, portfolios);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
