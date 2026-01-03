"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { useSearchParams } from "next/navigation";
import { DonateForm, DonateUserSelect } from "@/app/wallets/features/donate/components";
import { useDonateFlow } from "@/app/wallets/features/donate/hooks/useDonateFlow";
import { useDonateMembers } from "@/app/wallets/features/donate/hooks/useDonateMembers";
import { Tabs } from "@/app/admin/wallet/grant/types/tabs";
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
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export default function DonatePointPageClient() {
  const t = useTranslations();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const currentPoint = BigInt(searchParams.get("currentPoint") ?? "0");
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.History);

  // Grant と同じパターン: Client Component でデータ取得
  const { members, loading, error, refetch, loadMoreRef, isLoadingMore, walletsConnection } =
    useDonateMembers(user?.id);

  // members から initialConnection を作成（元のpageInfoを保持）
  const initialConnection = useMemo<GqlMembershipsConnection | null>(() => {
    if (members.length === 0) return null;

    const edges = members.map((m) => ({
      cursor: `${m.user.id}_${COMMUNITY_ID}`,
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
  }, [members, walletsConnection]);

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const { selectedUser, setSelectedUser, handleDonate, isLoading, isAuthReady } = useDonateFlow(
    user,
    currentPoint,
  );

  if (loading) {
    return <LoadingIndicator />;
  }

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
        <DonateForm
          user={selectedUser}
          isLoading={isLoading}
          isAuthReady={isAuthReady}
          onBack={() => setSelectedUser(null)}
          onSubmit={handleDonate}
          currentPoint={currentPoint}
        />
      )}
    </div>
  );
}
