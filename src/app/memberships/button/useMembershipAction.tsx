import { useMutation } from "@apollo/client";
import {
  MEMBERSHIP_INVITE,
  MEMBERSHIP_CANCEL_INVITATION,
  MEMBERSHIP_APPROVE_INVITATION,
  MEMBERSHIP_DENY_INVITATION,
  MEMBERSHIP_SELF_JOIN,
  MEMBERSHIP_WITHDRAW,
  MEMBERSHIP_ASSIGN_OWNER,
  MEMBERSHIP_ASSIGN_MANAGER,
  MEMBERSHIP_ASSIGN_MEMBER_ROLE,
  MEMBERSHIP_REMOVE,
} from "@/graphql/mutations/membership";

export const useMembershipActions = () => {
  const [invite] = useMutation(MEMBERSHIP_INVITE);
  const [cancelInvitation] = useMutation(MEMBERSHIP_CANCEL_INVITATION);
  const [approveInvitation] = useMutation(MEMBERSHIP_APPROVE_INVITATION);
  const [denyInvitation] = useMutation(MEMBERSHIP_DENY_INVITATION);
  const [selfJoin] = useMutation(MEMBERSHIP_SELF_JOIN);
  const [withdraw] = useMutation(MEMBERSHIP_WITHDRAW);
  const [assignOwner] = useMutation(MEMBERSHIP_ASSIGN_OWNER);
  const [assignManager] = useMutation(MEMBERSHIP_ASSIGN_MANAGER);
  const [assignMemberRole] = useMutation(MEMBERSHIP_ASSIGN_MEMBER_ROLE);
  const [remove] = useMutation(MEMBERSHIP_REMOVE);

  return {
    invite,
    cancelInvitation,
    approveInvitation,
    denyInvitation,
    selfJoin,
    withdraw,
    assignOwner,
    assignManager,
    assignMemberRole,
    remove,
  };
};
