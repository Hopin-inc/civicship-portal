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
      console.log("⏳ Still loading user...");
      return;
    }

    if (!isAuthenticated || !currentUser) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      console.log("🚷 No user found. Redirecting to login.");
      router.replace(`/login?next=${next}`);
      return;
    }

    if (!currentUser.memberships || currentUser.memberships.length === 0) {
      console.log("🚪 User has no memberships. Redirecting to home.");
      router.replace("/");
      return;
    }

    const targetMembership = currentUser.memberships.find((m: any) => m.community?.id === COMMUNITY_ID);
    const isCommunityManager =
      targetMembership &&
      (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

    if (!targetMembership) {
      console.log(`❌ No membership found for community ${COMMUNITY_ID}. Redirecting to home.`);
      router.replace("/");
      return;
    }

    if (!isCommunityManager) {
      console.log("⚠️ User is not a manager. Redirecting to home.");
      toast.warning("管理者権限がありません");
      router.replace("/");
      return;
    }

    console.log("✅ User is authorized as community manager.");
  }, [currentUser, isAuthenticated, loading, router]);

  if (loading) {
    console.log("⏳ Showing loading indicator...");
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !currentUser || !currentUser.memberships || currentUser.memberships.length === 0) {
    console.log("🚫 Unauthorized user state. No UI rendered.");
    return null;
  }

  const targetMembership = currentUser.memberships.find((m: any) => m.community?.id === COMMUNITY_ID);
  const isCommunityManager =
    targetMembership &&
    (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

  if (!isCommunityManager) {
    console.log("❌ Unauthorized role. No UI rendered.");
    return null;
  }

  console.log("🟢 AdminGuard passed. Rendering children.");
  return <>{children}</>;
};

export default AdminGuard;
