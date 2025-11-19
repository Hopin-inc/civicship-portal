"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { DonatePointContent } from "@/app/wallets/features/donate/components/DonatePointContent";

export default function DonatePointPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentPoint = BigInt(searchParams.get("currentPoint") ?? "0");

  return <DonatePointContent currentUser={user} currentPoint={currentPoint} />;
}
