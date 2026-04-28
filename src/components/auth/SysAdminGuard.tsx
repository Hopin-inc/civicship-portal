"use client";

import React, { useEffect } from "react";
import { useAppRouter } from "@/lib/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { toast } from "react-toastify";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { GqlSysRole } from "@/types/graphql";
import { logger } from "@/lib/logging";

interface SysAdminGuardProps {
  children: React.ReactNode;
}

export const SysAdminGuard: React.FC<SysAdminGuardProps> = ({ children }) => {
  const { isAuthenticated, loading, user: currentUser } = useAuth();
  const router = useAppRouter();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !currentUser) {
      const next = encodeURIComponent(window.location.pathname + window.location.search);
      logger.debug("No user found. Redirecting to login", {
        component: "SysAdminGuard",
        redirectTo: `/login?next=${next}`,
      });
      router.replace(`/login?next=${next}`);
      return;
    }

    if (currentUser.sysRole !== GqlSysRole.SysAdmin) {
      toast.warning("システム管理者権限がありません");
      router.replace("/");
      return;
    }
  }, [currentUser, isAuthenticated, loading, router]);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  if (currentUser.sysRole !== GqlSysRole.SysAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default SysAdminGuard;
