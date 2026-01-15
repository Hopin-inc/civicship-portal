"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { GqlMembership, GqlRole } from "@/types/graphql";
import { AuthRedirectService } from "@/lib/auth/service/auth-redirect-service";
import { logger } from "@/lib/logging";
import { AdminRoleContext } from "@/app/[communityId]/admin/context/AdminRoleContext";
import { AccessPolicy } from "@/lib/auth/core/access-policy";

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAuthenticated, loading, user: currentUser } = useAuth();
  const router = useRouter();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId;

  const authRedirectService = React.useMemo(() => {
    return AuthRedirectService.getInstance();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !currentUser) {
      const next = window.location.pathname + window.location.search;
      logger.debug("No user found. Redirecting to login", {
        component: "AdminGuard",
        redirectTo: `/login?next=${next}`,
      });
      router.replace(`/login?next=${next}`);
      return;
    }

    const checkAdminAccess = () => {
      const pathname = window.location.pathname;
      if (!communityId) {
        logger.debug("No communityId found. Cannot check admin access", {
          component: "AdminGuard",
        });
        return;
      }
      const canAccess = AccessPolicy.canAccessRole(currentUser, pathname, communityId);
      if (!canAccess) {
        const redirectPath = AccessPolicy.getFallbackPath(currentUser, communityId);
        toast.warning("管理者権限がありません");
        router.replace(redirectPath);
        return;
      }

      logger.debug("✅ User is authorized as community manager", {
        component: "AdminGuard",
      });
    };

    checkAdminAccess();
  }, [currentUser, isAuthenticated, loading, router, authRedirectService, communityId]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !currentUser) {
    logger.debug("Unauthorized user state. No UI rendered", { component: "AdminGuard" });
    return null;
  }

  const targetMembership = currentUser.memberships?.find(
    (m: GqlMembership) => m.community?.id === communityId,
  );
  if (!targetMembership) {
    logger.debug("No membership found for community", { component: "AdminGuard" });
    return null;
  }
  const role = targetMembership.role;

  if (!(role === GqlRole.Owner || role === GqlRole.Manager)) {
    logger.debug("Unauthorized role. No UI rendered", { component: "AdminGuard" });
    return null;
  }
  return <AdminRoleContext.Provider value={role}>{children}</AdminRoleContext.Provider>;
};

export default AdminGuard;
