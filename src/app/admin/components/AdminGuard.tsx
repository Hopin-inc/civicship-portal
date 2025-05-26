"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { GqlRole } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { COMMUNITY_ID } from "@/utils";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user: currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // 未ログイン → 認証へ
    if (!currentUser) {
      router.replace("/sign-up/phone-verification");
      return;
    }

    // メンバーシップがない → トップへ
    if (!currentUser.memberships || currentUser.memberships.length === 0) {
      router.replace("/");
      return;
    }

    // neo88の管理者かどうか
    const targetMembership = currentUser.memberships.find((m) => m.community?.id === COMMUNITY_ID);
    const isCommunityManager =
      targetMembership &&
      (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

    if (!isCommunityManager) {
      toast.warning("管理者権限がありません");
      router.replace("/");
    }
  }, [currentUser, loading, router]);

  if (loading) return <LoadingIndicator />;
  if (!currentUser || !currentUser.memberships || currentUser.memberships.length === 0) return null;

  const targetMembership = currentUser.memberships.find((m) => m.community?.id === COMMUNITY_ID);
  const isCommunityManager =
    targetMembership &&
    (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

  if (!isCommunityManager) return null;

  return <>{children}</>;
}
