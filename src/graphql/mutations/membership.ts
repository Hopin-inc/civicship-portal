import { graphql } from "@/gql";

// Invite mutations
export const MEMBERSHIP_INVITE = graphql(`
    mutation membershipInvite($input: MembershipInviteInput!) {
        membershipInvite(input: $input) {
            ...on MembershipInviteSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                }
            }
        }
    }
`);

export const MEMBERSHIP_CANCEL_INVITATION = graphql(`
    mutation membershipCancelInvitation($input: MembershipCancelInvitationInput!) {
        membershipCancelInvitation(input: $input) {
            ...on MembershipSetInvitationStatusSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                    status
                }
            }
        }
    }
`);

export const MEMBERSHIP_APPROVE_INVITATION = graphql(`
    mutation membershipApproveInvitation($input: MembershipApproveInvitationInput!) {
        membershipApproveInvitation(input: $input) {
            ...on MembershipSetInvitationStatusSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                    status
                }
            }
        }
    }
`);

export const MEMBERSHIP_DENY_INVITATION = graphql(`
    mutation membershipDenyInvitation($input: MembershipDenyInvitationInput!) {
        membershipDenyInvitation(input: $input) {
            ...on MembershipSetInvitationStatusSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                    status
                }
            }
        }
    }
`);

// Join mutations
export const MEMBERSHIP_SELF_JOIN = graphql(`
    mutation membershipSelfJoin($input: MembershipSelfJoinInput!) {
        membershipSelfJoin(input: $input) {
            ...on MembershipSelfJoinSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                }
            }
        }
    }
`);

export const MEMBERSHIP_WITHDRAW = graphql(`
    mutation membershipWithdraw($input: MembershipWithdrawInput!) {
        membershipWithdraw(input: $input) {
            ...on MembershipWithdrawSuccess {
                userId
                communityId
            }
        }
    }
`);

// Role mutations
export const MEMBERSHIP_ASSIGN_OWNER = graphql(`
    mutation membershipAssignOwner($input: MembershipAssignOwnerInput!) {
        membershipAssignOwner(input: $input) {
            ...on MembershipSetRoleSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                }
            }
        }
    }
`);

export const MEMBERSHIP_ASSIGN_MANAGER = graphql(`
    mutation membershipAssignManager($input: MembershipAssignManagerInput!) {
        membershipAssignManager(input: $input) {
            ...on MembershipSetRoleSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                }
            }
        }
    }
`);

export const MEMBERSHIP_ASSIGN_MEMBER_ROLE = graphql(`
    mutation membershipAssignMemberRole($input: MembershipAssignMemberInput!) {
        membershipAssignMemberRole(input: $input) {
            ...on MembershipSetRoleSuccess {
                membership {
                    user {
                        id
                        name
                    }
                    community {
                        id
                        name
                    }
                    role
                }
            }
        }
    }
`);

export const MEMBERSHIP_REMOVE = graphql(`
    mutation membershipRemove($input: MembershipRemoveInput!) {
        membershipRemove(input: $input) {
            ...on MembershipRemoveSuccess {
                userId
                communityId
            }
        }
    }
`);
