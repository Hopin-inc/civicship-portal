"use client";

import { useEffect, useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useParams, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ActivityPage() {
  const headerConfig = useMemo(
    () => ({
      hideHeader: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const params = useParams();
  const searchParams = useSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const communityId = searchParams.get("community_id") ?? "";

  useEffect(() => {
    window.location.href = `/opportunities/${id}?community_id=${communityId}&type=quest`;
  }, [id, communityId]);

  return <LoadingIndicator/>;
}
