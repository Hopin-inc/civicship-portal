"use client";

import { useEffect } from "react";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function WalletsRedirectPage() {
  const router = useCommunityRouter();

  useEffect(() => {
    router.replace("/wallets/me");
  }, [router]);

  return <LoadingIndicator />;
}
