"use client";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useEffect } from "react";

export default function QuestsPage() {
  useEffect(() => {
    window.location.href = "/opportunities/search?type=quest";
  }, []);

  return <LoadingIndicator/>;
}