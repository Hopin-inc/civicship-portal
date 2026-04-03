"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { DonateUserSelect } from "@/app/community/[communityId]/wallets/features/donate/components";
import TransferInputStep from "@/app/community/[communityId]/admin/wallet/grant/components/TransferInputStep";
import { useDonateFlow } from "@/app/community/[communityId]/wallets/features/donate/hooks/useDonateFlow";
import { useDonateMembers } from "@/app/community/[communityId]/wallets/features/donate/hooks/useDonateMembers";
import { useMyWalletBalance } from "@/app/community/[communityId]/wallets/features/donate/hooks/useMyWalletBalance";
import { Tabs } from "@/app/community/[communityId]/admin/wallet/grant/types/tabs";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { useTranslations } from "next-intl";
import {
  GqlMembershipsConnection,
  GqlRole,
  GqlMembershipStatus,
  GqlMembershipStatusReason,
} from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

export default function DonatePointPageClient() {
  const t = useTranslations();
  const { user } = useAuth();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.History);

  const { currentPoint, loading: isBalanceLoading, error: balanceError, refetch: refetchBalance } = useMyWalletBalance();

  // Grant と同じパターン: Client Component でデータ取得
  const { members, loading: areMembersLoading, error, refetch, walletsConnection } =
    useDonateMembers(user?.id);

  // members から initialConnection を作成（元のpageInfoを保持）
  const initialConnection = useMemo<GqlMembershipsConnection | null>(() => {
    if (members.length === 0) return null;

    const edges = members.map((m) => ({
      cursor: `${m.user.id}_${communityId}`,
      node: {
        user: m.user,
        role: GqlRole.Member,
        reason: GqlMembershipStatusReason.AcceptedInvitation,
        status: GqlMembershipStatus.Joined,
      },
    }));

    return {
      edges,
      pageInfo: walletsConnection?.pageInfo ?? {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: walletsConnection?.totalCount ?? members.length,
    };
  }, [members, communityId, walletsConnection]);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const balanceRefetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    balanceRefetchRef.current = refetchBalance;
  }, [refetchBalance]);

  const { selectedUser, setSelectedUser, handleDonate, isLoading, isAuthReady } = useDonateFlow(
    user,
    currentPoint,
  );

  if (areMembersLoading || isBalanceLoading) {
    return <LoadingIndicator />;
  }

  if (balanceError)
    return <ErrorState title={t("wallets.donate.errorBalance")} refetchRef={balanceRefetchRef} />;

  if (error)
    return <ErrorState title={t("wallets.donate.errorMembers")} refetchRef={refetchRef} />;

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {!selectedUser ? (
        <DonateUserSelect
          members={members}
          onSelect={setSelectedUser}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          initialConnection={initialConnection}
        />
      ) : (
        <TransferInputStep
          user={selectedUser}
          currentPoint={currentPoint}
          isLoading={isLoading}
          isAuthReady={isAuthReady}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleDonate}
        />
      )}
    </div>
  );
}
