"use client";

import { useEffect, useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useParams } from "next/navigation";
import { useAppRouter } from "@/lib/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function QuestPage() {
  const router = useAppRouter();
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
    router.replace(`/opportunities/${id}?type=quest`);
  }, [id, router]);

  return <LoadingIndicator/>;
}
