"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlUser, useGetMemberWalletsQuery } from "@/types/graphql";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import UserSelectStep from "./components/UserSelectStep";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import TransferInputStep from "@/app/admin/wallet/grant/components/TransferInputStep";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { Tabs } from "./types/tabs";

export default function GrantPointStepperPage() {
  const router = useRouter();
  const track = useAnalytics();

  const searchParams = useSearchParams();
  const currentPoint = Number(searchParams.get("currentPoint") ?? "0");
  const tab = searchParams.get("tab") ?? "";
  const [activeTab, setActiveTab] = useState<Tabs>(tab as Tabs);

  const { data, loading, error, refetch, fetchMore } = useGetMemberWalletsQuery({
    variables: { filter: { communityId: COMMUNITY_ID }, first: 500 },
    fetchPolicy: "network-only",
  });

  const handleLoadMore = async () => {
    const pageInfo = data?.wallets?.pageInfo;
    const endCursor = pageInfo?.endCursor;

    if (pageInfo?.hasNextPage && endCursor) {
      await fetchMore({
        variables: {
          filter: { communityId: COMMUNITY_ID },
          first: 500,
          after: endCursor,
        },
      });
    }
  };

  const { grantPoint } = useTransactionMutations();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const [selectedUser, setSelectedUser] = useState<GqlUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGrantPoint = async (amount: number) => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      const res = await grantPoint({
        input: { transferPoints: amount, toUserId: selectedUser.id },
        permission: { communityId: COMMUNITY_ID },
      });

      if (res.success) {
        track({
          name: "grant_point",
          params: {
            toUser: {
              userId: selectedUser.id,
              name: selectedUser.name ?? "未設定",
            },
            amount,
          },
        });

        toast.success(`+${amount.toLocaleString()} pt を渡しました`);
        router.push("/admin/wallet?refresh=true");
      } else {
        toast.error(`助成失敗: ${res.code}`);
      }
    } catch {
      toast.error("助成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const members = data?.wallets?.edges
    ?.map((edge) => {
      const wallet = edge?.node;
      const user = wallet?.user;
      return user && wallet ? { user, wallet } : null;
    })
    .filter(Boolean) as {
    user: GqlUser;
    wallet: { currentPointView?: { currentPoint: number } };
  }[];

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title="メンバーを読み込めませんでした" refetchRef={refetchRef} />;
  }

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">

      {!selectedUser ? (
        <UserSelectStep
          members={members}
          onSelect={setSelectedUser}
          onLoadMore={handleLoadMore}
          hasNextPage={data?.wallets?.pageInfo?.hasNextPage}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      ) : (
        <TransferInputStep
          user={selectedUser}
          currentPoint={currentPoint}
          isLoading={isLoading}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleGrantPoint}
        />
      )}
    </div>
  );
}
