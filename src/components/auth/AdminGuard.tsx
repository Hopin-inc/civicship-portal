"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { COMMUNITY_ID } from "@/utils";
import { GqlRole } from "@/types/graphql";
import logger from "@/lib/logging";

/**
 * 管理者ガードコンポーネントのプロパティ
 */
interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * 管理者ガードコンポーネント
 * 管理者権限を持つユーザーのみアクセスを許可する
 */
export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    skip: !isAuthenticated,
  });

  const loading = authLoading || userLoading;
  const currentUser = userData?.currentUser?.user;

  useEffect(() => {
    if (loading) {
      logger.debug("Still loading user", {
        component: "AdminGuard",
        authLoading,
        userLoading
      });
      return;
    }

    if (!isAuthenticated || !currentUser) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      logger.info("No user found, redirecting to login", {
        component: "AdminGuard",
        isAuthenticated,
        hasCurrentUser: !!currentUser,
        redirectPath: `/login?next=${next}`
      });
      router.replace(`/login?next=${next}`);
      return;
    }

    if (!currentUser.memberships || currentUser.memberships.length === 0) {
      logger.info("User has no memberships, redirecting to home", {
        component: "AdminGuard",
        userId: currentUser.id,
        redirectPath: "/"
      });
      router.replace("/");
      return;
    }

    const targetMembership = currentUser.memberships.find((m: any) => m.community?.id === COMMUNITY_ID);
    const isCommunityManager =
      targetMembership &&
      (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

    if (!targetMembership) {
      logger.info("No membership found for community, redirecting to home", {
        component: "AdminGuard",
        userId: currentUser.id,
        communityId: COMMUNITY_ID,
        redirectPath: "/"
      });
      router.replace("/");
      return;
    }

    if (!isCommunityManager) {
      logger.warn("User is not a manager, redirecting to home", {
        component: "AdminGuard",
        userId: currentUser.id,
        communityId: COMMUNITY_ID,
        membershipRole: targetMembership.role,
        redirectPath: "/"
      });
      toast.warning("管理者権限がありません");
      router.replace("/");
      return;
    }

    logger.info("User is authorized as community manager", {
      component: "AdminGuard",
      userId: currentUser.id,
      communityId: COMMUNITY_ID,
      role: targetMembership.role
    });
  }, [currentUser, isAuthenticated, loading, router, authLoading, userLoading]);

  if (loading) {
    logger.debug("Showing loading indicator", {
      component: "AdminGuard",
      authLoading,
      userLoading
    });
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !currentUser || !currentUser.memberships || currentUser.memberships.length === 0) {
    logger.info("Unauthorized user state, no UI rendered", {
      component: "AdminGuard",
      isAuthenticated,
      hasCurrentUser: !!currentUser,
      hasMemberships: !!(currentUser?.memberships?.length)
    });
    return null;
  }

  const targetMembership = currentUser.memberships.find((m: any) => m.community?.id === COMMUNITY_ID);
  const isCommunityManager =
    targetMembership &&
    (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

  if (!isCommunityManager) {
    logger.info("Unauthorized role, no UI rendered", {
      component: "AdminGuard",
      userId: currentUser.id,
      communityId: COMMUNITY_ID,
      membershipRole: targetMembership?.role
    });
    return null;
  }

  logger.debug("AdminGuard passed, rendering children", {
    component: "AdminGuard",
    userId: currentUser.id,
    communityId: COMMUNITY_ID
  });
  return <>{children}</>;
};

export default AdminGuard;
