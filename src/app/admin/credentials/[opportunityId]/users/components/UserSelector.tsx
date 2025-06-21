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
import { useReservationCommand } from "@/app/reservation/confirm/hooks/useReservationAction";
import { useSelection } from "../../../context/SelectionContext";
import { useEvaluartionBulkCreate } from "../../../hooks/useEvaluartionBulkCreate";
import { useAttendanceState } from "../../../../reservations/hooks/attendance/useAttendanceState";

export default function UserSelector() {
  const communityId = COMMUNITY_ID;
  const { user: currentUser } = useAuth();
  const { selectedDate } = useSelection();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { handleReservation, creatingReservation } = useReservationCommand();
  const [participations, setParticipations] = useState<any[]>([]); // 型は適宜修正
  const [createParticipation, { loading }] = useParticipationBulkCreateMutation({
    onCompleted: (response) => {
      console.log(response);
      setParticipations(response?.participationBulkCreate?.participations ?? []);
      toast.success("参加者を追加しました");
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });

  const { save, loading: evaluationLoading } = useEvaluartionBulkCreate({
    onSuccess: (res) => {
      console.log("res", res);
      toast.success("出欠情報を保存しました");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { attendanceData } = useAttendanceState(participations);

  const handleCheck = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleConfirm = async () => {
    console.log(selectedUserId, selectedDate);
    if (selectedUserId && selectedDate) {
      const { data } = await createParticipation({
        variables: {
          input: {
            userIds: [selectedUserId],
            slotId: selectedDate ?? "",
          },
          permission: {
            communityId: communityId,
          },
        },
      });
    }
  };

  useEffect(() => {
    if (participations.length > 0 && attendanceData) {
      save(participations, communityId, attendanceData);
    }
  }, [attendanceData]);

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

  useEffect(() => {
    void fetchMembershipList({ variables: { first: 50 } });
  }, [fetchMembershipList]);

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(() => {})} className="px-4 mb-4 pt-6">
        <SearchForm name="searchQuery" />
      </form>

      <div className="flex flex-col gap-4 px-4">
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
              checked={selectedUserId === user.id}
                onCheck={() => handleCheck(user.id)}
              />

            </div>
          );
        })}
        {selectedUserId && (
          <Button variant="primary" className="w-1/2 py-4 mt-4 mx-auto" onClick={handleConfirm}>
            登録
          </Button>
        )}
      </div>
    </FormProvider>
  );
}
