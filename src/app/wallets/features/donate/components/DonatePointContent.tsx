"use client";

import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { DonateForm, DonateUserSelect } from "@/app/wallets/features/donate/components";
import { useDonateFlow } from "../hooks/useDonateFlow";
import { useDonateMembers } from "../hooks/useDonateMembers";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";
import { useEffect, useRef, useState } from "react";
import { GqlUser } from "@/types/graphql";

export function DonatePointContent({
  currentUser,
  currentPoint,
}: {
  currentUser?: GqlUser | null;
  currentPoint: bigint;
}) {
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.History);
  const { members, loading, error, refetch, loadMoreRef, isLoadingMore } = useDonateMembers(
    currentUser?.id,
  );

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const { selectedUser, setSelectedUser, handleDonate, isLoading } = useDonateFlow(
    currentUser,
    currentPoint,
  );

  if (loading && !isLoadingMore) return <LoadingIndicator />;
  if (error)
    return <ErrorState title="送信先のメンバーを取得できませんでした" refetchRef={refetchRef} />;

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <DonateUserSelect
          members={members}
          onSelect={setSelectedUser}
          loadMoreRef={loadMoreRef}
          isLoadingMore={isLoadingMore}
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
