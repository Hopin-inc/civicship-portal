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
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

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
      console.log("⏳ Still loading user...");
      return;
    }

    if (!isAuthenticated || !currentUser) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      console.log("🚷 No user found. Redirecting to login.");
      router.replace(`/login?next=${next}`);
      return;
    }

    const checkAdminAccess = async () => {
      const { hasAccess, redirectPath } = await authRedirectService.checkAdminAccess(currentUser);
      
      if (!hasAccess && redirectPath) {
        if (redirectPath === "/") {
          toast.warning("管理者権限がありません");
        }
        console.log(`❌ Admin access denied. Redirecting to: ${redirectPath}`);
        router.replace(redirectPath);
        return;
      }

      console.log("✅ User is authorized as community manager.");
    };

    checkAdminAccess();
  }, [currentUser, isAuthenticated, loading, router, authRedirectService]);

  if (loading) {
    console.log("⏳ Showing loading indicator...");
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !currentUser) {
    console.log("🚫 Unauthorized user state. No UI rendered.");
    return null;
  }

  const checkSyncAdminAccess = () => {
    if (!currentUser?.memberships || currentUser.memberships.length === 0) {
      return false;
    }

    const targetMembership = currentUser.memberships.find((m: any) => m.community?.id === COMMUNITY_ID);
    return targetMembership && 
           (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);
  };

  if (!checkSyncAdminAccess()) {
    console.log("❌ Unauthorized role. No UI rendered.");
    return null;
  }

  console.log("🟢 AdminGuard passed. Rendering children.");
  return <>{children}</>;
};

export default AdminGuard;
