"use client";

import { useAuth } from "@/contexts/AuthProvider";
import { DonateUserSelect } from "@/app/community/[communityId]/wallets/features/donate/components";
import TransferInputStep from "@/app/community/[communityId]/admin/wallet/grant/components/TransferInputStep";
import { useDonateFlow } from "@/app/community/[communityId]/wallets/features/donate/hooks/useDonateFlow";
import { useDonateMembers } from "@/app/community/[communityId]/wallets/features/donate/hooks/useDonateMembers";
import { Tabs } from "@/app/community/[communityId]/admin/wallet/grant/types/tabs";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { UserPointRow } from "@/components/shared/UserPointRow";
import { useTranslations } from "next-intl";
import {
  GqlMembershipsConnection,
  GqlRole,
  GqlMembershipStatus,
  GqlMembershipStatusReason,
  GqlUser,
  useGetUserFlexibleQuery,
  useGetCommunityWalletQuery,
} from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";

interface DonatePointPageClientProps {
  initialCurrentPoint: string;
}

export default function DonatePointPageClient({ initialCurrentPoint }: DonatePointPageClientProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const searchParams = useSearchParams();
  const recipientId = searchParams.get("recipientId");
  const currentPoint = BigInt(initialCurrentPoint);
  const [activeTab, setActiveTab] = useState<Tabs>(Tabs.History);

  // Grant と同じパターン: Client Component でデータ取得
  const { members, loading, error, refetch, loadMoreRef, isLoadingMore, walletsConnection } =
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

  const { selectedUser, setSelectedUser, selectCommunity, handleDonate, isLoading, isAuthReady } =
    useDonateFlow(user, currentPoint);

  // コミュニティ財布を「ユーザー」として扱うための疑似ユーザー (表示は名前/ロゴのみ使用)
  const communityAsUser = useMemo<GqlUser>(
    () => ({
      __typename: "User",
      id: communityId,
      name: communityConfig?.title ?? "",
      image: communityConfig?.squareLogoPath ?? "",
    }),
    [communityId, communityConfig?.title, communityConfig?.squareLogoPath],
  );

  // コミュニティ財布の残高を取得し、選択行にメンバーと同じ形式で表示する
  const { data: communityWalletData } = useGetCommunityWalletQuery({
    variables: { communityId },
    skip: !communityId,
    fetchPolicy: "cache-and-network",
  });
  const communityPoint = useMemo<number | undefined>(() => {
    const raw =
      communityWalletData?.wallets?.edges?.[0]?.node?.currentPointView?.currentPoint;
    return raw != null ? Number(raw) : undefined;
  }, [communityWalletData]);

  const [notFoundInMembers, setNotFoundInMembers] = useState(false);
  const lastProcessedRecipientId = useRef<string | null>(null);
  useEffect(() => {
    if (!recipientId || loading || lastProcessedRecipientId.current === recipientId) return;
    lastProcessedRecipientId.current = recipientId;
    setNotFoundInMembers(false);
    const found = members.find((m) => m.user.id === recipientId);
    if (found) {
      setSelectedUser(found.user);
    } else {
      setNotFoundInMembers(true);
    }
  }, [recipientId, loading, members, setSelectedUser]);

  const { data: fallbackUserData } = useGetUserFlexibleQuery({
    variables: { id: recipientId ?? "", withDidIssuanceRequests: true },
    skip: !notFoundInMembers || !recipientId || recipientId === user?.id,
  });
  const lastSetFallbackId = useRef<string | null>(null);
  useEffect(() => {
    if (fallbackUserData?.user && lastSetFallbackId.current !== fallbackUserData.user.id) {
      lastSetFallbackId.current = fallbackUserData.user.id;
      setSelectedUser(fallbackUserData.user);
    }
  }, [fallbackUserData, setSelectedUser]);

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
          // コミュニティ財布への送付 (CONTRIBUTION) をメンバー/履歴一覧の最上部に同一 Table で固定表示。
          // communityId 未ロード時は空 ID 送金を防ぐため表示しない
          prependRow={
            communityId ? (
              <UserPointRow
                avatar={communityAsUser.image ?? ""}
                name={communityAsUser.name}
                subText={t("wallets.donate.communityWallet")}
                pointValue={communityPoint}
                onClick={() => selectCommunity(communityAsUser)}
              />
            ) : undefined
          }
          onSelectCommunity={() => selectCommunity(communityAsUser)}
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
