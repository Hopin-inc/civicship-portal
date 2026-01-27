"use client";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";
import { useEffect } from "react";

export default function QuestsPage() {
  const router = useCommunityRouter();
  useEffect(() => {
    router.replace("/opportunities/search?type=quest");
  }, [router]);

  return <LoadingIndicator/>;
}