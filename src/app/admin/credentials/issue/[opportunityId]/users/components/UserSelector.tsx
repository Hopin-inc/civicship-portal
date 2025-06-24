"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlRole, GqlUser, useParticipationBulkCreateMutation } from "@/types/graphql";
import { toast } from "sonner";
import { MemberRow } from "./Member";
import { useMembershipQueries } from "@/app/admin/members/hooks/useMembershipQueries";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { FormProvider } from "react-hook-form";
import SearchForm from "@/app/search/components/SearchForm";
import { useMemberSearch } from "@/app/admin/wallet/grant/hooks/useMemberSearch";
import { Button } from "@/components/ui/button";
import { useSelection } from "../../../../context/SelectionContext";
import { useEvaluartionBulkCreate } from "../../../../hooks/useEvaluartionBulkCreate";

export default function UserSelector() {
  const communityId = COMMUNITY_ID;
  const { user: currentUser } = useAuth();
  const { selectedSlots, setSelectedSlots } = useSelection();
  const [currentSlotIndex, setCurrentSlotIndex] = useState(0);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(selectedSlots[0]?.userIds ?? []);
  const [createParticipation] = useParticipationBulkCreateMutation({
    onCompleted: (response) => {
      save(response?.participationBulkCreate?.participations ?? [], communityId);
      toast.success("参加者を追加しました");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const { save } = useEvaluartionBulkCreate({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const currentSlot = selectedSlots[currentSlotIndex];

  const handleCheck = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
    setSelectedSlots(prev =>
      prev.map((slot, idx) =>
        idx === currentSlotIndex
          ? {
              ...slot,
              userIds: slot.userIds.includes(userId)
                ? slot.userIds.filter(id => id !== userId)
                : [...slot.userIds, userId],
            }
          : slot
      )
    );
  };

  const handleConfirm = async () => {
    if (selectedUserIds.length > 0 && selectedSlots.length > 0) {
      const slot = selectedSlots[currentSlotIndex];
      await createParticipation({
        variables: {
          input: {
            userIds: slot.userIds,
            slotId: slot.slotId,
          },
          permission: { communityId },
        },
      });
      if (currentSlotIndex < selectedSlots.length - 1) {
        setCurrentSlotIndex(currentSlotIndex + 1);
        setSelectedUserIds(selectedSlots[currentSlotIndex + 1]?.userIds ?? []);
      } else {
        alert("選択完了");
        // 必要に応じて画面遷移やリセット処理を追加
      }
    }
  };

  const currentUserRole = currentUser?.memberships?.find(
    (m) => m.community?.id === communityId,
  )?.role;

  const headerConfig = useMemo(
    () => ({
      title: "参加者選択",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { fetchMembershipList, membershipListData } = useMembershipQueries();

  const members = useMemo(() => {
    return (
      membershipListData?.memberships?.edges
        ?.map((edge) => {
          const user = edge?.node?.user;
          const role = edge?.node?.role;
          return user && role ? { user, role } : null;
        })
        .filter((member): member is { user: GqlUser; role: GqlRole } => member !== null) ?? []
    );
  }, [membershipListData]);

  const { form, filteredMembers } = useMemberSearch(
    members
      .map(({ user }) => (user ? { user } : null))
      .filter((m): m is { user: GqlUser } => m !== null),
  );

  console.log(filteredMembers);

  useEffect(() => {
    void fetchMembershipList({ variables: { first: 50 } });
  }, [fetchMembershipList]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="px-4 mb-4 pt-6">
        <SearchForm name="searchQuery" />
      </form>

      <div className="flex flex-col gap-4 px-4">
        <h1 className="text-2xl font-bold mb-2">参加者選択（{currentSlotIndex + 1}/{selectedSlots.length}）</h1>
        {filteredMembers.length === 0 && (
          <p className="text-sm text-muted-foreground">一致するメンバーが見つかりません</p>
        )}

        {filteredMembers.map(({ user }) => {
          const membership = members.find((m) => m?.user.id === user.id);
          if (!membership) return null;

          return (
            <div key={user.id} className="flex flex-col gap-4">
              <MemberRow
                user={user}
                role={membership.role}
                currentUserRole={currentUserRole}
                onRoleChange={(newRole) => {
                  if (currentUserRole !== GqlRole.Owner) {
                    toast.error("この操作を行う権限がありません");
                    return;
                  }
                }}
                checked={selectedUserIds.includes(user.id)}
                onCheck={() => handleCheck(user.id)}
              />

            </div>
          );
        })}
        {selectedUserIds.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-between px-6 py-4 z-10">
          <Button
            variant="secondary"
            className="text-gray-500 font-bold"
            onClick={() => {
              setSelectedSlots([]);
              // router.push("/admin/credentials");
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
        )}
      </div>
    </FormProvider>
  );
}
