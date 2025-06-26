import React, { useEffect, useMemo, useState } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlUser, useParticipationBulkCreateMutation, GqlParticipationStatusReason } from "@/types/graphql";
import { toast } from "sonner";
import { MemberRow } from "./Member";
import { useMembershipQueries } from "@/app/admin/members/hooks/useMembershipQueries";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { FormProvider } from "react-hook-form";
import { useMemberSearch } from "@/app/admin/wallet/grant/hooks/useMemberSearch";
import { Button } from "@/components/ui/button";
import { useSelection } from "../context/SelectionContext";
import { useEvaluartionBulkCreate } from "../hooks/useEvaluartionBulkCreate";
import { useRouter } from "next/navigation";
import Loading from "@/components/layout/Loading";
import SearchForm from "./SearchForm";
import { logger } from "@/lib/logging";

export default function UserSelector() {
  const communityId = COMMUNITY_ID;
  const { selectedSlot, setSelectedSlot, participatedUsers } = useSelection();
  const router = useRouter();
  const { fetchMembershipList, membershipListData } = useMembershipQueries();
  const { form, singleMembershipData, loading, error } = useMemberSearch();
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(selectedSlot?.userIds ?? []);

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

  const { save } = useEvaluartionBulkCreate({
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

  const DISABLED_REASONS: GqlParticipationStatusReason[] = [
    GqlParticipationStatusReason.ReservationAccepted,
    GqlParticipationStatusReason.PersonalRecord,
  ];

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

  useEffect(() => {
    void fetchMembershipList({ variables: { first: 50 } });
  }, [fetchMembershipList]);

  if (!selectedSlot) {
    return <div>スロットが選択されていません</div>;
  }

  const handleCheck = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
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

  // 並び替え用の配列を作成
  const sortedMembers = [...members].sort((a, b) => {
    const aParticipated = participatedUsers.find(
      (u) => u.userId === a.user.id && u.slotId === selectedSlot?.slotId
    );
    const bParticipated = participatedUsers.find(
      (u) => u.userId === b.user.id && u.slotId === selectedSlot?.slotId
    );
    // isCreatedByUserがtrueのユーザーを最優先で上に
    if (aParticipated?.isCreatedByUser && !bParticipated?.isCreatedByUser) return -1;
    if (!aParticipated?.isCreatedByUser && bParticipated?.isCreatedByUser) return 1;
    // 以降は従来の並び替え
    const aIsParticipated = !!aParticipated;
    const bIsParticipated = !!bParticipated;
    if (aIsParticipated && !bIsParticipated) return -1;
    if (!aIsParticipated && bIsParticipated) return 1;
    return 0;
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <FormProvider {...form}>
      <div className="flex items-end gap-2 mt-2">
        <h1 className="text-2xl font-bold">発行先を選ぶ</h1>
        <span className="ml-1 flex items-end mb-1">
          <span className="text-gray-400 text-base">(</span>
          <span className="text-lg font-bold text-[#71717A] mx-1">3</span>
          <span className="text-gray-400 text-base">/3</span>
          <span className="text-gray-400 text-base">)</span>
        </span>
      </div>
      <form onSubmit={form.handleSubmit(() => {})} className="px-4 mb-4 pt-4">
        <SearchForm name="searchQuery" />
      </form>

      <div className="flex flex-col gap-4 px-4">
        {form.watch("searchQuery") && singleMembershipData?.membershipByName?.user ? (
          <MemberRow
            user={singleMembershipData.membershipByName.user}
            checked={selectedUserIds.includes(singleMembershipData.membershipByName.user?.id ?? "")}
            onCheck={() => singleMembershipData.membershipByName?.user?.id && handleCheck(singleMembershipData.membershipByName.user.id)}
            isDisabled={getParticipatedReason(singleMembershipData.membershipByName.user?.id ?? "") !== undefined && DISABLED_REASONS.includes(getParticipatedReason(singleMembershipData.membershipByName.user?.id ?? "") as GqlParticipationStatusReason)}
            reason={getParticipatedReason(singleMembershipData.membershipByName.user?.id ?? "")}
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
        <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-between px-6 py-4 z-10">
          <Button
            variant="text"
            className="text-gray-500"
            onClick={() => {
              setSelectedSlot(null);
              router.push("/admin/credentials");
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
    </FormProvider>
  );
} 