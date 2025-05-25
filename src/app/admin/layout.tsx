"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { GqlRole } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user: currentUser, isAuthenticating: loading } = useAuth();
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

  if (loading || !currentUser) {
    return <LoadingIndicator />;
  }

  if (!currentUser.memberships || currentUser.memberships.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full flex-grow pb-16">{children}</main>
    </div>
  );
}
