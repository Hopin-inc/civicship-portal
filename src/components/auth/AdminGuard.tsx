"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/account/identity/query";
import { toast } from "sonner";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlRole } from "@/types/graphql";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";
import { logger } from "@/lib/logging";
import { AdminRoleContext } from "@/app/admin/context/AdminRoleContext";

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

    const checkAdminAccess = async () => {
      const { hasAccess, redirectPath } = await authRedirectService.checkAdminAccess(currentUser);

      if (!hasAccess && redirectPath) {
        if (redirectPath === "/") {
          toast.warning("管理者権限がありません");
        }
        logger.debug("Admin access denied. Redirecting", {
          component: "AdminGuard",
          redirectPath,
        });
        router.replace(redirectPath);
        return;
      }

      logger.debug("User is authorized as community manager", {
        component: "AdminGuard",
      });
    };

    checkAdminAccess();
  }, [currentUser, isAuthenticated, loading, router, authRedirectService]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !currentUser) {
    logger.debug("Unauthorized user state. No UI rendered", { component: "AdminGuard" });
    return null;
  }

  const targetMembership = currentUser.memberships.find(
    (m: any) => m.community?.id === COMMUNITY_ID,
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
