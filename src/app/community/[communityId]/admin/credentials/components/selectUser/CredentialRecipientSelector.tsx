import React, { useMemo, useState } from "react";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import {
  GqlDidIssuanceRequest,
  GqlMembershipsConnection,
  GqlParticipationStatusReason,
  GqlUser,
  useParticipationBulkCreateMutation,
} from "@/types/graphql";
import { toast } from "react-toastify";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { useSelection } from "../../context/SelectionContext";
import { useEvaluationBulkCreate } from "../../hooks/useEvaluationBulkCreate";
import { useAppRouter } from "@/lib/navigation";
import { logger } from "@/lib/logging";
import { useMemberWithDidSearch } from "../../hooks/useMemberWithDidSearch";
import SearchResultList from "./SearchResultList";
import SearchForm from "@/components/shared/SearchForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

// 定数定義
const STEP_COLORS = {
  PRIMARY: "#71717A",
  GRAY: "text-gray-400",
} as const;

const STEP_NUMBERS = {
  CURRENT: 3,
  TOTAL: 3,
} as const;

const DISABLED_REASONS: GqlParticipationStatusReason[] = [
  GqlParticipationStatusReason.ReservationAccepted,
  GqlParticipationStatusReason.PersonalRecord,
];

// ソートロジックを関数として分離
const sortMembersByParticipation = (
  members: { user: GqlUser & { didInfo?: GqlDidIssuanceRequest | undefined } }[],
  participatedUsers: Array<{ userId: string; slotId: string; isCreatedByUser: boolean; reason?: GqlParticipationStatusReason }>,
  selectedSlotId: string | undefined,
) => {
  return [...members].sort((a, b) => {
    const aParticipated = participatedUsers.find(
      (u) => u.userId === a.user.id && u.slotId === selectedSlotId,
    );
    const bParticipated = participatedUsers.find(
      (u) => u.userId === b.user.id && u.slotId === selectedSlotId,
    );

    // 選択可能性を判定する関数
    const isSelectable = (user: GqlUser & { didInfo?: GqlDidIssuanceRequest | undefined }, participated?: { reason?: GqlParticipationStatusReason }) => {
      const hasDid = !!user.didInfo?.didValue;
      const isDisabled = participated?.reason && DISABLED_REASONS.includes(participated.reason);
      return hasDid && !isDisabled;
    };

    const aIsSelectable = isSelectable(a.user, aParticipated);
    const bIsSelectable = isSelectable(b.user, bParticipated);

    // 1. 選択できるユーザーを上に、選択できないユーザーを下に
    if (aIsSelectable && !bIsSelectable) return -1;
    if (!aIsSelectable && bIsSelectable) return 1;

    // 2. 選択可能なユーザー内での優先順位
    if (aIsSelectable && bIsSelectable) {
      // 2-1. isCreatedByUserがtrueのユーザーを最優先
      if (aParticipated?.isCreatedByUser && !bParticipated?.isCreatedByUser) return -1;
      if (!aParticipated?.isCreatedByUser && bParticipated?.isCreatedByUser) return 1;

      // 2-2. 参加済みユーザーを上に
      const aIsParticipated = !!aParticipated;
      const bIsParticipated = !!bParticipated;
      if (aIsParticipated && !bIsParticipated) return -1;
      if (!aIsParticipated && bIsParticipated) return 1;
    }

    // 3. 選択不可能なユーザー内での優先順位
    if (!aIsSelectable && !bIsSelectable) {
      // 3-1. DIDがあるユーザーを上に
      const aHasDid = !!a.user.didInfo?.didValue;
      const bHasDid = !!b.user.didInfo?.didValue;
      if (aHasDid && !bHasDid) return -1;
      if (!aHasDid && bHasDid) return 1;
    }

    // 4. それ以外は順不同
    return 0;
  });
};

interface CredentialRecipientSelectorProps {
  setStep: (step: number) => void;
  initialConnection: GqlMembershipsConnection | null;
}

export default function CredentialRecipientSelector({
  setStep,
  initialConnection,
}: CredentialRecipientSelectorProps) {
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
  const { selectedSlot, setSelectedSlot, participatedUsers } = useSelection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useAppRouter();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const selectedUserIds = selectedSlot?.userIds ?? [];

  const { save } = useEvaluationBulkCreate({
    onSuccess: () => {
      router.push("/admin/credentials");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const [createParticipation] = useParticipationBulkCreateMutation({
    onCompleted: (response) => {
      save(response?.participationBulkCreate?.participations ?? [], communityId);
      toast.success("登録が完了しました");
    },
    onError: (error) => {
      logger.warn("登録に失敗しました", {
        error: error.message,
      });
      toast.error("登録に失敗しました");
    },
  });

  const headerConfig = useMemo(
    () => ({
      title: "証明書発行",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const getParticipatedReason = (userId: string) =>
    participatedUsers.find((u) => u.userId === userId && u.slotId === selectedSlot?.slotId)?.reason;

  const allMembers = useMemo(() => {
    if (!initialConnection?.edges) return [];
    return initialConnection.edges.flatMap((edge) =>
      edge?.node?.user ? [{ user: edge.node.user }] : []
    );
  }, [initialConnection]);
  const {
    data: searchMembershipData,
    loading,
    error,
    hasNextPage,
    isLoadingMore,
    handleFetchMore,
    loadMoreRef,
  } = useMemberWithDidSearch(communityId, allMembers, {
    searchQuery,
    enablePagination: true,
    pageSize: 20,
    initialConnection,
  });


  // 並び替え用の配列を作成
  const sortedMembers = useMemo(() => {
    return sortMembersByParticipation(
      searchMembershipData.map((user) => ({ user })),
      participatedUsers,
      selectedSlot?.slotId,
    );
  }, [searchMembershipData, participatedUsers, selectedSlot?.slotId]);
  const formattedMembers = sortedMembers.map(({ user }) => user);

  if (!selectedSlot) {
    return <div>開催枠が設定されていません</div>;
  }

  const handleCheck = (userId: string) => {
    setSelectedSlot((prev) =>
      prev
        ? {
            ...prev,
            userIds: prev.userIds.includes(userId)
              ? prev.userIds.filter((id) => id !== userId)
              : [...prev.userIds, userId],
          }
        : null,
    );
  };

  const handleConfirm = async () => {
    if (selectedUserIds.length > 0 && selectedSlot) {
      try {
        setIsSubmitting(true);
        await createParticipation({
          variables: {
            input: {
              userIds: selectedSlot.userIds,
              slotId: selectedSlot.slotId,
            },
            permission: { communityId },
          },
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading && !searchQuery && !isLoadingMore ) return <LoadingIndicator fullScreen={true} />;

  return (
    <>
      <div className="flex items-end gap-2 mt-2">
        <h1 className="text-2xl font-bold">発行先を選ぶ</h1>
        <span className="ml-1 flex mb-1 items-baseline">
          <span className={`${STEP_COLORS.GRAY} text-base`}>(</span>
          <span className="text-xl font-bold ml-1" style={{ color: STEP_COLORS.PRIMARY }}>
            {STEP_NUMBERS.CURRENT}
          </span>
          <span className={`${STEP_COLORS.GRAY} text-base`}>/</span>
          <span className={`${STEP_COLORS.GRAY} text-base mr-1`}>{STEP_NUMBERS.TOTAL}</span>
          <span className={`${STEP_COLORS.GRAY} text-base`}>)</span>
        </span>
      </div>
      <div className="mb-4 pt-4">
        <SearchForm
          value={input}
          onInputChange={setInput}
          onSearch={setSearchQuery}
          placeholder="名前・DIDで検索"
        />
      </div>
      <div className="flex flex-col gap-4">
        <SearchResultList
          searchQuery={searchQuery}
          searchMembershipData={formattedMembers}
          selectedUserIds={selectedUserIds}
          handleCheck={handleCheck}
          getParticipatedReason={getParticipatedReason}
          DISABLED_REASONS={DISABLED_REASONS}
          hasNextPage={hasNextPage}
          isLoadingMore={isLoadingMore}
          onLoadMore={handleFetchMore}
          loadMoreRef={loadMoreRef}
        />
        <div className="fixed bottom-0 left-0 w-full bg-white z-10">
          <div className="w-full max-w-sm mx-auto flex justify-between px-4 py-4 border-t">
            <Button
              variant="text"
              className="text-gray-500"
              onClick={() => {
                router.push("/admin/credentials");
              }}
            >
              キャンセル
            </Button>
            <Button
              className={`rounded-full px-8 py-2 font-bold text-white ${
                selectedUserIds.length > 0 && !isSubmitting
                  ? "bg-primary"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              size="lg"
              disabled={selectedUserIds.length === 0 || isSubmitting}
              onClick={() => {
                if (selectedUserIds.length > 0) {
                  handleConfirm();
                }
              }}
            >
              {isSubmitting ? "発行中..." : "発行"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
