"use client";

import { useEffect } from "react";
import { useAppRouter } from "@/lib/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function WalletsRedirectPage() {
  const router = useAppRouter();

  useEffect(() => {
    router.replace("/wallets/me");
  }, []);

  return <LoadingIndicator />;
}
