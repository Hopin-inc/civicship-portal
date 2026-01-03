"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { DonatePointContent } from "@/app/wallets/features/donate/components/DonatePointContent";
import { GqlMembershipsConnection } from "@/types/graphql";

interface DonatePointPageClientProps {
  initialConnection: GqlMembershipsConnection | null;
}

export default function DonatePointPageClient({ initialConnection }: DonatePointPageClientProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentPoint = BigInt(searchParams.get("currentPoint") ?? "0");

  return (
    <DonatePointContent
      currentUser={user}
      currentPoint={currentPoint}
      initialConnection={initialConnection}
    />
  );
}
