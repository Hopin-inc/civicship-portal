import { graphql } from "@/gql";

export const GET_PARTICIPATIONS = graphql(`
    query participations($filter: ParticipationFilterInput, $sort: ParticipationSortInput, $cursor: String, $first: Int) {
        participations(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
            edges {
                node {
                    id
                    status
                    user {
                        id
                        name
                    }
                    opportunity {
                        id
                        title
                        description
                        category
                        requireApproval
                        pointsPerParticipation
                        publishStatus
                        startsAt
                        endsAt
                        createdByUser {
                            id
                            name
                        }
                        community {
                            id
                            name
                            city {
                                code
                                name
                                state {
                                    code
                                    name
                                }
                            }
                            wallets {
                                id
                                user {
                                    id
                                    name
                                }
                                currentPointView {
                                    walletId
                                    currentPoint
                                }
                            }
                        }
                        city {
                            code
                            name
                            state {
                                code
                                name
                            }
                        }
                    }
                    statusHistories {
                        id
                        status
                        createdByUser {
                            id
                            name
                        }
                        participation {
                            id
                            status
                        }
                    }
                    transactions {
                        id
                        reason
                        fromWallet {
                            id
                            user {
                                id
                                name
                            }
                        }
                        toWallet {
                            id
                            user {
                                id
                                name
                            }
                        }
                        fromPointChange
                        toPointChange
                        createdAt
                    }
                }
            }
            pageInfo {
                endCursor
                hasNextPage
            }
        }
    }
`);

export const GET_PARTICIPATION = graphql(`
    query participation($id: ID!) {
        participation(id: $id) {
            id
            status
            user {
                id
                name
            }
            opportunity {
                id
                title
                description
                category
                requireApproval
                pointsPerParticipation
                publishStatus
                startsAt
                endsAt
                createdByUser {
                    id
                    name
                }
                community {
                    id
                    name
                    city {
                        code
                        name
                        state {
                            code
                            name
                        }
                    }
                    wallets {
                        id
                        user {
                            id
                            name
                        }
                        currentPointView {
                            walletId
                            currentPoint
                        }
                    }
                }
                city {
                    code
                    name
                    state {
                        code
                        name
                    }
                }
                participations {
                    id
                    user {
                        id
                        name
                    }
                }
            }
            statusHistories {
                id
                status
                createdByUser {
                    id
                    name
                }
                participation {
                    id
                    status
                }
            }
            transactions {
                id
                reason
                fromWallet {
                    id
                    user {
                        id
                        name
                    }
                }
                toWallet {
                    id
                    user {
                        id
                        name
                    }
                }
                fromPointChange
                toPointChange
                createdAt
            }
        }
    }
`);
