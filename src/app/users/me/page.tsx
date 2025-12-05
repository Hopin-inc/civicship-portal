"use client";

import { useUserProfileContext, presentUserProfile } from "@/app/users/features/shared";
import { UserProfileView } from "@/app/users/features/profile";
import { useAuth } from "@/contexts/AuthProvider";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlMembership, GqlRole } from "@/types/graphql";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useMemo } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export default function MyProfilePage() {
  const { gqlUser, isOwner, portfolios } = useUserProfileContext();
  const { user: currentUser } = useAuth();
  const t = useTranslations();

  // 管理者権限チェック
  const hasAdminRole = useMemo(() => {
    if (!currentUser?.memberships) return false;
    const membership = currentUser.memberships.find(
      (m: GqlMembership) => m.community?.id === COMMUNITY_ID,
    );
    return membership?.role === GqlRole.Owner || membership?.role === GqlRole.Manager;
  }, [currentUser]);

  // ヘッダー設定
  const headerConfig = useMemo(
    () => ({
      action: hasAdminRole ? (
        <Link
          href="/admin"
          className={cn(buttonVariants({ variant: "text", size: "sm" }), "text-black")}
        >
          {t("users.profileHeader.adminButton")}
        </Link>
      ) : undefined,
    }),
    [hasAdminRole, t],
  );

  useHeaderConfig(headerConfig);

  const viewModel = presentUserProfile(gqlUser, isOwner, portfolios);

  return <UserProfileView viewModel={viewModel} isOwner={isOwner} />;
}
