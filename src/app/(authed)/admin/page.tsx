"use client";

import { useEffect } from "react";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(currentCommunityConfig.adminRootPath ?? "/admin/reservations");
  }, [router]);

  return <LoadingIndicator fullScreen={true} />;
}
