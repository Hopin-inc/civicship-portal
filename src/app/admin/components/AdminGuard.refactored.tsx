"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { GqlRole } from "@/types/graphql";
import { usePermission } from "@/hooks/usePermission";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

type AdminGuardProps = {
  children: React.ReactNode;
  communityId?: string;
  requiredRoles?: GqlRole[];
};

/**
 * 管理者権限を持つユーザーのみアクセスを許可するガードコンポーネント
 * 権限がない場合はリダイレクトする
 */
export const AdminGuard = ({
  children,
  communityId,
  requiredRoles = [GqlRole.Owner, GqlRole.Manager],
}: AdminGuardProps) => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { checkAdminPermission, checkCommunityPermission } = usePermission();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      console.log("User not authenticated, redirecting to login");
      router.push("/login");
      return;
    }

    if (communityId) {
      const permissionResult = checkCommunityPermission({
        communityId,
        requiredRoles,
      });

      if (!permissionResult.hasPermission) {
        console.log("User does not have required community permissions, redirecting to home");
        router.push("/");
        return;
      }

      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }

    const permissionResult = checkAdminPermission();
    
    if (!permissionResult.hasPermission) {
      console.log("User does not have admin permissions, redirecting to home");
      router.push("/");
      return;
    }

    setIsAuthorized(true);
    setIsChecking(false);
  }, [user, loading, router, communityId, requiredRoles, checkAdminPermission, checkCommunityPermission]);

  if (isChecking || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
