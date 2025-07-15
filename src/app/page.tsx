"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { currentCommunityConfig } from "@/lib/communities/metadata";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticating, loading: authLoading } = useAuth();

  useEffect(() => {
    router.replace(currentCommunityConfig.rootPath ?? "/activities");
  }, [router]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (isAuthenticating || authLoading) {
    return <LoadingIndicator fullScreen={true} />;
  }
}
