"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { GqlUser, useGetMemberWalletsQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import TransferInputStep from "@/app/admin/wallet/grant/components/TransferInputStep";
import UserSelectStep from "@/app/admin/wallet/grant/components/UserSelectStep";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";

export default function DonatePointPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const track = useAnalytics();

  const searchParams = useSearchParams();
  const currentPoint = Number(searchParams.get("currentPoint") ?? "0");
  const tab = searchParams.get("tab") ?? "";
  const [activeTab, setActiveTab] = useState<Tabs>(tab as Tabs);

  const { data, loading, error, refetch, fetchMore } = useGetMemberWalletsQuery({
    variables: { filter: { communityId: COMMUNITY_ID }, first: 100 },
    fetchPolicy: "network-only",
  });

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const [selectedUser, setSelectedUser] = useState<GqlUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { donatePoint } = useTransactionMutations();

  const members =
    (data?.wallets?.edges
      ?.map((edge) => {
        const wallet = edge?.node;
        const user = wallet?.user;
        const currentPoint = wallet?.currentPointView?.currentPoint;
        return user?.id !== currentUser?.id && user
          ? {
              user,
              wallet: currentPoint != null ? { currentPointView: { currentPoint } } : {},
            }
          : null;
      })
      .filter(Boolean) as {
      user: GqlUser;
      wallet: { currentPointView?: { currentPoint: number } };
    }[]) ?? [];

  const handleDonate = async (amount: number) => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const res = await donatePoint({
        input: {
          communityId: COMMUNITY_ID,
          transferPoints: amount,
          toUserId: selectedUser.id,
        },
        permission: { userId: currentUser?.id ?? "" },
      });

      if (res.success) {
        track({
          name: "donate_point",
          params: {
            fromUser: {
              userId: currentUser?.id ?? "unknown",
              name: currentUser?.name ?? "未設定",
            },
            toUser: {
              userId: selectedUser.id,
              name: selectedUser.name ?? "未設定",
            },
            amount,
          },
        });

        toast.success(`+${amount.toLocaleString()} pt をあげました`);
        router.push("/wallets?refresh=true");
      } else {
        toast.error(`送信失敗: ${res.code}`);
      }
    } catch {
      toast.error("ポイントを送れませんでした");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const endCursor = data?.wallets?.pageInfo?.endCursor;
    if (data?.wallets?.pageInfo?.hasNextPage && endCursor) {
      await fetchMore({
        variables: {
          filter: { communityId: COMMUNITY_ID },
          first: 100,
          after: endCursor,
        },
      });
    }
  };

  const hasNextPage = data?.wallets?.pageInfo?.hasNextPage ?? false;

  if (loading) return <LoadingIndicator />;
  if (error)
    return <ErrorState title="送信先のメンバーを取得できませんでした" refetchRef={refetchRef} />;

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <UserSelectStep
          title="譲渡先を選ぶ"
          members={members}
          onSelect={(user) => setSelectedUser(user)}
          onLoadMore={handleLoadMore}
          hasNextPage={hasNextPage}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          listType="donate"
        />
      ) : (
        <TransferInputStep
          user={selectedUser}
          isLoading={isLoading}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleDonate}
          currentPoint={currentPoint} // ← ここ追加
          title="ポイントをあげる"
          recipientLabel="あげる相手"
          submitLabel="あげる"
          backLabel="送り先を選び直す"
          presetAmounts={[1000, 3000, 5000, 10000]}
        />
      )}
    </div>
  );
}
