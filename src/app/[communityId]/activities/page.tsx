"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";

export default function ActivitiesPage() {
  const router = useCommunityRouter();
  useEffect(() => {
    router.replace("/opportunities/search?type=activity");
  }, [router]);
  return <LoadingIndicator/>;
}
