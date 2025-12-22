"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ActivityPage() {
  const params = useParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    // Redirect to the unified opportunity page without community_id query param
    // The communityId is now determined from the URL path prefix
    router.replace(`/opportunities/${id}?type=activity`);
  }, [id, router]);

  return <LoadingIndicator/>;
}
