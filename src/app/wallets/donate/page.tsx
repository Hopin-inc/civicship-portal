"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { GqlUser } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useDonateMembers, useDonatePoint } from "@/app/wallets/features/donate/hooks";
import { DonateUserSelect, DonateForm } from "@/app/wallets/features/donate/components";

export default function DonatePointPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const track = useAnalytics();

  const searchParams = useSearchParams();
  const currentPoint = BigInt(searchParams.get("currentPoint") ?? "0");
  const tab = searchParams.get("tab") ?? "";
  const [activeTab, setActiveTab] = useState<Tabs>(tab as Tabs);

  const { members, loading, error, refetch, loadMoreRef, isLoadingMore } = useDonateMembers(currentUser?.id);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const [selectedUser, setSelectedUser] = useState<GqlUser | null>(null);
  const { donate, isLoading } = useDonatePoint();

  const handleDonate = async (amount: number, comment?: string) => {
    if (!selectedUser || !currentUser?.id) return;

    try {
      const res = await donate({
        toUserId: selectedUser.id,
        amount,
        comment,
        fromUserId: currentUser.id,
      });

      if (res.success) {
        track({
          name: "donate_point",
          params: {
            fromUser: {
              userId: currentUser.id,
              name: currentUser.name ?? "未設定",
            },
            toUser: {
              userId: selectedUser.id,
              name: selectedUser.name ?? "未設定",
            },
            amount,
          },
        });

        toast.success(`${amount.toLocaleString()} pt をあげました`);
        router.push("/wallets/me?refresh=true");
      } else {
        toast.error(`送信失敗: ${res.code}`);
      }
    } catch {
      toast.error("ポイントを送れませんでした");
    }
  };

  if (loading && !isLoadingMore) return <LoadingIndicator />;
  if (error)
    return <ErrorState title="送信先のメンバーを取得できませんでした" refetchRef={refetchRef} />;

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <DonateUserSelect
          members={members}
          onSelect={(user) => setSelectedUser(user)}
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
