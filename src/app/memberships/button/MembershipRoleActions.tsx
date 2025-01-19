import React from "react";
import { Button } from "@/app/components/ui/button";
import { useMembershipActions } from "@/app/memberships/button/useMembershipAction";
import { handleMembershipAction } from "@/app/memberships/button/handleMembershipAction";

type MembershipRoleProps = {
  membership: {
    user: { id: string };
  };
  communityId: string;
};

export const MembershipRoleActions: React.FC<MembershipRoleProps> = ({
                                                                       membership,
                                                                       communityId,
                                                                     }) => {
  const actions = useMembershipActions();

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          handleMembershipAction(actions.assignMemberRole, {
            input: { communityId, userId: membership.user.id },
          })
        }
        variant="default"
      >
        メンバーに設定
      </Button>
      <Button
        onClick={() =>
          handleMembershipAction(actions.assignManager, {
            input: { communityId, userId: membership.user.id },
          })
        }
        variant="default"
      >
        マネージャーに設定
      </Button>
      <Button
        onClick={() =>
          handleMembershipAction(actions.assignOwner, {
            input: { communityId, userId: membership.user.id },
          })
        }
        variant="default"
      >
        オーナーに設定
      </Button>
    </div>
  );
};
