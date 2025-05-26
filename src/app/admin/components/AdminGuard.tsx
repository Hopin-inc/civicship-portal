"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { GqlRole } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user: currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      const targetMembership = currentUser.memberships?.find((m) => m.community?.id === "neo88");
      const isCommunityManager =
        targetMembership &&
        (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);
      if (!isCommunityManager) {
        router.push("/");
        toast.warning("管理者権限がありません");
      }
    }
  }, [currentUser, router, loading]);

  if (loading) return <LoadingIndicator />;
  if (!currentUser) router.push("/sign-up/phone-verification");
  else if (!currentUser.memberships || currentUser.memberships.length === 0) router.push("/");

  return <>{children}</>;
}
