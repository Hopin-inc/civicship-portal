"use client";

import { useEffect, useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useParams } from "next/navigation";
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

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    // Redirect to the unified opportunity page without community_id query param
    // The communityId is now determined from the URL path prefix
    window.location.href = `/opportunities/${id}?type=quest`;
  }, [id]);

  return <LoadingIndicator/>;
}
