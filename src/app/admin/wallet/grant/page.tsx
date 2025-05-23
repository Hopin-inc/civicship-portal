"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import { COMMUNITY_ID } from "@/utils";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { GqlUser, useGetMemberWalletsQuery } from "@/types/graphql";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import UserSelectStep from "./components/UserSelectStep";
import GrantInputStep from "./components/GrantInputStep";
import { useRouter } from "next/navigation";

export default function GrantPointStepperPage() {
  const router = useRouter();
  const headerConfig = useMemo(
    () => ({
      title: "ポイントを渡す",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { data, loading, error, refetch } = useGetMemberWalletsQuery({
    variables: { filter: { communityId: COMMUNITY_ID } },
    fetchPolicy: "network-only",
  });

  const { grantPoint } = useTransactionMutations();

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

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <UserSelectStep members={members} onSelect={setSelectedUser} />
      ) : (
        <GrantInputStep
          user={selectedUser}
          isLoading={isLoading}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleGrantPoint}
        />
      )}

      {loading && <p className="text-sm text-muted-foreground text-center">読み込み中...</p>}
      {error && <p className="text-sm text-red-500 text-center">読み込みに失敗しました</p>}
    </div>
  );
}
