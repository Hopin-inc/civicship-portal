"use client";

import { useRef } from "react";
import { ErrorState } from "@/components/shared/ErrorState";

export default function SysAdminDashboardError({ reset }: { error: Error; reset: () => void }) {
  const ref = useRef<(() => void) | null>(reset);
  ref.current = reset;
  return <ErrorState refetchRef={ref} />;
}
