"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppRouter } from "@/lib/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ActivityPage() {
  const params = useParams();
  const router = useAppRouter();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    router.replace(`/opportunities/${id}?type=activity`);
  }, [id, router]);

  return <LoadingIndicator/>;
}
