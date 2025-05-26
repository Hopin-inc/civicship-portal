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
    if (loading) {
      console.log("⏳ Still loading user...");
      return;
    }

    // 🚫 Not logged in → Redirect to phone verification
    if (!currentUser) {
      console.log("🚷 No user found. Redirecting to phone verification.");
      router.replace("/sign-up/phone-verification");
      return;
    }

    // 🧾 No memberships → Redirect to home
    if (!currentUser.memberships || currentUser.memberships.length === 0) {
      console.log("🚪 User has no memberships. Redirecting to home.");
      router.replace("/");
      return;
    }

    // 🎯 Check if user is a manager in the target community
    const targetMembership = currentUser.memberships.find((m) => m.community?.id === COMMUNITY_ID);
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
  }, [currentUser, loading, router]);

  if (loading) {
    console.log("⏳ Showing loading indicator...");
    return <LoadingIndicator />;
  }

  if (!currentUser || !currentUser.memberships || currentUser.memberships.length === 0) {
    console.log("🚫 Unauthorized user state. No UI rendered.");
    return null;
  }

  const targetMembership = currentUser.memberships.find((m) => m.community?.id === COMMUNITY_ID);
  const isCommunityManager =
    targetMembership &&
    (targetMembership.role === GqlRole.Owner || targetMembership.role === GqlRole.Manager);

  if (!isCommunityManager) {
    console.log("❌ Unauthorized role. No UI rendered.");
    return null;
  }

  console.log("🟢 AdminGuard passed. Rendering children.");
  return <>{children}</>;
}
