import React from "react";
import { Button } from "@/app/components/ui/button";
import { useMembershipActions } from "@/app/memberships/button/useMembershipAction";
import { handleMembershipAction } from "@/app/memberships/button/handleMembershipAction";
import { MembershipStatus } from "@/gql/graphql";

type MembershipStatusProps = {
  membership: {
    status: MembershipStatus | null | undefined;
    user: { id: string };
  };
  communityId: string;
};

export const MembershipStatusActions: React.FC<MembershipStatusProps> = ({
                                                                           membership,
                                                                           communityId,
                                                                         }) => {
  const actions = useMembershipActions();

  if (!membership.status) {
    return null; // status が存在しない場合、何も表示しない
  }

  return (
    <div className="flex flex-col gap-2">
      {membership.status === "INVITED" && (
        <>
          <Button
            onClick={() =>
              handleMembershipAction(actions.approveInvitation, {
                input: { communityId},
              })
            }
            variant="default"
          >
            招待承認
          </Button>
          <Button
            onClick={() =>
              handleMembershipAction(actions.denyInvitation, {
                input: { communityId},
              })
            }
            variant="destructive"
          >
            招待拒否
          </Button>
        </>
      )}
      {membership.status === "CANCELED" && (
        <Button
          onClick={() =>
            handleMembershipAction(actions.invite, {
              input: { communityId, userId: membership.user.id },
            })
          }
          variant="ghost"
        >
          再招待
        </Button>
      )}
    </div>
  );
};
