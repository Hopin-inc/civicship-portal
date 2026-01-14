"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ActivityPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const communityId = searchParams.get("community_id") ?? "";

  useEffect(() => {
    router.replace(`/opportunities/${id}?community_id=${communityId}&type=activity`);
  }, [id, communityId, router]);

  return <LoadingIndicator/>;
}
