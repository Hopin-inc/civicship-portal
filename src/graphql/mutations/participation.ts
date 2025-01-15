import { graphql } from "@/gql";

export const PARTICIPATION_INVITE = graphql(`
    mutation participationInvite($id: ID!, $input: ParticipationInviteInput!) {
        participationInvite(id: $id, input: $input) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_CANCEL_INVITATION = graphql(`
    mutation participationCancelInvitation($id: ID!) {
        participationCancelInvitation(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_APPROVE_INVITATION = graphql(`
    mutation participationApproveInvitation($id: ID!) {
        participationApproveInvitation(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_DENY_INVITATION = graphql(`
    mutation participationDenyInvitation($id: ID!) {
        participationDenyInvitation(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_APPLY = graphql(`
    mutation participationApply($input: ParticipationApplyInput!) {
        participationApply(input: $input) {
            ...on ParticipationApplySuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_CANCEL_APPLICATION = graphql(`
    mutation participationCancelApplication($id: ID!) {
        participationCancelApplication(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_APPROVE_APPLICATION = graphql(`
    mutation participationApproveApplication($id: ID!) {
        participationApproveApplication(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_DENY_APPLICATION = graphql(`
    mutation participationDenyApplication($id: ID!) {
        participationDenyApplication(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_APPROVE_PERFORMANCE = graphql(`
    mutation participationApprovePerformance($id: ID!) {
        participationApprovePerformance(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);

export const PARTICIPATION_DENY_PERFORMANCE = graphql(`
    mutation participationDenyPerformance($id: ID!) {
        participationDenyPerformance(id: $id) {
            ...on ParticipationSetStatusSuccess {
                participation {
                    id
                    status
                }
            }
        }
    }
`);