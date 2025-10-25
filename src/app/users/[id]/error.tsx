"use client";

import { ErrorState } from "@/components/shared";
import { useEffect, useRef } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const refetchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    refetchRef.current = reset;
  }, [reset]);

  return <ErrorState title="参加者ページを読み込めませんでした" refetchRef={refetchRef} />;
}
