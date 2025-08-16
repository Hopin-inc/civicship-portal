"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";

export default async function ActivitiesPage() {
  useEffect(() => {
    window.location.href = "/opportunities";
  }, []);
  return <LoadingIndicator/>;
}
