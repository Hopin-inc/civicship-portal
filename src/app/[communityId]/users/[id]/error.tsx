"use client";

import { ErrorState } from "@/components/shared";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();
  const refetchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    refetchRef.current = reset;
  }, [reset]);

  return <ErrorState title={t("users.error.loadFailed")} refetchRef={refetchRef} />;
}
