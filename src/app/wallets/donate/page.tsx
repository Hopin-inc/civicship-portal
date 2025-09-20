"use client";

import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { GqlUser } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import TransferInputStep from "@/app/admin/wallet/grant/components/TransferInputStep";
import UserSelectStep from "@/app/admin/wallet/grant/components/UserSelectStep";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { useMemberWallets } from "@/hooks/members/useMemberWallets";

export default function DonatePointPage() {
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const track = useAnalytics();

  const searchParams = useSearchParams();
  const currentPoint = BigInt(searchParams.get("currentPoint") ?? "0");
  const tab = searchParams.get("tab") ?? "";
  const [activeTab, setActiveTab] = useState<Tabs>(tab as Tabs);

  const { data, loading, error, refetch, loadMoreRef, hasNextPage, isLoadingMore } = useMemberWallets();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const [selectedUser, setSelectedUser] = useState<GqlUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { donatePoint } = useTransactionMutations();

  const members = (data?.wallets?.edges ?? [])
    .map((edge) => {
      const wallet = edge?.node;
      const user = wallet?.user;
      const pointStr = wallet?.currentPointView?.currentPoint;
      if (!user || user.id === currentUser?.id) return null;
      const currentPoint = pointStr ? BigInt(pointStr) : BigInt(0);

      return {
        user,
        wallet: {
          currentPointView: {
            currentPoint,
          },
        },
      };
    })
    .filter(
      (
        member,
      ): member is {
        user: GqlUser;
        wallet: { currentPointView: { currentPoint: bigint } };
      } => !!member && !!member.user,
    );

  const handleDonate = async (amount: number, comment?: string) => {
    if (!selectedUser) return;

    setIsLoading(true);
    try {
      const res = await donatePoint({
        input: {
          communityId: COMMUNITY_ID,
          transferPoints: amount,
          toUserId: selectedUser.id,
          comment: comment,
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

        toast.success(`${amount.toLocaleString()} pt をあげました`);
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

  if (loading && !isLoadingMore) return <LoadingIndicator />;
  if (error)
    return <ErrorState title="送信先のメンバーを取得できませんでした" refetchRef={refetchRef} />;

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <UserSelectStep
          title="送り先を選ぶ"
          members={members}
          onSelect={(user) => setSelectedUser(user)}
          loadMoreRef={loadMoreRef}
          isLoadingMore={isLoadingMore}
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
          currentPoint={currentPoint}
          title="ポイントをあげる"
          recipientLabel="にあげる"
          submitLabel="あげる"
          backLabel="あげる相手を選び直す"
          presetAmounts={[1000, 3000, 5000, 10000]}
        />
      )}
    </div>
  );
}
