import { graphql } from "@/gql";

export const ISSUE_COMMUNITY_POINT = graphql(`
    mutation transactionIssueCommunityPoint($input: TransactionIssueCommunityPointInput!) {
        transactionIssueCommunityPoint(input: $input) {
            ...on TransactionIssueCommunityPointSuccess {
                transaction {
                    id
                    reason
                    toPointChange
                    toWallet {
                        id
                        currentPointView {
                            currentPoint
                        }
                    }
                }
            }
        }
    }
`);

export const GRANT_COMMUNITY_POINT = graphql(`
    mutation transactionGrantCommunityPoint($input: TransactionGrantCommunityPointInput!) {
        transactionGrantCommunityPoint(input: $input) {
            ...on TransactionGrantCommunityPointSuccess {
                transaction {
                    id
                    reason
                    fromPointChange
                    fromWallet {
                        id
                        currentPointView {
                            currentPoint
                        }
                    }
                    toPointChange
                    toWallet {
                        id
                        user {
                            id
                            name
                            image
                        }
                        currentPointView {
                            currentPoint
                        }
                    }
                }
            }
        }
    }
`);

export const DONATE_SELF_POINT = graphql(`
    mutation transactionDonateSelfPoint($input: TransactionDonateSelfPointInput!) {
        transactionDonateSelfPoint(input: $input) {
            ...on TransactionDonateSelfPointSuccess {
                transaction {
                    id
                    reason
                    fromPointChange
                    fromWallet {
                        id
                        user {
                            id
                            name
                            image
                        }
                        community {
                            id
                            name
                            image
                        }
                        currentPointView {
                            currentPoint
                        }
                    }
                    toPointChange
                    toWallet {
                        id
                        user {
                            id
                            name
                            image
                        }
                        community {
                            id
                            name
                            image
                        }
                        currentPointView {
                            currentPoint
                        }
                    }
                }
            }
        }
    }
`);
