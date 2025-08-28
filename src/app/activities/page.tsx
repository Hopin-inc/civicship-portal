"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ActivitiesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/opportunities/search?type=activity");
  }, []);
  return <LoadingIndicator/>;
}
