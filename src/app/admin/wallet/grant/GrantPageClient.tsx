"use client";

import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlMembershipsConnection, GqlUser } from "@/types/graphql";
import { useTransactionMutations } from "@/app/admin/wallet/hooks/useTransactionMutations";
import UserSelectStep from "./components/UserSelectStep";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import TransferInputStep from "@/app/admin/wallet/grant/components/TransferInputStep";
import { useAnalytics } from "@/hooks/analytics/useAnalytics";
import { Tabs } from "./types/tabs";
import { ErrorState } from "@/components/shared";
import { useMemberWallets } from "@/hooks/members/useMemberWallets";
import { useTranslations } from "next-intl";
import { errorMessages } from "@/utils/errorMessage";

const DEFAULT_TAB: Tabs = Tabs.History;
const isValidTab = (tab: string): tab is Tabs => {
  return Object.values(Tabs).includes(tab as Tabs);
};

interface GrantPageClientProps {
  initialConnection: GqlMembershipsConnection | null;
}

export default function GrantPageClient({ initialConnection }: GrantPageClientProps) {
  const t = useTranslations();
  const router = useRouter();
  const track = useAnalytics();

  const searchParams = useSearchParams();
  const currentPoint = BigInt(searchParams.get("currentPoint") ?? "0");
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<Tabs>(() => {
    if (tabParam && isValidTab(tabParam)) {
      return tabParam;
    }
    return DEFAULT_TAB;
  });

  const { data, loading, error, refetch, loadMoreRef, isLoadingMore } = useMemberWallets();

  const { grantPoint, isAuthReady } = useTransactionMutations();

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const [selectedUser, setSelectedUser] = useState<GqlUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGrantPoint = async (amount: number, comment?: string) => {
    if (!selectedUser) return;
    setIsLoading(true);
    try {
      const res = await grantPoint({
        input: { transferPoints: amount, toUserId: selectedUser.id, comment },
        permission: { communityId: COMMUNITY_ID },
      });

      if (res.success) {
        track({
          name: "grant_point",
          params: {
            toUser: {
              userId: selectedUser.id,
              name: selectedUser.name ?? t("adminWallet.common.notSet"),
            },
            amount,
          },
        });

        toast.success(t("adminWallet.grant.success", { amount: amount.toLocaleString() }));
        router.push("/admin/wallet?refresh=true");
      } else {
        const errorMessage = errorMessages[res.code] ?? t("adminWallet.grant.errorGeneric");
        toast.error(errorMessage);
      }
    } catch {
      toast.error(t("adminWallet.grant.errorGeneric"));
    } finally {
      setIsLoading(false);
    }
  };

  const members = (data?.wallets?.edges ?? [])
    .map((edge) => {
      const wallet = edge?.node;
      const user = wallet?.user;
      const pointStr = wallet?.currentPointView?.currentPoint;
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
      } => !!member.user,
    );

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error) {
    return <ErrorState title={t("adminWallet.grant.membersLoadError")} refetchRef={refetchRef} />;
  }

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <UserSelectStep
          members={members}
          onSelect={setSelectedUser}
          loadMoreRef={loadMoreRef}
          isLoadingMore={isLoadingMore}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          listType="grant"
          initialConnection={initialConnection}
        />
      ) : (
        <TransferInputStep
          user={selectedUser}
          currentPoint={currentPoint}
          isLoading={isLoading}
          isAuthReady={isAuthReady}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleGrantPoint}
        />
      )}
    </div>
  );
}
