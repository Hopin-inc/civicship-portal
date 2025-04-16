/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
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

export type AccumulatedPointView = {
  __typename?: "AccumulatedPointView";
  accumulatedPoint: Scalars["Int"]["output"];
  walletId: Scalars["String"]["output"];
};

export type Article = {
  __typename?: "Article";
  authors?: Maybe<Array<User>>;
  body: Scalars["String"]["output"];
  category: ArticleCategory;
  community?: Maybe<Community>;
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  introduction: Scalars["String"]["output"];
  opportunities?: Maybe<Array<Opportunity>>;
  publishStatus: PublishStatus;
  publishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  relatedUsers?: Maybe<Array<User>>;
  thumbnail?: Maybe<Scalars["JSON"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export enum ArticleCategory {
  ActivityReport = "ACTIVITY_REPORT",
  Interview = "INTERVIEW",
}

export type ArticleEdge = Edge & {
  __typename?: "ArticleEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Article>;
};

export type ArticleFilterInput = {
  and?: InputMaybe<Array<ArticleFilterInput>>;
  authors?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  categories?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  dateFrom?: InputMaybe<Scalars["Datetime"]["input"]>;
  dateTo?: InputMaybe<Scalars["Datetime"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  not?: InputMaybe<ArticleFilterInput>;
  or?: InputMaybe<Array<ArticleFilterInput>>;
  publishStatus?: InputMaybe<Array<PublishStatus>>;
  relatedUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  stateCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type ArticleSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  publishedAt?: InputMaybe<SortDirection>;
  startsAt?: InputMaybe<SortDirection>;
};

export type ArticlesConnection = {
  __typename?: "ArticlesConnection";
  edges?: Maybe<Array<Maybe<ArticleEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type AuthZDirectiveCompositeRulesInput = {
  and?: InputMaybe<Array<InputMaybe<AuthZRules>>>;
  not?: InputMaybe<AuthZRules>;
  or?: InputMaybe<Array<InputMaybe<AuthZRules>>>;
};

export type AuthZDirectiveDeepCompositeRulesInput = {
  and?: InputMaybe<Array<InputMaybe<AuthZDirectiveDeepCompositeRulesInput>>>;
  id?: InputMaybe<AuthZRules>;
  not?: InputMaybe<AuthZDirectiveDeepCompositeRulesInput>;
  or?: InputMaybe<Array<InputMaybe<AuthZDirectiveDeepCompositeRulesInput>>>;
};

export enum AuthZRules {
  IsAdmin = "IsAdmin",
  IsCommunityManager = "IsCommunityManager",
  IsCommunityMember = "IsCommunityMember",
  IsCommunityOwner = "IsCommunityOwner",
  IsOpportunityOwner = "IsOpportunityOwner",
  IsSelf = "IsSelf",
  IsUser = "IsUser",
  VerifySanitizeInput = "VerifySanitizeInput",
}

export type CheckCommunityPermissionInput = {
  communityId: Scalars["ID"]["input"];
};

export type CheckIsSelfPermissionInput = {
  userId: Scalars["ID"]["input"];
};

export type CheckOpportunityPermissionInput = {
  communityId: Scalars["ID"]["input"];
  opportunityId: Scalars["ID"]["input"];
};

export type City = {
  __typename?: "City";
  code: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  state: State;
};

export type CommunitiesConnection = {
  __typename?: "CommunitiesConnection";
  edges?: Maybe<Array<Maybe<CommunityEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Community = {
  __typename?: "Community";
  articles?: Maybe<ArticlesConnection>;
  bio?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  establishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  memberships?: Maybe<MembershipsConnection>;
  name: Scalars["String"]["output"];
  opportunities?: Maybe<OpportunitiesConnection>;
  participations?: Maybe<ParticipationsConnection>;
  places?: Maybe<Array<Place>>;
  pointName: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utilities?: Maybe<UtilitiesConnection>;
  wallets?: Maybe<WalletsConnection>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type CommunityArticlesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ArticleFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ArticleSortInput>;
};

export type CommunityMembershipsArgs = {
  cursor?: InputMaybe<MembershipCursorInput>;
  filter?: InputMaybe<MembershipFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<MembershipSortInput>;
};

export type CommunityOpportunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySortInput>;
};

export type CommunityParticipationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationSortInput>;
};

export type CommunityUtilitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UtilityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UtilitySortInput>;
};

export type CommunityWalletsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<WalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<WalletSortInput>;
};

export type CommunityCreateInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  places?: InputMaybe<Array<NestedPlaceCreateInput>>;
  pointName: Scalars["String"]["input"];
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommunityCreatePayload = CommunityCreateSuccess;

export type CommunityCreateSuccess = {
  __typename?: "CommunityCreateSuccess";
  community: Community;
};

export type CommunityDeletePayload = CommunityDeleteSuccess;

export type CommunityDeleteSuccess = {
  __typename?: "CommunityDeleteSuccess";
  communityId: Scalars["String"]["output"];
};

export type CommunityEdge = Edge & {
  __typename?: "CommunityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Community>;
};

export type CommunityFilterInput = {
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  placeIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type CommunitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type CommunityUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  places: NestedPlacesBulkUpdateInput;
  pointName: Scalars["String"]["input"];
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommunityUpdateProfilePayload = CommunityUpdateProfileSuccess;

export type CommunityUpdateProfileSuccess = {
  __typename?: "CommunityUpdateProfileSuccess";
  community: Community;
};

export type CurrentPointView = {
  __typename?: "CurrentPointView";
  currentPoint: Scalars["Int"]["output"];
  walletId: Scalars["String"]["output"];
};

export enum CurrentPrefecture {
  Ehime = "EHIME",
  Kagawa = "KAGAWA",
  Kochi = "KOCHI",
  OutsideShikoku = "OUTSIDE_SHIKOKU",
  Tokushima = "TOKUSHIMA",
  Unknown = "UNKNOWN",
}

export type CurrentUserPayload = {
  __typename?: "CurrentUserPayload";
  user?: Maybe<User>;
};

export type EarliestReservableSlotView = {
  __typename?: "EarliestReservableSlotView";
  earliestReservableAt?: Maybe<Scalars["Datetime"]["output"]>;
  opportunityId: Scalars["ID"]["output"];
};

export type Edge = {
  cursor: Scalars["String"]["output"];
};

export type Evaluation = {
  __typename?: "Evaluation";
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  credentialUrl?: Maybe<Scalars["String"]["output"]>;
  evaluator: User;
  histories?: Maybe<EvaluationHistoriesConnection>;
  id: Scalars["ID"]["output"];
  issuedAt?: Maybe<Scalars["Datetime"]["output"]>;
  participation: Participation;
  status: EvaluationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type EvaluationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<EvaluationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<EvaluationHistorySortInput>;
};

export type EvaluationCreateInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  participationId: Scalars["ID"]["input"];
};

export type EvaluationCreatePayload = EvaluationCreateSuccess;

export type EvaluationCreateSuccess = {
  __typename?: "EvaluationCreateSuccess";
  evaluation: Evaluation;
};

export type EvaluationEdge = Edge & {
  __typename?: "EvaluationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Evaluation>;
};

export type EvaluationFilterInput = {
  evaluatorId?: InputMaybe<Scalars["ID"]["input"]>;
  participationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<EvaluationStatus>;
};

export type EvaluationHistoriesConnection = {
  __typename?: "EvaluationHistoriesConnection";
  edges: Array<EvaluationHistoryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type EvaluationHistory = {
  __typename?: "EvaluationHistory";
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  evaluation: Evaluation;
  id: Scalars["ID"]["output"];
  status: EvaluationStatus;
};

export type EvaluationHistoryEdge = Edge & {
  __typename?: "EvaluationHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<EvaluationHistory>;
};

export type EvaluationHistoryFilterInput = {
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  evaluationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<EvaluationStatus>;
};

export type EvaluationHistorySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type EvaluationSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export enum EvaluationStatus {
  Failed = "FAILED",
  Passed = "PASSED",
  Pending = "PENDING",
}

export type EvaluationsConnection = {
  __typename?: "EvaluationsConnection";
  edges: Array<EvaluationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum IdentityPlatform {
  Facebook = "FACEBOOK",
  Line = "LINE",
}

export type ImageInput = {
  alt?: InputMaybe<Scalars["String"]["input"]>;
  caption?: InputMaybe<Scalars["String"]["input"]>;
  file: Scalars["Upload"]["input"];
};

export type Membership = {
  __typename?: "Membership";
  bio?: Maybe<Scalars["String"]["output"]>;
  community: Community;
  createdAt: Scalars["Datetime"]["output"];
  headline?: Maybe<Scalars["String"]["output"]>;
  membershipHistories?: Maybe<MembershipHistoriesConnection>;
  participationView?: Maybe<MembershipParticipationView>;
  reason: MembershipStatusReason;
  role: Role;
  status: MembershipStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user: User;
};

export type MembershipMembershipHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<MembershipHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<MembershipHistorySortInput>;
};

export type MembershipCursorInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MembershipEdge = Edge & {
  __typename?: "MembershipEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Membership>;
};

export type MembershipFilterInput = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  role?: InputMaybe<Role>;
  status?: InputMaybe<MembershipStatus>;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type MembershipHistoriesConnection = {
  __typename?: "MembershipHistoriesConnection";
  edges?: Maybe<Array<Maybe<MembershipHistoryEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type MembershipHistory = {
  __typename?: "MembershipHistory";
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  id: Scalars["ID"]["output"];
  membership: Membership;
  reason: MembershipStatusReason;
  role: Role;
  status: MembershipStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type MembershipHistoryEdge = Edge & {
  __typename?: "MembershipHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<MembershipHistory>;
};

export type MembershipHistoryFilterInput = {
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  membershipId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type MembershipHistorySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type MembershipHostedMetrics = {
  __typename?: "MembershipHostedMetrics";
  geo: Array<MembershipParticipationLocation>;
  totalParticipantCount: Scalars["Int"]["output"];
};

export type MembershipInviteInput = {
  communityId: Scalars["ID"]["input"];
  role?: InputMaybe<Role>;
  userId: Scalars["ID"]["input"];
};

export type MembershipInvitePayload = MembershipInviteSuccess;

export type MembershipInviteSuccess = {
  __typename?: "MembershipInviteSuccess";
  membership: Membership;
};

export type MembershipParticipatedMetrics = {
  __typename?: "MembershipParticipatedMetrics";
  geo: Array<MembershipParticipationLocation>;
  totalParticipatedCount: Scalars["Int"]["output"];
};

export type MembershipParticipationLocation = {
  __typename?: "MembershipParticipationLocation";
  latitude: Scalars["Decimal"]["output"];
  longitude: Scalars["Decimal"]["output"];
  placeId: Scalars["ID"]["output"];
};

export type MembershipParticipationView = {
  __typename?: "MembershipParticipationView";
  hosted: MembershipHostedMetrics;
  participated: MembershipParticipatedMetrics;
};

export type MembershipRemoveInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MembershipRemovePayload = MembershipRemoveSuccess;

export type MembershipRemoveSuccess = {
  __typename?: "MembershipRemoveSuccess";
  communityId: Scalars["ID"]["output"];
  userId: Scalars["ID"]["output"];
};

export type MembershipSetInvitationStatusInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MembershipSetInvitationStatusPayload = MembershipSetInvitationStatusSuccess;

export type MembershipSetInvitationStatusSuccess = {
  __typename?: "MembershipSetInvitationStatusSuccess";
  membership: Membership;
};

export type MembershipSetRoleInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MembershipSetRolePayload = MembershipSetRoleSuccess;

export type MembershipSetRoleSuccess = {
  __typename?: "MembershipSetRoleSuccess";
  membership: Membership;
};

export type MembershipSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export enum MembershipStatus {
  Joined = "JOINED",
  Left = "LEFT",
  Pending = "PENDING",
}

export enum MembershipStatusReason {
  AcceptedInvitation = "ACCEPTED_INVITATION",
  Assigned = "ASSIGNED",
  CanceledInvitation = "CANCELED_INVITATION",
  CreatedCommunity = "CREATED_COMMUNITY",
  DeclinedInvitation = "DECLINED_INVITATION",
  Invited = "INVITED",
  Removed = "REMOVED",
  Withdrawn = "WITHDRAWN",
}

export type MembershipWithdrawInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MembershipWithdrawPayload = MembershipWithdrawSuccess;

export type MembershipWithdrawSuccess = {
  __typename?: "MembershipWithdrawSuccess";
  communityId: Scalars["ID"]["output"];
  userId: Scalars["ID"]["output"];
};

export type MembershipsConnection = {
  __typename?: "MembershipsConnection";
  edges?: Maybe<Array<Maybe<MembershipEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  communityCreate?: Maybe<CommunityCreatePayload>;
  communityDelete?: Maybe<CommunityDeletePayload>;
  communityUpdateProfile?: Maybe<CommunityUpdateProfilePayload>;
  evaluationFail?: Maybe<EvaluationCreatePayload>;
  evaluationPass?: Maybe<EvaluationCreatePayload>;
  membershipAcceptMyInvitation?: Maybe<MembershipSetInvitationStatusPayload>;
  membershipAssignManager?: Maybe<MembershipSetRolePayload>;
  membershipAssignMember?: Maybe<MembershipSetRolePayload>;
  membershipAssignOwner?: Maybe<MembershipSetRolePayload>;
  membershipCancelInvitation?: Maybe<MembershipSetInvitationStatusPayload>;
  membershipDenyMyInvitation?: Maybe<MembershipSetInvitationStatusPayload>;
  membershipInvite?: Maybe<MembershipInvitePayload>;
  membershipRemove?: Maybe<MembershipRemovePayload>;
  membershipWithdraw?: Maybe<MembershipWithdrawPayload>;
  mutationEcho: Scalars["String"]["output"];
  opportunityCreate?: Maybe<OpportunityCreatePayload>;
  opportunityDelete?: Maybe<OpportunityDeletePayload>;
  opportunitySetPublishStatus?: Maybe<OpportunitySetPublishStatusPayload>;
  opportunitySlotSetHostingStatus?: Maybe<OpportunitySlotSetHostingStatusPayload>;
  opportunitySlotsBulkUpdate?: Maybe<OpportunitySlotsBulkUpdatePayload>;
  opportunityUpdateContent?: Maybe<OpportunityUpdateContentPayload>;
  participationCreatePersonalRecord?: Maybe<ParticipationCreatePersonalRecordPayload>;
  participationDeletePersonalRecord?: Maybe<ParticipationDeletePayload>;
  placeCreate?: Maybe<PlaceCreatePayload>;
  placeDelete?: Maybe<PlaceDeletePayload>;
  placeUpdate?: Maybe<PlaceUpdatePayload>;
  reservationAccept?: Maybe<ReservationSetStatusPayload>;
  reservationCancel?: Maybe<ReservationSetStatusPayload>;
  reservationCreate?: Maybe<ReservationCreatePayload>;
  reservationJoin?: Maybe<ReservationSetStatusPayload>;
  reservationReject?: Maybe<ReservationSetStatusPayload>;
  ticketPurchase?: Maybe<TicketPurchasePayload>;
  ticketRefund?: Maybe<TicketRefundPayload>;
  ticketUse?: Maybe<TicketUsePayload>;
  transactionDonateSelfPoint?: Maybe<TransactionDonateSelfPointPayload>;
  transactionGrantCommunityPoint?: Maybe<TransactionGrantCommunityPointPayload>;
  transactionIssueCommunityPoint?: Maybe<TransactionIssueCommunityPointPayload>;
  userDeleteMe?: Maybe<UserDeletePayload>;
  userSignUp?: Maybe<CurrentUserPayload>;
  userUpdateMyProfile?: Maybe<UserUpdateProfilePayload>;
  utilityCreate?: Maybe<UtilityCreatePayload>;
  utilityDelete?: Maybe<UtilityDeletePayload>;
  utilitySetPublishStatus?: Maybe<UtilitySetPublishStatusPayload>;
  utilityUpdateInfo?: Maybe<UtilityUpdateInfoPayload>;
};

export type MutationCommunityCreateArgs = {
  input: CommunityCreateInput;
};

export type MutationCommunityDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
};

export type MutationCommunityUpdateProfileArgs = {
  id: Scalars["ID"]["input"];
  input: CommunityUpdateProfileInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationEvaluationFailArgs = {
  input: EvaluationCreateInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationEvaluationPassArgs = {
  input: EvaluationCreateInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationMembershipAcceptMyInvitationArgs = {
  input: MembershipSetInvitationStatusInput;
  permission: CheckIsSelfPermissionInput;
};

export type MutationMembershipAssignManagerArgs = {
  input: MembershipSetRoleInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationMembershipAssignMemberArgs = {
  input: MembershipSetRoleInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationMembershipAssignOwnerArgs = {
  input: MembershipSetRoleInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationMembershipCancelInvitationArgs = {
  input: MembershipSetInvitationStatusInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationMembershipDenyMyInvitationArgs = {
  input: MembershipSetInvitationStatusInput;
  permission: CheckIsSelfPermissionInput;
};

export type MutationMembershipInviteArgs = {
  input: MembershipInviteInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationMembershipRemoveArgs = {
  input: MembershipRemoveInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationMembershipWithdrawArgs = {
  input: MembershipWithdrawInput;
  permission: CheckIsSelfPermissionInput;
};

export type MutationOpportunityCreateArgs = {
  input: OpportunityCreateInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationOpportunityDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
};

export type MutationOpportunitySetPublishStatusArgs = {
  id: Scalars["ID"]["input"];
  input: OpportunitySetPublishStatusInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationOpportunitySlotSetHostingStatusArgs = {
  id: Scalars["ID"]["input"];
  input: OpportunitySlotSetHostingStatusInput;
  permission: CheckOpportunityPermissionInput;
};

export type MutationOpportunitySlotsBulkUpdateArgs = {
  input: OpportunitySlotsBulkUpdateInput;
  permission: CheckOpportunityPermissionInput;
};

export type MutationOpportunityUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: OpportunityUpdateContentInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationParticipationCreatePersonalRecordArgs = {
  input: ParticipationCreatePersonalRecordInput;
};

export type MutationParticipationDeletePersonalRecordArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckIsSelfPermissionInput;
};

export type MutationPlaceCreateArgs = {
  input: PlaceCreateInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationPlaceDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
};

export type MutationPlaceUpdateArgs = {
  id: Scalars["ID"]["input"];
  input: PlaceUpdateInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationReservationAcceptArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckOpportunityPermissionInput;
};

export type MutationReservationCancelArgs = {
  id: Scalars["ID"]["input"];
  input: ReservationCancelInput;
  permission: CheckIsSelfPermissionInput;
};

export type MutationReservationCreateArgs = {
  input: ReservationCreateInput;
};

export type MutationReservationJoinArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationReservationRejectArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckOpportunityPermissionInput;
};

export type MutationTicketPurchaseArgs = {
  input: TicketPurchaseInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationTicketRefundArgs = {
  id: Scalars["ID"]["input"];
  input: TicketRefundInput;
  permission: CheckIsSelfPermissionInput;
};

export type MutationTicketUseArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckIsSelfPermissionInput;
};

export type MutationTransactionDonateSelfPointArgs = {
  input: TransactionDonateSelfPointInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationTransactionGrantCommunityPointArgs = {
  input: TransactionGrantCommunityPointInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationTransactionIssueCommunityPointArgs = {
  input: TransactionIssueCommunityPointInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationUserDeleteMeArgs = {
  input: UserDeleteInput;
  permission: CheckIsSelfPermissionInput;
};

export type MutationUserSignUpArgs = {
  input: UserSignUpInput;
};

export type MutationUserUpdateMyProfileArgs = {
  input: UserUpdateProfileInput;
  permission: CheckIsSelfPermissionInput;
};

export type MutationUtilityCreateArgs = {
  input: UtilityCreateInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationUtilityDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
};

export type MutationUtilitySetPublishStatusArgs = {
  id: Scalars["ID"]["input"];
  input: UtilitySetPublishStatusInput;
  permission: CheckCommunityPermissionInput;
};

export type MutationUtilityUpdateInfoArgs = {
  id: Scalars["ID"]["input"];
  input: UtilityUpdateInfoInput;
  permission: CheckCommunityPermissionInput;
};

export type NestedPlaceConnectOrCreateInput = {
  create?: InputMaybe<NestedPlaceCreateInput>;
  where?: InputMaybe<Scalars["ID"]["input"]>;
};

export type NestedPlaceCreateInput = {
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

export type NestedPlacesBulkConnectOrCreateInput = {
  data?: InputMaybe<Array<NestedPlaceConnectOrCreateInput>>;
};

export type NestedPlacesBulkUpdateInput = {
  connectOrCreate?: InputMaybe<Array<NestedPlaceConnectOrCreateInput>>;
  disconnect?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type OpportunitiesConnection = {
  __typename?: "OpportunitiesConnection";
  edges: Array<OpportunityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Opportunity = {
  __typename?: "Opportunity";
  articles?: Maybe<Array<Article>>;
  body?: Maybe<Scalars["String"]["output"]>;
  capacity?: Maybe<Scalars["Int"]["output"]>;
  category: OpportunityCategory;
  community?: Maybe<Community>;
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  description: Scalars["String"]["output"];
  earliestReservableSlotView?: Maybe<EarliestReservableSlotView>;
  feeRequired?: Maybe<Scalars["Int"]["output"]>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  isReservableWithTicket?: Maybe<Scalars["Boolean"]["output"]>;
  place?: Maybe<Place>;
  pointsToEarn?: Maybe<Scalars["Int"]["output"]>;
  publishStatus: PublishStatus;
  requireApproval: Scalars["Boolean"]["output"];
  requiredUtilities?: Maybe<Array<Utility>>;
  slots?: Maybe<OpportunitySlotsConnection>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type OpportunitySlotsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunitySlotFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySlotSortInput>;
};

export enum OpportunityCategory {
  Activity = "ACTIVITY",
  Event = "EVENT",
  Quest = "QUEST",
}

export type OpportunityCreateInput = {
  body?: InputMaybe<Scalars["String"]["input"]>;
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  category: OpportunityCategory;
  communityId: Scalars["ID"]["input"];
  description: Scalars["String"]["input"];
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  images?: InputMaybe<Array<ImageInput>>;
  place?: InputMaybe<NestedPlaceConnectOrCreateInput>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: PublishStatus;
  requireApproval: Scalars["Boolean"]["input"];
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  title: Scalars["String"]["input"];
};

export type OpportunityCreatePayload = OpportunityCreateSuccess;

export type OpportunityCreateSuccess = {
  __typename?: "OpportunityCreateSuccess";
  opportunity: Opportunity;
};

export type OpportunityDeletePayload = OpportunityDeleteSuccess;

export type OpportunityDeleteSuccess = {
  __typename?: "OpportunityDeleteSuccess";
  opportunityId: Scalars["ID"]["output"];
};

export type OpportunityEdge = Edge & {
  __typename?: "OpportunityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Opportunity>;
};

export type OpportunityFilterInput = {
  and?: InputMaybe<Array<OpportunityFilterInput>>;
  articleIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  category?: InputMaybe<OpportunityCategory>;
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  communityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  createdByUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  not?: InputMaybe<OpportunityFilterInput>;
  or?: InputMaybe<Array<OpportunityFilterInput>>;
  placeIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  publishStatus?: InputMaybe<Array<PublishStatus>>;
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  slotEndsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  slotHostingStatus?: InputMaybe<Array<OpportunitySlotHostingStatus>>;
  slotRemainingCapacity?: InputMaybe<Scalars["Int"]["input"]>;
  slotStartsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type OpportunitySetPublishStatusInput = {
  publishStatus: PublishStatus;
};

export type OpportunitySetPublishStatusPayload = OpportunitySetPublishStatusSuccess;

export type OpportunitySetPublishStatusSuccess = {
  __typename?: "OpportunitySetPublishStatusSuccess";
  opportunity: Opportunity;
};

export type OpportunitySlot = {
  __typename?: "OpportunitySlot";
  capacity?: Maybe<Scalars["Int"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  endsAt: Scalars["Datetime"]["output"];
  hostingStatus: OpportunitySlotHostingStatus;
  id: Scalars["ID"]["output"];
  opportunity?: Maybe<Opportunity>;
  participations?: Maybe<ParticipationsConnection>;
  remainingCapacityView?: Maybe<RemainingCapacityView>;
  reservations?: Maybe<ReservationsConnection>;
  startsAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type OpportunitySlotParticipationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationSortInput>;
};

export type OpportunitySlotReservationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ReservationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ReservationSortInput>;
};

export type OpportunitySlotCreateInput = {
  endsAt: Scalars["Datetime"]["input"];
  startsAt: Scalars["Datetime"]["input"];
};

export type OpportunitySlotEdge = Edge & {
  __typename?: "OpportunitySlotEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<OpportunitySlot>;
};

export type OpportunitySlotFilterInput = {
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
};

export enum OpportunitySlotHostingStatus {
  Cancelled = "CANCELLED",
  Completed = "COMPLETED",
  Scheduled = "SCHEDULED",
}

export type OpportunitySlotSetHostingStatusInput = {
  status: OpportunitySlotHostingStatus;
};

export type OpportunitySlotSetHostingStatusPayload = OpportunitySlotSetHostingStatusSuccess;

export type OpportunitySlotSetHostingStatusSuccess = {
  __typename?: "OpportunitySlotSetHostingStatusSuccess";
  slot: OpportunitySlot;
};

export type OpportunitySlotSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  endsAt?: InputMaybe<SortDirection>;
  startsAt?: InputMaybe<SortDirection>;
};

export type OpportunitySlotUpdateInput = {
  endsAt: Scalars["Datetime"]["input"];
  id: Scalars["ID"]["input"];
  startsAt: Scalars["Datetime"]["input"];
};

export type OpportunitySlotsBulkUpdateInput = {
  create?: InputMaybe<Array<OpportunitySlotCreateInput>>;
  delete?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  opportunityId: Scalars["ID"]["input"];
  update?: InputMaybe<Array<OpportunitySlotUpdateInput>>;
};

export type OpportunitySlotsBulkUpdatePayload = OpportunitySlotsBulkUpdateSuccess;

export type OpportunitySlotsBulkUpdateSuccess = {
  __typename?: "OpportunitySlotsBulkUpdateSuccess";
  slots: Array<OpportunitySlot>;
};

export type OpportunitySlotsConnection = {
  __typename?: "OpportunitySlotsConnection";
  edges?: Maybe<Array<Maybe<OpportunitySlotEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type OpportunitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
  earliestSlotStartsAt?: InputMaybe<SortDirection>;
};

export type OpportunityUpdateContentInput = {
  body?: InputMaybe<Scalars["String"]["input"]>;
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  category: OpportunityCategory;
  description: Scalars["String"]["input"];
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  images?: InputMaybe<Array<ImageInput>>;
  place?: InputMaybe<NestedPlaceConnectOrCreateInput>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: PublishStatus;
  requireApproval: Scalars["Boolean"]["input"];
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  title: Scalars["String"]["input"];
};

export type OpportunityUpdateContentPayload = OpportunityUpdateContentSuccess;

export type OpportunityUpdateContentSuccess = {
  __typename?: "OpportunityUpdateContentSuccess";
  opportunity: Opportunity;
};

export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]["output"]>;
  hasNextPage: Scalars["Boolean"]["output"];
  hasPreviousPage: Scalars["Boolean"]["output"];
  startCursor?: Maybe<Scalars["String"]["output"]>;
};

export type Paging = {
  __typename?: "Paging";
  skip: Scalars["Int"]["output"];
  take: Scalars["Int"]["output"];
};

export type Participation = {
  __typename?: "Participation";
  community?: Maybe<Community>;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  evaluation?: Maybe<Evaluation>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  reason: ParticipationStatusReason;
  reservation?: Maybe<Reservation>;
  source: Source;
  status: ParticipationStatus;
  statusHistories?: Maybe<ParticipationStatusHistoriesConnection>;
  ticketStatusHistories?: Maybe<Array<TicketStatusHistory>>;
  transactions?: Maybe<TransactionsConnection>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type ParticipationStatusHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationStatusHistorySortInput>;
};

export type ParticipationTransactionsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TransactionFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TransactionSortInput>;
};

export type ParticipationCreatePersonalRecordInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<ImageInput>>;
};

export type ParticipationCreatePersonalRecordPayload = ParticipationCreatePersonalRecordSuccess;

export type ParticipationCreatePersonalRecordSuccess = {
  __typename?: "ParticipationCreatePersonalRecordSuccess";
  participation: Participation;
};

export type ParticipationDeletePayload = ParticipationDeleteSuccess;

export type ParticipationDeleteSuccess = {
  __typename?: "ParticipationDeleteSuccess";
  participationId: Scalars["ID"]["output"];
};

export type ParticipationEdge = Edge & {
  __typename?: "ParticipationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Participation>;
};

export type ParticipationFilterInput = {
  categories?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  dateFrom?: InputMaybe<Scalars["Datetime"]["input"]>;
  dateTo?: InputMaybe<Scalars["Datetime"]["input"]>;
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunitySlotId?: InputMaybe<Scalars["ID"]["input"]>;
  reservationId?: InputMaybe<Scalars["ID"]["input"]>;
  stateCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  status?: InputMaybe<ParticipationStatus>;
  userIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type ParticipationSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  startsAt?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export enum ParticipationStatus {
  NotParticipating = "NOT_PARTICIPATING",
  Participated = "PARTICIPATED",
  Participating = "PARTICIPATING",
  Pending = "PENDING",
}

export type ParticipationStatusHistoriesConnection = {
  __typename?: "ParticipationStatusHistoriesConnection";
  edges: Array<ParticipationStatusHistoryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type ParticipationStatusHistory = {
  __typename?: "ParticipationStatusHistory";
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  id: Scalars["ID"]["output"];
  participation: Participation;
  reason: ParticipationStatusReason;
  status: ParticipationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type ParticipationStatusHistoryEdge = Edge & {
  __typename?: "ParticipationStatusHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<ParticipationStatusHistory>;
};

export type ParticipationStatusHistoryFilterInput = {
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  participationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<ParticipationStatus>;
};

export type ParticipationStatusHistorySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export enum ParticipationStatusReason {
  OpportunityCanceled = "OPPORTUNITY_CANCELED",
  PersonalRecord = "PERSONAL_RECORD",
  ReservationAccepted = "RESERVATION_ACCEPTED",
  ReservationApplied = "RESERVATION_APPLIED",
  ReservationCanceled = "RESERVATION_CANCELED",
  ReservationJoined = "RESERVATION_JOINED",
  ReservationRejected = "RESERVATION_REJECTED",
}

export enum ParticipationType {
  Hosted = "HOSTED",
  Participated = "PARTICIPATED",
}

export type ParticipationsConnection = {
  __typename?: "ParticipationsConnection";
  edges: Array<ParticipationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Place = {
  __typename?: "Place";
  address: Scalars["String"]["output"];
  city: City;
  community?: Maybe<Community>;
  createdAt: Scalars["Datetime"]["output"];
  googlePlaceId?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isManual: Scalars["Boolean"]["output"];
  latitude: Scalars["Decimal"]["output"];
  longitude: Scalars["Decimal"]["output"];
  mapLocation?: Maybe<Scalars["JSON"]["output"]>;
  name: Scalars["String"]["output"];
  opportunities?: Maybe<OpportunitiesConnection>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type PlaceOpportunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySortInput>;
};

export type PlaceCreateInput = {
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

export type PlaceCreatePayload = PlaceCreateSuccess;

export type PlaceCreateSuccess = {
  __typename?: "PlaceCreateSuccess";
  place: Place;
};

export type PlaceDeletePayload = PlaceDeleteSuccess;

export type PlaceDeleteSuccess = {
  __typename?: "PlaceDeleteSuccess";
  id: Scalars["ID"]["output"];
};

export type PlaceEdge = Edge & {
  __typename?: "PlaceEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Place>;
};

export type PlaceFilterInput = {
  cityCode?: InputMaybe<Scalars["ID"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type PlaceSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type PlaceUpdateInput = {
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

export type PlaceUpdatePayload = PlaceUpdateSuccess;

export type PlaceUpdateSuccess = {
  __typename?: "PlaceUpdateSuccess";
  place: Place;
};

export type PlacesConnection = {
  __typename?: "PlacesConnection";
  edges?: Maybe<Array<Maybe<PlaceEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Portfolio = {
  __typename?: "Portfolio";
  category: Scalars["String"]["output"];
  date: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  participants: Array<User>;
  place?: Maybe<Place>;
  source: PortfolioSource;
  thumbnailUrl?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
};

export type PortfolioEdge = Edge & {
  __typename?: "PortfolioEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Portfolio>;
};

export type PortfolioFilterInput = {
  categories?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  dateFrom?: InputMaybe<Scalars["Datetime"]["input"]>;
  dateTo?: InputMaybe<Scalars["Datetime"]["input"]>;
  source?: InputMaybe<PortfolioSource>;
  stateCodes?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  userIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type PortfolioSortInput = {
  date?: InputMaybe<SortDirection>;
};

export enum PortfolioSource {
  Article = "ARTICLE",
  Opportunity = "OPPORTUNITY",
}

export type PortfoliosConnection = {
  __typename?: "PortfoliosConnection";
  edges?: Maybe<Array<Maybe<PortfolioEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum PublishStatus {
  CommunityInternal = "COMMUNITY_INTERNAL",
  Private = "PRIVATE",
  Public = "PUBLIC",
}

export type Query = {
  __typename?: "Query";
  article?: Maybe<Article>;
  articles: ArticlesConnection;
  cities: Array<City>;
  communities: CommunitiesConnection;
  community?: Maybe<Community>;
  currentUser?: Maybe<CurrentUserPayload>;
  echo: Scalars["String"]["output"];
  evaluation?: Maybe<Evaluation>;
  evaluationHistories: EvaluationHistoriesConnection;
  evaluationHistory?: Maybe<EvaluationHistory>;
  evaluations: EvaluationsConnection;
  membership?: Maybe<Membership>;
  membershipHistories: MembershipHistoriesConnection;
  membershipHistory?: Maybe<MembershipHistory>;
  memberships: MembershipsConnection;
  opportunities: OpportunitiesConnection;
  opportunity?: Maybe<Opportunity>;
  opportunitySlot?: Maybe<OpportunitySlot>;
  opportunitySlots: OpportunitySlotsConnection;
  participation?: Maybe<Participation>;
  participationStatusHistories: ParticipationStatusHistoriesConnection;
  participationStatusHistory?: Maybe<ParticipationStatusHistory>;
  participations: ParticipationsConnection;
  place?: Maybe<Place>;
  places: PlacesConnection;
  portfolios: PortfoliosConnection;
  reservation?: Maybe<Reservation>;
  reservationHistories: ReservationHistoriesConnection;
  reservationHistory?: Maybe<ReservationHistory>;
  reservations: ReservationsConnection;
  states: Array<State>;
  ticket?: Maybe<Ticket>;
  ticketStatusHistories: TicketStatusHistoriesConnection;
  ticketStatusHistory?: Maybe<TicketStatusHistory>;
  tickets: TicketsConnection;
  transaction?: Maybe<Transaction>;
  transactions: TransactionsConnection;
  user?: Maybe<User>;
  users: UsersConnection;
  utilities: UtilitiesConnection;
  utility?: Maybe<Utility>;
  wallet?: Maybe<Wallet>;
  wallets: WalletsConnection;
};

export type QueryArticleArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
};

export type QueryArticlesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ArticleFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ArticleSortInput>;
};

export type QueryCitiesArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryCommunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<CommunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<CommunitySortInput>;
};

export type QueryCommunityArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryEvaluationArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryEvaluationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<EvaluationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<EvaluationHistorySortInput>;
};

export type QueryEvaluationHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryEvaluationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<EvaluationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<EvaluationSortInput>;
};

export type QueryMembershipArgs = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type QueryMembershipHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<MembershipHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<MembershipHistorySortInput>;
};

export type QueryMembershipHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryMembershipsArgs = {
  cursor?: InputMaybe<MembershipCursorInput>;
  filter?: InputMaybe<MembershipFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<MembershipSortInput>;
};

export type QueryOpportunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySortInput>;
};

export type QueryOpportunityArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
};

export type QueryOpportunitySlotArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryOpportunitySlotsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunitySlotFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySlotSortInput>;
};

export type QueryParticipationArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryParticipationStatusHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationStatusHistorySortInput>;
};

export type QueryParticipationStatusHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryParticipationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationSortInput>;
};

export type QueryPlaceArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryPlacesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<PlaceFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<PlaceSortInput>;
};

export type QueryPortfoliosArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<PortfolioFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<PortfolioSortInput>;
};

export type QueryReservationArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryReservationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ReservationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ReservationHistorySortInput>;
};

export type QueryReservationHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryReservationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ReservationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ReservationSortInput>;
};

export type QueryStatesArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryTicketArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTicketStatusHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TicketStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TicketStatusHistorySortInput>;
};

export type QueryTicketStatusHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTicketsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TicketFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TicketSortInput>;
};

export type QueryTransactionArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTransactionsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TransactionFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TransactionSortInput>;
};

export type QueryUserArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryUsersArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UserSortInput>;
};

export type QueryUtilitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UtilityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UtilitySortInput>;
};

export type QueryUtilityArgs = {
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
};

export type QueryWalletArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryWalletsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<WalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<WalletSortInput>;
};

export type RemainingCapacityView = {
  __typename?: "RemainingCapacityView";
  opportunitySlotId: Scalars["String"]["output"];
  remainingCapacity?: Maybe<Scalars["Int"]["output"]>;
};

export type Reservation = {
  __typename?: "Reservation";
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  histories?: Maybe<Array<ReservationHistory>>;
  id: Scalars["ID"]["output"];
  opportunitySlot: OpportunitySlot;
  participations?: Maybe<Array<Participation>>;
  status: ReservationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type ReservationCancelInput = {
  paymentMethod: ReservationPaymentMethod;
  ticketIdsIfExists?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type ReservationCreateInput = {
  opportunitySlotId: Scalars["ID"]["input"];
  otherUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  paymentMethod: ReservationPaymentMethod;
  ticketIdsIfNeed?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  totalParticipantCount: Scalars["Int"]["input"];
};

export type ReservationCreatePayload = ReservationCreateSuccess;

export type ReservationCreateSuccess = {
  __typename?: "ReservationCreateSuccess";
  reservation: Reservation;
};

export type ReservationEdge = Edge & {
  __typename?: "ReservationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Reservation>;
};

export type ReservationFilterInput = {
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunitySlotId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<ReservationStatus>;
};

export type ReservationHistoriesConnection = {
  __typename?: "ReservationHistoriesConnection";
  edges: Array<ReservationHistoryEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type ReservationHistory = {
  __typename?: "ReservationHistory";
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  id: Scalars["ID"]["output"];
  reservation: Reservation;
  status: ReservationStatus;
};

export type ReservationHistoryEdge = Edge & {
  __typename?: "ReservationHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<ReservationHistory>;
};

export type ReservationHistoryFilterInput = {
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  reservationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<ReservationStatus>;
};

export type ReservationHistorySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export enum ReservationPaymentMethod {
  Fee = "FEE",
  Ticket = "TICKET",
}

export type ReservationSetStatusPayload = ReservationSetStatusSuccess;

export type ReservationSetStatusSuccess = {
  __typename?: "ReservationSetStatusSuccess";
  reservation: Reservation;
};

export type ReservationSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export enum ReservationStatus {
  Accepted = "ACCEPTED",
  Applied = "APPLIED",
  Canceled = "CANCELED",
  Rejected = "REJECTED",
}

export type ReservationsConnection = {
  __typename?: "ReservationsConnection";
  edges: Array<ReservationEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum Role {
  Manager = "MANAGER",
  Member = "MEMBER",
  Owner = "OWNER",
}

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
}

export enum Source {
  External = "EXTERNAL",
  Internal = "INTERNAL",
}

export type State = {
  __typename?: "State";
  code: Scalars["ID"]["output"];
  countryCode: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
};

export enum SysRole {
  SysAdmin = "SYS_ADMIN",
  User = "USER",
}

export type Ticket = {
  __typename?: "Ticket";
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  reason: TicketStatusReason;
  status: TicketStatus;
  ticketStatusHistories?: Maybe<TicketStatusHistoriesConnection>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utility: Utility;
  wallet: Wallet;
};

export type TicketTicketStatusHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TicketStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TicketStatusHistorySortInput>;
};

export type TicketEdge = Edge & {
  __typename?: "TicketEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Ticket>;
};

export type TicketFilterInput = {
  status?: InputMaybe<TicketStatus>;
  utilityId?: InputMaybe<Scalars["ID"]["input"]>;
  walletId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type TicketPurchaseInput = {
  communityId: Scalars["ID"]["input"];
  pointsRequired: Scalars["Int"]["input"];
  utilityId: Scalars["ID"]["input"];
  walletId: Scalars["ID"]["input"];
};

export type TicketPurchasePayload = TicketPurchaseSuccess;

export type TicketPurchaseSuccess = {
  __typename?: "TicketPurchaseSuccess";
  ticket: Ticket;
};

export type TicketRefundInput = {
  communityId: Scalars["ID"]["input"];
  pointsRequired: Scalars["Int"]["input"];
  walletId: Scalars["ID"]["input"];
};

export type TicketRefundPayload = TicketRefundSuccess;

export type TicketRefundSuccess = {
  __typename?: "TicketRefundSuccess";
  ticket: Ticket;
};

export type TicketSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  status?: InputMaybe<SortDirection>;
};

export enum TicketStatus {
  Available = "AVAILABLE",
  Disabled = "DISABLED",
}

export type TicketStatusHistoriesConnection = {
  __typename?: "TicketStatusHistoriesConnection";
  edges?: Maybe<Array<Maybe<TicketStatusHistoryEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type TicketStatusHistory = {
  __typename?: "TicketStatusHistory";
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  id: Scalars["ID"]["output"];
  reason: TicketStatusReason;
  status: TicketStatus;
  ticket: Ticket;
  transaction?: Maybe<Transaction>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type TicketStatusHistoryEdge = Edge & {
  __typename?: "TicketStatusHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<TicketStatusHistory>;
};

export type TicketStatusHistoryFilterInput = {
  createdById?: InputMaybe<Scalars["ID"]["input"]>;
  reason?: InputMaybe<TicketStatusReason>;
  status?: InputMaybe<TicketStatus>;
  ticketId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type TicketStatusHistorySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export enum TicketStatusReason {
  Canceled = "CANCELED",
  Expired = "EXPIRED",
  Purchased = "PURCHASED",
  Refunded = "REFUNDED",
  Reserved = "RESERVED",
  Used = "USED",
}

export type TicketUsePayload = TicketUseSuccess;

export type TicketUseSuccess = {
  __typename?: "TicketUseSuccess";
  ticket: Ticket;
};

export type TicketsConnection = {
  __typename?: "TicketsConnection";
  edges?: Maybe<Array<Maybe<TicketEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Transaction = {
  __typename?: "Transaction";
  createdAt: Scalars["Datetime"]["output"];
  fromPointChange?: Maybe<Scalars["Int"]["output"]>;
  fromWallet?: Maybe<Wallet>;
  id: Scalars["ID"]["output"];
  participation?: Maybe<Participation>;
  reason: TransactionReason;
  ticketStatusHistories?: Maybe<TicketStatusHistoriesConnection>;
  toPointChange?: Maybe<Scalars["Int"]["output"]>;
  toWallet?: Maybe<Wallet>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type TransactionTicketStatusHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TicketStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TicketStatusHistorySortInput>;
};

export type TransactionDonateSelfPointInput = {
  communityId: Scalars["ID"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  fromWalletId: Scalars["ID"]["input"];
  toPointChange: Scalars["Int"]["input"];
  toUserId: Scalars["ID"]["input"];
};

export type TransactionDonateSelfPointPayload = TransactionDonateSelfPointSuccess;

export type TransactionDonateSelfPointSuccess = {
  __typename?: "TransactionDonateSelfPointSuccess";
  transaction: Transaction;
};

export type TransactionEdge = Edge & {
  __typename?: "TransactionEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Transaction>;
};

export type TransactionFilterInput = {
  fromWalletId?: InputMaybe<Scalars["ID"]["input"]>;
  reason?: InputMaybe<TransactionReason>;
  toWalletId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type TransactionGrantCommunityPointInput = {
  communityId: Scalars["ID"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  fromWalletId: Scalars["ID"]["input"];
  toPointChange: Scalars["Int"]["input"];
  toUserId: Scalars["ID"]["input"];
};

export type TransactionGrantCommunityPointPayload = TransactionGrantCommunityPointSuccess;

export type TransactionGrantCommunityPointSuccess = {
  __typename?: "TransactionGrantCommunityPointSuccess";
  transaction: Transaction;
};

export type TransactionIssueCommunityPointInput = {
  toPointChange: Scalars["Int"]["input"];
  toWalletId: Scalars["ID"]["input"];
};

export type TransactionIssueCommunityPointPayload = TransactionIssueCommunityPointSuccess;

export type TransactionIssueCommunityPointSuccess = {
  __typename?: "TransactionIssueCommunityPointSuccess";
  transaction: Transaction;
};

export enum TransactionReason {
  Donation = "DONATION",
  Grant = "GRANT",
  Onboarding = "ONBOARDING",
  PointIssued = "POINT_ISSUED",
  PointReward = "POINT_REWARD",
  TicketPurchased = "TICKET_PURCHASED",
  TicketRefunded = "TICKET_REFUNDED",
}

export type TransactionSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type TransactionsConnection = {
  __typename?: "TransactionsConnection";
  edges?: Maybe<Array<Maybe<TransactionEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type User = {
  __typename?: "User";
  articlesAboutMe?: Maybe<ArticlesConnection>;
  articlesWrittenByMe?: Maybe<ArticlesConnection>;
  bio?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  currentPrefecture?: Maybe<CurrentPrefecture>;
  evaluationCreatedByMe?: Maybe<EvaluationHistoriesConnection>;
  evaluations?: Maybe<EvaluationsConnection>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  membershipChangedByMe?: Maybe<MembershipHistoriesConnection>;
  memberships?: Maybe<MembershipsConnection>;
  name: Scalars["String"]["output"];
  opportunitiesCreatedByMe?: Maybe<OpportunitiesConnection>;
  participationStatusChangedByMe?: Maybe<ParticipationStatusHistoriesConnection>;
  participations?: Maybe<ParticipationsConnection>;
  portfolios?: Maybe<PortfoliosConnection>;
  reservationStatusChangedByMe?: Maybe<ReservationHistoriesConnection>;
  reservations?: Maybe<ReservationsConnection>;
  slug: Scalars["String"]["output"];
  sysRole: SysRole;
  ticketStatusChangedByMe?: Maybe<TicketStatusHistoriesConnection>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  urlFacebook?: Maybe<Scalars["String"]["output"]>;
  urlInstagram?: Maybe<Scalars["String"]["output"]>;
  urlTiktok?: Maybe<Scalars["String"]["output"]>;
  urlWebsite?: Maybe<Scalars["String"]["output"]>;
  urlX?: Maybe<Scalars["String"]["output"]>;
  urlYoutube?: Maybe<Scalars["String"]["output"]>;
  wallets?: Maybe<WalletsConnection>;
};

export type UserArticlesAboutMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ArticleFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ArticleSortInput>;
};

export type UserArticlesWrittenByMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ArticleFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ArticleSortInput>;
};

export type UserEvaluationCreatedByMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<EvaluationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<EvaluationHistorySortInput>;
};

export type UserEvaluationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<EvaluationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<EvaluationSortInput>;
};

export type UserMembershipChangedByMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<MembershipHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<MembershipHistorySortInput>;
};

export type UserMembershipsArgs = {
  cursor?: InputMaybe<MembershipCursorInput>;
  filter?: InputMaybe<MembershipFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<MembershipSortInput>;
};

export type UserOpportunitiesCreatedByMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySortInput>;
};

export type UserParticipationStatusChangedByMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationStatusHistorySortInput>;
};

export type UserParticipationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationSortInput>;
};

export type UserPortfoliosArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<PortfolioFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<PortfolioSortInput>;
};

export type UserReservationStatusChangedByMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ReservationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ReservationHistorySortInput>;
};

export type UserReservationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ReservationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ReservationSortInput>;
};

export type UserTicketStatusChangedByMeArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TicketStatusHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TicketStatusHistorySortInput>;
};

export type UserWalletsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<WalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<WalletSortInput>;
};

export type UserDeleteInput = {
  /** Used for permission checking. */
  userId: Scalars["ID"]["input"];
};

export type UserDeletePayload = {
  __typename?: "UserDeletePayload";
  userId: Scalars["ID"]["output"];
};

export type UserEdge = Edge & {
  __typename?: "UserEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<User>;
};

export type UserFilterInput = {
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  sysRole?: InputMaybe<SysRole>;
};

export type UserSignUpInput = {
  currentPrefecture: CurrentPrefecture;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  slug?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type UserUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  currentPrefecture?: InputMaybe<CurrentPrefecture>;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  slug: Scalars["String"]["input"];
  urlFacebook?: InputMaybe<Scalars["String"]["input"]>;
  urlInstagram?: InputMaybe<Scalars["String"]["input"]>;
  urlTiktok?: InputMaybe<Scalars["String"]["input"]>;
  urlWebsite?: InputMaybe<Scalars["String"]["input"]>;
  urlX?: InputMaybe<Scalars["String"]["input"]>;
  urlYoutube?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserUpdateProfilePayload = UserUpdateProfileSuccess;

export type UserUpdateProfileSuccess = {
  __typename?: "UserUpdateProfileSuccess";
  user?: Maybe<User>;
};

export type UsersConnection = {
  __typename?: "UsersConnection";
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type UtilitiesConnection = {
  __typename?: "UtilitiesConnection";
  edges?: Maybe<Array<Maybe<UtilityEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Utility = {
  __typename?: "Utility";
  community: Community;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  name: Scalars["String"]["output"];
  pointsRequired: Scalars["Int"]["output"];
  publishStatus: PublishStatus;
  requiredForOpportunities?: Maybe<OpportunitiesConnection>;
  tickets?: Maybe<TicketsConnection>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type UtilityRequiredForOpportunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySortInput>;
};

export type UtilityTicketsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TicketFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TicketSortInput>;
};

export type UtilityCreateInput = {
  communityId: Scalars["ID"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<ImageInput>>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
};

export type UtilityCreatePayload = UtilityCreateSuccess;

export type UtilityCreateSuccess = {
  __typename?: "UtilityCreateSuccess";
  utility: Utility;
};

export type UtilityDeletePayload = UtilityDeleteSuccess;

export type UtilityDeleteSuccess = {
  __typename?: "UtilityDeleteSuccess";
  utilityId: Scalars["String"]["output"];
};

export type UtilityEdge = Edge & {
  __typename?: "UtilityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Utility>;
};

export type UtilityFilterInput = {
  and?: InputMaybe<Array<UtilityFilterInput>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  not?: InputMaybe<UtilityFilterInput>;
  or?: InputMaybe<Array<UtilityFilterInput>>;
  publishStatus?: InputMaybe<Array<PublishStatus>>;
};

export type UtilitySetPublishStatusInput = {
  publishStatus: PublishStatus;
};

export type UtilitySetPublishStatusPayload = UtilitySetPublishStatusSuccess;

export type UtilitySetPublishStatusSuccess = {
  __typename?: "UtilitySetPublishStatusSuccess";
  utility: Utility;
};

export type UtilitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
  pointsRequired?: InputMaybe<SortDirection>;
};

export type UtilityUpdateInfoInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<ImageInput>>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
};

export type UtilityUpdateInfoPayload = UtilityUpdateInfoSuccess;

export type UtilityUpdateInfoSuccess = {
  __typename?: "UtilityUpdateInfoSuccess";
  utility: Utility;
};

export enum ValueType {
  Float = "FLOAT",
  Int = "INT",
}

export type Wallet = {
  __typename?: "Wallet";
  accumulatedPointView?: Maybe<AccumulatedPointView>;
  community: Community;
  createdAt: Scalars["Datetime"]["output"];
  currentPointView?: Maybe<CurrentPointView>;
  id: Scalars["ID"]["output"];
  tickets?: Maybe<TicketsConnection>;
  transactions?: Maybe<TransactionsConnection>;
  type: WalletType;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type WalletTicketsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TicketFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TicketSortInput>;
};

export type WalletTransactionsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TransactionFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TransactionSortInput>;
};

export type WalletEdge = Edge & {
  __typename?: "WalletEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Wallet>;
};

export type WalletFilterInput = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  type?: InputMaybe<WalletType>;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type WalletSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export enum WalletType {
  Community = "COMMUNITY",
  Member = "MEMBER",
}

export type WalletsConnection = {
  __typename?: "WalletsConnection";
  edges?: Maybe<Array<Maybe<WalletEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type UserSignUpMutationVariables = Exact<{
  input: UserSignUpInput;
}>;

export type UserSignUpMutation = {
  __typename?: "Mutation";
  userSignUp?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string; name: string } | null;
  } | null;
};

export type CreateReservationMutationVariables = Exact<{
  input: ReservationCreateInput;
}>;

export type CreateReservationMutation = {
  __typename?: "Mutation";
  reservationCreate?: {
    __typename?: "ReservationCreateSuccess";
    reservation: { __typename?: "Reservation"; id: string; status: ReservationStatus };
  } | null;
};

export type UpdateMyProfileMutationVariables = Exact<{
  input: UserUpdateProfileInput;
  permission: CheckIsSelfPermissionInput;
}>;

export type UpdateMyProfileMutation = {
  __typename?: "Mutation";
  userUpdateMyProfile?: {
    __typename?: "UserUpdateProfileSuccess";
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: CurrentPrefecture | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      slug: string;
    } | null;
  } | null;
};

export type GetArticleQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
}>;

export type GetArticleQuery = {
  __typename?: "Query";
  article?: {
    __typename?: "Article";
    id: string;
    title: string;
    introduction: string;
    body: string;
    category: ArticleCategory;
    thumbnail?: any | null;
    publishedAt?: Date | null;
    createdAt: Date;
    updatedAt?: Date | null;
    authors?: Array<{
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
    }> | null;
    relatedUsers?: Array<{
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
    }> | null;
  } | null;
  articles: {
    __typename?: "ArticlesConnection";
    edges?: Array<{
      __typename?: "ArticleEdge";
      node?: {
        __typename?: "Article";
        id: string;
        title: string;
        introduction: string;
        thumbnail?: any | null;
        publishedAt?: Date | null;
        authors?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
        }> | null;
      } | null;
    } | null> | null;
  };
};

export type GetArticlesQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ArticleFilterInput>;
  sort?: InputMaybe<ArticleSortInput>;
}>;

export type GetArticlesQuery = {
  __typename?: "Query";
  articles: {
    __typename?: "ArticlesConnection";
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
    edges?: Array<{
      __typename?: "ArticleEdge";
      node?: {
        __typename?: "Article";
        id: string;
        title: string;
        introduction: string;
        thumbnail?: any | null;
        publishedAt?: Date | null;
        authors?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
        }> | null;
      } | null;
    } | null> | null;
  };
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string; name: string } | null;
  } | null;
};

export type OpportunityFieldsFragment = {
  __typename?: "Opportunity";
  id: string;
  title: string;
  description: string;
  images?: Array<string> | null;
  feeRequired?: number | null;
  pointsToEarn?: number | null;
  isReservableWithTicket?: boolean | null;
  community?: { __typename?: "Community"; id: string; name: string; image?: string | null } | null;
  place?: {
    __typename?: "Place";
    id: string;
    name: string;
    address: string;
    city: { __typename?: "City"; name: string; state: { __typename?: "State"; name: string } };
  } | null;
  slots?: {
    __typename?: "OpportunitySlotsConnection";
    edges?: Array<{
      __typename?: "OpportunitySlotEdge";
      node?: {
        __typename?: "OpportunitySlot";
        id: string;
        startsAt: Date;
        endsAt: Date;
        capacity?: number | null;
      } | null;
    } | null> | null;
  } | null;
} & { " $fragmentName"?: "OpportunityFieldsFragment" };

export type GetOpportunitiesQueryVariables = Exact<{
  upcomingFilter?: InputMaybe<OpportunityFilterInput>;
  featuredFilter?: InputMaybe<OpportunityFilterInput>;
  allFilter?: InputMaybe<OpportunityFilterInput>;
  similarFilter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetOpportunitiesQuery = {
  __typename?: "Query";
  upcoming: {
    __typename?: "OpportunitiesConnection";
    edges: Array<{
      __typename?: "OpportunityEdge";
      node?:
        | ({ __typename?: "Opportunity" } & {
            " $fragmentRefs"?: { OpportunityFieldsFragment: OpportunityFieldsFragment };
          })
        | null;
    }>;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
  featured: {
    __typename?: "OpportunitiesConnection";
    edges: Array<{
      __typename?: "OpportunityEdge";
      node?:
        | ({ __typename?: "Opportunity" } & {
            " $fragmentRefs"?: { OpportunityFieldsFragment: OpportunityFieldsFragment };
          })
        | null;
    }>;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
  similar: {
    __typename?: "OpportunitiesConnection";
    edges: Array<{
      __typename?: "OpportunityEdge";
      node?:
        | ({ __typename?: "Opportunity" } & {
            " $fragmentRefs"?: { OpportunityFieldsFragment: OpportunityFieldsFragment };
          })
        | null;
    }>;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
  all: {
    __typename?: "OpportunitiesConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "OpportunityEdge";
      node?:
        | ({ __typename?: "Opportunity" } & {
            " $fragmentRefs"?: { OpportunityFieldsFragment: OpportunityFieldsFragment };
          })
        | null;
    }>;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GetOpportunityQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: CheckCommunityPermissionInput;
}>;

export type GetOpportunityQuery = {
  __typename?: "Query";
  opportunity?: {
    __typename?: "Opportunity";
    id: string;
    title: string;
    description: string;
    body?: string | null;
    category: OpportunityCategory;
    capacity?: number | null;
    pointsToEarn?: number | null;
    isReservableWithTicket?: boolean | null;
    feeRequired?: number | null;
    requireApproval: boolean;
    publishStatus: PublishStatus;
    images?: Array<string> | null;
    createdAt: Date;
    updatedAt?: Date | null;
    community?: {
      __typename?: "Community";
      id: string;
      name: string;
      image?: string | null;
    } | null;
    createdByUser?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      articlesAboutMe?: {
        __typename?: "ArticlesConnection";
        edges?: Array<{
          __typename?: "ArticleEdge";
          node?: {
            __typename?: "Article";
            id: string;
            title: string;
            introduction: string;
            thumbnail?: any | null;
            createdAt: Date;
          } | null;
        } | null> | null;
      } | null;
      opportunitiesCreatedByMe?: {
        __typename?: "OpportunitiesConnection";
        edges: Array<{
          __typename?: "OpportunityEdge";
          node?: {
            __typename?: "Opportunity";
            id: string;
            title: string;
            description: string;
            category: OpportunityCategory;
            capacity?: number | null;
            pointsToEarn?: number | null;
            feeRequired?: number | null;
            requireApproval: boolean;
            publishStatus: PublishStatus;
            images?: Array<string> | null;
            createdAt: Date;
            updatedAt?: Date | null;
            community?: {
              __typename?: "Community";
              id: string;
              name: string;
              image?: string | null;
            } | null;
            slots?: {
              __typename?: "OpportunitySlotsConnection";
              edges?: Array<{
                __typename?: "OpportunitySlotEdge";
                node?: {
                  __typename?: "OpportunitySlot";
                  id: string;
                  startsAt: Date;
                  endsAt: Date;
                  participations?: {
                    __typename?: "ParticipationsConnection";
                    edges: Array<{
                      __typename?: "ParticipationEdge";
                      node?: {
                        __typename?: "Participation";
                        id: string;
                        status: ParticipationStatus;
                        user?: {
                          __typename?: "User";
                          id: string;
                          name: string;
                          image?: string | null;
                        } | null;
                      } | null;
                    }>;
                  } | null;
                } | null;
              } | null> | null;
            } | null;
          } | null;
        }>;
      } | null;
    } | null;
    place?: {
      __typename?: "Place";
      id: string;
      name: string;
      address: string;
      latitude: any;
      longitude: any;
      city: { __typename?: "City"; name: string; state: { __typename?: "State"; name: string } };
    } | null;
    requiredUtilities?: Array<{ __typename?: "Utility"; id: string }> | null;
    slots?: {
      __typename?: "OpportunitySlotsConnection";
      edges?: Array<{
        __typename?: "OpportunitySlotEdge";
        node?: {
          __typename?: "OpportunitySlot";
          id: string;
          startsAt: Date;
          endsAt: Date;
          participations?: {
            __typename?: "ParticipationsConnection";
            edges: Array<{
              __typename?: "ParticipationEdge";
              node?: {
                __typename?: "Participation";
                id: string;
                status: ParticipationStatus;
                images?: Array<string> | null;
                user?: {
                  __typename?: "User";
                  id: string;
                  name: string;
                  image?: string | null;
                } | null;
              } | null;
            }>;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export type GetParticipationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetParticipationQuery = {
  __typename?: "Query";
  participation?: {
    __typename?: "Participation";
    id: string;
    images?: Array<string> | null;
    reason: ParticipationStatusReason;
    source: Source;
    status: ParticipationStatus;
    updatedAt?: Date | null;
    reservation?: {
      __typename?: "Reservation";
      id: string;
      opportunitySlot: {
        __typename?: "OpportunitySlot";
        id: string;
        capacity?: number | null;
        startsAt: Date;
        endsAt: Date;
        hostingStatus: OpportunitySlotHostingStatus;
        opportunity?: {
          __typename?: "Opportunity";
          id: string;
          title: string;
          description: string;
          body?: string | null;
          category: OpportunityCategory;
          capacity?: number | null;
          pointsToEarn?: number | null;
          feeRequired?: number | null;
          requireApproval: boolean;
          publishStatus: PublishStatus;
          images?: Array<string> | null;
          createdAt: Date;
          updatedAt?: Date | null;
          community?: {
            __typename?: "Community";
            id: string;
            name: string;
            image?: string | null;
          } | null;
          createdByUser?: {
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
          } | null;
          place?: {
            __typename?: "Place";
            id: string;
            name: string;
            address: string;
            latitude: any;
            longitude: any;
            city: {
              __typename?: "City";
              name: string;
              state: { __typename?: "State"; name: string };
            };
          } | null;
          slots?: {
            __typename?: "OpportunitySlotsConnection";
            edges?: Array<{
              __typename?: "OpportunitySlotEdge";
              node?: {
                __typename?: "OpportunitySlot";
                id: string;
                startsAt: Date;
                endsAt: Date;
                participations?: {
                  __typename?: "ParticipationsConnection";
                  edges: Array<{
                    __typename?: "ParticipationEdge";
                    node?: {
                      __typename?: "Participation";
                      id: string;
                      status: ParticipationStatus;
                      images?: Array<string> | null;
                      user?: {
                        __typename?: "User";
                        id: string;
                        name: string;
                        image?: string | null;
                      } | null;
                    } | null;
                  }>;
                } | null;
              } | null;
            } | null> | null;
          } | null;
        } | null;
      };
      participations?: Array<{
        __typename?: "Participation";
        id: string;
        user?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
      }> | null;
    } | null;
    statusHistories?: {
      __typename?: "ParticipationStatusHistoriesConnection";
      edges: Array<{
        __typename?: "ParticipationStatusHistoryEdge";
        node?: {
          __typename?: "ParticipationStatusHistory";
          id: string;
          status: ParticipationStatus;
          reason: ParticipationStatusReason;
          createdAt: Date;
          createdByUser?: { __typename?: "User"; id: string; name: string } | null;
        } | null;
      }>;
    } | null;
    user?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
  } | null;
};

export type SearchOpportunitiesQueryVariables = Exact<{
  filter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type SearchOpportunitiesQuery = {
  __typename?: "Query";
  opportunities: {
    __typename?: "OpportunitiesConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "OpportunityEdge";
      node?: {
        __typename?: "Opportunity";
        id: string;
        title: string;
        description: string;
        category: OpportunityCategory;
        capacity?: number | null;
        pointsToEarn?: number | null;
        feeRequired?: number | null;
        requireApproval: boolean;
        publishStatus: PublishStatus;
        images?: Array<string> | null;
        createdAt: Date;
        updatedAt?: Date | null;
        community?: {
          __typename?: "Community";
          id: string;
          name: string;
          image?: string | null;
        } | null;
        place?: {
          __typename?: "Place";
          id: string;
          name: string;
          address: string;
          latitude: any;
          longitude: any;
          city: {
            __typename?: "City";
            name: string;
            state: { __typename?: "State"; name: string };
          };
        } | null;
        slots?: {
          __typename?: "OpportunitySlotsConnection";
          edges?: Array<{
            __typename?: "OpportunitySlotEdge";
            node?: {
              __typename?: "OpportunitySlot";
              id: string;
              startsAt: Date;
              endsAt: Date;
              capacity?: number | null;
              participations?: {
                __typename?: "ParticipationsConnection";
                edges: Array<{
                  __typename?: "ParticipationEdge";
                  node?: {
                    __typename?: "Participation";
                    id: string;
                    status: ParticipationStatus;
                    user?: {
                      __typename?: "User";
                      id: string;
                      name: string;
                      image?: string | null;
                    } | null;
                  } | null;
                }>;
              } | null;
            } | null;
          } | null> | null;
        } | null;
      } | null;
    }>;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GetUserProfileQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetUserProfileQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    sysRole: SysRole;
    currentPrefecture?: CurrentPrefecture | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlWebsite?: string | null;
    urlX?: string | null;
    urlYoutube?: string | null;
  } | null;
};

export type GetUserWithDetailsAndPortfoliosQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  first?: InputMaybe<Scalars["Int"]["input"]>;
  after?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<PortfolioFilterInput>;
  sort?: InputMaybe<PortfolioSortInput>;
}>;

export type GetUserWithDetailsAndPortfoliosQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    sysRole: SysRole;
    currentPrefecture?: CurrentPrefecture | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlWebsite?: string | null;
    urlX?: string | null;
    urlYoutube?: string | null;
    portfolios?: {
      __typename?: "PortfoliosConnection";
      edges?: Array<{
        __typename?: "PortfolioEdge";
        cursor: string;
        node?: {
          __typename?: "Portfolio";
          id: string;
          title: string;
          category: string;
          date: Date;
          thumbnailUrl?: string | null;
          source: PortfolioSource;
          place?: { __typename?: "Place"; id: string; name: string } | null;
          participants: Array<{
            __typename?: "User";
            id: string;
            name: string;
            image?: string | null;
          }>;
        } | null;
      } | null> | null;
      pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
    } | null;
  } | null;
};

export type GetUserWalletQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetUserWalletQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    wallets?: {
      __typename?: "WalletsConnection";
      edges?: Array<{
        __typename?: "WalletEdge";
        node?: {
          __typename?: "Wallet";
          id: string;
          tickets?: {
            __typename?: "TicketsConnection";
            edges?: Array<{
              __typename?: "TicketEdge";
              node?: {
                __typename?: "Ticket";
                id: string;
                status: TicketStatus;
                utility: { __typename?: "Utility"; id: string };
                ticketStatusHistories?: {
                  __typename?: "TicketStatusHistoriesConnection";
                  edges?: Array<{
                    __typename?: "TicketStatusHistoryEdge";
                    node?: {
                      __typename?: "TicketStatusHistory";
                      id: string;
                      status: TicketStatus;
                      createdByUser?: {
                        __typename?: "User";
                        id: string;
                        name: string;
                        image?: string | null;
                      } | null;
                    } | null;
                  } | null> | null;
                } | null;
              } | null;
            } | null> | null;
          } | null;
        } | null;
      } | null> | null;
    } | null;
  } | null;
};

export const OpportunityFieldsFragmentDoc = {
  kind: "Document",
  definitions: [
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "OpportunityFields" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Opportunity" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "images" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "community" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "place" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "city" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "slots" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "endsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "capacity" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "feeRequired" } },
          { kind: "Field", name: { kind: "Name", value: "pointsToEarn" } },
          { kind: "Field", name: { kind: "Name", value: "isReservableWithTicket" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OpportunityFieldsFragment, unknown>;
export const UserSignUpDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "userSignUp" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UserSignUpInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userSignUp" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UserSignUpMutation, UserSignUpMutationVariables>;
export const CreateReservationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "CreateReservation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ReservationCreateInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "reservationCreate" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ReservationCreateSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "reservation" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "status" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateReservationMutation, CreateReservationMutationVariables>;
export const UpdateMyProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "UpdateMyProfile" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UserUpdateProfileInput" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "permission" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CheckIsSelfPermissionInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userUpdateMyProfile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "input" },
                value: { kind: "Variable", name: { kind: "Name", value: "input" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "permission" },
                value: { kind: "Variable", name: { kind: "Name", value: "permission" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "UserUpdateProfileSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "user" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "image" } },
                            { kind: "Field", name: { kind: "Name", value: "bio" } },
                            { kind: "Field", name: { kind: "Name", value: "currentPrefecture" } },
                            { kind: "Field", name: { kind: "Name", value: "urlFacebook" } },
                            { kind: "Field", name: { kind: "Name", value: "urlInstagram" } },
                            { kind: "Field", name: { kind: "Name", value: "urlX" } },
                            { kind: "Field", name: { kind: "Name", value: "slug" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateMyProfileMutation, UpdateMyProfileMutationVariables>;
export const GetArticleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArticle" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "permission" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CheckCommunityPermissionInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "article" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "permission" },
                value: { kind: "Variable", name: { kind: "Name", value: "permission" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "introduction" } },
                { kind: "Field", name: { kind: "Name", value: "body" } },
                { kind: "Field", name: { kind: "Name", value: "category" } },
                { kind: "Field", name: { kind: "Name", value: "thumbnail" } },
                { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "authors" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "image" } },
                      { kind: "Field", name: { kind: "Name", value: "bio" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "relatedUsers" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "image" } },
                      { kind: "Field", name: { kind: "Name", value: "bio" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "articles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "IntValue", value: "4" },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "categories" },
                      value: {
                        kind: "ListValue",
                        values: [{ kind: "StringValue", value: "INTERVIEW", block: false }],
                      },
                    },
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "publishStatus" },
                      value: {
                        kind: "ListValue",
                        values: [{ kind: "EnumValue", value: "PUBLIC" }],
                      },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "publishedAt" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                            { kind: "Field", name: { kind: "Name", value: "introduction" } },
                            { kind: "Field", name: { kind: "Name", value: "thumbnail" } },
                            { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "authors" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  { kind: "Field", name: { kind: "Name", value: "image" } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetArticleQuery, GetArticleQueryVariables>;
export const GetArticlesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetArticles" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "ArticleFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "ArticleSortInput" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "articles" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "cursor" },
                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "filter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: { kind: "Variable", name: { kind: "Name", value: "sort" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                            { kind: "Field", name: { kind: "Name", value: "introduction" } },
                            { kind: "Field", name: { kind: "Name", value: "thumbnail" } },
                            { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "authors" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  { kind: "Field", name: { kind: "Name", value: "image" } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetArticlesQuery, GetArticlesQueryVariables>;
export const CurrentUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "currentUser" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "currentUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const GetOpportunitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetOpportunities" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "upcomingFilter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OpportunityFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "featuredFilter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OpportunityFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "allFilter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OpportunityFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "similarFilter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OpportunityFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            alias: { kind: "Name", value: "upcoming" },
            name: { kind: "Name", value: "opportunities" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "upcomingFilter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "sort" },
                value: {
                  kind: "ObjectValue",
                  fields: [
                    {
                      kind: "ObjectField",
                      name: { kind: "Name", value: "createdAt" },
                      value: { kind: "EnumValue", value: "desc" },
                    },
                  ],
                },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "IntValue", value: "5" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "OpportunityFields" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "featured" },
            name: { kind: "Name", value: "opportunities" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "featuredFilter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "IntValue", value: "5" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "OpportunityFields" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "similar" },
            name: { kind: "Name", value: "opportunities" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "similarFilter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "IntValue", value: "3" },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "OpportunityFields" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            alias: { kind: "Name", value: "all" },
            name: { kind: "Name", value: "opportunities" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "allFilter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "cursor" },
                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "FragmentSpread",
                              name: { kind: "Name", value: "OpportunityFields" },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: "FragmentDefinition",
      name: { kind: "Name", value: "OpportunityFields" },
      typeCondition: { kind: "NamedType", name: { kind: "Name", value: "Opportunity" } },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          { kind: "Field", name: { kind: "Name", value: "id" } },
          { kind: "Field", name: { kind: "Name", value: "title" } },
          { kind: "Field", name: { kind: "Name", value: "description" } },
          { kind: "Field", name: { kind: "Name", value: "images" } },
          {
            kind: "Field",
            name: { kind: "Name", value: "community" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "place" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "address" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "city" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [{ kind: "Field", name: { kind: "Name", value: "name" } }],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            kind: "Field",
            name: { kind: "Name", value: "slots" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "endsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "capacity" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          { kind: "Field", name: { kind: "Name", value: "feeRequired" } },
          { kind: "Field", name: { kind: "Name", value: "pointsToEarn" } },
          { kind: "Field", name: { kind: "Name", value: "isReservableWithTicket" } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetOpportunitiesQuery, GetOpportunitiesQueryVariables>;
export const GetOpportunityDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetOpportunity" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "permission" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CheckCommunityPermissionInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "opportunity" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "permission" },
                value: { kind: "Variable", name: { kind: "Name", value: "permission" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "body" } },
                { kind: "Field", name: { kind: "Name", value: "category" } },
                { kind: "Field", name: { kind: "Name", value: "capacity" } },
                { kind: "Field", name: { kind: "Name", value: "pointsToEarn" } },
                { kind: "Field", name: { kind: "Name", value: "isReservableWithTicket" } },
                { kind: "Field", name: { kind: "Name", value: "feeRequired" } },
                { kind: "Field", name: { kind: "Name", value: "requireApproval" } },
                { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "community" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "image" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "createdByUser" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "image" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "articlesAboutMe" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "first" },
                            value: { kind: "IntValue", value: "1" },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "filter" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "publishStatus" },
                                  value: {
                                    kind: "ListValue",
                                    values: [{ kind: "EnumValue", value: "PUBLIC" }],
                                  },
                                },
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "categories" },
                                  value: {
                                    kind: "ListValue",
                                    values: [
                                      { kind: "StringValue", value: "INTERVIEW", block: false },
                                    ],
                                  },
                                },
                              ],
                            },
                          },
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "sort" },
                            value: {
                              kind: "ObjectValue",
                              fields: [
                                {
                                  kind: "ObjectField",
                                  name: { kind: "Name", value: "publishedAt" },
                                  value: { kind: "EnumValue", value: "desc" },
                                },
                              ],
                            },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "edges" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "node" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "title" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "introduction" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "thumbnail" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "createdAt" },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "opportunitiesCreatedByMe" },
                        arguments: [
                          {
                            kind: "Argument",
                            name: { kind: "Name", value: "first" },
                            value: { kind: "IntValue", value: "5" },
                          },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "edges" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "node" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "title" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "description" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "category" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "capacity" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "community" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "image" },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "pointsToEarn" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "feeRequired" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "requireApproval" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "publishStatus" },
                                        },
                                        { kind: "Field", name: { kind: "Name", value: "images" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "createdAt" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "updatedAt" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "slots" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "edges" },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "node" },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "id" },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "startsAt",
                                                            },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "endsAt" },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: {
                                                              kind: "Name",
                                                              value: "participations",
                                                            },
                                                            selectionSet: {
                                                              kind: "SelectionSet",
                                                              selections: [
                                                                {
                                                                  kind: "Field",
                                                                  name: {
                                                                    kind: "Name",
                                                                    value: "edges",
                                                                  },
                                                                  selectionSet: {
                                                                    kind: "SelectionSet",
                                                                    selections: [
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "node",
                                                                        },
                                                                        selectionSet: {
                                                                          kind: "SelectionSet",
                                                                          selections: [
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "id",
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "status",
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "user",
                                                                              },
                                                                              selectionSet: {
                                                                                kind: "SelectionSet",
                                                                                selections: [
                                                                                  {
                                                                                    kind: "Field",
                                                                                    name: {
                                                                                      kind: "Name",
                                                                                      value: "id",
                                                                                    },
                                                                                  },
                                                                                  {
                                                                                    kind: "Field",
                                                                                    name: {
                                                                                      kind: "Name",
                                                                                      value: "name",
                                                                                    },
                                                                                  },
                                                                                  {
                                                                                    kind: "Field",
                                                                                    name: {
                                                                                      kind: "Name",
                                                                                      value:
                                                                                        "image",
                                                                                    },
                                                                                  },
                                                                                ],
                                                                              },
                                                                            },
                                                                          ],
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "place" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "address" } },
                      { kind: "Field", name: { kind: "Name", value: "latitude" } },
                      { kind: "Field", name: { kind: "Name", value: "longitude" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "city" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "requiredUtilities" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "slots" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "edges" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                                  { kind: "Field", name: { kind: "Name", value: "endsAt" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "participations" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "edges" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "node" },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "id" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "status" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "images" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "user" },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "id" },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "name" },
                                                          },
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "image" },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetOpportunityQuery, GetOpportunityQueryVariables>;
export const GetParticipationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetParticipation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "participation" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "images" } },
                { kind: "Field", name: { kind: "Name", value: "reason" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "reservation" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "opportunitySlot" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "capacity" } },
                            { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "endsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "hostingStatus" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "opportunity" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "title" } },
                                  { kind: "Field", name: { kind: "Name", value: "description" } },
                                  { kind: "Field", name: { kind: "Name", value: "body" } },
                                  { kind: "Field", name: { kind: "Name", value: "category" } },
                                  { kind: "Field", name: { kind: "Name", value: "capacity" } },
                                  { kind: "Field", name: { kind: "Name", value: "pointsToEarn" } },
                                  { kind: "Field", name: { kind: "Name", value: "feeRequired" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "requireApproval" },
                                  },
                                  { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                                  { kind: "Field", name: { kind: "Name", value: "images" } },
                                  { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                                  { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "community" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        { kind: "Field", name: { kind: "Name", value: "image" } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdByUser" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        { kind: "Field", name: { kind: "Name", value: "image" } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "place" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        { kind: "Field", name: { kind: "Name", value: "address" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "latitude" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "longitude" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "city" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "state" },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "name" },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "slots" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "edges" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "node" },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "id" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "startsAt" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "endsAt" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "participations",
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "edges" },
                                                            selectionSet: {
                                                              kind: "SelectionSet",
                                                              selections: [
                                                                {
                                                                  kind: "Field",
                                                                  name: {
                                                                    kind: "Name",
                                                                    value: "node",
                                                                  },
                                                                  selectionSet: {
                                                                    kind: "SelectionSet",
                                                                    selections: [
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "id",
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "status",
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "images",
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "user",
                                                                        },
                                                                        selectionSet: {
                                                                          kind: "SelectionSet",
                                                                          selections: [
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "id",
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "name",
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "image",
                                                                              },
                                                                            },
                                                                          ],
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participations" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "user" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  { kind: "Field", name: { kind: "Name", value: "image" } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "source" } },
                { kind: "Field", name: { kind: "Name", value: "status" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "statusHistories" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "edges" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "status" } },
                                  { kind: "Field", name: { kind: "Name", value: "reason" } },
                                  { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "createdByUser" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "image" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetParticipationQuery, GetParticipationQueryVariables>;
export const SearchOpportunitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "SearchOpportunities" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OpportunityFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "opportunities" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "filter" },
                value: { kind: "Variable", name: { kind: "Name", value: "filter" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "first" },
                value: { kind: "Variable", name: { kind: "Name", value: "first" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "edges" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "node" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                            { kind: "Field", name: { kind: "Name", value: "description" } },
                            { kind: "Field", name: { kind: "Name", value: "category" } },
                            { kind: "Field", name: { kind: "Name", value: "capacity" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  { kind: "Field", name: { kind: "Name", value: "image" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "pointsToEarn" } },
                            { kind: "Field", name: { kind: "Name", value: "feeRequired" } },
                            { kind: "Field", name: { kind: "Name", value: "requireApproval" } },
                            { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                            { kind: "Field", name: { kind: "Name", value: "images" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                            { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "place" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  { kind: "Field", name: { kind: "Name", value: "address" } },
                                  { kind: "Field", name: { kind: "Name", value: "latitude" } },
                                  { kind: "Field", name: { kind: "Name", value: "longitude" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "city" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "state" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "name" },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "slots" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "edges" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "node" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "startsAt" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "endsAt" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "capacity" },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "participations" },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "edges" },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "node" },
                                                            selectionSet: {
                                                              kind: "SelectionSet",
                                                              selections: [
                                                                {
                                                                  kind: "Field",
                                                                  name: {
                                                                    kind: "Name",
                                                                    value: "id",
                                                                  },
                                                                },
                                                                {
                                                                  kind: "Field",
                                                                  name: {
                                                                    kind: "Name",
                                                                    value: "status",
                                                                  },
                                                                },
                                                                {
                                                                  kind: "Field",
                                                                  name: {
                                                                    kind: "Name",
                                                                    value: "user",
                                                                  },
                                                                  selectionSet: {
                                                                    kind: "SelectionSet",
                                                                    selections: [
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "id",
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "name",
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "image",
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "pageInfo" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                    ],
                  },
                },
                { kind: "Field", name: { kind: "Name", value: "totalCount" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<SearchOpportunitiesQuery, SearchOpportunitiesQueryVariables>;
export const GetUserProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUserProfile" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
                { kind: "Field", name: { kind: "Name", value: "bio" } },
                { kind: "Field", name: { kind: "Name", value: "sysRole" } },
                { kind: "Field", name: { kind: "Name", value: "currentPrefecture" } },
                { kind: "Field", name: { kind: "Name", value: "urlFacebook" } },
                { kind: "Field", name: { kind: "Name", value: "urlInstagram" } },
                { kind: "Field", name: { kind: "Name", value: "urlWebsite" } },
                { kind: "Field", name: { kind: "Name", value: "urlX" } },
                { kind: "Field", name: { kind: "Name", value: "urlYoutube" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetUserWithDetailsAndPortfoliosDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUserWithDetailsAndPortfolios" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "PortfolioFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "PortfolioSortInput" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
                { kind: "Field", name: { kind: "Name", value: "bio" } },
                { kind: "Field", name: { kind: "Name", value: "sysRole" } },
                { kind: "Field", name: { kind: "Name", value: "currentPrefecture" } },
                { kind: "Field", name: { kind: "Name", value: "urlFacebook" } },
                { kind: "Field", name: { kind: "Name", value: "urlInstagram" } },
                { kind: "Field", name: { kind: "Name", value: "urlWebsite" } },
                { kind: "Field", name: { kind: "Name", value: "urlX" } },
                { kind: "Field", name: { kind: "Name", value: "urlYoutube" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "portfolios" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "first" },
                      value: { kind: "Variable", name: { kind: "Name", value: "first" } },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "cursor" },
                      value: { kind: "Variable", name: { kind: "Name", value: "after" } },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "filter" },
                      value: { kind: "Variable", name: { kind: "Name", value: "filter" } },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "sort" },
                      value: { kind: "Variable", name: { kind: "Name", value: "sort" } },
                    },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "edges" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "title" } },
                                  { kind: "Field", name: { kind: "Name", value: "category" } },
                                  { kind: "Field", name: { kind: "Name", value: "date" } },
                                  { kind: "Field", name: { kind: "Name", value: "thumbnailUrl" } },
                                  { kind: "Field", name: { kind: "Name", value: "source" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "place" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "participants" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        { kind: "Field", name: { kind: "Name", value: "image" } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "cursor" } },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                            { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetUserWithDetailsAndPortfoliosQuery,
  GetUserWithDetailsAndPortfoliosQueryVariables
>;
export const GetUserWalletDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUserWallet" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "id" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "user" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "wallets" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "edges" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "node" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "tickets" },
                                    arguments: [
                                      {
                                        kind: "Argument",
                                        name: { kind: "Name", value: "filter" },
                                        value: {
                                          kind: "ObjectValue",
                                          fields: [
                                            {
                                              kind: "ObjectField",
                                              name: { kind: "Name", value: "status" },
                                              value: { kind: "EnumValue", value: "AVAILABLE" },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "edges" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "node" },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "id" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "status" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "utility" },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "id" },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: {
                                                        kind: "Name",
                                                        value: "ticketStatusHistories",
                                                      },
                                                      selectionSet: {
                                                        kind: "SelectionSet",
                                                        selections: [
                                                          {
                                                            kind: "Field",
                                                            name: { kind: "Name", value: "edges" },
                                                            selectionSet: {
                                                              kind: "SelectionSet",
                                                              selections: [
                                                                {
                                                                  kind: "Field",
                                                                  name: {
                                                                    kind: "Name",
                                                                    value: "node",
                                                                  },
                                                                  selectionSet: {
                                                                    kind: "SelectionSet",
                                                                    selections: [
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "id",
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "status",
                                                                        },
                                                                      },
                                                                      {
                                                                        kind: "Field",
                                                                        name: {
                                                                          kind: "Name",
                                                                          value: "createdByUser",
                                                                        },
                                                                        selectionSet: {
                                                                          kind: "SelectionSet",
                                                                          selections: [
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "id",
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "name",
                                                                              },
                                                                            },
                                                                            {
                                                                              kind: "Field",
                                                                              name: {
                                                                                kind: "Name",
                                                                                value: "image",
                                                                              },
                                                                            },
                                                                          ],
                                                                        },
                                                                      },
                                                                    ],
                                                                  },
                                                                },
                                                              ],
                                                            },
                                                          },
                                                        ],
                                                      },
                                                    },
                                                  ],
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserWalletQuery, GetUserWalletQueryVariables>;
