"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ActivityPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const communityId = searchParams.get("community_id") ?? "";

  useEffect(() => {
    window.location.href = `/opportunities/${id}?community_id=${communityId}&type=activity`;
  }, [id, communityId]);

  return <LoadingIndicator/>;
}
