"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { GqlRole } from "@/types/graphql";
import { usePermission } from "@/hooks/usePermission";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { COMMUNITY_ID } from "@/utils";

type AdminGuardProps = {
  children: React.ReactNode;
  communityId?: string;
  requiredRoles?: GqlRole[];
};

/**
 * 管理者権限を持つユーザーのみアクセスを許可するガードコンポーネント
 * 権限がない場合はリダイレクトする
 */
export default function AdminGuard({
  children,
  communityId = COMMUNITY_ID,
  requiredRoles = [GqlRole.Owner, GqlRole.Manager],
}: AdminGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { checkAdminPermission, checkCommunityPermission } = usePermission();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) {
      console.log("⏳ Still loading user...");
      return;
    }

    if (!user) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      console.log("🚷 No user found. Redirecting to login.");
      router.replace(`/login?next=${next}`);
      return;
    }

    if (communityId) {
      const permissionResult = checkCommunityPermission({
        communityId,
        requiredRoles,
      });

      if (!permissionResult.hasPermission) {
        console.log("⚠️ User does not have required community permissions, redirecting to home");
        router.replace("/");
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
      console.log("✅ User is authorized as community manager.");
      return;
    }

    const permissionResult = checkAdminPermission();
    
    if (!permissionResult.hasPermission) {
      console.log("⚠️ User does not have admin permissions, redirecting to home");
      router.replace("/");
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [user, loading, router, communityId, requiredRoles, checkAdminPermission, checkCommunityPermission]);

  if (isChecking || loading) {
    console.log("⏳ Showing loading indicator...");
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!isAuthorized) {
    console.log("🚫 Unauthorized user state. No UI rendered.");
    return null;
  }

  console.log("🟢 AdminGuard passed. Rendering children.");
  return <>{children}</>;
}
