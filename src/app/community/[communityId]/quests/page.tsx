"use client";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useAppRouter } from "@/lib/navigation";
import { useEffect } from "react";

export default function QuestsPage() {
  const router = useAppRouter();
  useEffect(() => {
    router.replace("/opportunities/search?type=quest");
  }, []);

  return <LoadingIndicator/>;
}