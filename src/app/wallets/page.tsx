"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function WalletsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/wallets/me");
  }, []);

  return <LoadingIndicator />;
}
