"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user: currentUser, isAuthenticating: loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && currentUser) {
      if (!currentUser.memberships || currentUser.memberships.length === 0) {
        router.push("/");
        toast.warning("管理者権限がありません");
      }
    }
  }, [currentUser, loading, router]);

  if (loading || !currentUser) {
    return null;
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
