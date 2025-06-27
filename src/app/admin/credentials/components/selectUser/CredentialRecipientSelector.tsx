import React, { useEffect, useMemo } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlUser, useParticipationBulkCreateMutation, GqlParticipationStatusReason } from "@/types/graphql";
import { toast } from "sonner";
import { useMembershipQueries } from "@/app/admin/members/hooks/useMembershipQueries";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { FormProvider } from "react-hook-form";
import { useMemberSearch } from "@/app/admin/wallet/grant/hooks/useMemberSearch";
import { Button } from "@/components/ui/button";
import { useSelection } from "../../context/SelectionContext";
import { useEvaluationBulkCreate } from "../../hooks/useEvaluationBulkCreate";
import { useRouter } from "next/navigation";
import Loading from "@/components/layout/Loading";
import { logger } from "@/lib/logging";
import SearchForm from "./SearchForm";
import { MemberRow } from "./Member";

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
  members: { user: GqlUser }[],
  participatedUsers: Array<{ userId: string; slotId: string; isCreatedByUser: boolean }>,
  selectedSlotId: string | undefined
) => {
  return [...members].sort((a, b) => {
    const aParticipated = participatedUsers.find(
      (u) => u.userId === a.user.id && u.slotId === selectedSlotId
    );
    const bParticipated = participatedUsers.find(
      (u) => u.userId === b.user.id && u.slotId === selectedSlotId
    );

    // isCreatedByUserがtrueのユーザーを最優先で上に
    if (aParticipated?.isCreatedByUser && !bParticipated?.isCreatedByUser) return -1;
    if (!aParticipated?.isCreatedByUser && bParticipated?.isCreatedByUser) return 1;

    // 参加済みユーザーを上に
    const aIsParticipated = !!aParticipated;
    const bIsParticipated = !!bParticipated;
    if (aIsParticipated && !bIsParticipated) return -1;
    if (!aIsParticipated && bIsParticipated) return 1;

    return 0;
  });
};

export default function CredentialRecipientSelector({ setStep }: { setStep: (step: number) => void }) {
  const communityId = COMMUNITY_ID;
  const { selectedSlot, setSelectedSlot, participatedUsers } = useSelection();
  const router = useRouter();
  const { fetchMembershipList, membershipListData } = useMembershipQueries();
  const { form, singleMembershipData, loading, error } = useMemberSearch();

  const selectedUserIds = selectedSlot?.userIds ?? [];

  const [createParticipation] = useParticipationBulkCreateMutation({
    onCompleted: (response) => {
      save(response?.participationBulkCreate?.participations ?? [], communityId);
      toast.success("登録が完了しました");
      router.push("/admin/credentials");
    },
    onError: (error) => {
      logger.error("登録に失敗しました", {
        error: error.message,
      });
      toast.error("登録に失敗しました");
    },
  });

  const { save } = useEvaluationBulkCreate({
    onError: (error) => {
      toast.error(error.message);
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
    participatedUsers.find(u => u.userId === userId && u.slotId === selectedSlot?.slotId)?.reason;

  const members = useMemo(() => {
    return (
      membershipListData?.memberships?.edges
        ?.map((edge) => {
          const user = edge?.node?.user;
          return user ? { user } : null;
        })
        .filter((member): member is { user: GqlUser } => member !== null) ?? []
    );
  }, [membershipListData]);

  // 並び替え用の配列を作成
  const sortedMembers = useMemo(() => {
    return sortMembersByParticipation(members, participatedUsers, selectedSlot?.slotId);
  }, [members, participatedUsers, selectedSlot?.slotId]);

  useEffect(() => {
    void fetchMembershipList({ variables: { first: 50 } });
  }, [fetchMembershipList]);

  if (!selectedSlot) {
    return <div>スロットが選択されていません</div>;
  }

  const handleCheck = (userId: string) => {
    setSelectedSlot(prev =>
      prev
        ? {
            ...prev,
            userIds: prev.userIds.includes(userId)
              ? prev.userIds.filter(id => id !== userId)
              : [...prev.userIds, userId],
          }
        : null
    );
  };

  const handleConfirm = async () => {
    if (selectedUserIds.length > 0 && selectedSlot) {
      await createParticipation({
        variables: {
          input: {
            userIds: selectedSlot.userIds,
            slotId: selectedSlot.slotId,
          },
          permission: { communityId },
        },
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FormProvider {...form}>
      <div className="flex items-end gap-2 mt-2">
        <h1 className="text-2xl font-bold">発行先を選ぶ</h1>
        <span className="ml-1 flex items-end mb-1">
          <span className={`${STEP_COLORS.GRAY} text-base`}>(</span>
          <span className={`text-lg font-bold mx-1`} style={{ color: STEP_COLORS.PRIMARY }}>{STEP_NUMBERS.CURRENT}</span>
          <span className={`${STEP_COLORS.GRAY} text-base`}>/</span>
          <span className={`${STEP_COLORS.GRAY} text-base`}>{STEP_NUMBERS.TOTAL}</span>
          <span className={`${STEP_COLORS.GRAY} text-base`}>)</span>
        </span>
      </div>
      <form onSubmit={form.handleSubmit(() => {})} className="px-4 mb-4 pt-4">
        <SearchForm name="searchQuery" />
      </form>

      <div className="flex flex-col gap-4 px-4">
        {form.watch("searchQuery") && singleMembershipData?.membership?.user ? (
          <MemberRow
            user={singleMembershipData.membership.user}
            checked={selectedUserIds.includes(singleMembershipData.membership.user?.id ?? "")}
            onCheck={() => singleMembershipData.membership?.user?.id && handleCheck(singleMembershipData.membership.user.id)}
            isDisabled={getParticipatedReason(singleMembershipData.membership?.user?.id ?? "") !== undefined && DISABLED_REASONS.includes(getParticipatedReason(singleMembershipData.membership?.user?.id ?? "") as GqlParticipationStatusReason)}
            reason={getParticipatedReason(singleMembershipData.membership?.user?.id ?? "")}
          />
        ) : (
          <>
            {sortedMembers.length === 0 && (
              <p className="text-sm text-muted-foreground">一致するメンバーが見つかりません</p>
            )}
            {sortedMembers.map(({ user }) => {
              const reason = getParticipatedReason(user.id);
              const isDisabled = reason !== undefined && DISABLED_REASONS.includes(reason as GqlParticipationStatusReason);

              return (
                <div key={user.id} className="flex flex-col gap-4">
                  <MemberRow
                    user={user}
                    checked={selectedUserIds.includes(user.id)}
                    onCheck={() => handleCheck(user.id)}
                    isDisabled={isDisabled}
                    reason={reason}
                  />
                </div>
              );
            })}
          </>
        )}
        <div className="fixed bottom-0 left-0 w-full bg-white z-10">
        <div className="w-full max-w-sm mx-auto flex justify-between px-4 py-4 border-t">
          <Button
            variant="text"
            className="text-gray-500"
            onClick={() => {
              setStep(2);
            }}
          >
            キャンセル
          </Button>
          <Button
            className={`rounded-full px-8 py-2 font-bold text-white ${selectedUserIds.length > 0 ? "bg-primary" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            disabled={selectedUserIds.length === 0}
            onClick={() => {
              if (selectedUserIds.length > 0) {
                handleConfirm();
              }
            }}
          >
            次へ
          </Button>
        </div>
      </div>
      </div>
    </FormProvider>
  );
} 