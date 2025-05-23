"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { COMMUNITY_ID } from "@/utils";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { GqlUser, useGetMemberWalletsQuery } from "@/types/graphql";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import UserSelectStep from "./components/UserSelectStep";
import GrantInputStep from "./components/GrantInputStep";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";

export default function GrantPointStepperPage() {
  const router = useRouter();
  const headerConfig = useMemo(
    () => ({
      title: "ポイント支給",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { data, loading, error, refetch, fetchMore } = useGetMemberWalletsQuery({
    variables: { filter: { communityId: COMMUNITY_ID } },
    fetchPolicy: "network-only",
  });

  const handleLoadMore = async () => {
    const pageInfo = data?.wallets?.pageInfo;
    const endCursor = pageInfo?.endCursor;

    if (pageInfo?.hasNextPage && endCursor) {
      await fetchMore({
        variables: {
          filter: { communityId: COMMUNITY_ID },
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
        toast.success(`+${amount.toLocaleString()} pt を渡しました`);
        router.push("/admin/wallet");
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
        />
      ) : (
        <GrantInputStep
          user={selectedUser}
          isLoading={isLoading}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleGrantPoint}
        />
      )}
    </div>
  );
}
