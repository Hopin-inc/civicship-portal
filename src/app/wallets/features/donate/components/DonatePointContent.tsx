"use client";

import { ErrorState } from "@/components/shared";
import { DonateForm, DonateUserSelect } from "@/app/wallets/features/donate/components";
import { useDonateFlow } from "../hooks/useDonateFlow";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";
import { useEffect, useRef, useState } from "react";
import { GqlUser, GqlWalletsConnection } from "@/types/graphql";
import { useTranslations } from "next-intl";
import { useInfiniteMembers } from "@/hooks/members/useInfiniteMembers";
import { getServerMemberWalletsWithCursor } from "@/hooks/members/server";

export function DonatePointContent({
  currentUser,
  currentPointString,
  initialMembers,
}: {
  currentUser?: GqlUser | null;
  currentPointString: string;
  initialMembers: GqlWalletsConnection;
}) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.History);
  const currentPoint = BigInt(currentPointString);

  const { members, loading, refetch, loadMoreRef } = useInfiniteMembers({
    initialMembers,
    fetchMore: getServerMemberWalletsWithCursor,
    currentUserId: currentUser?.id,
  });

  const refetchRef = useRef<(() => Promise<void>) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const { selectedUser, setSelectedUser, handleDonate, isLoading } = useDonateFlow(
    currentUser,
    currentPoint,
  );

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <DonateUserSelect
          members={members}
          onSelect={setSelectedUser}
          loadMoreRef={loadMoreRef}
          isLoadingMore={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <DonateForm
          user={selectedUser}
          isLoading={isLoading}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleDonate}
          currentPoint={currentPoint}
        />
      )}
    </div>
  );
}
