"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";
import { useAppRouter } from "@/lib/navigation";

export default function ActivitiesPage() {
  const router = useAppRouter();
  useEffect(() => {
    router.replace("/opportunities/search?type=activity");
  }, []);
  return <LoadingIndicator/>;
}
