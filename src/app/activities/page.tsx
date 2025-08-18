"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";

export default function ActivitiesPage() {
  useEffect(() => {
    window.location.href = "/opportunities/search?type=activity";
  }, []);
  return <LoadingIndicator/>;
}
