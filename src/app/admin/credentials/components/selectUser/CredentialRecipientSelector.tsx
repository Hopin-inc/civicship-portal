import React, { useMemo, useState } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GqlDidIssuanceRequest,
  GqlParticipationStatusReason,
  GqlUser,
  useParticipationBulkCreateMutation,
} from "@/types/graphql";
import { toast } from "sonner";
import { useMembershipQueries } from "@/app/admin/members/hooks/useMembershipQueries";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { Button } from "@/components/ui/button";
import { useSelection } from "../../context/SelectionContext";
import { useEvaluationBulkCreate } from "../../hooks/useEvaluationBulkCreate";
import { useRouter } from "next/navigation";
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
  participatedUsers: Array<{ userId: string; slotId: string; isCreatedByUser: boolean }>,
  selectedSlotId: string | undefined,
) => {
  return [...members].sort((a, b) => {
    const aParticipated = participatedUsers.find(
      (u) => u.userId === a.user.id && u.slotId === selectedSlotId,
    );
    const bParticipated = participatedUsers.find(
      (u) => u.userId === b.user.id && u.slotId === selectedSlotId,
    );

    // 1. isCreatedByUserがtrueのユーザーを最優先
    if (aParticipated?.isCreatedByUser && !bParticipated?.isCreatedByUser) return -1;
    if (!aParticipated?.isCreatedByUser && bParticipated?.isCreatedByUser) return 1;

    // 2. 参加済みユーザーを上に
    const aIsParticipated = !!aParticipated;
    const bIsParticipated = !!bParticipated;
    if (aIsParticipated && !bIsParticipated) return -1;
    if (!aIsParticipated && bIsParticipated) return 1;

    // 3. didデータがある人を上に
    const aHasDid = !!a.user.didInfo?.didValue;
    const bHasDid = !!b.user.didInfo?.didValue;
    if (aHasDid && !bHasDid) return -1;
    if (!aHasDid && bHasDid) return 1;

    // 4. それ以外は順不同
    return 0;
  });
};

export default function CredentialRecipientSelector({
  setStep,
}: {
  setStep: (step: number) => void;
}) {
  const communityId = COMMUNITY_ID;
  const { selectedSlot, setSelectedSlot, participatedUsers } = useSelection();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const {
    membershipListData,
    refetch,
    loading: membershipLoading,
  } = useMembershipQueries(communityId);
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
      logger.error("登録に失敗しました", {
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
    return (
      membershipListData?.memberships?.edges
        ?.map((edge) => {
          const user = edge?.node?.user;
          return user ? { user } : null;
        })
        .filter((member): member is { user: GqlUser } => member !== null) ?? []
    );
  }, [membershipListData]);
  const {
    data: searchMembershipData,
    loading,
    error,
  } = useMemberWithDidSearch(communityId, allMembers, { searchQuery });

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

  if (loading || membershipLoading) return <LoadingIndicator fullScreen={true} />;

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
      <div className="px-4 mb-4 pt-4">
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
