"use client";

import { useAuthCompat as useAuth } from "@/hooks/auth/useAuthCompat";
import { useSearchParams } from "next/navigation";
import { DonatePointContent } from "@/app/(authed)/wallets/features/donate/components/DonatePointContent";

export default function DonatePointPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentPoint = BigInt(searchParams.get("currentPoint") ?? "0");

  return <DonatePointContent currentUser={user} currentPoint={currentPoint} />;
}
