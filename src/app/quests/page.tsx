"use client";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuestsPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/opportunities/search?type=quest");
  }, []);

  return <LoadingIndicator/>;
}