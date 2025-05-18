import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  DateTime: { input: any; output: any };
  Datetime: { input: Date; output: Date };
  Decimal: { input: any; output: any };
  JSON: { input: any; output: any };
  Upload: { input: any; output: any };
};

export type GqlAccumulatedPointView = {
  __typename?: "AccumulatedPointView";
  accumulatedPoint: Scalars["Int"]["output"];
  walletId?: Maybe<Scalars["String"]["output"]>;
};

export type GqlAlreadyJoinedError = {
  __typename?: "AlreadyJoinedError";
  message: Scalars["String"]["output"];
};

export type GqlArticle = {
  __typename?: "Article";
  authors?: Maybe<Array<GqlUser>>;
  body?: Maybe<Scalars["String"]["output"]>;
  category: GqlArticleCategory;
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  introduction: Scalars["String"]["output"];
  opportunities?: Maybe<Array<GqlOpportunity>>;
  publishStatus: GqlPublishStatus;
  publishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  relatedUsers?: Maybe<Array<GqlUser>>;
  thumbnail?: Maybe<Scalars["JSON"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export const GqlArticleCategory = {
  ActivityReport: "ACTIVITY_REPORT",
  Interview: "INTERVIEW",
} as const;

export type GqlArticleCategory = (typeof GqlArticleCategory)[keyof typeof GqlArticleCategory];
export type GqlArticleEdge = GqlEdge & {
  __typename?: "ArticleEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlArticle>;
};

export type GqlArticleFilterInput = {
  and?: InputMaybe<Array<GqlArticleFilterInput>>;
  authors?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  categories?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  dateFrom?: InputMaybe<Scalars["Datetime"]["input"]>;
  dateTo?: InputMaybe<Scalars["Datetime"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<GqlArticleFilterInput>;
  or?: InputMaybe<Array<GqlArticleFilterInput>>;
  publishStatus?: InputMaybe<Array<GqlPublishStatus>>;
  relatedUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  stateCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlArticleSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  publishedAt?: InputMaybe<GqlSortDirection>;
  startsAt?: InputMaybe<GqlSortDirection>;
};

export type GqlArticlesConnection = {
  __typename?: "ArticlesConnection";
  edges?: Maybe<Array<Maybe<GqlArticleEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlAuthZDirectiveCompositeRulesInput = {
  and?: InputMaybe<Array<InputMaybe<GqlAuthZRules>>>;
  not?: InputMaybe<GqlAuthZRules>;
  or?: InputMaybe<Array<InputMaybe<GqlAuthZRules>>>;
};

export type GqlAuthZDirectiveDeepCompositeRulesInput = {
  and?: InputMaybe<Array<InputMaybe<GqlAuthZDirectiveDeepCompositeRulesInput>>>;
  id?: InputMaybe<GqlAuthZRules>;
  not?: InputMaybe<GqlAuthZDirectiveDeepCompositeRulesInput>;
  or?: InputMaybe<Array<InputMaybe<GqlAuthZDirectiveDeepCompositeRulesInput>>>;
};

export const GqlAuthZRules = {
  CanReadPhoneNumber: "CanReadPhoneNumber",
  IsAdmin: "IsAdmin",
  IsCommunityManager: "IsCommunityManager",
  IsCommunityMember: "IsCommunityMember",
  IsCommunityOwner: "IsCommunityOwner",
  IsOpportunityOwner: "IsOpportunityOwner",
  IsSelf: "IsSelf",
  IsUser: "IsUser",
} as const;

export type GqlAuthZRules = (typeof GqlAuthZRules)[keyof typeof GqlAuthZRules];
export type GqlAuthenticationError = {
  __typename?: "AuthenticationError";
  message: Scalars["String"]["output"];
};

export type GqlAuthorizationError = {
  __typename?: "AuthorizationError";
  message: Scalars["String"]["output"];
};

export type GqlCheckCommunityPermissionInput = {
  communityId: Scalars["ID"]["input"];
};

export type GqlCheckIsSelfPermissionInput = {
  userId: Scalars["ID"]["input"];
};

export type GqlCheckOpportunityPermissionInput = {
  communityId: Scalars["ID"]["input"];
  opportunityId: Scalars["ID"]["input"];
};

export type GqlCity = {
  __typename?: "City";
  code: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  state?: Maybe<GqlState>;
};

export const GqlClaimLinkStatus = {
  Claimed: "CLAIMED",
  Expired: "EXPIRED",
  Issued: "ISSUED",
} as const;

export type GqlClaimLinkStatus = (typeof GqlClaimLinkStatus)[keyof typeof GqlClaimLinkStatus];
export type GqlCommunitiesConnection = {
  __typename?: "CommunitiesConnection";
  edges?: Maybe<Array<GqlCommunityEdge>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlCommunity = {
  __typename?: "Community";
  articles?: Maybe<Array<GqlArticle>>;
  bio?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  establishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  memberships?: Maybe<Array<GqlMembership>>;
  name?: Maybe<Scalars["String"]["output"]>;
  opportunities?: Maybe<Array<GqlOpportunity>>;
  participations?: Maybe<Array<GqlParticipation>>;
  places?: Maybe<Array<GqlPlace>>;
  pointName?: Maybe<Scalars["String"]["output"]>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utilities?: Maybe<Array<GqlUtility>>;
  wallets?: Maybe<Array<GqlWallet>>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type GqlCommunityCreateInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<GqlImageInput>;
  name: Scalars["String"]["input"];
  places?: InputMaybe<Array<GqlNestedPlaceCreateInput>>;
  pointName: Scalars["String"]["input"];
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlCommunityCreatePayload = GqlCommunityCreateSuccess;

export type GqlCommunityCreateSuccess = {
  __typename?: "CommunityCreateSuccess";
  community: GqlCommunity;
};

export type GqlCommunityDeletePayload = GqlCommunityDeleteSuccess;

export type GqlCommunityDeleteSuccess = {
  __typename?: "CommunityDeleteSuccess";
  communityId: Scalars["String"]["output"];
};

export type GqlCommunityEdge = GqlEdge & {
  __typename?: "CommunityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlCommunity>;
};

export type GqlCommunityFilterInput = {
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  placeIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlCommunitySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlCommunityUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<GqlImageInput>;
  name: Scalars["String"]["input"];
  places: GqlNestedPlacesBulkUpdateInput;
  pointName: Scalars["String"]["input"];
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlCommunityUpdateProfilePayload = GqlCommunityUpdateProfileSuccess;

export type GqlCommunityUpdateProfileSuccess = {
  __typename?: "CommunityUpdateProfileSuccess";
  community: GqlCommunity;
};

export type GqlCurrentPointView = {
  __typename?: "CurrentPointView";
  currentPoint: Scalars["Int"]["output"];
  walletId?: Maybe<Scalars["String"]["output"]>;
};

export const GqlCurrentPrefecture = {
  Ehime: "EHIME",
  Kagawa: "KAGAWA",
  Kochi: "KOCHI",
  OutsideShikoku: "OUTSIDE_SHIKOKU",
  Tokushima: "TOKUSHIMA",
  Unknown: "UNKNOWN",
} as const;

export type GqlCurrentPrefecture = (typeof GqlCurrentPrefecture)[keyof typeof GqlCurrentPrefecture];
export type GqlCurrentUserPayload = {
  __typename?: "CurrentUserPayload";
  user?: Maybe<GqlUser>;
};

export type GqlDatabaseError = {
  __typename?: "DatabaseError";
  message: Scalars["String"]["output"];
};

export type GqlDateTimeRangeFilter = {
  gt?: InputMaybe<Scalars["Datetime"]["input"]>;
  gte?: InputMaybe<Scalars["Datetime"]["input"]>;
  lt?: InputMaybe<Scalars["Datetime"]["input"]>;
  lte?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type GqlEdge = {
  cursor: Scalars["String"]["output"];
};

export const GqlErrorCode = {
  AlreadyJoined: "ALREADY_JOINED",
  AlreadyUsedClaimLink: "ALREADY_USED_CLAIM_LINK",
  ClaimLinkExpired: "CLAIM_LINK_EXPIRED",
  Forbidden: "FORBIDDEN",
  InsuperableBalance: "INSUPERABLE_BALANCE",
  InternalServerError: "INTERNAL_SERVER_ERROR",
  InvalidEvaluationStatus: "INVALID_EVALUATION_STATUS",
  InvalidPlaceInput: "INVALID_PLACE_INPUT",
  InvalidPublishStatus: "INVALID_PUBLISH_STATUS",
  InvalidTransferMethod: "INVALID_TRANSFER_METHOD",
  MissingTicketIds: "MISSING_TICKET_IDS",
  MissingWalletInformation: "MISSING_WALLET_INFORMATION",
  NotFound: "NOT_FOUND",
  PersonalRecordOnlyDeletable: "PERSONAL_RECORD_ONLY_DELETABLE",
  RateLimit: "RATE_LIMIT",
  ReservationCancellationTimeout: "RESERVATION_CANCELLATION_TIMEOUT",
  ReservationFull: "RESERVATION_FULL",
  ReservationNotAccepted: "RESERVATION_NOT_ACCEPTED",
  SlotNotScheduled: "SLOT_NOT_SCHEDULED",
  TicketParticipantMismatch: "TICKET_PARTICIPANT_MISMATCH",
  Unauthenticated: "UNAUTHENTICATED",
  UnsupportedTransactionReason: "UNSUPPORTED_TRANSACTION_REASON",
  UserIdNotFound: "USER_ID_NOT_FOUND",
  ValidationError: "VALIDATION_ERROR",
} as const;

export type GqlErrorCode = (typeof GqlErrorCode)[keyof typeof GqlErrorCode];
export type GqlEvaluation = {
  __typename?: "Evaluation";
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  credentialUrl?: Maybe<Scalars["String"]["output"]>;
  evaluator?: Maybe<GqlUser>;
  histories?: Maybe<Array<GqlEvaluationHistory>>;
  id: Scalars["ID"]["output"];
  issuedAt?: Maybe<Scalars["Datetime"]["output"]>;
  participation?: Maybe<GqlParticipation>;
  status: GqlEvaluationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlEvaluationCreateInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  participationId: Scalars["ID"]["input"];
};

export type GqlEvaluationCreatePayload = GqlEvaluationCreateSuccess;

export type GqlEvaluationCreateSuccess = {
  __typename?: "EvaluationCreateSuccess";
  evaluation: GqlEvaluation;
};

export type GqlEvaluationEdge = GqlEdge & {
  __typename?: "EvaluationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlEvaluation>;
};

export type GqlEvaluationFilterInput = {
  evaluatorId?: InputMaybe<Scalars["ID"]["input"]>;
  participationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlEvaluationStatus>;
};

export type GqlEvaluationHistoriesConnection = {
  __typename?: "EvaluationHistoriesConnection";
  edges: Array<GqlEvaluationHistoryEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlEvaluationHistory = {
  __typename?: "EvaluationHistory";
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  evaluation?: Maybe<GqlEvaluation>;
  id: Scalars["ID"]["output"];
  status: GqlEvaluationStatus;
};

export type GqlEvaluationHistoryEdge = GqlEdge & {
  __typename?: "EvaluationHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlEvaluationHistory>;
};

export type GqlEvaluationHistoryFilterInput = {
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  evaluationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlEvaluationStatus>;
};

export type GqlEvaluationHistorySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlEvaluationSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  updatedAt?: InputMaybe<GqlSortDirection>;
};

export const GqlEvaluationStatus = {
  Failed: "FAILED",
  Passed: "PASSED",
  Pending: "PENDING",
} as const;

export type GqlEvaluationStatus = (typeof GqlEvaluationStatus)[keyof typeof GqlEvaluationStatus];
export type GqlEvaluationsConnection = {
  __typename?: "EvaluationsConnection";
  edges: Array<GqlEvaluationEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlIdentity = {
  __typename?: "Identity";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  platform?: Maybe<GqlIdentityPlatform>;
  uid: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<GqlUser>;
};

export const GqlIdentityPlatform = {
  Facebook: "FACEBOOK",
  Line: "LINE",
  Phone: "PHONE",
} as const;

export type GqlIdentityPlatform = (typeof GqlIdentityPlatform)[keyof typeof GqlIdentityPlatform];
export type GqlImageInput = {
  alt?: InputMaybe<Scalars["String"]["input"]>;
  caption?: InputMaybe<Scalars["String"]["input"]>;
  file: Scalars["Upload"]["input"];
};

export type GqlLinkPhoneAuthInput = {
  phoneUid: Scalars["String"]["input"];
};

export type GqlLinkPhoneAuthPayload = {
  __typename?: "LinkPhoneAuthPayload";
  success: Scalars["Boolean"]["output"];
  user?: Maybe<GqlUser>;
};

export type GqlMembership = {
  __typename?: "Membership";
  bio?: Maybe<Scalars["String"]["output"]>;
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  headline?: Maybe<Scalars["String"]["output"]>;
  histories?: Maybe<Array<GqlMembershipHistory>>;
  hostOpportunityCount?: Maybe<Scalars["Int"]["output"]>;
  participationView?: Maybe<GqlMembershipParticipationView>;
  reason: GqlMembershipStatusReason;
  role: GqlRole;
  status: GqlMembershipStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<GqlUser>;
};

export type GqlMembershipCursorInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type GqlMembershipEdge = GqlEdge & {
  __typename?: "MembershipEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlMembership>;
};

export type GqlMembershipFilterInput = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  role?: InputMaybe<GqlRole>;
  status?: InputMaybe<GqlMembershipStatus>;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlMembershipHistory = {
  __typename?: "MembershipHistory";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  id: Scalars["ID"]["output"];
  membership: GqlMembership;
  reason: GqlMembershipStatusReason;
  role: GqlRole;
  status: GqlMembershipStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlMembershipHostedMetrics = {
  __typename?: "MembershipHostedMetrics";
  geo: Array<GqlMembershipParticipationLocation>;
  totalParticipantCount: Scalars["Int"]["output"];
};

export type GqlMembershipInviteInput = {
  communityId: Scalars["ID"]["input"];
  role?: InputMaybe<GqlRole>;
  userId: Scalars["ID"]["input"];
};

export type GqlMembershipInvitePayload = GqlMembershipInviteSuccess;

export type GqlMembershipInviteSuccess = {
  __typename?: "MembershipInviteSuccess";
  membership: GqlMembership;
};

export type GqlMembershipParticipatedMetrics = {
  __typename?: "MembershipParticipatedMetrics";
  geo?: Maybe<Array<GqlMembershipParticipationLocation>>;
  totalParticipatedCount: Scalars["Int"]["output"];
};

export type GqlMembershipParticipationLocation = {
  __typename?: "MembershipParticipationLocation";
  address: Scalars["String"]["output"];
  latitude: Scalars["Decimal"]["output"];
  longitude: Scalars["Decimal"]["output"];
  placeId: Scalars["ID"]["output"];
  placeImage: Scalars["String"]["output"];
  placeName: Scalars["String"]["output"];
};

export type GqlMembershipParticipationView = {
  __typename?: "MembershipParticipationView";
  hosted: GqlMembershipHostedMetrics;
  participated?: Maybe<GqlMembershipParticipatedMetrics>;
};

export type GqlMembershipRemoveInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type GqlMembershipRemovePayload = GqlMembershipRemoveSuccess;

export type GqlMembershipRemoveSuccess = {
  __typename?: "MembershipRemoveSuccess";
  communityId: Scalars["ID"]["output"];
  userId: Scalars["ID"]["output"];
};

export type GqlMembershipSetInvitationStatusInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type GqlMembershipSetInvitationStatusPayload = GqlMembershipSetInvitationStatusSuccess;

export type GqlMembershipSetInvitationStatusSuccess = {
  __typename?: "MembershipSetInvitationStatusSuccess";
  membership: GqlMembership;
};

export type GqlMembershipSetRoleInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type GqlMembershipSetRolePayload = GqlMembershipSetRoleSuccess;

export type GqlMembershipSetRoleSuccess = {
  __typename?: "MembershipSetRoleSuccess";
  membership: GqlMembership;
};

export type GqlMembershipSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export const GqlMembershipStatus = {
  Joined: "JOINED",
  Left: "LEFT",
  Pending: "PENDING",
} as const;

export type GqlMembershipStatus = (typeof GqlMembershipStatus)[keyof typeof GqlMembershipStatus];
export const GqlMembershipStatusReason = {
  AcceptedInvitation: "ACCEPTED_INVITATION",
  Assigned: "ASSIGNED",
  CanceledInvitation: "CANCELED_INVITATION",
  CreatedCommunity: "CREATED_COMMUNITY",
  DeclinedInvitation: "DECLINED_INVITATION",
  Invited: "INVITED",
  Removed: "REMOVED",
  Withdrawn: "WITHDRAWN",
} as const;

export type GqlMembershipStatusReason =
  (typeof GqlMembershipStatusReason)[keyof typeof GqlMembershipStatusReason];
export type GqlMembershipWithdrawInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type GqlMembershipWithdrawPayload = GqlMembershipWithdrawSuccess;

export type GqlMembershipWithdrawSuccess = {
  __typename?: "MembershipWithdrawSuccess";
  communityId: Scalars["ID"]["output"];
  userId: Scalars["ID"]["output"];
};

export type GqlMembershipsConnection = {
  __typename?: "MembershipsConnection";
  edges?: Maybe<Array<Maybe<GqlMembershipEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlMissingTicketIdsError = {
  __typename?: "MissingTicketIdsError";
  message: Scalars["String"]["output"];
};

export type GqlMutation = {
  __typename?: "Mutation";
  communityCreate?: Maybe<GqlCommunityCreatePayload>;
  communityDelete?: Maybe<GqlCommunityDeletePayload>;
  communityUpdateProfile?: Maybe<GqlCommunityUpdateProfilePayload>;
  evaluationFail?: Maybe<GqlEvaluationCreatePayload>;
  evaluationPass?: Maybe<GqlEvaluationCreatePayload>;
  linkPhoneAuth?: Maybe<GqlLinkPhoneAuthPayload>;
  membershipAcceptMyInvitation?: Maybe<GqlMembershipSetInvitationStatusPayload>;
  membershipAssignManager?: Maybe<GqlMembershipSetRolePayload>;
  membershipAssignMember?: Maybe<GqlMembershipSetRolePayload>;
  membershipAssignOwner?: Maybe<GqlMembershipSetRolePayload>;
  membershipCancelInvitation?: Maybe<GqlMembershipSetInvitationStatusPayload>;
  membershipDenyMyInvitation?: Maybe<GqlMembershipSetInvitationStatusPayload>;
  membershipInvite?: Maybe<GqlMembershipInvitePayload>;
  membershipRemove?: Maybe<GqlMembershipRemovePayload>;
  membershipWithdraw?: Maybe<GqlMembershipWithdrawPayload>;
  mutationEcho: Scalars["String"]["output"];
  opportunityCreate?: Maybe<GqlOpportunityCreatePayload>;
  opportunityDelete?: Maybe<GqlOpportunityDeletePayload>;
  opportunitySetPublishStatus?: Maybe<GqlOpportunitySetPublishStatusPayload>;
  opportunitySlotSetHostingStatus?: Maybe<GqlOpportunitySlotSetHostingStatusPayload>;
  opportunitySlotsBulkUpdate?: Maybe<GqlOpportunitySlotsBulkUpdatePayload>;
  opportunityUpdateContent?: Maybe<GqlOpportunityUpdateContentPayload>;
  participationCreatePersonalRecord?: Maybe<GqlParticipationCreatePersonalRecordPayload>;
  participationDeletePersonalRecord?: Maybe<GqlParticipationDeletePayload>;
  placeCreate?: Maybe<GqlPlaceCreatePayload>;
  placeDelete?: Maybe<GqlPlaceDeletePayload>;
  placeUpdate?: Maybe<GqlPlaceUpdatePayload>;
  reservationAccept?: Maybe<GqlReservationSetStatusPayload>;
  reservationCancel?: Maybe<GqlReservationSetStatusPayload>;
  reservationCreate?: Maybe<GqlReservationCreatePayload>;
  reservationJoin?: Maybe<GqlReservationSetStatusPayload>;
  reservationReject?: Maybe<GqlReservationSetStatusPayload>;
  storePhoneAuthToken?: Maybe<GqlStorePhoneAuthTokenPayload>;
  ticketClaim?: Maybe<GqlTicketClaimPayload>;
  ticketIssue?: Maybe<GqlTicketIssuePayload>;
  ticketPurchase?: Maybe<GqlTicketPurchasePayload>;
  ticketRefund?: Maybe<GqlTicketRefundPayload>;
  ticketUse?: Maybe<GqlTicketUsePayload>;
  transactionDonateSelfPoint?: Maybe<GqlTransactionDonateSelfPointPayload>;
  transactionGrantCommunityPoint?: Maybe<GqlTransactionGrantCommunityPointPayload>;
  transactionIssueCommunityPoint?: Maybe<GqlTransactionIssueCommunityPointPayload>;
  userDeleteMe?: Maybe<GqlUserDeletePayload>;
  userSignUp?: Maybe<GqlCurrentUserPayload>;
  userUpdateMyProfile?: Maybe<GqlUserUpdateProfilePayload>;
  utilityCreate?: Maybe<GqlUtilityCreatePayload>;
  utilityDelete?: Maybe<GqlUtilityDeletePayload>;
  utilitySetPublishStatus?: Maybe<GqlUtilitySetPublishStatusPayload>;
  utilityUpdateInfo?: Maybe<GqlUtilityUpdateInfoPayload>;
};

export type GqlMutationCommunityCreateArgs = {
  input: GqlCommunityCreateInput;
};

export type GqlMutationCommunityDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationCommunityUpdateProfileArgs = {
  id: Scalars["ID"]["input"];
  input: GqlCommunityUpdateProfileInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationEvaluationFailArgs = {
  input: GqlEvaluationCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationEvaluationPassArgs = {
  input: GqlEvaluationCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationLinkPhoneAuthArgs = {
  input: GqlLinkPhoneAuthInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationMembershipAcceptMyInvitationArgs = {
  input: GqlMembershipSetInvitationStatusInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationMembershipAssignManagerArgs = {
  input: GqlMembershipSetRoleInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationMembershipAssignMemberArgs = {
  input: GqlMembershipSetRoleInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationMembershipAssignOwnerArgs = {
  input: GqlMembershipSetRoleInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationMembershipCancelInvitationArgs = {
  input: GqlMembershipSetInvitationStatusInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationMembershipDenyMyInvitationArgs = {
  input: GqlMembershipSetInvitationStatusInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationMembershipInviteArgs = {
  input: GqlMembershipInviteInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationMembershipRemoveArgs = {
  input: GqlMembershipRemoveInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationMembershipWithdrawArgs = {
  input: GqlMembershipWithdrawInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationOpportunityCreateArgs = {
  input: GqlOpportunityCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationOpportunityDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationOpportunitySetPublishStatusArgs = {
  id: Scalars["ID"]["input"];
  input: GqlOpportunitySetPublishStatusInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationOpportunitySlotSetHostingStatusArgs = {
  id: Scalars["ID"]["input"];
  input: GqlOpportunitySlotSetHostingStatusInput;
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationOpportunitySlotsBulkUpdateArgs = {
  input: GqlOpportunitySlotsBulkUpdateInput;
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationOpportunityUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: GqlOpportunityUpdateContentInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationParticipationCreatePersonalRecordArgs = {
  input: GqlParticipationCreatePersonalRecordInput;
};

export type GqlMutationParticipationDeletePersonalRecordArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationPlaceCreateArgs = {
  input: GqlPlaceCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationPlaceDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationPlaceUpdateArgs = {
  id: Scalars["ID"]["input"];
  input: GqlPlaceUpdateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationReservationAcceptArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationReservationCancelArgs = {
  id: Scalars["ID"]["input"];
  input: GqlReservationCancelInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationReservationCreateArgs = {
  input: GqlReservationCreateInput;
};

export type GqlMutationReservationJoinArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlMutationReservationRejectArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationStorePhoneAuthTokenArgs = {
  input: GqlStorePhoneAuthTokenInput;
};

export type GqlMutationTicketClaimArgs = {
  input: GqlTicketClaimInput;
};

export type GqlMutationTicketIssueArgs = {
  input: GqlTicketIssueInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationTicketPurchaseArgs = {
  input: GqlTicketPurchaseInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationTicketRefundArgs = {
  id: Scalars["ID"]["input"];
  input: GqlTicketRefundInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationTicketUseArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationTransactionDonateSelfPointArgs = {
  input: GqlTransactionDonateSelfPointInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationTransactionGrantCommunityPointArgs = {
  input: GqlTransactionGrantCommunityPointInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationTransactionIssueCommunityPointArgs = {
  input: GqlTransactionIssueCommunityPointInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationUserDeleteMeArgs = {
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationUserSignUpArgs = {
  input: GqlUserSignUpInput;
};

export type GqlMutationUserUpdateMyProfileArgs = {
  input: GqlUserUpdateProfileInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationUtilityCreateArgs = {
  input: GqlUtilityCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationUtilityDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationUtilitySetPublishStatusArgs = {
  id: Scalars["ID"]["input"];
  input: GqlUtilitySetPublishStatusInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationUtilityUpdateInfoArgs = {
  id: Scalars["ID"]["input"];
  input: GqlUtilityUpdateInfoInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlNestedPlaceConnectOrCreateInput = {
  create?: InputMaybe<GqlNestedPlaceCreateInput>;
  where?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlNestedPlaceCreateInput = {
  address: Scalars["String"]["input"];
  cityCode: Scalars["ID"]["input"];
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  googlePlaceId?: InputMaybe<Scalars["String"]["input"]>;
  isManual: Scalars["Boolean"]["input"];
  latitude: Scalars["Decimal"]["input"];
  longitude: Scalars["Decimal"]["input"];
  mapLocation?: InputMaybe<Scalars["JSON"]["input"]>;
  name: Scalars["String"]["input"];
};

export type GqlNestedPlacesBulkConnectOrCreateInput = {
  data?: InputMaybe<Array<GqlNestedPlaceConnectOrCreateInput>>;
};

export type GqlNestedPlacesBulkUpdateInput = {
  connectOrCreate?: InputMaybe<Array<GqlNestedPlaceConnectOrCreateInput>>;
  disconnect?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlNoAvailableParticipationSlotsError = {
  __typename?: "NoAvailableParticipationSlotsError";
  message: Scalars["String"]["output"];
};

export type GqlOpportunitiesConnection = {
  __typename?: "OpportunitiesConnection";
  edges: Array<GqlOpportunityEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlOpportunity = {
  __typename?: "Opportunity";
  articles?: Maybe<Array<GqlArticle>>;
  body?: Maybe<Scalars["String"]["output"]>;
  capacity?: Maybe<Scalars["Int"]["output"]>;
  category: GqlOpportunityCategory;
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  description: Scalars["String"]["output"];
  earliestReservableAt?: Maybe<Scalars["Datetime"]["output"]>;
  feeRequired?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  isReservableWithTicket?: Maybe<Scalars["Boolean"]["output"]>;
  place?: Maybe<GqlPlace>;
  pointsToEarn?: Maybe<Scalars["Int"]["output"]>;
  publishStatus: GqlPublishStatus;
  requireApproval: Scalars["Boolean"]["output"];
  requiredUtilities?: Maybe<Array<GqlUtility>>;
  slots?: Maybe<Array<GqlOpportunitySlot>>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlOpportunitySlotsArgs = {
  filter?: InputMaybe<GqlOpportunitySlotFilterInput>;
  sort?: InputMaybe<GqlOpportunitySlotSortInput>;
};

export const GqlOpportunityCategory = {
  Activity: "ACTIVITY",
  Event: "EVENT",
  Quest: "QUEST",
} as const;

export type GqlOpportunityCategory =
  (typeof GqlOpportunityCategory)[keyof typeof GqlOpportunityCategory];
export type GqlOpportunityCreateInput = {
  body?: InputMaybe<Scalars["String"]["input"]>;
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  category: GqlOpportunityCategory;
  communityId: Scalars["ID"]["input"];
  description: Scalars["String"]["input"];
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  place?: InputMaybe<GqlNestedPlaceConnectOrCreateInput>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: GqlPublishStatus;
  requireApproval: Scalars["Boolean"]["input"];
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  title: Scalars["String"]["input"];
};

export type GqlOpportunityCreatePayload = GqlOpportunityCreateSuccess;

export type GqlOpportunityCreateSuccess = {
  __typename?: "OpportunityCreateSuccess";
  opportunity: GqlOpportunity;
};

export type GqlOpportunityDeletePayload = GqlOpportunityDeleteSuccess;

export type GqlOpportunityDeleteSuccess = {
  __typename?: "OpportunityDeleteSuccess";
  opportunityId: Scalars["ID"]["output"];
};

export type GqlOpportunityEdge = GqlEdge & {
  __typename?: "OpportunityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlOpportunity>;
};

export type GqlOpportunityFilterInput = {
  and?: InputMaybe<Array<GqlOpportunityFilterInput>>;
  articleIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  category?: InputMaybe<GqlOpportunityCategory>;
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  communityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  createdByUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  isReservableWithTicket?: InputMaybe<Scalars["Boolean"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<GqlOpportunityFilterInput>;
  or?: InputMaybe<Array<GqlOpportunityFilterInput>>;
  placeIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  publishStatus?: InputMaybe<Array<GqlPublishStatus>>;
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  slotDateRange?: InputMaybe<GqlDateTimeRangeFilter>;
  slotHostingStatus?: InputMaybe<Array<GqlOpportunitySlotHostingStatus>>;
  slotRemainingCapacity?: InputMaybe<Scalars["Int"]["input"]>;
  stateCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlOpportunitySetPublishStatusInput = {
  publishStatus: GqlPublishStatus;
};

export type GqlOpportunitySetPublishStatusPayload = GqlOpportunitySetPublishStatusSuccess;

export type GqlOpportunitySetPublishStatusSuccess = {
  __typename?: "OpportunitySetPublishStatusSuccess";
  opportunity: GqlOpportunity;
};

export type GqlOpportunitySlot = {
  __typename?: "OpportunitySlot";
  capacity?: Maybe<Scalars["Int"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  endsAt: Scalars["Datetime"]["output"];
  hostingStatus: GqlOpportunitySlotHostingStatus;
  id: Scalars["ID"]["output"];
  opportunity?: Maybe<GqlOpportunity>;
  remainingCapacity?: Maybe<Scalars["Int"]["output"]>;
  reservations?: Maybe<Array<GqlReservation>>;
  startsAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlOpportunitySlotCreateInput = {
  endsAt: Scalars["Datetime"]["input"];
  startsAt: Scalars["Datetime"]["input"];
};

export type GqlOpportunitySlotEdge = GqlEdge & {
  __typename?: "OpportunitySlotEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlOpportunitySlot>;
};

export type GqlOpportunitySlotFilterInput = {
  dateRange?: InputMaybe<GqlDateTimeRangeFilter>;
  hostingStatus?: InputMaybe<GqlOpportunitySlotHostingStatus>;
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
};

export const GqlOpportunitySlotHostingStatus = {
  Cancelled: "CANCELLED",
  Completed: "COMPLETED",
  Scheduled: "SCHEDULED",
} as const;

export type GqlOpportunitySlotHostingStatus =
  (typeof GqlOpportunitySlotHostingStatus)[keyof typeof GqlOpportunitySlotHostingStatus];
export type GqlOpportunitySlotSetHostingStatusInput = {
  status: GqlOpportunitySlotHostingStatus;
};

export type GqlOpportunitySlotSetHostingStatusPayload = GqlOpportunitySlotSetHostingStatusSuccess;

export type GqlOpportunitySlotSetHostingStatusSuccess = {
  __typename?: "OpportunitySlotSetHostingStatusSuccess";
  slot: GqlOpportunitySlot;
};

export type GqlOpportunitySlotSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  endsAt?: InputMaybe<GqlSortDirection>;
  startsAt?: InputMaybe<GqlSortDirection>;
};

export type GqlOpportunitySlotUpdateInput = {
  endsAt: Scalars["Datetime"]["input"];
  id: Scalars["ID"]["input"];
  startsAt: Scalars["Datetime"]["input"];
};

export type GqlOpportunitySlotsBulkUpdateInput = {
  create?: InputMaybe<Array<GqlOpportunitySlotCreateInput>>;
  delete?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  opportunityId: Scalars["ID"]["input"];
  update?: InputMaybe<Array<GqlOpportunitySlotUpdateInput>>;
};

export type GqlOpportunitySlotsBulkUpdatePayload = GqlOpportunitySlotsBulkUpdateSuccess;

export type GqlOpportunitySlotsBulkUpdateSuccess = {
  __typename?: "OpportunitySlotsBulkUpdateSuccess";
  slots: Array<GqlOpportunitySlot>;
};

export type GqlOpportunitySlotsConnection = {
  __typename?: "OpportunitySlotsConnection";
  edges?: Maybe<Array<Maybe<GqlOpportunitySlotEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlOpportunitySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  earliestSlotStartsAt?: InputMaybe<GqlSortDirection>;
};

export type GqlOpportunityUpdateContentInput = {
  body?: InputMaybe<Scalars["String"]["input"]>;
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  category: GqlOpportunityCategory;
  description: Scalars["String"]["input"];
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  place?: InputMaybe<GqlNestedPlaceConnectOrCreateInput>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: GqlPublishStatus;
  requireApproval: Scalars["Boolean"]["input"];
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  title: Scalars["String"]["input"];
};

export type GqlOpportunityUpdateContentPayload = GqlOpportunityUpdateContentSuccess;

export type GqlOpportunityUpdateContentSuccess = {
  __typename?: "OpportunityUpdateContentSuccess";
  opportunity: GqlOpportunity;
};

export type GqlPageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor?: Maybe<Scalars["String"]["output"]>;
};

export type GqlPaging = {
  __typename?: "Paging";
  skip: Scalars["Int"]["output"];
  take: Scalars["Int"]["output"];
};

export type GqlParticipation = {
  __typename?: "Participation";
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  evaluation?: Maybe<GqlEvaluation>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  reason: GqlParticipationStatusReason;
  reservation?: Maybe<GqlReservation>;
  source?: Maybe<GqlSource>;
  status: GqlParticipationStatus;
  statusHistories?: Maybe<Array<GqlParticipationStatusHistory>>;
  ticketStatusHistories?: Maybe<Array<GqlTicketStatusHistory>>;
  transactions?: Maybe<Array<GqlTransaction>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<GqlUser>;
};

export type GqlParticipationCreatePersonalRecordInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
};

export type GqlParticipationCreatePersonalRecordPayload =
  GqlParticipationCreatePersonalRecordSuccess;

export type GqlParticipationCreatePersonalRecordSuccess = {
  __typename?: "ParticipationCreatePersonalRecordSuccess";
  participation: GqlParticipation;
};

export type GqlParticipationDeletePayload = GqlParticipationDeleteSuccess;

export type GqlParticipationDeleteSuccess = {
  __typename?: "ParticipationDeleteSuccess";
  participationId: Scalars["ID"]["output"];
};

export type GqlParticipationEdge = GqlEdge & {
  __typename?: "ParticipationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlParticipation>;
};

export type GqlParticipationFilterInput = {
  categories?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  dateFrom?: InputMaybe<Scalars["Datetime"]["input"]>;
  dateTo?: InputMaybe<Scalars["Datetime"]["input"]>;
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunitySlotId?: InputMaybe<Scalars["ID"]["input"]>;
  reservationId?: InputMaybe<Scalars["ID"]["input"]>;
  stateCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  status?: InputMaybe<GqlParticipationStatus>;
  userIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlParticipationSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  startsAt?: InputMaybe<GqlSortDirection>;
  updatedAt?: InputMaybe<GqlSortDirection>;
};

export const GqlParticipationStatus = {
  NotParticipating: "NOT_PARTICIPATING",
  Participated: "PARTICIPATED",
  Participating: "PARTICIPATING",
  Pending: "PENDING",
} as const;

export type GqlParticipationStatus =
  (typeof GqlParticipationStatus)[keyof typeof GqlParticipationStatus];
export type GqlParticipationStatusHistoriesConnection = {
  __typename?: "ParticipationStatusHistoriesConnection";
  edges: Array<GqlParticipationStatusHistoryEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlParticipationStatusHistory = {
  __typename?: "ParticipationStatusHistory";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  id: Scalars["ID"]["output"];
  participation?: Maybe<GqlParticipation>;
  reason: GqlParticipationStatusReason;
  status: GqlParticipationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlParticipationStatusHistoryEdge = GqlEdge & {
  __typename?: "ParticipationStatusHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlParticipationStatusHistory>;
};

export type GqlParticipationStatusHistoryFilterInput = {
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  participationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlParticipationStatus>;
};

export type GqlParticipationStatusHistorySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export const GqlParticipationStatusReason = {
  OpportunityCanceled: "OPPORTUNITY_CANCELED",
  PersonalRecord: "PERSONAL_RECORD",
  ReservationAccepted: "RESERVATION_ACCEPTED",
  ReservationApplied: "RESERVATION_APPLIED",
  ReservationCanceled: "RESERVATION_CANCELED",
  ReservationJoined: "RESERVATION_JOINED",
  ReservationRejected: "RESERVATION_REJECTED",
} as const;

export type GqlParticipationStatusReason =
  (typeof GqlParticipationStatusReason)[keyof typeof GqlParticipationStatusReason];
export const GqlParticipationType = {
  Hosted: "HOSTED",
  Participated: "PARTICIPATED",
} as const;

export type GqlParticipationType = (typeof GqlParticipationType)[keyof typeof GqlParticipationType];
export type GqlParticipationsConnection = {
  __typename?: "ParticipationsConnection";
  edges: Array<GqlParticipationEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlPlace = {
  __typename?: "Place";
  address: Scalars["String"]["output"];
  city?: Maybe<GqlCity>;
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  googlePlaceId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  isManual?: Maybe<Scalars["Boolean"]["output"]>;
  latitude: Scalars["Decimal"]["output"];
  longitude: Scalars["Decimal"]["output"];
  mapLocation?: Maybe<Scalars["JSON"]["output"]>;
  name: Scalars["String"]["output"];
  opportunities?: Maybe<Array<GqlOpportunity>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlPlaceCreateInput = {
  address: Scalars["String"]["input"];
  cityCode: Scalars["ID"]["input"];
  communityId: Scalars["ID"]["input"];
  googlePlaceId?: InputMaybe<Scalars["String"]["input"]>;
  isManual: Scalars["Boolean"]["input"];
  latitude: Scalars["Decimal"]["input"];
  longitude: Scalars["Decimal"]["input"];
  mapLocation?: InputMaybe<Scalars["JSON"]["input"]>;
  name: Scalars["String"]["input"];
  opportunityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlPlaceCreatePayload = GqlPlaceCreateSuccess;

export type GqlPlaceCreateSuccess = {
  __typename?: "PlaceCreateSuccess";
  place: GqlPlace;
};

export type GqlPlaceDeletePayload = GqlPlaceDeleteSuccess;

export type GqlPlaceDeleteSuccess = {
  __typename?: "PlaceDeleteSuccess";
  id: Scalars["ID"]["output"];
};

export type GqlPlaceEdge = GqlEdge & {
  __typename?: "PlaceEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlPlace>;
};

export type GqlPlaceFilterInput = {
  cityCode?: InputMaybe<Scalars["ID"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlPlaceSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlPlaceUpdateInput = {
  address: Scalars["String"]["input"];
  cityCode: Scalars["ID"]["input"];
  googlePlaceId?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["ID"]["input"];
  isManual: Scalars["Boolean"]["input"];
  latitude: Scalars["Decimal"]["input"];
  longitude: Scalars["Decimal"]["input"];
  mapLocation?: InputMaybe<Scalars["JSON"]["input"]>;
  name: Scalars["String"]["input"];
  opportunityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlPlaceUpdatePayload = GqlPlaceUpdateSuccess;

export type GqlPlaceUpdateSuccess = {
  __typename?: "PlaceUpdateSuccess";
  place: GqlPlace;
};

export type GqlPlacesConnection = {
  __typename?: "PlacesConnection";
  edges?: Maybe<Array<Maybe<GqlPlaceEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlPortfolio = {
  __typename?: "Portfolio";
  category: GqlPortfolioCategory;
  date: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  participants?: Maybe<Array<GqlUser>>;
  place?: Maybe<GqlPlace>;
  reservationStatus?: Maybe<GqlReservationStatus>;
  source: GqlPortfolioSource;
  thumbnailUrl?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export const GqlPortfolioCategory = {
  Activity: "ACTIVITY",
  ActivityReport: "ACTIVITY_REPORT",
  Event: "EVENT",
  Interview: "INTERVIEW",
  Quest: "QUEST",
} as const;

export type GqlPortfolioCategory = (typeof GqlPortfolioCategory)[keyof typeof GqlPortfolioCategory];
export const GqlPortfolioSource = {
  Article: "ARTICLE",
  Opportunity: "OPPORTUNITY",
} as const;

export type GqlPortfolioSource = (typeof GqlPortfolioSource)[keyof typeof GqlPortfolioSource];
export const GqlPublishStatus = {
  CommunityInternal: "COMMUNITY_INTERNAL",
  Private: "PRIVATE",
  Public: "PUBLIC",
} as const;

export type GqlPublishStatus = (typeof GqlPublishStatus)[keyof typeof GqlPublishStatus];
export type GqlQuery = {
  __typename?: "Query";
  article?: Maybe<GqlArticle>;
  articles: GqlArticlesConnection;
  cities: Array<GqlCity>;
  communities: GqlCommunitiesConnection;
  community?: Maybe<GqlCommunity>;
  currentUser?: Maybe<GqlCurrentUserPayload>;
  echo: Scalars["String"]["output"];
  evaluation?: Maybe<GqlEvaluation>;
  evaluationHistories: GqlEvaluationHistoriesConnection;
  evaluationHistory?: Maybe<GqlEvaluationHistory>;
  evaluations: GqlEvaluationsConnection;
  membership?: Maybe<GqlMembership>;
  memberships: GqlMembershipsConnection;
  opportunities: GqlOpportunitiesConnection;
  opportunity?: Maybe<GqlOpportunity>;
  opportunitySlot?: Maybe<GqlOpportunitySlot>;
  opportunitySlots: GqlOpportunitySlotsConnection;
  participation?: Maybe<GqlParticipation>;
  participationStatusHistories: GqlParticipationStatusHistoriesConnection;
  participationStatusHistory?: Maybe<GqlParticipationStatusHistory>;
  participations: GqlParticipationsConnection;
  place?: Maybe<GqlPlace>;
  places: GqlPlacesConnection;
  reservation?: Maybe<GqlReservation>;
  reservationHistories: GqlReservationHistoriesConnection;
  reservationHistory?: Maybe<GqlReservationHistory>;
  reservations: GqlReservationsConnection;
  states: Array<GqlState>;
  ticket?: Maybe<GqlTicket>;
  ticketClaimLink?: Maybe<GqlTicketClaimLink>;
  ticketIssuer?: Maybe<GqlTicketIssuer>;
  ticketIssuers: GqlTicketIssuersConnection;
  ticketStatusHistories: GqlTicketStatusHistoriesConnection;
  ticketStatusHistory?: Maybe<GqlTicketStatusHistory>;
  tickets: GqlTicketsConnection;
  transaction?: Maybe<GqlTransaction>;
  transactions: GqlTransactionsConnection;
  user?: Maybe<GqlUser>;
  users: GqlUsersConnection;
  utilities: GqlUtilitiesConnection;
  utility?: Maybe<GqlUtility>;
  wallet?: Maybe<GqlWallet>;
  wallets: GqlWalletsConnection;
};

export type GqlQueryArticleArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlQueryArticlesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlArticleFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlArticleSortInput>;
};

export type GqlQueryCitiesArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlQueryCommunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlCommunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlCommunitySortInput>;
};

export type GqlQueryCommunityArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryEvaluationArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryEvaluationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlEvaluationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlEvaluationHistorySortInput>;
};

export type GqlQueryEvaluationHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryEvaluationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlEvaluationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlEvaluationSortInput>;
};

export type GqlQueryMembershipArgs = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type GqlQueryMembershipsArgs = {
  cursor?: InputMaybe<GqlMembershipCursorInput>;
  filter?: InputMaybe<GqlMembershipFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlMembershipSortInput>;
};

export type GqlQueryOpportunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlOpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlOpportunitySortInput>;
};

export type GqlQueryOpportunityArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlQueryOpportunitySlotArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryOpportunitySlotsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlOpportunitySlotFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlOpportunitySlotSortInput>;
};

export type GqlQueryParticipationArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryParticipationStatusHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlParticipationStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlParticipationStatusHistorySortInput>;
};

export type GqlQueryParticipationStatusHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryParticipationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlParticipationSortInput>;
};

export type GqlQueryPlaceArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryPlacesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlPlaceFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlPlaceSortInput>;
};

export type GqlQueryReservationArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryReservationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlReservationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlReservationHistorySortInput>;
};

export type GqlQueryReservationHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryReservationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlReservationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlReservationSortInput>;
};

export type GqlQueryStatesArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlQueryTicketArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryTicketClaimLinkArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryTicketIssuerArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryTicketIssuersArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlTicketIssuerFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlTicketIssuerSortInput>;
};

export type GqlQueryTicketStatusHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlTicketStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlTicketStatusHistorySortInput>;
};

export type GqlQueryTicketStatusHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryTicketsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlTicketFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlTicketSortInput>;
};

export type GqlQueryTransactionArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryTransactionsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlTransactionFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlTransactionSortInput>;
};

export type GqlQueryUserArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryUsersArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlUserFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlUserSortInput>;
};

export type GqlQueryUtilitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlUtilityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlUtilitySortInput>;
};

export type GqlQueryUtilityArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlQueryWalletArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryWalletsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlWalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlWalletSortInput>;
};

export type GqlRateLimitError = {
  __typename?: "RateLimitError";
  message: Scalars["String"]["output"];
};

export type GqlReservation = {
  __typename?: "Reservation";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  histories?: Maybe<Array<GqlReservationHistory>>;
  id: Scalars["ID"]["output"];
  opportunitySlot?: Maybe<GqlOpportunitySlot>;
  participations?: Maybe<Array<GqlParticipation>>;
  status: GqlReservationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlReservationAdvanceBookingRequiredError = {
  __typename?: "ReservationAdvanceBookingRequiredError";
  message: Scalars["String"]["output"];
};

export type GqlReservationCancelInput = {
  paymentMethod: GqlReservationPaymentMethod;
  ticketIdsIfExists?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlReservationCancellationTimeoutError = {
  __typename?: "ReservationCancellationTimeoutError";
  message: Scalars["String"]["output"];
};

export type GqlReservationCreateInput = {
  opportunitySlotId: Scalars["ID"]["input"];
  otherUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  paymentMethod: GqlReservationPaymentMethod;
  ticketIdsIfNeed?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  totalParticipantCount: Scalars["Int"]["input"];
};

export type GqlReservationCreatePayload =
  | GqlMissingTicketIdsError
  | GqlReservationAdvanceBookingRequiredError
  | GqlReservationCreateSuccess
  | GqlReservationFullError
  | GqlReservationNotAcceptedError
  | GqlSlotNotScheduledError
  | GqlTicketParticipantMismatchError;

export type GqlReservationCreateSuccess = {
  __typename?: "ReservationCreateSuccess";
  reservation: GqlReservation;
};

export type GqlReservationEdge = GqlEdge & {
  __typename?: "ReservationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlReservation>;
};

export type GqlReservationFilterInput = {
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunitySlotId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlReservationStatus>;
};

export type GqlReservationFullError = {
  __typename?: "ReservationFullError";
  capacity: Scalars["Int"]["output"];
  message: Scalars["String"]["output"];
  requested: Scalars["Int"]["output"];
};

export type GqlReservationHistoriesConnection = {
  __typename?: "ReservationHistoriesConnection";
  edges: Array<GqlReservationHistoryEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlReservationHistory = {
  __typename?: "ReservationHistory";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  id: Scalars["ID"]["output"];
  reservation: GqlReservation;
  status: GqlReservationStatus;
};

export type GqlReservationHistoryEdge = GqlEdge & {
  __typename?: "ReservationHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlReservationHistory>;
};

export type GqlReservationHistoryFilterInput = {
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  reservationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlReservationStatus>;
};

export type GqlReservationHistorySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlReservationNotAcceptedError = {
  __typename?: "ReservationNotAcceptedError";
  message: Scalars["String"]["output"];
};

export const GqlReservationPaymentMethod = {
  Fee: "FEE",
  Ticket: "TICKET",
} as const;

export type GqlReservationPaymentMethod =
  (typeof GqlReservationPaymentMethod)[keyof typeof GqlReservationPaymentMethod];
export type GqlReservationSetStatusPayload =
  | GqlAlreadyJoinedError
  | GqlNoAvailableParticipationSlotsError
  | GqlReservationCancellationTimeoutError
  | GqlReservationSetStatusSuccess;

export type GqlReservationSetStatusSuccess = {
  __typename?: "ReservationSetStatusSuccess";
  reservation: GqlReservation;
};

export type GqlReservationSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  updatedAt?: InputMaybe<GqlSortDirection>;
};

export const GqlReservationStatus = {
  Accepted: "ACCEPTED",
  Applied: "APPLIED",
  Canceled: "CANCELED",
  Rejected: "REJECTED",
} as const;

export type GqlReservationStatus = (typeof GqlReservationStatus)[keyof typeof GqlReservationStatus];
export type GqlReservationsConnection = {
  __typename?: "ReservationsConnection";
  edges: Array<GqlReservationEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export const GqlRole = {
  Manager: "MANAGER",
  Member: "MEMBER",
  Owner: "OWNER",
} as const;

export type GqlRole = (typeof GqlRole)[keyof typeof GqlRole];
export type GqlSlotNotScheduledError = {
  __typename?: "SlotNotScheduledError";
  message: Scalars["String"]["output"];
};

export const GqlSortDirection = {
  Asc: "asc",
  Desc: "desc",
} as const;

export type GqlSortDirection = (typeof GqlSortDirection)[keyof typeof GqlSortDirection];
export const GqlSource = {
  External: "EXTERNAL",
  Internal: "INTERNAL",
} as const;

export type GqlSource = (typeof GqlSource)[keyof typeof GqlSource];
export type GqlState = {
  __typename?: "State";
  code: Scalars["ID"]["output"];
  countryCode: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export type GqlStorePhoneAuthTokenInput = {
  authToken: Scalars["String"]["input"];
  expiresIn: Scalars["Int"]["input"];
  phoneUid: Scalars["String"]["input"];
  refreshToken: Scalars["String"]["input"];
};

export type GqlStorePhoneAuthTokenPayload = {
  __typename?: "StorePhoneAuthTokenPayload";
  expiresAt?: Maybe<Scalars["Datetime"]["output"]>;
  success: Scalars["Boolean"]["output"];
};

export const GqlSysRole = {
  SysAdmin: "SYS_ADMIN",
  User: "USER",
} as const;

export type GqlSysRole = (typeof GqlSysRole)[keyof typeof GqlSysRole];
export type GqlTicket = {
  __typename?: "Ticket";
  claimLink?: Maybe<GqlTicketClaimLink>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  reason: GqlTicketStatusReason;
  status: GqlTicketStatus;
  ticketStatusHistories?: Maybe<Array<GqlTicketStatusHistory>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utility?: Maybe<GqlUtility>;
  wallet?: Maybe<GqlWallet>;
};

export type GqlTicketClaimInput = {
  ticketClaimLinkId: Scalars["ID"]["input"];
};

export type GqlTicketClaimLink = {
  __typename?: "TicketClaimLink";
  claimedAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  issuer?: Maybe<GqlTicketIssuer>;
  /** Max number of tickets a user can claim using this link */
  qty: Scalars["Int"]["output"];
  status: GqlClaimLinkStatus;
  tickets?: Maybe<Array<GqlTicket>>;
};

export type GqlTicketClaimPayload = GqlTicketClaimSuccess;

export type GqlTicketClaimSuccess = {
  __typename?: "TicketClaimSuccess";
  tickets: Array<GqlTicket>;
};

export type GqlTicketEdge = GqlEdge & {
  __typename?: "TicketEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlTicket>;
};

export type GqlTicketFilterInput = {
  status?: InputMaybe<GqlTicketStatus>;
  utilityId?: InputMaybe<Scalars["ID"]["input"]>;
  walletId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlTicketIssueInput = {
  qtyToBeIssued: Scalars["Int"]["input"];
  utilityId: Scalars["ID"]["input"];
};

export type GqlTicketIssuePayload = GqlTicketIssueSuccess;

export type GqlTicketIssueSuccess = {
  __typename?: "TicketIssueSuccess";
  issue: GqlTicketIssuer;
};

export type GqlTicketIssuer = {
  __typename?: "TicketIssuer";
  claimLink?: Maybe<GqlTicketClaimLink>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  owner?: Maybe<GqlUser>;
  /** Maximum number of tickets claimable from this link */
  qtyToBeIssued: Scalars["Int"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utility?: Maybe<GqlUtility>;
};

export type GqlTicketIssuerEdge = GqlEdge & {
  __typename?: "TicketIssuerEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlTicketIssuer>;
};

export type GqlTicketIssuerFilterInput = {
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlTicketIssuerSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlTicketIssuersConnection = {
  __typename?: "TicketIssuersConnection";
  edges?: Maybe<Array<Maybe<GqlTicketIssuerEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlTicketParticipantMismatchError = {
  __typename?: "TicketParticipantMismatchError";
  message: Scalars["String"]["output"];
  participantCount: Scalars["Int"]["output"];
  ticketCount: Scalars["Int"]["output"];
};

export type GqlTicketPurchaseInput = {
  communityId: Scalars["ID"]["input"];
  pointsRequired: Scalars["Int"]["input"];
  utilityId: Scalars["ID"]["input"];
  walletId: Scalars["ID"]["input"];
};

export type GqlTicketPurchasePayload = GqlTicketPurchaseSuccess;

export type GqlTicketPurchaseSuccess = {
  __typename?: "TicketPurchaseSuccess";
  ticket: GqlTicket;
};

export type GqlTicketRefundInput = {
  communityId: Scalars["ID"]["input"];
  pointsRequired: Scalars["Int"]["input"];
  walletId: Scalars["ID"]["input"];
};

export type GqlTicketRefundPayload = GqlTicketRefundSuccess;

export type GqlTicketRefundSuccess = {
  __typename?: "TicketRefundSuccess";
  ticket: GqlTicket;
};

export type GqlTicketSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  status?: InputMaybe<GqlSortDirection>;
};

export const GqlTicketStatus = {
  Available: "AVAILABLE",
  Disabled: "DISABLED",
} as const;

export type GqlTicketStatus = (typeof GqlTicketStatus)[keyof typeof GqlTicketStatus];
export type GqlTicketStatusHistoriesConnection = {
  __typename?: "TicketStatusHistoriesConnection";
  edges?: Maybe<Array<Maybe<GqlTicketStatusHistoryEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlTicketStatusHistory = {
  __typename?: "TicketStatusHistory";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  id: Scalars["ID"]["output"];
  reason: GqlTicketStatusReason;
  status: GqlTicketStatus;
  ticket?: Maybe<GqlTicket>;
  transaction?: Maybe<GqlTransaction>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlTicketStatusHistoryEdge = GqlEdge & {
  __typename?: "TicketStatusHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlTicketStatusHistory>;
};

export type GqlTicketStatusHistoryFilterInput = {
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  reason?: InputMaybe<GqlTicketStatusReason>;
  status?: InputMaybe<GqlTicketStatus>;
  ticketId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlTicketStatusHistorySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export const GqlTicketStatusReason = {
  Canceled: "CANCELED",
  Expired: "EXPIRED",
  Gifted: "GIFTED",
  Purchased: "PURCHASED",
  Refunded: "REFUNDED",
  Reserved: "RESERVED",
  Used: "USED",
} as const;

export type GqlTicketStatusReason =
  (typeof GqlTicketStatusReason)[keyof typeof GqlTicketStatusReason];
export type GqlTicketUsePayload = GqlTicketUseSuccess;

export type GqlTicketUseSuccess = {
  __typename?: "TicketUseSuccess";
  ticket: GqlTicket;
};

export type GqlTicketsConnection = {
  __typename?: "TicketsConnection";
  edges?: Maybe<Array<Maybe<GqlTicketEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlTransaction = {
  __typename?: "Transaction";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  fromPointChange?: Maybe<Scalars["Int"]["output"]>;
  fromWallet?: Maybe<GqlWallet>;
  id: Scalars["ID"]["output"];
  participation?: Maybe<GqlParticipation>;
  reason: GqlTransactionReason;
  ticketStatusHistories?: Maybe<Array<GqlTicketStatusHistory>>;
  toPointChange?: Maybe<Scalars["Int"]["output"]>;
  toWallet?: Maybe<GqlWallet>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlTransactionDonateSelfPointInput = {
  communityId: Scalars["ID"]["input"];
  fromWalletId: Scalars["ID"]["input"];
  toUserId: Scalars["ID"]["input"];
  transferPoints: Scalars["Int"]["input"];
};

export type GqlTransactionDonateSelfPointPayload = GqlTransactionDonateSelfPointSuccess;

export type GqlTransactionDonateSelfPointSuccess = {
  __typename?: "TransactionDonateSelfPointSuccess";
  transaction: GqlTransaction;
};

export type GqlTransactionEdge = GqlEdge & {
  __typename?: "TransactionEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlTransaction>;
};

export type GqlTransactionFilterInput = {
  fromUserId?: InputMaybe<Scalars["ID"]["input"]>;
  fromWalletId?: InputMaybe<Scalars["ID"]["input"]>;
  reason?: InputMaybe<GqlTransactionReason>;
  toUserId?: InputMaybe<Scalars["ID"]["input"]>;
  toWalletId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlTransactionGrantCommunityPointInput = {
  communityId: Scalars["ID"]["input"];
  fromWalletId: Scalars["ID"]["input"];
  toUserId: Scalars["ID"]["input"];
  transferPoints: Scalars["Int"]["input"];
};

export type GqlTransactionGrantCommunityPointPayload = GqlTransactionGrantCommunityPointSuccess;

export type GqlTransactionGrantCommunityPointSuccess = {
  __typename?: "TransactionGrantCommunityPointSuccess";
  transaction: GqlTransaction;
};

export type GqlTransactionIssueCommunityPointInput = {
  toWalletId: Scalars["ID"]["input"];
  transferPoints: Scalars["Int"]["input"];
};

export type GqlTransactionIssueCommunityPointPayload = GqlTransactionIssueCommunityPointSuccess;

export type GqlTransactionIssueCommunityPointSuccess = {
  __typename?: "TransactionIssueCommunityPointSuccess";
  transaction: GqlTransaction;
};

export const GqlTransactionReason = {
  Donation: "DONATION",
  Grant: "GRANT",
  Onboarding: "ONBOARDING",
  PointIssued: "POINT_ISSUED",
  PointReward: "POINT_REWARD",
  TicketPurchased: "TICKET_PURCHASED",
  TicketRefunded: "TICKET_REFUNDED",
} as const;

export type GqlTransactionReason = (typeof GqlTransactionReason)[keyof typeof GqlTransactionReason];
export type GqlTransactionSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlTransactionsConnection = {
  __typename?: "TransactionsConnection";
  edges?: Maybe<Array<Maybe<GqlTransactionEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlUser = {
  __typename?: "User";
  articlesAboutMe?: Maybe<Array<GqlArticle>>;
  articlesWrittenByMe?: Maybe<Array<GqlArticle>>;
  bio?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  currentPrefecture?: Maybe<GqlCurrentPrefecture>;
  evaluationCreatedByMe?: Maybe<Array<GqlEvaluationHistory>>;
  evaluations?: Maybe<Array<GqlEvaluation>>;
  id: Scalars["ID"]["output"];
  identities?: Maybe<Array<GqlIdentity>>;
  image?: Maybe<Scalars["String"]["output"]>;
  membershipChangedByMe?: Maybe<Array<GqlMembershipHistory>>;
  memberships?: Maybe<Array<GqlMembership>>;
  name: Scalars["String"]["output"];
  opportunitiesCreatedByMe?: Maybe<Array<GqlOpportunity>>;
  participationStatusChangedByMe?: Maybe<Array<GqlParticipationStatusHistory>>;
  participations?: Maybe<Array<GqlParticipation>>;
  phoneNumber?: Maybe<Scalars["String"]["output"]>;
  portfolios?: Maybe<Array<GqlPortfolio>>;
  reservationStatusChangedByMe?: Maybe<Array<GqlReservationHistory>>;
  reservations?: Maybe<Array<GqlReservation>>;
  slug?: Maybe<Scalars["String"]["output"]>;
  sysRole?: Maybe<GqlSysRole>;
  ticketStatusChangedByMe?: Maybe<Array<GqlTicketStatusHistory>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  urlFacebook?: Maybe<Scalars["String"]["output"]>;
  urlInstagram?: Maybe<Scalars["String"]["output"]>;
  urlTiktok?: Maybe<Scalars["String"]["output"]>;
  urlWebsite?: Maybe<Scalars["String"]["output"]>;
  urlX?: Maybe<Scalars["String"]["output"]>;
  urlYoutube?: Maybe<Scalars["String"]["output"]>;
  wallets?: Maybe<Array<GqlWallet>>;
};

export type GqlUserDeletePayload = {
  __typename?: "UserDeletePayload";
  userId?: Maybe<Scalars["ID"]["output"]>;
};

export type GqlUserEdge = GqlEdge & {
  __typename?: "UserEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlUser>;
};

export type GqlUserFilterInput = {
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  sysRole?: InputMaybe<GqlSysRole>;
};

export type GqlUserSignUpInput = {
  communityId: Scalars["ID"]["input"];
  currentPrefecture: GqlCurrentPrefecture;
  image?: InputMaybe<GqlImageInput>;
  name: Scalars["String"]["input"];
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  phoneUid?: InputMaybe<Scalars["String"]["input"]>;
  slug?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlUserSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlUserUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  currentPrefecture?: InputMaybe<GqlCurrentPrefecture>;
  image?: InputMaybe<GqlImageInput>;
  name: Scalars["String"]["input"];
  slug: Scalars["String"]["input"];
  urlFacebook?: InputMaybe<Scalars["String"]["input"]>;
  urlInstagram?: InputMaybe<Scalars["String"]["input"]>;
  urlTiktok?: InputMaybe<Scalars["String"]["input"]>;
  urlWebsite?: InputMaybe<Scalars["String"]["input"]>;
  urlX?: InputMaybe<Scalars["String"]["input"]>;
  urlYoutube?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlUserUpdateProfilePayload = GqlUserUpdateProfileSuccess;

export type GqlUserUpdateProfileSuccess = {
  __typename?: "UserUpdateProfileSuccess";
  user?: Maybe<GqlUser>;
};

export type GqlUsersConnection = {
  __typename?: "UsersConnection";
  edges?: Maybe<Array<Maybe<GqlUserEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlUtilitiesConnection = {
  __typename?: "UtilitiesConnection";
  edges?: Maybe<Array<Maybe<GqlUtilityEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlUtility = {
  __typename?: "Utility";
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  name?: Maybe<Scalars["String"]["output"]>;
  pointsRequired: Scalars["Int"]["output"];
  publishStatus: GqlPublishStatus;
  requiredForOpportunities?: Maybe<Array<GqlOpportunity>>;
  ticketIssuers?: Maybe<Array<GqlTicketIssuer>>;
  tickets?: Maybe<Array<GqlTicket>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlUtilityCreateInput = {
  communityId: Scalars["ID"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
};

export type GqlUtilityCreatePayload = GqlUtilityCreateSuccess;

export type GqlUtilityCreateSuccess = {
  __typename?: "UtilityCreateSuccess";
  utility: GqlUtility;
};

export type GqlUtilityDeletePayload = GqlUtilityDeleteSuccess;

export type GqlUtilityDeleteSuccess = {
  __typename?: "UtilityDeleteSuccess";
  utilityId: Scalars["String"]["output"];
};

export type GqlUtilityEdge = GqlEdge & {
  __typename?: "UtilityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlUtility>;
};

export type GqlUtilityFilterInput = {
  and?: InputMaybe<Array<GqlUtilityFilterInput>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  not?: InputMaybe<GqlUtilityFilterInput>;
  or?: InputMaybe<Array<GqlUtilityFilterInput>>;
  publishStatus?: InputMaybe<Array<GqlPublishStatus>>;
};

export type GqlUtilitySetPublishStatusInput = {
  publishStatus: GqlPublishStatus;
};

export type GqlUtilitySetPublishStatusPayload = GqlUtilitySetPublishStatusSuccess;

export type GqlUtilitySetPublishStatusSuccess = {
  __typename?: "UtilitySetPublishStatusSuccess";
  utility: GqlUtility;
};

export type GqlUtilitySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  pointsRequired?: InputMaybe<GqlSortDirection>;
};

export type GqlUtilityUpdateInfoInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
};

export type GqlUtilityUpdateInfoPayload = GqlUtilityUpdateInfoSuccess;

export type GqlUtilityUpdateInfoSuccess = {
  __typename?: "UtilityUpdateInfoSuccess";
  utility: GqlUtility;
};

export type GqlValidationError = {
  __typename?: "ValidationError";
  message: Scalars["String"]["output"];
};

export const GqlValueType = {
  Float: "FLOAT",
  Int: "INT",
} as const;

export type GqlValueType = (typeof GqlValueType)[keyof typeof GqlValueType];
export type GqlWallet = {
  __typename?: "Wallet";
  accumulatedPointView?: Maybe<GqlAccumulatedPointView>;
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  currentPointView?: Maybe<GqlCurrentPointView>;
  id: Scalars["ID"]["output"];
  tickets?: Maybe<Array<GqlTicket>>;
  transactions?: Maybe<Array<GqlTransaction>>;
  type: GqlWalletType;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<GqlUser>;
};

export type GqlWalletEdge = GqlEdge & {
  __typename?: "WalletEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlWallet>;
};

export type GqlWalletFilterInput = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  type?: InputMaybe<GqlWalletType>;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlWalletSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export const GqlWalletType = {
  Community: "COMMUNITY",
  Member: "MEMBER",
} as const;

export type GqlWalletType = (typeof GqlWalletType)[keyof typeof GqlWalletType];
export type GqlWalletsConnection = {
  __typename?: "WalletsConnection";
  edges?: Maybe<Array<Maybe<GqlWalletEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlCommunityFieldsFragment = {
  __typename?: "Community";
  id: string;
  name?: string | null;
  image?: string | null;
};

export type GqlGetCommunitiesQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetCommunitiesQuery = {
  __typename?: "Query";
  communities: {
    __typename?: "CommunitiesConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "CommunityEdge";
      node?: { __typename?: "Community"; id: string; name?: string | null } | null;
    }> | null;
  };
};

export type GqlGetCommunityQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetCommunityQuery = {
  __typename?: "Query";
  community?: { __typename?: "Community"; id: string; name?: string | null } | null;
};

export type GqlIdentityFieldsFragment = {
  __typename?: "Identity";
  uid: string;
  platform?: GqlIdentityPlatform | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type GqlUserSignUpMutationVariables = Exact<{
  input: GqlUserSignUpInput;
}>;

export type GqlUserSignUpMutation = {
  __typename?: "Mutation";
  userSignUp?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string; name: string } | null;
  } | null;
};

export type GqlStorePhoneAuthTokenMutationVariables = Exact<{
  input: GqlStorePhoneAuthTokenInput;
}>;

export type GqlStorePhoneAuthTokenMutation = {
  __typename?: "Mutation";
  storePhoneAuthToken?: {
    __typename?: "StorePhoneAuthTokenPayload";
    success: boolean;
    expiresAt?: Date | null;
  } | null;
};

export type GqlLinkPhoneAuthMutationVariables = Exact<{
  input: GqlLinkPhoneAuthInput;
  permission: GqlCheckIsSelfPermissionInput;
}>;

export type GqlLinkPhoneAuthMutation = {
  __typename?: "Mutation";
  linkPhoneAuth?: {
    __typename?: "LinkPhoneAuthPayload";
    success: boolean;
    user?: { __typename?: "User"; id: string; name: string } | null;
  } | null;
};

export type GqlCurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type GqlCurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "CurrentUserPayload";
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      memberships?: Array<{
        __typename?: "Membership";
        role: GqlRole;
        status: GqlMembershipStatus;
        headline?: string | null;
        bio?: string | null;
        reason: GqlMembershipStatusReason;
        user?: { __typename?: "User"; id: string; name: string } | null;
        community?: { __typename?: "Community"; id: string; name?: string | null } | null;
      }> | null;
    } | null;
  } | null;
};

export type GqlMembershipFieldsFragment = {
  __typename?: "Membership";
  headline?: string | null;
  bio?: string | null;
  role: GqlRole;
  status: GqlMembershipStatus;
  reason: GqlMembershipStatusReason;
};

export type GqlHostedGeoFieldsFragment = {
  __typename?: "MembershipHostedMetrics";
  totalParticipantCount: number;
  geo: Array<{
    __typename?: "MembershipParticipationLocation";
    placeId: string;
    placeName: string;
    placeImage: string;
    latitude: any;
    longitude: any;
    address: string;
  }>;
};

export type GqlGetSingleMembershipQueryVariables = Exact<{
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
}>;

export type GqlGetSingleMembershipQuery = {
  __typename?: "Query";
  membership?: {
    __typename?: "Membership";
    headline?: string | null;
    bio?: string | null;
    role: GqlRole;
    status: GqlMembershipStatus;
    reason: GqlMembershipStatusReason;
    participationView?: {
      __typename?: "MembershipParticipationView";
      hosted: {
        __typename?: "MembershipHostedMetrics";
        totalParticipantCount: number;
        geo: Array<{
          __typename?: "MembershipParticipationLocation";
          placeId: string;
          placeName: string;
          placeImage: string;
          latitude: any;
          longitude: any;
          address: string;
        }>;
      };
    } | null;
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      articlesAboutMe?: Array<{
        __typename?: "Article";
        id: string;
        title: string;
        body?: string | null;
        introduction: string;
        thumbnail?: any | null;
        category: GqlArticleCategory;
        publishStatus: GqlPublishStatus;
        publishedAt?: Date | null;
      }> | null;
      opportunitiesCreatedByMe?: Array<{
        __typename?: "Opportunity";
        id: string;
        title: string;
        description: string;
        body?: string | null;
        images?: Array<string> | null;
        category: GqlOpportunityCategory;
        publishStatus: GqlPublishStatus;
        isReservableWithTicket?: boolean | null;
        requireApproval: boolean;
        feeRequired?: number | null;
        pointsToEarn?: number | null;
        earliestReservableAt?: Date | null;
        community?: {
          __typename?: "Community";
          id: string;
          name?: string | null;
          image?: string | null;
        } | null;
      }> | null;
    } | null;
    community?: {
      __typename?: "Community";
      id: string;
      name?: string | null;
      image?: string | null;
    } | null;
  } | null;
};

export type GqlGetMembershipListQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<GqlMembershipCursorInput>;
  filter?: InputMaybe<GqlMembershipFilterInput>;
  sort?: InputMaybe<GqlMembershipSortInput>;
  IsCard?: Scalars["Boolean"]["input"];
}>;

export type GqlGetMembershipListQuery = {
  __typename?: "Query";
  memberships: {
    __typename?: "MembershipsConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges?: Array<{
      __typename?: "MembershipEdge";
      cursor: string;
      node?: {
        __typename?: "Membership";
        hostOpportunityCount?: number | null;
        headline?: string | null;
        bio?: string | null;
        role: GqlRole;
        status: GqlMembershipStatus;
        reason: GqlMembershipStatusReason;
        participationView?: {
          __typename?: "MembershipParticipationView";
          hosted: {
            __typename?: "MembershipHostedMetrics";
            totalParticipantCount: number;
            geo: Array<{
              __typename?: "MembershipParticipationLocation";
              placeId: string;
              placeName: string;
              placeImage: string;
              latitude: any;
              longitude: any;
              address: string;
            }>;
          };
        } | null;
        user?: {
          __typename?: "User";
          id: string;
          image?: string | null;
          name: string;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          articlesAboutMe?: Array<{
            __typename?: "Article";
            id: string;
            title: string;
            body?: string | null;
            introduction: string;
            thumbnail?: any | null;
            category: GqlArticleCategory;
            publishStatus: GqlPublishStatus;
            publishedAt?: Date | null;
          }> | null;
        } | null;
        community?: {
          __typename?: "Community";
          id: string;
          name?: string | null;
          image?: string | null;
        } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlUserFieldsFragment = {
  __typename?: "User";
  id: string;
  name: string;
  image?: string | null;
  bio?: string | null;
  currentPrefecture?: GqlCurrentPrefecture | null;
  urlFacebook?: string | null;
  urlInstagram?: string | null;
  urlX?: string | null;
};

export type GqlUserPortfolioFieldsFragment = {
  __typename?: "Portfolio";
  id: string;
  title: string;
  thumbnailUrl?: string | null;
  source: GqlPortfolioSource;
  category: GqlPortfolioCategory;
  date: Date;
  reservationStatus?: GqlReservationStatus | null;
  place?: {
    __typename?: "Place";
    id: string;
    name: string;
    address: string;
    latitude: any;
    longitude: any;
    city?: {
      __typename?: "City";
      code: string;
      name: string;
      state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
    } | null;
  } | null;
  participants?: Array<{
    __typename?: "User";
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    currentPrefecture?: GqlCurrentPrefecture | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlX?: string | null;
  }> | null;
};

export type GqlUpdateMyProfileMutationVariables = Exact<{
  input: GqlUserUpdateProfileInput;
  permission: GqlCheckIsSelfPermissionInput;
}>;

export type GqlUpdateMyProfileMutation = {
  __typename?: "Mutation";
  userUpdateMyProfile?: {
    __typename?: "UserUpdateProfileSuccess";
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      slug?: string | null;
    } | null;
  } | null;
};

export type GqlGetUserFlexibleQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  withPortfolios?: Scalars["Boolean"]["input"];
  withWallets?: Scalars["Boolean"]["input"];
  withOpportunities?: Scalars["Boolean"]["input"];
}>;

export type GqlGetUserFlexibleQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    currentPrefecture?: GqlCurrentPrefecture | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlX?: string | null;
    portfolios?: Array<{
      __typename?: "Portfolio";
      id: string;
      title: string;
      thumbnailUrl?: string | null;
      source: GqlPortfolioSource;
      category: GqlPortfolioCategory;
      date: Date;
      reservationStatus?: GqlReservationStatus | null;
      place?: {
        __typename?: "Place";
        id: string;
        name: string;
        address: string;
        latitude: any;
        longitude: any;
        city?: {
          __typename?: "City";
          code: string;
          name: string;
          state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
        } | null;
      } | null;
      participants?: Array<{
        __typename?: "User";
        id: string;
        name: string;
        image?: string | null;
        bio?: string | null;
        currentPrefecture?: GqlCurrentPrefecture | null;
        urlFacebook?: string | null;
        urlInstagram?: string | null;
        urlX?: string | null;
      }> | null;
    }> | null;
    wallets?: Array<{
      __typename?: "Wallet";
      id: string;
      type: GqlWalletType;
      tickets?: Array<{
        __typename?: "Ticket";
        id: string;
        reason: GqlTicketStatusReason;
        status: GqlTicketStatus;
      }> | null;
      currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
    }> | null;
    opportunitiesCreatedByMe?: Array<{
      __typename?: "Opportunity";
      id: string;
      title: string;
      description: string;
      body?: string | null;
      images?: Array<string> | null;
      category: GqlOpportunityCategory;
      publishStatus: GqlPublishStatus;
      isReservableWithTicket?: boolean | null;
      requireApproval: boolean;
      feeRequired?: number | null;
      pointsToEarn?: number | null;
      earliestReservableAt?: Date | null;
      community?: {
        __typename?: "Community";
        id: string;
        name?: string | null;
        image?: string | null;
      } | null;
      place?: {
        __typename?: "Place";
        id: string;
        name: string;
        address: string;
        latitude: any;
        longitude: any;
        city?: {
          __typename?: "City";
          code: string;
          name: string;
          state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
        } | null;
      } | null;
    }> | null;
  } | null;
};

export type GqlGetUserWalletQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetUserWalletQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    currentPrefecture?: GqlCurrentPrefecture | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlX?: string | null;
    wallets?: Array<{
      __typename?: "Wallet";
      id: string;
      type: GqlWalletType;
      transactions?: Array<{
        __typename?: "Transaction";
        id: string;
        reason: GqlTransactionReason;
        fromPointChange?: number | null;
        toPointChange?: number | null;
        createdAt?: Date | null;
        fromWallet?: {
          __typename?: "Wallet";
          id: string;
          type: GqlWalletType;
          user?: {
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
            bio?: string | null;
            currentPrefecture?: GqlCurrentPrefecture | null;
            urlFacebook?: string | null;
            urlInstagram?: string | null;
            urlX?: string | null;
          } | null;
          currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
        } | null;
        toWallet?: {
          __typename?: "Wallet";
          id: string;
          type: GqlWalletType;
          user?: {
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
            bio?: string | null;
            currentPrefecture?: GqlCurrentPrefecture | null;
            urlFacebook?: string | null;
            urlInstagram?: string | null;
            urlX?: string | null;
          } | null;
          currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
        } | null;
      }> | null;
      tickets?: Array<{
        __typename?: "Ticket";
        id: string;
        reason: GqlTicketStatusReason;
        status: GqlTicketStatus;
        utility?: {
          __typename?: "Utility";
          id: string;
          name?: string | null;
          description?: string | null;
          images?: Array<string> | null;
          publishStatus: GqlPublishStatus;
          pointsRequired: number;
        } | null;
      }> | null;
      currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
    }> | null;
  } | null;
};

export type GqlWalletFieldsFragment = {
  __typename?: "Wallet";
  id: string;
  type: GqlWalletType;
  currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
};

export type GqlGetWalletsWithTransactionQueryVariables = Exact<{
  filter?: InputMaybe<GqlWalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GqlGetWalletsWithTransactionQuery = {
  __typename?: "Query";
  wallets: {
    __typename?: "WalletsConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges?: Array<{
      __typename?: "WalletEdge";
      cursor: string;
      node?: {
        __typename?: "Wallet";
        id: string;
        type: GqlWalletType;
        transactions?: Array<{
          __typename?: "Transaction";
          id: string;
          reason: GqlTransactionReason;
          fromPointChange?: number | null;
          toPointChange?: number | null;
          createdAt?: Date | null;
          fromWallet?: {
            __typename?: "Wallet";
            id: string;
            type: GqlWalletType;
            user?: {
              __typename?: "User";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
              currentPrefecture?: GqlCurrentPrefecture | null;
              urlFacebook?: string | null;
              urlInstagram?: string | null;
              urlX?: string | null;
            } | null;
            currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
          } | null;
          toWallet?: {
            __typename?: "Wallet";
            id: string;
            type: GqlWalletType;
            user?: {
              __typename?: "User";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
              currentPrefecture?: GqlCurrentPrefecture | null;
              urlFacebook?: string | null;
              urlInstagram?: string | null;
              urlX?: string | null;
            } | null;
            currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
          } | null;
        }> | null;
        currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetWalletsWithTicketQueryVariables = Exact<{
  filter?: InputMaybe<GqlWalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GqlGetWalletsWithTicketQuery = {
  __typename?: "Query";
  wallets: {
    __typename?: "WalletsConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges?: Array<{
      __typename?: "WalletEdge";
      cursor: string;
      node?: {
        __typename?: "Wallet";
        id: string;
        type: GqlWalletType;
        tickets?: Array<{
          __typename?: "Ticket";
          id: string;
          reason: GqlTicketStatusReason;
          status: GqlTicketStatus;
          utility?: {
            __typename?: "Utility";
            id: string;
            name?: string | null;
            description?: string | null;
            images?: Array<string> | null;
            publishStatus: GqlPublishStatus;
            pointsRequired: number;
          } | null;
        }> | null;
        currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlArticleFieldsFragment = {
  __typename?: "Article";
  id: string;
  title: string;
  body?: string | null;
  introduction: string;
  thumbnail?: any | null;
  category: GqlArticleCategory;
  publishStatus: GqlPublishStatus;
  publishedAt?: Date | null;
};

export type GqlGetArticlesQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlArticleFilterInput>;
  sort?: InputMaybe<GqlArticleSortInput>;
}>;

export type GqlGetArticlesQuery = {
  __typename?: "Query";
  articles: {
    __typename?: "ArticlesConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges?: Array<{
      __typename?: "ArticleEdge";
      cursor: string;
      node?: {
        __typename?: "Article";
        id: string;
        title: string;
        body?: string | null;
        introduction: string;
        thumbnail?: any | null;
        category: GqlArticleCategory;
        publishStatus: GqlPublishStatus;
        publishedAt?: Date | null;
        authors?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
        }> | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetArticleQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlGetArticleQuery = {
  __typename?: "Query";
  article?: {
    __typename?: "Article";
    id: string;
    title: string;
    body?: string | null;
    introduction: string;
    thumbnail?: any | null;
    category: GqlArticleCategory;
    publishStatus: GqlPublishStatus;
    publishedAt?: Date | null;
    authors?: Array<{
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      opportunitiesCreatedByMe?: Array<{
        __typename?: "Opportunity";
        id: string;
        title: string;
        description: string;
        body?: string | null;
        images?: Array<string> | null;
        category: GqlOpportunityCategory;
        publishStatus: GqlPublishStatus;
        isReservableWithTicket?: boolean | null;
        requireApproval: boolean;
        feeRequired?: number | null;
        pointsToEarn?: number | null;
        earliestReservableAt?: Date | null;
        place?: {
          __typename?: "Place";
          id: string;
          name: string;
          address: string;
          latitude: any;
          longitude: any;
          city?: {
            __typename?: "City";
            code: string;
            name: string;
            state?: {
              __typename?: "State";
              code: string;
              countryCode: string;
              name: string;
            } | null;
          } | null;
        } | null;
      }> | null;
    }> | null;
    relatedUsers?: Array<{
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
    }> | null;
  } | null;
  articles: {
    __typename?: "ArticlesConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges?: Array<{
      __typename?: "ArticleEdge";
      cursor: string;
      node?: {
        __typename?: "Article";
        id: string;
        title: string;
        body?: string | null;
        introduction: string;
        thumbnail?: any | null;
        category: GqlArticleCategory;
        publishStatus: GqlPublishStatus;
        publishedAt?: Date | null;
        authors?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
        }> | null;
      } | null;
    } | null> | null;
  };
};

export type GqlEvaluationFieldsFragment = {
  __typename?: "Evaluation";
  id: string;
  comment?: string | null;
  credentialUrl?: string | null;
  status: GqlEvaluationStatus;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  issuedAt?: Date | null;
};

export type GqlGetEvaluationsQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetEvaluationsQuery = {
  __typename?: "Query";
  evaluations: {
    __typename?: "EvaluationsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "EvaluationEdge";
      node?: { __typename?: "Evaluation"; id: string } | null;
    }>;
  };
};

export type GqlGetEvaluationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetEvaluationQuery = {
  __typename?: "Query";
  evaluation?: { __typename?: "Evaluation"; id: string } | null;
};

export type GqlOpportunityFieldsFragment = {
  __typename?: "Opportunity";
  id: string;
  title: string;
  description: string;
  body?: string | null;
  images?: Array<string> | null;
  category: GqlOpportunityCategory;
  publishStatus: GqlPublishStatus;
  isReservableWithTicket?: boolean | null;
  requireApproval: boolean;
  feeRequired?: number | null;
  pointsToEarn?: number | null;
  earliestReservableAt?: Date | null;
};

export type GqlGetOpportunitiesQueryVariables = Exact<{
  filter?: InputMaybe<GqlOpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GqlGetOpportunitiesQuery = {
  __typename?: "Query";
  opportunities: {
    __typename?: "OpportunitiesConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges: Array<{
      __typename?: "OpportunityEdge";
      cursor: string;
      node?: {
        __typename?: "Opportunity";
        id: string;
        title: string;
        description: string;
        body?: string | null;
        images?: Array<string> | null;
        category: GqlOpportunityCategory;
        publishStatus: GqlPublishStatus;
        isReservableWithTicket?: boolean | null;
        requireApproval: boolean;
        feeRequired?: number | null;
        pointsToEarn?: number | null;
        earliestReservableAt?: Date | null;
        community?: {
          __typename?: "Community";
          id: string;
          name?: string | null;
          image?: string | null;
        } | null;
        slots?: Array<{
          __typename?: "OpportunitySlot";
          id: string;
          hostingStatus: GqlOpportunitySlotHostingStatus;
          startsAt: Date;
          endsAt: Date;
          capacity?: number | null;
          remainingCapacity?: number | null;
        }> | null;
        place?: {
          __typename?: "Place";
          id: string;
          name: string;
          address: string;
          latitude: any;
          longitude: any;
          city?: {
            __typename?: "City";
            code: string;
            name: string;
            state?: {
              __typename?: "State";
              code: string;
              countryCode: string;
              name: string;
            } | null;
          } | null;
        } | null;
      } | null;
    }>;
  };
};

export type GqlGetOpportunityQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlGetOpportunityQuery = {
  __typename?: "Query";
  opportunity?: {
    __typename?: "Opportunity";
    id: string;
    title: string;
    description: string;
    body?: string | null;
    images?: Array<string> | null;
    category: GqlOpportunityCategory;
    publishStatus: GqlPublishStatus;
    isReservableWithTicket?: boolean | null;
    requireApproval: boolean;
    feeRequired?: number | null;
    pointsToEarn?: number | null;
    earliestReservableAt?: Date | null;
    community?: {
      __typename?: "Community";
      id: string;
      name?: string | null;
      image?: string | null;
    } | null;
    place?: {
      __typename?: "Place";
      id: string;
      name: string;
      address: string;
      latitude: any;
      longitude: any;
      city?: {
        __typename?: "City";
        code: string;
        name: string;
        state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
      } | null;
    } | null;
    slots?: Array<{
      __typename?: "OpportunitySlot";
      id: string;
      hostingStatus: GqlOpportunitySlotHostingStatus;
      startsAt: Date;
      endsAt: Date;
      capacity?: number | null;
      remainingCapacity?: number | null;
      reservations?: Array<{
        __typename?: "Reservation";
        id: string;
        status: GqlReservationStatus;
        participations?: Array<{
          __typename?: "Participation";
          id: string;
          source?: GqlSource | null;
          status: GqlParticipationStatus;
          reason: GqlParticipationStatusReason;
          images?: Array<string> | null;
          description?: string | null;
          user?: {
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
            bio?: string | null;
            currentPrefecture?: GqlCurrentPrefecture | null;
            urlFacebook?: string | null;
            urlInstagram?: string | null;
            urlX?: string | null;
          } | null;
        }> | null;
      }> | null;
    }> | null;
    createdByUser?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      articlesAboutMe?: Array<{
        __typename?: "Article";
        id: string;
        title: string;
        body?: string | null;
        introduction: string;
        thumbnail?: any | null;
        category: GqlArticleCategory;
        publishStatus: GqlPublishStatus;
        publishedAt?: Date | null;
      }> | null;
      opportunitiesCreatedByMe?: Array<{
        __typename?: "Opportunity";
        id: string;
        title: string;
        description: string;
        body?: string | null;
        images?: Array<string> | null;
        category: GqlOpportunityCategory;
        publishStatus: GqlPublishStatus;
        isReservableWithTicket?: boolean | null;
        requireApproval: boolean;
        feeRequired?: number | null;
        pointsToEarn?: number | null;
        earliestReservableAt?: Date | null;
        community?: {
          __typename?: "Community";
          id: string;
          name?: string | null;
          image?: string | null;
        } | null;
        slots?: Array<{
          __typename?: "OpportunitySlot";
          id: string;
          hostingStatus: GqlOpportunitySlotHostingStatus;
          startsAt: Date;
          endsAt: Date;
          capacity?: number | null;
          remainingCapacity?: number | null;
          reservations?: Array<{
            __typename?: "Reservation";
            id: string;
            status: GqlReservationStatus;
            participations?: Array<{
              __typename?: "Participation";
              id: string;
              source?: GqlSource | null;
              status: GqlParticipationStatus;
              reason: GqlParticipationStatusReason;
              images?: Array<string> | null;
              description?: string | null;
              user?: {
                __typename?: "User";
                id: string;
                name: string;
                image?: string | null;
                bio?: string | null;
                currentPrefecture?: GqlCurrentPrefecture | null;
                urlFacebook?: string | null;
                urlInstagram?: string | null;
                urlX?: string | null;
              } | null;
            }> | null;
          }> | null;
        }> | null;
      }> | null;
    } | null;
  } | null;
};

export type GqlSearchOpportunitiesQueryVariables = Exact<{
  filter?: InputMaybe<GqlOpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlSearchOpportunitiesQuery = {
  __typename?: "Query";
  opportunities: {
    __typename?: "OpportunitiesConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges: Array<{
      __typename?: "OpportunityEdge";
      cursor: string;
      node?: {
        __typename?: "Opportunity";
        id: string;
        title: string;
        description: string;
        body?: string | null;
        images?: Array<string> | null;
        category: GqlOpportunityCategory;
        publishStatus: GqlPublishStatus;
        isReservableWithTicket?: boolean | null;
        requireApproval: boolean;
        feeRequired?: number | null;
        pointsToEarn?: number | null;
        earliestReservableAt?: Date | null;
        community?: {
          __typename?: "Community";
          id: string;
          name?: string | null;
          image?: string | null;
        } | null;
        place?: {
          __typename?: "Place";
          id: string;
          name: string;
          address: string;
          latitude: any;
          longitude: any;
          city?: {
            __typename?: "City";
            code: string;
            name: string;
            state?: {
              __typename?: "State";
              code: string;
              countryCode: string;
              name: string;
            } | null;
          } | null;
        } | null;
        slots?: Array<{
          __typename?: "OpportunitySlot";
          id: string;
          hostingStatus: GqlOpportunitySlotHostingStatus;
          startsAt: Date;
          endsAt: Date;
          capacity?: number | null;
          remainingCapacity?: number | null;
          reservations?: Array<{
            __typename?: "Reservation";
            id: string;
            status: GqlReservationStatus;
            participations?: Array<{
              __typename?: "Participation";
              id: string;
              source?: GqlSource | null;
              status: GqlParticipationStatus;
              reason: GqlParticipationStatusReason;
              images?: Array<string> | null;
              description?: string | null;
              user?: {
                __typename?: "User";
                id: string;
                name: string;
                image?: string | null;
                bio?: string | null;
                currentPrefecture?: GqlCurrentPrefecture | null;
                urlFacebook?: string | null;
                urlInstagram?: string | null;
                urlX?: string | null;
              } | null;
            }> | null;
          }> | null;
        }> | null;
      } | null;
    }>;
  };
};

export type GqlOpportunitySlotFieldsFragment = {
  __typename?: "OpportunitySlot";
  id: string;
  hostingStatus: GqlOpportunitySlotHostingStatus;
  startsAt: Date;
  endsAt: Date;
  capacity?: number | null;
  remainingCapacity?: number | null;
};

export type GqlGetOpportunitySlotsQueryVariables = Exact<{
  filter?: InputMaybe<GqlOpportunitySlotFilterInput>;
}>;

export type GqlGetOpportunitySlotsQuery = {
  __typename?: "Query";
  opportunitySlots: {
    __typename?: "OpportunitySlotsConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges?: Array<{
      __typename?: "OpportunitySlotEdge";
      cursor: string;
      node?: {
        __typename?: "OpportunitySlot";
        id: string;
        hostingStatus: GqlOpportunitySlotHostingStatus;
        startsAt: Date;
        endsAt: Date;
        capacity?: number | null;
        remainingCapacity?: number | null;
        opportunity?: {
          __typename?: "Opportunity";
          id: string;
          title: string;
          description: string;
          body?: string | null;
          images?: Array<string> | null;
          category: GqlOpportunityCategory;
          publishStatus: GqlPublishStatus;
          isReservableWithTicket?: boolean | null;
          requireApproval: boolean;
          feeRequired?: number | null;
          pointsToEarn?: number | null;
          earliestReservableAt?: Date | null;
        } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetOpportunitySlotQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetOpportunitySlotQuery = {
  __typename?: "Query";
  opportunitySlot?: { __typename?: "OpportunitySlot"; id: string } | null;
};

export type GqlParticipationFieldsFragment = {
  __typename?: "Participation";
  id: string;
  source?: GqlSource | null;
  status: GqlParticipationStatus;
  reason: GqlParticipationStatusReason;
  images?: Array<string> | null;
  description?: string | null;
};

export type GqlGetParticipationsQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetParticipationsQuery = {
  __typename?: "Query";
  participations: {
    __typename?: "ParticipationsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "ParticipationEdge";
      node?: { __typename?: "Participation"; id: string } | null;
    }>;
  };
};

export type GqlGetParticipationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetParticipationQuery = {
  __typename?: "Query";
  participation?: {
    __typename?: "Participation";
    id: string;
    source?: GqlSource | null;
    status: GqlParticipationStatus;
    reason: GqlParticipationStatusReason;
    images?: Array<string> | null;
    description?: string | null;
    reservation?: {
      __typename?: "Reservation";
      id: string;
      status: GqlReservationStatus;
      opportunitySlot?: {
        __typename?: "OpportunitySlot";
        id: string;
        hostingStatus: GqlOpportunitySlotHostingStatus;
        startsAt: Date;
        endsAt: Date;
        capacity?: number | null;
        remainingCapacity?: number | null;
        opportunity?: {
          __typename?: "Opportunity";
          id: string;
          title: string;
          description: string;
          body?: string | null;
          images?: Array<string> | null;
          category: GqlOpportunityCategory;
          publishStatus: GqlPublishStatus;
          isReservableWithTicket?: boolean | null;
          requireApproval: boolean;
          feeRequired?: number | null;
          pointsToEarn?: number | null;
          earliestReservableAt?: Date | null;
          community?: {
            __typename?: "Community";
            id: string;
            name?: string | null;
            image?: string | null;
          } | null;
          createdByUser?: {
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
            bio?: string | null;
            currentPrefecture?: GqlCurrentPrefecture | null;
            urlFacebook?: string | null;
            urlInstagram?: string | null;
            urlX?: string | null;
          } | null;
          place?: {
            __typename?: "Place";
            id: string;
            name: string;
            address: string;
            latitude: any;
            longitude: any;
            city?: {
              __typename?: "City";
              code: string;
              name: string;
              state?: {
                __typename?: "State";
                code: string;
                countryCode: string;
                name: string;
              } | null;
            } | null;
          } | null;
        } | null;
      } | null;
    } | null;
    statusHistories?: Array<{
      __typename?: "ParticipationStatusHistory";
      id: string;
      status: GqlParticipationStatus;
      reason: GqlParticipationStatusReason;
      createdAt?: Date | null;
      createdByUser?: {
        __typename?: "User";
        id: string;
        name: string;
        image?: string | null;
        bio?: string | null;
        currentPrefecture?: GqlCurrentPrefecture | null;
        urlFacebook?: string | null;
        urlInstagram?: string | null;
        urlX?: string | null;
      } | null;
    }> | null;
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
    } | null;
  } | null;
};

export type GqlReservationFieldsFragment = {
  __typename?: "Reservation";
  id: string;
  status: GqlReservationStatus;
};

export type GqlCreateReservationMutationVariables = Exact<{
  input: GqlReservationCreateInput;
}>;

export type GqlCreateReservationMutation = {
  __typename?: "Mutation";
  reservationCreate?:
    | { __typename: "MissingTicketIdsError"; message: string }
    | { __typename: "ReservationAdvanceBookingRequiredError"; message: string }
    | {
        __typename?: "ReservationCreateSuccess";
        reservation: { __typename?: "Reservation"; id: string; status: GqlReservationStatus };
      }
    | { __typename: "ReservationFullError"; message: string; capacity: number; requested: number }
    | { __typename: "ReservationNotAcceptedError"; message: string }
    | { __typename: "SlotNotScheduledError"; message: string }
    | {
        __typename: "TicketParticipantMismatchError";
        message: string;
        ticketCount: number;
        participantCount: number;
      }
    | null;
};

export type GqlCancelReservationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlReservationCancelInput;
  permission: GqlCheckIsSelfPermissionInput;
}>;

export type GqlCancelReservationMutation = {
  __typename?: "Mutation";
  reservationCancel?:
    | { __typename?: "AlreadyJoinedError" }
    | { __typename?: "NoAvailableParticipationSlotsError" }
    | { __typename?: "ReservationCancellationTimeoutError"; message: string }
    | {
        __typename?: "ReservationSetStatusSuccess";
        reservation: { __typename?: "Reservation"; id: string; status: GqlReservationStatus };
      }
    | null;
};

export type GqlGetReservationsQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetReservationsQuery = {
  __typename?: "Query";
  reservations: {
    __typename?: "ReservationsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "ReservationEdge";
      node?: { __typename?: "Reservation"; id: string } | null;
    }>;
  };
};

export type GqlGetReservationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetReservationQuery = {
  __typename?: "Query";
  reservation?: {
    __typename?: "Reservation";
    id: string;
    status: GqlReservationStatus;
    opportunitySlot?: {
      __typename?: "OpportunitySlot";
      id: string;
      hostingStatus: GqlOpportunitySlotHostingStatus;
      startsAt: Date;
      endsAt: Date;
      capacity?: number | null;
      remainingCapacity?: number | null;
      opportunity?: {
        __typename?: "Opportunity";
        id: string;
        title: string;
        description: string;
        body?: string | null;
        images?: Array<string> | null;
        category: GqlOpportunityCategory;
        publishStatus: GqlPublishStatus;
        isReservableWithTicket?: boolean | null;
        requireApproval: boolean;
        feeRequired?: number | null;
        pointsToEarn?: number | null;
        earliestReservableAt?: Date | null;
        createdByUser?: {
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          articlesAboutMe?: Array<{
            __typename?: "Article";
            id: string;
            title: string;
            body?: string | null;
            introduction: string;
            thumbnail?: any | null;
            category: GqlArticleCategory;
            publishStatus: GqlPublishStatus;
            publishedAt?: Date | null;
          }> | null;
        } | null;
        place?: {
          __typename?: "Place";
          id: string;
          name: string;
          address: string;
          latitude: any;
          longitude: any;
          city?: {
            __typename?: "City";
            code: string;
            name: string;
            state?: {
              __typename?: "State";
              code: string;
              countryCode: string;
              name: string;
            } | null;
          } | null;
        } | null;
      } | null;
    } | null;
    participations?: Array<{
      __typename?: "Participation";
      id: string;
      source?: GqlSource | null;
      status: GqlParticipationStatus;
      reason: GqlParticipationStatusReason;
      images?: Array<string> | null;
      description?: string | null;
    }> | null;
  } | null;
};

export type GqlPlaceFieldsFragment = {
  __typename?: "Place";
  id: string;
  name: string;
  address: string;
  latitude: any;
  longitude: any;
  city?: {
    __typename?: "City";
    code: string;
    name: string;
    state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
  } | null;
};

export type GqlGetPlacesQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetPlacesQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "PlaceEdge";
      node?: { __typename?: "Place"; id: string; name: string } | null;
    } | null> | null;
  };
};

export type GqlTicketFieldsFragment = {
  __typename?: "Ticket";
  id: string;
  reason: GqlTicketStatusReason;
  status: GqlTicketStatus;
};

export type GqlTicketClaimMutationVariables = Exact<{
  input: GqlTicketClaimInput;
}>;

export type GqlTicketClaimMutation = {
  __typename?: "Mutation";
  ticketClaim?: {
    __typename?: "TicketClaimSuccess";
    tickets: Array<{ __typename?: "Ticket"; id: string }>;
  } | null;
};

export type GqlGetTicketsQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetTicketsQuery = {
  __typename?: "Query";
  tickets: {
    __typename?: "TicketsConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "TicketEdge";
      node?: { __typename?: "Ticket"; id: string } | null;
    } | null> | null;
  };
};

export type GqlGetTicketQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetTicketQuery = {
  __typename?: "Query";
  ticket?: { __typename?: "Ticket"; id: string } | null;
};

export type GqlTicketClaimLinkFieldsFragment = {
  __typename?: "TicketClaimLink";
  id: string;
  qty: number;
  status: GqlClaimLinkStatus;
  claimedAt?: Date | null;
};

export type GqlTicketClaimLinkQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlTicketClaimLinkQuery = {
  __typename?: "Query";
  ticketClaimLink?: {
    __typename?: "TicketClaimLink";
    qty: number;
    status: GqlClaimLinkStatus;
    issuer?: {
      __typename?: "TicketIssuer";
      owner?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
    } | null;
  } | null;
};

export type GqlUtilityFieldsFragment = {
  __typename?: "Utility";
  id: string;
  name?: string | null;
  description?: string | null;
  images?: Array<string> | null;
  publishStatus: GqlPublishStatus;
  pointsRequired: number;
};

export type GqlGetUtilitiesQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetUtilitiesQuery = {
  __typename?: "Query";
  utilities: {
    __typename?: "UtilitiesConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "UtilityEdge";
      node?: { __typename?: "Utility"; id: string; name?: string | null } | null;
    } | null> | null;
  };
};

export type GqlTransactionFieldsFragment = {
  __typename?: "Transaction";
  id: string;
  reason: GqlTransactionReason;
  fromPointChange?: number | null;
  toPointChange?: number | null;
  createdAt?: Date | null;
};

export type GqlGetTransactionsQueryVariables = Exact<{
  filter?: InputMaybe<GqlTransactionFilterInput>;
}>;

export type GqlGetTransactionsQuery = {
  __typename?: "Query";
  transactions: {
    __typename?: "TransactionsConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges?: Array<{
      __typename?: "TransactionEdge";
      cursor: string;
      node?: {
        __typename?: "Transaction";
        id: string;
        reason: GqlTransactionReason;
        fromPointChange?: number | null;
        toPointChange?: number | null;
        createdAt?: Date | null;
        fromWallet?: {
          __typename?: "Wallet";
          id: string;
          type: GqlWalletType;
          user?: {
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
            bio?: string | null;
            currentPrefecture?: GqlCurrentPrefecture | null;
            urlFacebook?: string | null;
            urlInstagram?: string | null;
            urlX?: string | null;
          } | null;
          currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
        } | null;
        toWallet?: {
          __typename?: "Wallet";
          id: string;
          type: GqlWalletType;
          user?: {
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
            bio?: string | null;
            currentPrefecture?: GqlCurrentPrefecture | null;
            urlFacebook?: string | null;
            urlInstagram?: string | null;
            urlX?: string | null;
          } | null;
          currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
        } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetTransactionQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetTransactionQuery = {
  __typename?: "Query";
  transaction?: { __typename?: "Transaction"; id: string } | null;
};

export const CommunityFieldsFragmentDoc = gql`
  fragment CommunityFields on Community {
    id
    name
    image
  }
`;
export const IdentityFieldsFragmentDoc = gql`
  fragment IdentityFields on Identity {
    uid
    platform
    createdAt
    updatedAt
  }
`;
export const MembershipFieldsFragmentDoc = gql`
  fragment MembershipFields on Membership {
    headline
    bio
    role
    status
    reason
  }
`;
export const HostedGeoFieldsFragmentDoc = gql`
  fragment HostedGeoFields on MembershipHostedMetrics {
    totalParticipantCount
    geo {
      placeId
      placeName
      placeImage
      latitude
      longitude
      address
    }
  }
`;
export const PlaceFieldsFragmentDoc = gql`
  fragment PlaceFields on Place {
    id
    name
    address
    latitude
    longitude
    city {
      code
      name
      state {
        code
        countryCode
        name
      }
    }
  }
`;
export const UserFieldsFragmentDoc = gql`
  fragment UserFields on User {
    id
    name
    image
    bio
    currentPrefecture
    urlFacebook
    urlInstagram
    urlX
  }
`;
export const UserPortfolioFieldsFragmentDoc = gql`
  fragment UserPortfolioFields on Portfolio {
    id
    title
    thumbnailUrl
    source
    category
    date
    reservationStatus
    place {
      ...PlaceFields
    }
    participants {
      ...UserFields
    }
  }
  ${PlaceFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
`;
export const WalletFieldsFragmentDoc = gql`
  fragment WalletFields on Wallet {
    id
    type
    currentPointView {
      currentPoint
    }
  }
`;
export const ArticleFieldsFragmentDoc = gql`
  fragment ArticleFields on Article {
    id
    title
    body
    introduction
    thumbnail
    category
    publishStatus
    publishedAt
  }
`;
export const EvaluationFieldsFragmentDoc = gql`
  fragment EvaluationFields on Evaluation {
    id
    comment
    credentialUrl
    status
    createdAt
    updatedAt
    issuedAt
  }
`;
export const OpportunityFieldsFragmentDoc = gql`
  fragment OpportunityFields on Opportunity {
    id
    title
    description
    body
    images
    category
    publishStatus
    isReservableWithTicket
    requireApproval
    feeRequired
    pointsToEarn
    earliestReservableAt
  }
`;
export const OpportunitySlotFieldsFragmentDoc = gql`
  fragment OpportunitySlotFields on OpportunitySlot {
    id
    hostingStatus
    startsAt
    endsAt
    capacity
    remainingCapacity
  }
`;
export const ParticipationFieldsFragmentDoc = gql`
  fragment ParticipationFields on Participation {
    id
    source
    status
    reason
    images
    description
  }
`;
export const ReservationFieldsFragmentDoc = gql`
  fragment ReservationFields on Reservation {
    id
    status
  }
`;
export const TicketFieldsFragmentDoc = gql`
  fragment TicketFields on Ticket {
    id
    reason
    status
  }
`;
export const TicketClaimLinkFieldsFragmentDoc = gql`
  fragment TicketClaimLinkFields on TicketClaimLink {
    id
    qty
    status
    claimedAt
  }
`;
export const UtilityFieldsFragmentDoc = gql`
  fragment UtilityFields on Utility {
    id
    name
    description
    images
    publishStatus
    pointsRequired
  }
`;
export const TransactionFieldsFragmentDoc = gql`
  fragment TransactionFields on Transaction {
    id
    reason
    fromPointChange
    toPointChange
    createdAt
  }
`;
export const GetCommunitiesDocument = gql`
  query GetCommunities {
    communities {
      edges {
        node {
          id
          name
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetCommunitiesQuery__
 *
 * To run a query within a React component, call `useGetCommunitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommunitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommunitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCommunitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetCommunitiesQuery, GqlGetCommunitiesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetCommunitiesQuery, GqlGetCommunitiesQueryVariables>(
    GetCommunitiesDocument,
    options,
  );
}
export function useGetCommunitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetCommunitiesQuery,
    GqlGetCommunitiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetCommunitiesQuery, GqlGetCommunitiesQueryVariables>(
    GetCommunitiesDocument,
    options,
  );
}
export function useGetCommunitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetCommunitiesQuery, GqlGetCommunitiesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetCommunitiesQuery, GqlGetCommunitiesQueryVariables>(
    GetCommunitiesDocument,
    options,
  );
}
export type GetCommunitiesQueryHookResult = ReturnType<typeof useGetCommunitiesQuery>;
export type GetCommunitiesLazyQueryHookResult = ReturnType<typeof useGetCommunitiesLazyQuery>;
export type GetCommunitiesSuspenseQueryHookResult = ReturnType<
  typeof useGetCommunitiesSuspenseQuery
>;
export type GetCommunitiesQueryResult = Apollo.QueryResult<
  GqlGetCommunitiesQuery,
  GqlGetCommunitiesQueryVariables
>;
export const GetCommunityDocument = gql`
  query GetCommunity($id: ID!) {
    community(id: $id) {
      id
      name
    }
  }
`;

/**
 * __useGetCommunityQuery__
 *
 * To run a query within a React component, call `useGetCommunityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommunityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommunityQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCommunityQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetCommunityQuery, GqlGetCommunityQueryVariables> &
    ({ variables: GqlGetCommunityQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetCommunityQuery, GqlGetCommunityQueryVariables>(
    GetCommunityDocument,
    options,
  );
}
export function useGetCommunityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetCommunityQuery, GqlGetCommunityQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetCommunityQuery, GqlGetCommunityQueryVariables>(
    GetCommunityDocument,
    options,
  );
}
export function useGetCommunitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetCommunityQuery, GqlGetCommunityQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetCommunityQuery, GqlGetCommunityQueryVariables>(
    GetCommunityDocument,
    options,
  );
}
export type GetCommunityQueryHookResult = ReturnType<typeof useGetCommunityQuery>;
export type GetCommunityLazyQueryHookResult = ReturnType<typeof useGetCommunityLazyQuery>;
export type GetCommunitySuspenseQueryHookResult = ReturnType<typeof useGetCommunitySuspenseQuery>;
export type GetCommunityQueryResult = Apollo.QueryResult<
  GqlGetCommunityQuery,
  GqlGetCommunityQueryVariables
>;
export const UserSignUpDocument = gql`
  mutation userSignUp($input: UserSignUpInput!) {
    userSignUp(input: $input) {
      user {
        id
        name
      }
    }
  }
`;
export type GqlUserSignUpMutationFn = Apollo.MutationFunction<
  GqlUserSignUpMutation,
  GqlUserSignUpMutationVariables
>;

/**
 * __useUserSignUpMutation__
 *
 * To run a mutation, you first call `useUserSignUpMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUserSignUpMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [userSignUpMutation, { data, loading, error }] = useUserSignUpMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUserSignUpMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlUserSignUpMutation, GqlUserSignUpMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlUserSignUpMutation, GqlUserSignUpMutationVariables>(
    UserSignUpDocument,
    options,
  );
}
export type UserSignUpMutationHookResult = ReturnType<typeof useUserSignUpMutation>;
export type UserSignUpMutationResult = Apollo.MutationResult<GqlUserSignUpMutation>;
export type UserSignUpMutationOptions = Apollo.BaseMutationOptions<
  GqlUserSignUpMutation,
  GqlUserSignUpMutationVariables
>;
export const StorePhoneAuthTokenDocument = gql`
  mutation storePhoneAuthToken($input: StorePhoneAuthTokenInput!) {
    storePhoneAuthToken(input: $input) {
      success
      expiresAt
    }
  }
`;
export type GqlStorePhoneAuthTokenMutationFn = Apollo.MutationFunction<
  GqlStorePhoneAuthTokenMutation,
  GqlStorePhoneAuthTokenMutationVariables
>;

/**
 * __useStorePhoneAuthTokenMutation__
 *
 * To run a mutation, you first call `useStorePhoneAuthTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useStorePhoneAuthTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [storePhoneAuthTokenMutation, { data, loading, error }] = useStorePhoneAuthTokenMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useStorePhoneAuthTokenMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlStorePhoneAuthTokenMutation,
    GqlStorePhoneAuthTokenMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlStorePhoneAuthTokenMutation,
    GqlStorePhoneAuthTokenMutationVariables
  >(StorePhoneAuthTokenDocument, options);
}
export type StorePhoneAuthTokenMutationHookResult = ReturnType<
  typeof useStorePhoneAuthTokenMutation
>;
export type StorePhoneAuthTokenMutationResult =
  Apollo.MutationResult<GqlStorePhoneAuthTokenMutation>;
export type StorePhoneAuthTokenMutationOptions = Apollo.BaseMutationOptions<
  GqlStorePhoneAuthTokenMutation,
  GqlStorePhoneAuthTokenMutationVariables
>;
export const LinkPhoneAuthDocument = gql`
  mutation linkPhoneAuth($input: LinkPhoneAuthInput!, $permission: CheckIsSelfPermissionInput!) {
    linkPhoneAuth(input: $input, permission: $permission) {
      success
      user {
        id
        name
      }
    }
  }
`;
export type GqlLinkPhoneAuthMutationFn = Apollo.MutationFunction<
  GqlLinkPhoneAuthMutation,
  GqlLinkPhoneAuthMutationVariables
>;

/**
 * __useLinkPhoneAuthMutation__
 *
 * To run a mutation, you first call `useLinkPhoneAuthMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkPhoneAuthMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkPhoneAuthMutation, { data, loading, error }] = useLinkPhoneAuthMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useLinkPhoneAuthMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlLinkPhoneAuthMutation,
    GqlLinkPhoneAuthMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlLinkPhoneAuthMutation, GqlLinkPhoneAuthMutationVariables>(
    LinkPhoneAuthDocument,
    options,
  );
}
export type LinkPhoneAuthMutationHookResult = ReturnType<typeof useLinkPhoneAuthMutation>;
export type LinkPhoneAuthMutationResult = Apollo.MutationResult<GqlLinkPhoneAuthMutation>;
export type LinkPhoneAuthMutationOptions = Apollo.BaseMutationOptions<
  GqlLinkPhoneAuthMutation,
  GqlLinkPhoneAuthMutationVariables
>;
export const CurrentUserDocument = gql`
  query currentUser {
    currentUser {
      user {
        id
        name
        memberships {
          ...MembershipFields
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
  ${MembershipFieldsFragmentDoc}
`;

/**
 * __useCurrentUserQuery__
 *
 * To run a query within a React component, call `useCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlCurrentUserQuery, GqlCurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlCurrentUserQuery, GqlCurrentUserQueryVariables>(
    CurrentUserDocument,
    options,
  );
}
export function useCurrentUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlCurrentUserQuery, GqlCurrentUserQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlCurrentUserQuery, GqlCurrentUserQueryVariables>(
    CurrentUserDocument,
    options,
  );
}
export function useCurrentUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlCurrentUserQuery, GqlCurrentUserQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlCurrentUserQuery, GqlCurrentUserQueryVariables>(
    CurrentUserDocument,
    options,
  );
}
export type CurrentUserQueryHookResult = ReturnType<typeof useCurrentUserQuery>;
export type CurrentUserLazyQueryHookResult = ReturnType<typeof useCurrentUserLazyQuery>;
export type CurrentUserSuspenseQueryHookResult = ReturnType<typeof useCurrentUserSuspenseQuery>;
export type CurrentUserQueryResult = Apollo.QueryResult<
  GqlCurrentUserQuery,
  GqlCurrentUserQueryVariables
>;
export const GetSingleMembershipDocument = gql`
  query GetSingleMembership($communityId: ID!, $userId: ID!) {
    membership(communityId: $communityId, userId: $userId) {
      ...MembershipFields
      participationView {
        hosted {
          ...HostedGeoFields
        }
      }
      user {
        ...UserFields
        articlesAboutMe {
          ...ArticleFields
        }
        opportunitiesCreatedByMe {
          ...OpportunityFields
          community {
            ...CommunityFields
          }
        }
      }
      community {
        ...CommunityFields
      }
    }
  }
  ${MembershipFieldsFragmentDoc}
  ${HostedGeoFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${ArticleFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
`;

/**
 * __useGetSingleMembershipQuery__
 *
 * To run a query within a React component, call `useGetSingleMembershipQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSingleMembershipQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSingleMembershipQuery({
 *   variables: {
 *      communityId: // value for 'communityId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetSingleMembershipQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetSingleMembershipQuery,
    GqlGetSingleMembershipQueryVariables
  > &
    ({ variables: GqlGetSingleMembershipQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetSingleMembershipQuery, GqlGetSingleMembershipQueryVariables>(
    GetSingleMembershipDocument,
    options,
  );
}
export function useGetSingleMembershipLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetSingleMembershipQuery,
    GqlGetSingleMembershipQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetSingleMembershipQuery, GqlGetSingleMembershipQueryVariables>(
    GetSingleMembershipDocument,
    options,
  );
}
export function useGetSingleMembershipSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetSingleMembershipQuery,
        GqlGetSingleMembershipQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetSingleMembershipQuery, GqlGetSingleMembershipQueryVariables>(
    GetSingleMembershipDocument,
    options,
  );
}
export type GetSingleMembershipQueryHookResult = ReturnType<typeof useGetSingleMembershipQuery>;
export type GetSingleMembershipLazyQueryHookResult = ReturnType<
  typeof useGetSingleMembershipLazyQuery
>;
export type GetSingleMembershipSuspenseQueryHookResult = ReturnType<
  typeof useGetSingleMembershipSuspenseQuery
>;
export type GetSingleMembershipQueryResult = Apollo.QueryResult<
  GqlGetSingleMembershipQuery,
  GqlGetSingleMembershipQueryVariables
>;
export const GetMembershipListDocument = gql`
  query GetMembershipList(
    $first: Int
    $cursor: MembershipCursorInput
    $filter: MembershipFilterInput
    $sort: MembershipSortInput
    $IsCard: Boolean! = false
  ) {
    memberships(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...MembershipFields
          participationView {
            hosted {
              ...HostedGeoFields
            }
          }
          hostOpportunityCount @include(if: $IsCard)
          user {
            id
            image
            ...UserFields @include(if: $IsCard)
            articlesAboutMe @include(if: $IsCard) {
              ...ArticleFields
            }
          }
          community @include(if: $IsCard) {
            ...CommunityFields
          }
        }
      }
    }
  }
  ${MembershipFieldsFragmentDoc}
  ${HostedGeoFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${ArticleFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
`;

/**
 * __useGetMembershipListQuery__
 *
 * To run a query within a React component, call `useGetMembershipListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMembershipListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMembershipListQuery({
 *   variables: {
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      IsCard: // value for 'IsCard'
 *   },
 * });
 */
export function useGetMembershipListQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetMembershipListQuery,
    GqlGetMembershipListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetMembershipListQuery, GqlGetMembershipListQueryVariables>(
    GetMembershipListDocument,
    options,
  );
}
export function useGetMembershipListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetMembershipListQuery,
    GqlGetMembershipListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetMembershipListQuery, GqlGetMembershipListQueryVariables>(
    GetMembershipListDocument,
    options,
  );
}
export function useGetMembershipListSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetMembershipListQuery,
        GqlGetMembershipListQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetMembershipListQuery, GqlGetMembershipListQueryVariables>(
    GetMembershipListDocument,
    options,
  );
}
export type GetMembershipListQueryHookResult = ReturnType<typeof useGetMembershipListQuery>;
export type GetMembershipListLazyQueryHookResult = ReturnType<typeof useGetMembershipListLazyQuery>;
export type GetMembershipListSuspenseQueryHookResult = ReturnType<
  typeof useGetMembershipListSuspenseQuery
>;
export type GetMembershipListQueryResult = Apollo.QueryResult<
  GqlGetMembershipListQuery,
  GqlGetMembershipListQueryVariables
>;
export const UpdateMyProfileDocument = gql`
  mutation UpdateMyProfile(
    $input: UserUpdateProfileInput!
    $permission: CheckIsSelfPermissionInput!
  ) {
    userUpdateMyProfile(input: $input, permission: $permission) {
      ... on UserUpdateProfileSuccess {
        user {
          id
          name
          image
          bio
          currentPrefecture
          urlFacebook
          urlInstagram
          urlX
          slug
        }
      }
    }
  }
`;
export type GqlUpdateMyProfileMutationFn = Apollo.MutationFunction<
  GqlUpdateMyProfileMutation,
  GqlUpdateMyProfileMutationVariables
>;

/**
 * __useUpdateMyProfileMutation__
 *
 * To run a mutation, you first call `useUpdateMyProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateMyProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateMyProfileMutation, { data, loading, error }] = useUpdateMyProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useUpdateMyProfileMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlUpdateMyProfileMutation,
    GqlUpdateMyProfileMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlUpdateMyProfileMutation, GqlUpdateMyProfileMutationVariables>(
    UpdateMyProfileDocument,
    options,
  );
}
export type UpdateMyProfileMutationHookResult = ReturnType<typeof useUpdateMyProfileMutation>;
export type UpdateMyProfileMutationResult = Apollo.MutationResult<GqlUpdateMyProfileMutation>;
export type UpdateMyProfileMutationOptions = Apollo.BaseMutationOptions<
  GqlUpdateMyProfileMutation,
  GqlUpdateMyProfileMutationVariables
>;
export const GetUserFlexibleDocument = gql`
  query GetUserFlexible(
    $id: ID!
    $withPortfolios: Boolean! = false
    $withWallets: Boolean! = false
    $withOpportunities: Boolean! = false
  ) {
    user(id: $id) {
      ...UserFields
      portfolios @include(if: $withPortfolios) {
        ...UserPortfolioFields
      }
      wallets @include(if: $withWallets) {
        ...WalletFields
        tickets {
          ...TicketFields
        }
      }
      opportunitiesCreatedByMe @include(if: $withOpportunities) {
        ...OpportunityFields
        community {
          ...CommunityFields
        }
        place {
          ...PlaceFields
        }
      }
    }
  }
  ${UserFieldsFragmentDoc}
  ${UserPortfolioFieldsFragmentDoc}
  ${WalletFieldsFragmentDoc}
  ${TicketFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
`;

/**
 * __useGetUserFlexibleQuery__
 *
 * To run a query within a React component, call `useGetUserFlexibleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserFlexibleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserFlexibleQuery({
 *   variables: {
 *      id: // value for 'id'
 *      withPortfolios: // value for 'withPortfolios'
 *      withWallets: // value for 'withWallets'
 *      withOpportunities: // value for 'withOpportunities'
 *   },
 * });
 */
export function useGetUserFlexibleQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetUserFlexibleQuery, GqlGetUserFlexibleQueryVariables> &
    ({ variables: GqlGetUserFlexibleQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetUserFlexibleQuery, GqlGetUserFlexibleQueryVariables>(
    GetUserFlexibleDocument,
    options,
  );
}
export function useGetUserFlexibleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetUserFlexibleQuery,
    GqlGetUserFlexibleQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetUserFlexibleQuery, GqlGetUserFlexibleQueryVariables>(
    GetUserFlexibleDocument,
    options,
  );
}
export function useGetUserFlexibleSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetUserFlexibleQuery, GqlGetUserFlexibleQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetUserFlexibleQuery, GqlGetUserFlexibleQueryVariables>(
    GetUserFlexibleDocument,
    options,
  );
}
export type GetUserFlexibleQueryHookResult = ReturnType<typeof useGetUserFlexibleQuery>;
export type GetUserFlexibleLazyQueryHookResult = ReturnType<typeof useGetUserFlexibleLazyQuery>;
export type GetUserFlexibleSuspenseQueryHookResult = ReturnType<
  typeof useGetUserFlexibleSuspenseQuery
>;
export type GetUserFlexibleQueryResult = Apollo.QueryResult<
  GqlGetUserFlexibleQuery,
  GqlGetUserFlexibleQueryVariables
>;
export const GetUserWalletDocument = gql`
  query GetUserWallet($id: ID!) {
    user(id: $id) {
      ...UserFields
      wallets {
        ...WalletFields
        transactions {
          ...TransactionFields
          fromWallet {
            ...WalletFields
            user {
              ...UserFields
            }
          }
          toWallet {
            ...WalletFields
            user {
              ...UserFields
            }
          }
        }
        tickets {
          ...TicketFields
          utility {
            ...UtilityFields
          }
        }
      }
    }
  }
  ${UserFieldsFragmentDoc}
  ${WalletFieldsFragmentDoc}
  ${TransactionFieldsFragmentDoc}
  ${TicketFieldsFragmentDoc}
  ${UtilityFieldsFragmentDoc}
`;

/**
 * __useGetUserWalletQuery__
 *
 * To run a query within a React component, call `useGetUserWalletQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserWalletQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserWalletQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserWalletQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetUserWalletQuery, GqlGetUserWalletQueryVariables> &
    ({ variables: GqlGetUserWalletQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetUserWalletQuery, GqlGetUserWalletQueryVariables>(
    GetUserWalletDocument,
    options,
  );
}
export function useGetUserWalletLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetUserWalletQuery, GqlGetUserWalletQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetUserWalletQuery, GqlGetUserWalletQueryVariables>(
    GetUserWalletDocument,
    options,
  );
}
export function useGetUserWalletSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetUserWalletQuery, GqlGetUserWalletQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetUserWalletQuery, GqlGetUserWalletQueryVariables>(
    GetUserWalletDocument,
    options,
  );
}
export type GetUserWalletQueryHookResult = ReturnType<typeof useGetUserWalletQuery>;
export type GetUserWalletLazyQueryHookResult = ReturnType<typeof useGetUserWalletLazyQuery>;
export type GetUserWalletSuspenseQueryHookResult = ReturnType<typeof useGetUserWalletSuspenseQuery>;
export type GetUserWalletQueryResult = Apollo.QueryResult<
  GqlGetUserWalletQuery,
  GqlGetUserWalletQueryVariables
>;
export const GetWalletsWithTransactionDocument = gql`
  query GetWalletsWithTransaction($filter: WalletFilterInput, $first: Int, $cursor: String) {
    wallets(filter: $filter, first: $first, cursor: $cursor) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...WalletFields
          transactions {
            ...TransactionFields
            fromWallet {
              ...WalletFields
              user {
                ...UserFields
              }
            }
            toWallet {
              ...WalletFields
              user {
                ...UserFields
              }
            }
          }
        }
      }
    }
  }
  ${WalletFieldsFragmentDoc}
  ${TransactionFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
`;

/**
 * __useGetWalletsWithTransactionQuery__
 *
 * To run a query within a React component, call `useGetWalletsWithTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWalletsWithTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWalletsWithTransactionQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetWalletsWithTransactionQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetWalletsWithTransactionQuery,
    GqlGetWalletsWithTransactionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetWalletsWithTransactionQuery,
    GqlGetWalletsWithTransactionQueryVariables
  >(GetWalletsWithTransactionDocument, options);
}
export function useGetWalletsWithTransactionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetWalletsWithTransactionQuery,
    GqlGetWalletsWithTransactionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetWalletsWithTransactionQuery,
    GqlGetWalletsWithTransactionQueryVariables
  >(GetWalletsWithTransactionDocument, options);
}
export function useGetWalletsWithTransactionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetWalletsWithTransactionQuery,
        GqlGetWalletsWithTransactionQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetWalletsWithTransactionQuery,
    GqlGetWalletsWithTransactionQueryVariables
  >(GetWalletsWithTransactionDocument, options);
}
export type GetWalletsWithTransactionQueryHookResult = ReturnType<
  typeof useGetWalletsWithTransactionQuery
>;
export type GetWalletsWithTransactionLazyQueryHookResult = ReturnType<
  typeof useGetWalletsWithTransactionLazyQuery
>;
export type GetWalletsWithTransactionSuspenseQueryHookResult = ReturnType<
  typeof useGetWalletsWithTransactionSuspenseQuery
>;
export type GetWalletsWithTransactionQueryResult = Apollo.QueryResult<
  GqlGetWalletsWithTransactionQuery,
  GqlGetWalletsWithTransactionQueryVariables
>;
export const GetWalletsWithTicketDocument = gql`
  query GetWalletsWithTicket($filter: WalletFilterInput, $first: Int, $cursor: String) {
    wallets(filter: $filter, first: $first, cursor: $cursor) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...WalletFields
          tickets {
            ...TicketFields
            utility {
              ...UtilityFields
            }
          }
        }
      }
    }
  }
  ${WalletFieldsFragmentDoc}
  ${TicketFieldsFragmentDoc}
  ${UtilityFieldsFragmentDoc}
`;

/**
 * __useGetWalletsWithTicketQuery__
 *
 * To run a query within a React component, call `useGetWalletsWithTicketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWalletsWithTicketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWalletsWithTicketQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetWalletsWithTicketQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetWalletsWithTicketQuery,
    GqlGetWalletsWithTicketQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetWalletsWithTicketQuery, GqlGetWalletsWithTicketQueryVariables>(
    GetWalletsWithTicketDocument,
    options,
  );
}
export function useGetWalletsWithTicketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetWalletsWithTicketQuery,
    GqlGetWalletsWithTicketQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetWalletsWithTicketQuery, GqlGetWalletsWithTicketQueryVariables>(
    GetWalletsWithTicketDocument,
    options,
  );
}
export function useGetWalletsWithTicketSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetWalletsWithTicketQuery,
        GqlGetWalletsWithTicketQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetWalletsWithTicketQuery,
    GqlGetWalletsWithTicketQueryVariables
  >(GetWalletsWithTicketDocument, options);
}
export type GetWalletsWithTicketQueryHookResult = ReturnType<typeof useGetWalletsWithTicketQuery>;
export type GetWalletsWithTicketLazyQueryHookResult = ReturnType<
  typeof useGetWalletsWithTicketLazyQuery
>;
export type GetWalletsWithTicketSuspenseQueryHookResult = ReturnType<
  typeof useGetWalletsWithTicketSuspenseQuery
>;
export type GetWalletsWithTicketQueryResult = Apollo.QueryResult<
  GqlGetWalletsWithTicketQuery,
  GqlGetWalletsWithTicketQueryVariables
>;
export const GetArticlesDocument = gql`
  query GetArticles(
    $first: Int
    $cursor: String
    $filter: ArticleFilterInput
    $sort: ArticleSortInput
  ) {
    articles(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...ArticleFields
          authors {
            ...UserFields
          }
        }
      }
    }
  }
  ${ArticleFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
`;

/**
 * __useGetArticlesQuery__
 *
 * To run a query within a React component, call `useGetArticlesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticlesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetArticlesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetArticlesQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetArticlesQuery, GqlGetArticlesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetArticlesQuery, GqlGetArticlesQueryVariables>(
    GetArticlesDocument,
    options,
  );
}
export function useGetArticlesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetArticlesQuery, GqlGetArticlesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetArticlesQuery, GqlGetArticlesQueryVariables>(
    GetArticlesDocument,
    options,
  );
}
export function useGetArticlesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetArticlesQuery, GqlGetArticlesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetArticlesQuery, GqlGetArticlesQueryVariables>(
    GetArticlesDocument,
    options,
  );
}
export type GetArticlesQueryHookResult = ReturnType<typeof useGetArticlesQuery>;
export type GetArticlesLazyQueryHookResult = ReturnType<typeof useGetArticlesLazyQuery>;
export type GetArticlesSuspenseQueryHookResult = ReturnType<typeof useGetArticlesSuspenseQuery>;
export type GetArticlesQueryResult = Apollo.QueryResult<
  GqlGetArticlesQuery,
  GqlGetArticlesQueryVariables
>;
export const GetArticleDocument = gql`
  query GetArticle($id: ID!, $permission: CheckCommunityPermissionInput!) {
    article(id: $id, permission: $permission) {
      ...ArticleFields
      authors {
        ...UserFields
        opportunitiesCreatedByMe {
          ...OpportunityFields
          place {
            ...PlaceFields
          }
        }
      }
      relatedUsers {
        ...UserFields
      }
    }
    articles(first: 4, filter: { publishStatus: [PUBLIC] }, sort: { publishedAt: desc }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...ArticleFields
          authors {
            ...UserFields
          }
        }
      }
    }
  }
  ${ArticleFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
`;

/**
 * __useGetArticleQuery__
 *
 * To run a query within a React component, call `useGetArticleQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArticleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetArticleQuery({
 *   variables: {
 *      id: // value for 'id'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useGetArticleQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetArticleQuery, GqlGetArticleQueryVariables> &
    ({ variables: GqlGetArticleQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetArticleQuery, GqlGetArticleQueryVariables>(
    GetArticleDocument,
    options,
  );
}
export function useGetArticleLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetArticleQuery, GqlGetArticleQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetArticleQuery, GqlGetArticleQueryVariables>(
    GetArticleDocument,
    options,
  );
}
export function useGetArticleSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetArticleQuery, GqlGetArticleQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetArticleQuery, GqlGetArticleQueryVariables>(
    GetArticleDocument,
    options,
  );
}
export type GetArticleQueryHookResult = ReturnType<typeof useGetArticleQuery>;
export type GetArticleLazyQueryHookResult = ReturnType<typeof useGetArticleLazyQuery>;
export type GetArticleSuspenseQueryHookResult = ReturnType<typeof useGetArticleSuspenseQuery>;
export type GetArticleQueryResult = Apollo.QueryResult<
  GqlGetArticleQuery,
  GqlGetArticleQueryVariables
>;
export const GetEvaluationsDocument = gql`
  query GetEvaluations {
    evaluations {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetEvaluationsQuery__
 *
 * To run a query within a React component, call `useGetEvaluationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEvaluationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEvaluationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetEvaluationsQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetEvaluationsQuery, GqlGetEvaluationsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetEvaluationsQuery, GqlGetEvaluationsQueryVariables>(
    GetEvaluationsDocument,
    options,
  );
}
export function useGetEvaluationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetEvaluationsQuery,
    GqlGetEvaluationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetEvaluationsQuery, GqlGetEvaluationsQueryVariables>(
    GetEvaluationsDocument,
    options,
  );
}
export function useGetEvaluationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetEvaluationsQuery, GqlGetEvaluationsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetEvaluationsQuery, GqlGetEvaluationsQueryVariables>(
    GetEvaluationsDocument,
    options,
  );
}
export type GetEvaluationsQueryHookResult = ReturnType<typeof useGetEvaluationsQuery>;
export type GetEvaluationsLazyQueryHookResult = ReturnType<typeof useGetEvaluationsLazyQuery>;
export type GetEvaluationsSuspenseQueryHookResult = ReturnType<
  typeof useGetEvaluationsSuspenseQuery
>;
export type GetEvaluationsQueryResult = Apollo.QueryResult<
  GqlGetEvaluationsQuery,
  GqlGetEvaluationsQueryVariables
>;
export const GetEvaluationDocument = gql`
  query GetEvaluation($id: ID!) {
    evaluation(id: $id) {
      id
    }
  }
`;

/**
 * __useGetEvaluationQuery__
 *
 * To run a query within a React component, call `useGetEvaluationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetEvaluationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetEvaluationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetEvaluationQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetEvaluationQuery, GqlGetEvaluationQueryVariables> &
    ({ variables: GqlGetEvaluationQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetEvaluationQuery, GqlGetEvaluationQueryVariables>(
    GetEvaluationDocument,
    options,
  );
}
export function useGetEvaluationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetEvaluationQuery, GqlGetEvaluationQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetEvaluationQuery, GqlGetEvaluationQueryVariables>(
    GetEvaluationDocument,
    options,
  );
}
export function useGetEvaluationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetEvaluationQuery, GqlGetEvaluationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetEvaluationQuery, GqlGetEvaluationQueryVariables>(
    GetEvaluationDocument,
    options,
  );
}
export type GetEvaluationQueryHookResult = ReturnType<typeof useGetEvaluationQuery>;
export type GetEvaluationLazyQueryHookResult = ReturnType<typeof useGetEvaluationLazyQuery>;
export type GetEvaluationSuspenseQueryHookResult = ReturnType<typeof useGetEvaluationSuspenseQuery>;
export type GetEvaluationQueryResult = Apollo.QueryResult<
  GqlGetEvaluationQuery,
  GqlGetEvaluationQueryVariables
>;
export const GetOpportunitiesDocument = gql`
  query GetOpportunities($filter: OpportunityFilterInput, $first: Int, $cursor: String) {
    opportunities(
      filter: $filter
      sort: { earliestSlotStartsAt: desc }
      first: $first
      cursor: $cursor
    ) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      edges {
        cursor
        node {
          ...OpportunityFields
          community {
            ...CommunityFields
          }
          slots {
            ...OpportunitySlotFields
          }
          place {
            ...PlaceFields
          }
        }
      }
    }
  }
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${OpportunitySlotFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
`;

/**
 * __useGetOpportunitiesQuery__
 *
 * To run a query within a React component, call `useGetOpportunitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpportunitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpportunitiesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetOpportunitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetOpportunitiesQuery,
    GqlGetOpportunitiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetOpportunitiesQuery, GqlGetOpportunitiesQueryVariables>(
    GetOpportunitiesDocument,
    options,
  );
}
export function useGetOpportunitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetOpportunitiesQuery,
    GqlGetOpportunitiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetOpportunitiesQuery, GqlGetOpportunitiesQueryVariables>(
    GetOpportunitiesDocument,
    options,
  );
}
export function useGetOpportunitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetOpportunitiesQuery, GqlGetOpportunitiesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetOpportunitiesQuery, GqlGetOpportunitiesQueryVariables>(
    GetOpportunitiesDocument,
    options,
  );
}
export type GetOpportunitiesQueryHookResult = ReturnType<typeof useGetOpportunitiesQuery>;
export type GetOpportunitiesLazyQueryHookResult = ReturnType<typeof useGetOpportunitiesLazyQuery>;
export type GetOpportunitiesSuspenseQueryHookResult = ReturnType<
  typeof useGetOpportunitiesSuspenseQuery
>;
export type GetOpportunitiesQueryResult = Apollo.QueryResult<
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables
>;
export const GetOpportunityDocument = gql`
  query GetOpportunity($id: ID!, $permission: CheckCommunityPermissionInput!) {
    opportunity(id: $id, permission: $permission) {
      ...OpportunityFields
      community {
        ...CommunityFields
      }
      place {
        ...PlaceFields
      }
      slots {
        ...OpportunitySlotFields
        reservations {
          ...ReservationFields
          participations {
            ...ParticipationFields
            user {
              ...UserFields
            }
          }
        }
      }
      createdByUser {
        ...UserFields
        articlesAboutMe {
          ...ArticleFields
        }
        opportunitiesCreatedByMe {
          ...OpportunityFields
          community {
            ...CommunityFields
          }
          slots {
            ...OpportunitySlotFields
            reservations {
              ...ReservationFields
              participations {
                ...ParticipationFields
                user {
                  ...UserFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
  ${OpportunitySlotFieldsFragmentDoc}
  ${ReservationFieldsFragmentDoc}
  ${ParticipationFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${ArticleFieldsFragmentDoc}
`;

/**
 * __useGetOpportunityQuery__
 *
 * To run a query within a React component, call `useGetOpportunityQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpportunityQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpportunityQuery({
 *   variables: {
 *      id: // value for 'id'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useGetOpportunityQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetOpportunityQuery, GqlGetOpportunityQueryVariables> &
    ({ variables: GqlGetOpportunityQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetOpportunityQuery, GqlGetOpportunityQueryVariables>(
    GetOpportunityDocument,
    options,
  );
}
export function useGetOpportunityLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetOpportunityQuery,
    GqlGetOpportunityQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetOpportunityQuery, GqlGetOpportunityQueryVariables>(
    GetOpportunityDocument,
    options,
  );
}
export function useGetOpportunitySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetOpportunityQuery, GqlGetOpportunityQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetOpportunityQuery, GqlGetOpportunityQueryVariables>(
    GetOpportunityDocument,
    options,
  );
}
export type GetOpportunityQueryHookResult = ReturnType<typeof useGetOpportunityQuery>;
export type GetOpportunityLazyQueryHookResult = ReturnType<typeof useGetOpportunityLazyQuery>;
export type GetOpportunitySuspenseQueryHookResult = ReturnType<
  typeof useGetOpportunitySuspenseQuery
>;
export type GetOpportunityQueryResult = Apollo.QueryResult<
  GqlGetOpportunityQuery,
  GqlGetOpportunityQueryVariables
>;
export const SearchOpportunitiesDocument = gql`
  query SearchOpportunities($filter: OpportunityFilterInput, $first: Int) {
    opportunities(filter: $filter, first: $first) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      edges {
        cursor
        node {
          ...OpportunityFields
          community {
            ...CommunityFields
          }
          place {
            ...PlaceFields
          }
          slots {
            ...OpportunitySlotFields
            reservations {
              ...ReservationFields
              participations {
                ...ParticipationFields
                user {
                  ...UserFields
                }
              }
            }
          }
        }
      }
    }
  }
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
  ${OpportunitySlotFieldsFragmentDoc}
  ${ReservationFieldsFragmentDoc}
  ${ParticipationFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
`;

/**
 * __useSearchOpportunitiesQuery__
 *
 * To run a query within a React component, call `useSearchOpportunitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchOpportunitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchOpportunitiesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useSearchOpportunitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlSearchOpportunitiesQuery,
    GqlSearchOpportunitiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlSearchOpportunitiesQuery, GqlSearchOpportunitiesQueryVariables>(
    SearchOpportunitiesDocument,
    options,
  );
}
export function useSearchOpportunitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlSearchOpportunitiesQuery,
    GqlSearchOpportunitiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlSearchOpportunitiesQuery, GqlSearchOpportunitiesQueryVariables>(
    SearchOpportunitiesDocument,
    options,
  );
}
export function useSearchOpportunitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlSearchOpportunitiesQuery,
        GqlSearchOpportunitiesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlSearchOpportunitiesQuery, GqlSearchOpportunitiesQueryVariables>(
    SearchOpportunitiesDocument,
    options,
  );
}
export type SearchOpportunitiesQueryHookResult = ReturnType<typeof useSearchOpportunitiesQuery>;
export type SearchOpportunitiesLazyQueryHookResult = ReturnType<
  typeof useSearchOpportunitiesLazyQuery
>;
export type SearchOpportunitiesSuspenseQueryHookResult = ReturnType<
  typeof useSearchOpportunitiesSuspenseQuery
>;
export type SearchOpportunitiesQueryResult = Apollo.QueryResult<
  GqlSearchOpportunitiesQuery,
  GqlSearchOpportunitiesQueryVariables
>;
export const GetOpportunitySlotsDocument = gql`
  query GetOpportunitySlots($filter: OpportunitySlotFilterInput) {
    opportunitySlots(filter: $filter, sort: { startsAt: desc }) {
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
      totalCount
      edges {
        cursor
        node {
          id
          hostingStatus
          startsAt
          endsAt
          capacity
          remainingCapacity
          opportunity {
            ...OpportunityFields
          }
        }
      }
    }
  }
  ${OpportunityFieldsFragmentDoc}
`;

/**
 * __useGetOpportunitySlotsQuery__
 *
 * To run a query within a React component, call `useGetOpportunitySlotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpportunitySlotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpportunitySlotsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetOpportunitySlotsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetOpportunitySlotsQuery,
    GqlGetOpportunitySlotsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetOpportunitySlotsQuery, GqlGetOpportunitySlotsQueryVariables>(
    GetOpportunitySlotsDocument,
    options,
  );
}
export function useGetOpportunitySlotsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetOpportunitySlotsQuery,
    GqlGetOpportunitySlotsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetOpportunitySlotsQuery, GqlGetOpportunitySlotsQueryVariables>(
    GetOpportunitySlotsDocument,
    options,
  );
}
export function useGetOpportunitySlotsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetOpportunitySlotsQuery,
        GqlGetOpportunitySlotsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetOpportunitySlotsQuery, GqlGetOpportunitySlotsQueryVariables>(
    GetOpportunitySlotsDocument,
    options,
  );
}
export type GetOpportunitySlotsQueryHookResult = ReturnType<typeof useGetOpportunitySlotsQuery>;
export type GetOpportunitySlotsLazyQueryHookResult = ReturnType<
  typeof useGetOpportunitySlotsLazyQuery
>;
export type GetOpportunitySlotsSuspenseQueryHookResult = ReturnType<
  typeof useGetOpportunitySlotsSuspenseQuery
>;
export type GetOpportunitySlotsQueryResult = Apollo.QueryResult<
  GqlGetOpportunitySlotsQuery,
  GqlGetOpportunitySlotsQueryVariables
>;
export const GetOpportunitySlotDocument = gql`
  query GetOpportunitySlot($id: ID!) {
    opportunitySlot(id: $id) {
      id
    }
  }
`;

/**
 * __useGetOpportunitySlotQuery__
 *
 * To run a query within a React component, call `useGetOpportunitySlotQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpportunitySlotQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpportunitySlotQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOpportunitySlotQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetOpportunitySlotQuery,
    GqlGetOpportunitySlotQueryVariables
  > &
    ({ variables: GqlGetOpportunitySlotQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetOpportunitySlotQuery, GqlGetOpportunitySlotQueryVariables>(
    GetOpportunitySlotDocument,
    options,
  );
}
export function useGetOpportunitySlotLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetOpportunitySlotQuery,
    GqlGetOpportunitySlotQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetOpportunitySlotQuery, GqlGetOpportunitySlotQueryVariables>(
    GetOpportunitySlotDocument,
    options,
  );
}
export function useGetOpportunitySlotSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetOpportunitySlotQuery,
        GqlGetOpportunitySlotQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetOpportunitySlotQuery, GqlGetOpportunitySlotQueryVariables>(
    GetOpportunitySlotDocument,
    options,
  );
}
export type GetOpportunitySlotQueryHookResult = ReturnType<typeof useGetOpportunitySlotQuery>;
export type GetOpportunitySlotLazyQueryHookResult = ReturnType<
  typeof useGetOpportunitySlotLazyQuery
>;
export type GetOpportunitySlotSuspenseQueryHookResult = ReturnType<
  typeof useGetOpportunitySlotSuspenseQuery
>;
export type GetOpportunitySlotQueryResult = Apollo.QueryResult<
  GqlGetOpportunitySlotQuery,
  GqlGetOpportunitySlotQueryVariables
>;
export const GetParticipationsDocument = gql`
  query GetParticipations {
    participations {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetParticipationsQuery__
 *
 * To run a query within a React component, call `useGetParticipationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetParticipationsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetParticipationsQuery,
    GqlGetParticipationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetParticipationsQuery, GqlGetParticipationsQueryVariables>(
    GetParticipationsDocument,
    options,
  );
}
export function useGetParticipationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetParticipationsQuery,
    GqlGetParticipationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetParticipationsQuery, GqlGetParticipationsQueryVariables>(
    GetParticipationsDocument,
    options,
  );
}
export function useGetParticipationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetParticipationsQuery,
        GqlGetParticipationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetParticipationsQuery, GqlGetParticipationsQueryVariables>(
    GetParticipationsDocument,
    options,
  );
}
export type GetParticipationsQueryHookResult = ReturnType<typeof useGetParticipationsQuery>;
export type GetParticipationsLazyQueryHookResult = ReturnType<typeof useGetParticipationsLazyQuery>;
export type GetParticipationsSuspenseQueryHookResult = ReturnType<
  typeof useGetParticipationsSuspenseQuery
>;
export type GetParticipationsQueryResult = Apollo.QueryResult<
  GqlGetParticipationsQuery,
  GqlGetParticipationsQueryVariables
>;
export const GetParticipationDocument = gql`
  query GetParticipation($id: ID!) {
    participation(id: $id) {
      ...ParticipationFields
      reservation {
        ...ReservationFields
        opportunitySlot {
          ...OpportunitySlotFields
          opportunity {
            ...OpportunityFields
            community {
              ...CommunityFields
            }
            createdByUser {
              ...UserFields
            }
            place {
              ...PlaceFields
            }
          }
        }
      }
      statusHistories {
        id
        status
        reason
        createdAt
        createdByUser {
          ...UserFields
        }
      }
      user {
        ...UserFields
      }
    }
  }
  ${ParticipationFieldsFragmentDoc}
  ${ReservationFieldsFragmentDoc}
  ${OpportunitySlotFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
`;

/**
 * __useGetParticipationQuery__
 *
 * To run a query within a React component, call `useGetParticipationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetParticipationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetParticipationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetParticipationQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetParticipationQuery,
    GqlGetParticipationQueryVariables
  > &
    ({ variables: GqlGetParticipationQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetParticipationQuery, GqlGetParticipationQueryVariables>(
    GetParticipationDocument,
    options,
  );
}
export function useGetParticipationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetParticipationQuery,
    GqlGetParticipationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetParticipationQuery, GqlGetParticipationQueryVariables>(
    GetParticipationDocument,
    options,
  );
}
export function useGetParticipationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetParticipationQuery, GqlGetParticipationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetParticipationQuery, GqlGetParticipationQueryVariables>(
    GetParticipationDocument,
    options,
  );
}
export type GetParticipationQueryHookResult = ReturnType<typeof useGetParticipationQuery>;
export type GetParticipationLazyQueryHookResult = ReturnType<typeof useGetParticipationLazyQuery>;
export type GetParticipationSuspenseQueryHookResult = ReturnType<
  typeof useGetParticipationSuspenseQuery
>;
export type GetParticipationQueryResult = Apollo.QueryResult<
  GqlGetParticipationQuery,
  GqlGetParticipationQueryVariables
>;
export const CreateReservationDocument = gql`
  mutation CreateReservation($input: ReservationCreateInput!) {
    reservationCreate(input: $input) {
      ... on ReservationCreateSuccess {
        reservation {
          ...ReservationFields
        }
      }
      ... on ReservationFullError {
        __typename
        message
        capacity
        requested
      }
      ... on ReservationAdvanceBookingRequiredError {
        __typename
        message
      }
      ... on ReservationNotAcceptedError {
        __typename
        message
      }
      ... on SlotNotScheduledError {
        __typename
        message
      }
      ... on MissingTicketIdsError {
        __typename
        message
      }
      ... on TicketParticipantMismatchError {
        __typename
        message
        ticketCount
        participantCount
      }
    }
  }
  ${ReservationFieldsFragmentDoc}
`;
export type GqlCreateReservationMutationFn = Apollo.MutationFunction<
  GqlCreateReservationMutation,
  GqlCreateReservationMutationVariables
>;

/**
 * __useCreateReservationMutation__
 *
 * To run a mutation, you first call `useCreateReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createReservationMutation, { data, loading, error }] = useCreateReservationMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateReservationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlCreateReservationMutation,
    GqlCreateReservationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlCreateReservationMutation, GqlCreateReservationMutationVariables>(
    CreateReservationDocument,
    options,
  );
}
export type CreateReservationMutationHookResult = ReturnType<typeof useCreateReservationMutation>;
export type CreateReservationMutationResult = Apollo.MutationResult<GqlCreateReservationMutation>;
export type CreateReservationMutationOptions = Apollo.BaseMutationOptions<
  GqlCreateReservationMutation,
  GqlCreateReservationMutationVariables
>;
export const CancelReservationDocument = gql`
  mutation CancelReservation(
    $id: ID!
    $input: ReservationCancelInput!
    $permission: CheckIsSelfPermissionInput!
  ) {
    reservationCancel(id: $id, input: $input, permission: $permission) {
      ... on ReservationSetStatusSuccess {
        reservation {
          ...ReservationFields
        }
      }
      ... on ReservationCancellationTimeoutError {
        message
      }
    }
  }
  ${ReservationFieldsFragmentDoc}
`;
export type GqlCancelReservationMutationFn = Apollo.MutationFunction<
  GqlCancelReservationMutation,
  GqlCancelReservationMutationVariables
>;

/**
 * __useCancelReservationMutation__
 *
 * To run a mutation, you first call `useCancelReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCancelReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [cancelReservationMutation, { data, loading, error }] = useCancelReservationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useCancelReservationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlCancelReservationMutation,
    GqlCancelReservationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlCancelReservationMutation, GqlCancelReservationMutationVariables>(
    CancelReservationDocument,
    options,
  );
}
export type CancelReservationMutationHookResult = ReturnType<typeof useCancelReservationMutation>;
export type CancelReservationMutationResult = Apollo.MutationResult<GqlCancelReservationMutation>;
export type CancelReservationMutationOptions = Apollo.BaseMutationOptions<
  GqlCancelReservationMutation,
  GqlCancelReservationMutationVariables
>;
export const GetReservationsDocument = gql`
  query GetReservations {
    reservations {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetReservationsQuery__
 *
 * To run a query within a React component, call `useGetReservationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReservationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReservationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetReservationsQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetReservationsQuery, GqlGetReservationsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetReservationsQuery, GqlGetReservationsQueryVariables>(
    GetReservationsDocument,
    options,
  );
}
export function useGetReservationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetReservationsQuery,
    GqlGetReservationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetReservationsQuery, GqlGetReservationsQueryVariables>(
    GetReservationsDocument,
    options,
  );
}
export function useGetReservationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetReservationsQuery, GqlGetReservationsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetReservationsQuery, GqlGetReservationsQueryVariables>(
    GetReservationsDocument,
    options,
  );
}
export type GetReservationsQueryHookResult = ReturnType<typeof useGetReservationsQuery>;
export type GetReservationsLazyQueryHookResult = ReturnType<typeof useGetReservationsLazyQuery>;
export type GetReservationsSuspenseQueryHookResult = ReturnType<
  typeof useGetReservationsSuspenseQuery
>;
export type GetReservationsQueryResult = Apollo.QueryResult<
  GqlGetReservationsQuery,
  GqlGetReservationsQueryVariables
>;
export const GetReservationDocument = gql`
  query GetReservation($id: ID!) {
    reservation(id: $id) {
      ...ReservationFields
      opportunitySlot {
        ...OpportunitySlotFields
        opportunity {
          ...OpportunityFields
          createdByUser {
            ...UserFields
            articlesAboutMe {
              ...ArticleFields
            }
          }
          place {
            ...PlaceFields
          }
        }
      }
      participations {
        ...ParticipationFields
      }
    }
  }
  ${ReservationFieldsFragmentDoc}
  ${OpportunitySlotFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${ArticleFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
  ${ParticipationFieldsFragmentDoc}
`;

/**
 * __useGetReservationQuery__
 *
 * To run a query within a React component, call `useGetReservationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReservationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReservationQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetReservationQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetReservationQuery, GqlGetReservationQueryVariables> &
    ({ variables: GqlGetReservationQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetReservationQuery, GqlGetReservationQueryVariables>(
    GetReservationDocument,
    options,
  );
}
export function useGetReservationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetReservationQuery,
    GqlGetReservationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetReservationQuery, GqlGetReservationQueryVariables>(
    GetReservationDocument,
    options,
  );
}
export function useGetReservationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetReservationQuery, GqlGetReservationQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetReservationQuery, GqlGetReservationQueryVariables>(
    GetReservationDocument,
    options,
  );
}
export type GetReservationQueryHookResult = ReturnType<typeof useGetReservationQuery>;
export type GetReservationLazyQueryHookResult = ReturnType<typeof useGetReservationLazyQuery>;
export type GetReservationSuspenseQueryHookResult = ReturnType<
  typeof useGetReservationSuspenseQuery
>;
export type GetReservationQueryResult = Apollo.QueryResult<
  GqlGetReservationQuery,
  GqlGetReservationQueryVariables
>;
export const GetPlacesDocument = gql`
  query GetPlaces {
    places {
      edges {
        node {
          id
          name
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetPlacesQuery__
 *
 * To run a query within a React component, call `useGetPlacesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlacesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlacesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPlacesQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetPlacesQuery, GqlGetPlacesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetPlacesQuery, GqlGetPlacesQueryVariables>(GetPlacesDocument, options);
}
export function useGetPlacesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetPlacesQuery, GqlGetPlacesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetPlacesQuery, GqlGetPlacesQueryVariables>(
    GetPlacesDocument,
    options,
  );
}
export function useGetPlacesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetPlacesQuery, GqlGetPlacesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetPlacesQuery, GqlGetPlacesQueryVariables>(
    GetPlacesDocument,
    options,
  );
}
export type GetPlacesQueryHookResult = ReturnType<typeof useGetPlacesQuery>;
export type GetPlacesLazyQueryHookResult = ReturnType<typeof useGetPlacesLazyQuery>;
export type GetPlacesSuspenseQueryHookResult = ReturnType<typeof useGetPlacesSuspenseQuery>;
export type GetPlacesQueryResult = Apollo.QueryResult<
  GqlGetPlacesQuery,
  GqlGetPlacesQueryVariables
>;
export const TicketClaimDocument = gql`
  mutation ticketClaim($input: TicketClaimInput!) {
    ticketClaim(input: $input) {
      ... on TicketClaimSuccess {
        tickets {
          id
        }
      }
    }
  }
`;
export type GqlTicketClaimMutationFn = Apollo.MutationFunction<
  GqlTicketClaimMutation,
  GqlTicketClaimMutationVariables
>;

/**
 * __useTicketClaimMutation__
 *
 * To run a mutation, you first call `useTicketClaimMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTicketClaimMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ticketClaimMutation, { data, loading, error }] = useTicketClaimMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTicketClaimMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlTicketClaimMutation, GqlTicketClaimMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlTicketClaimMutation, GqlTicketClaimMutationVariables>(
    TicketClaimDocument,
    options,
  );
}
export type TicketClaimMutationHookResult = ReturnType<typeof useTicketClaimMutation>;
export type TicketClaimMutationResult = Apollo.MutationResult<GqlTicketClaimMutation>;
export type TicketClaimMutationOptions = Apollo.BaseMutationOptions<
  GqlTicketClaimMutation,
  GqlTicketClaimMutationVariables
>;
export const GetTicketsDocument = gql`
  query GetTickets {
    tickets {
      edges {
        node {
          id
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetTicketsQuery__
 *
 * To run a query within a React component, call `useGetTicketsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTicketsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTicketsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTicketsQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetTicketsQuery, GqlGetTicketsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetTicketsQuery, GqlGetTicketsQueryVariables>(
    GetTicketsDocument,
    options,
  );
}
export function useGetTicketsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetTicketsQuery, GqlGetTicketsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetTicketsQuery, GqlGetTicketsQueryVariables>(
    GetTicketsDocument,
    options,
  );
}
export function useGetTicketsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetTicketsQuery, GqlGetTicketsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetTicketsQuery, GqlGetTicketsQueryVariables>(
    GetTicketsDocument,
    options,
  );
}
export type GetTicketsQueryHookResult = ReturnType<typeof useGetTicketsQuery>;
export type GetTicketsLazyQueryHookResult = ReturnType<typeof useGetTicketsLazyQuery>;
export type GetTicketsSuspenseQueryHookResult = ReturnType<typeof useGetTicketsSuspenseQuery>;
export type GetTicketsQueryResult = Apollo.QueryResult<
  GqlGetTicketsQuery,
  GqlGetTicketsQueryVariables
>;
export const GetTicketDocument = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      id
    }
  }
`;

/**
 * __useGetTicketQuery__
 *
 * To run a query within a React component, call `useGetTicketQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTicketQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTicketQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTicketQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetTicketQuery, GqlGetTicketQueryVariables> &
    ({ variables: GqlGetTicketQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetTicketQuery, GqlGetTicketQueryVariables>(GetTicketDocument, options);
}
export function useGetTicketLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetTicketQuery, GqlGetTicketQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetTicketQuery, GqlGetTicketQueryVariables>(
    GetTicketDocument,
    options,
  );
}
export function useGetTicketSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetTicketQuery, GqlGetTicketQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetTicketQuery, GqlGetTicketQueryVariables>(
    GetTicketDocument,
    options,
  );
}
export type GetTicketQueryHookResult = ReturnType<typeof useGetTicketQuery>;
export type GetTicketLazyQueryHookResult = ReturnType<typeof useGetTicketLazyQuery>;
export type GetTicketSuspenseQueryHookResult = ReturnType<typeof useGetTicketSuspenseQuery>;
export type GetTicketQueryResult = Apollo.QueryResult<
  GqlGetTicketQuery,
  GqlGetTicketQueryVariables
>;
export const TicketClaimLinkDocument = gql`
  query ticketClaimLink($id: ID!) {
    ticketClaimLink(id: $id) {
      qty
      status
      issuer {
        owner {
          id
          name
          image
        }
      }
    }
  }
`;

/**
 * __useTicketClaimLinkQuery__
 *
 * To run a query within a React component, call `useTicketClaimLinkQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketClaimLinkQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketClaimLinkQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useTicketClaimLinkQuery(
  baseOptions: Apollo.QueryHookOptions<GqlTicketClaimLinkQuery, GqlTicketClaimLinkQueryVariables> &
    ({ variables: GqlTicketClaimLinkQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlTicketClaimLinkQuery, GqlTicketClaimLinkQueryVariables>(
    TicketClaimLinkDocument,
    options,
  );
}
export function useTicketClaimLinkLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlTicketClaimLinkQuery,
    GqlTicketClaimLinkQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlTicketClaimLinkQuery, GqlTicketClaimLinkQueryVariables>(
    TicketClaimLinkDocument,
    options,
  );
}
export function useTicketClaimLinkSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlTicketClaimLinkQuery, GqlTicketClaimLinkQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlTicketClaimLinkQuery, GqlTicketClaimLinkQueryVariables>(
    TicketClaimLinkDocument,
    options,
  );
}
export type TicketClaimLinkQueryHookResult = ReturnType<typeof useTicketClaimLinkQuery>;
export type TicketClaimLinkLazyQueryHookResult = ReturnType<typeof useTicketClaimLinkLazyQuery>;
export type TicketClaimLinkSuspenseQueryHookResult = ReturnType<
  typeof useTicketClaimLinkSuspenseQuery
>;
export type TicketClaimLinkQueryResult = Apollo.QueryResult<
  GqlTicketClaimLinkQuery,
  GqlTicketClaimLinkQueryVariables
>;
export const GetUtilitiesDocument = gql`
  query GetUtilities {
    utilities {
      edges {
        node {
          id
          name
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetUtilitiesQuery__
 *
 * To run a query within a React component, call `useGetUtilitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUtilitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUtilitiesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUtilitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetUtilitiesQuery, GqlGetUtilitiesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetUtilitiesQuery, GqlGetUtilitiesQueryVariables>(
    GetUtilitiesDocument,
    options,
  );
}
export function useGetUtilitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetUtilitiesQuery, GqlGetUtilitiesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetUtilitiesQuery, GqlGetUtilitiesQueryVariables>(
    GetUtilitiesDocument,
    options,
  );
}
export function useGetUtilitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetUtilitiesQuery, GqlGetUtilitiesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetUtilitiesQuery, GqlGetUtilitiesQueryVariables>(
    GetUtilitiesDocument,
    options,
  );
}
export type GetUtilitiesQueryHookResult = ReturnType<typeof useGetUtilitiesQuery>;
export type GetUtilitiesLazyQueryHookResult = ReturnType<typeof useGetUtilitiesLazyQuery>;
export type GetUtilitiesSuspenseQueryHookResult = ReturnType<typeof useGetUtilitiesSuspenseQuery>;
export type GetUtilitiesQueryResult = Apollo.QueryResult<
  GqlGetUtilitiesQuery,
  GqlGetUtilitiesQueryVariables
>;
export const GetTransactionsDocument = gql`
  query getTransactions($filter: TransactionFilterInput) {
    transactions(filter: $filter, sort: { createdAt: desc }) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      edges {
        cursor
        node {
          ...TransactionFields
          fromWallet {
            ...WalletFields
            user {
              ...UserFields
            }
          }
          toWallet {
            ...WalletFields
            user {
              ...UserFields
            }
          }
        }
      }
    }
  }
  ${TransactionFieldsFragmentDoc}
  ${WalletFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
`;

/**
 * __useGetTransactionsQuery__
 *
 * To run a query within a React component, call `useGetTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetTransactionsQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables>(
    GetTransactionsDocument,
    options,
  );
}
export function useGetTransactionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetTransactionsQuery,
    GqlGetTransactionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables>(
    GetTransactionsDocument,
    options,
  );
}
export function useGetTransactionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetTransactionsQuery, GqlGetTransactionsQueryVariables>(
    GetTransactionsDocument,
    options,
  );
}
export type GetTransactionsQueryHookResult = ReturnType<typeof useGetTransactionsQuery>;
export type GetTransactionsLazyQueryHookResult = ReturnType<typeof useGetTransactionsLazyQuery>;
export type GetTransactionsSuspenseQueryHookResult = ReturnType<
  typeof useGetTransactionsSuspenseQuery
>;
export type GetTransactionsQueryResult = Apollo.QueryResult<
  GqlGetTransactionsQuery,
  GqlGetTransactionsQueryVariables
>;
export const GetTransactionDocument = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
    }
  }
`;

/**
 * __useGetTransactionQuery__
 *
 * To run a query within a React component, call `useGetTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTransactionQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetTransactionQuery, GqlGetTransactionQueryVariables> &
    ({ variables: GqlGetTransactionQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetTransactionQuery, GqlGetTransactionQueryVariables>(
    GetTransactionDocument,
    options,
  );
}
export function useGetTransactionLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetTransactionQuery,
    GqlGetTransactionQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetTransactionQuery, GqlGetTransactionQueryVariables>(
    GetTransactionDocument,
    options,
  );
}
export function useGetTransactionSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetTransactionQuery, GqlGetTransactionQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetTransactionQuery, GqlGetTransactionQueryVariables>(
    GetTransactionDocument,
    options,
  );
}
export type GetTransactionQueryHookResult = ReturnType<typeof useGetTransactionQuery>;
export type GetTransactionLazyQueryHookResult = ReturnType<typeof useGetTransactionLazyQuery>;
export type GetTransactionSuspenseQueryHookResult = ReturnType<
  typeof useGetTransactionSuspenseQuery
>;
export type GetTransactionQueryResult = Apollo.QueryResult<
  GqlGetTransactionQuery,
  GqlGetTransactionQueryVariables
>;
