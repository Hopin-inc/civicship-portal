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
};

export type AuthError = Error & {
  __typename?: "AuthError";
  message: Scalars["String"]["output"];
  statusCode: Scalars["Int"]["output"];
};

export type City = {
  __typename?: "City";
  code: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  state: State;
};

export type CommonError = AuthError | ComplexQueryError | InvalidInputValueError;

export type Communities = {
  __typename?: "Communities";
  data: Array<Community>;
  total: Scalars["Int"]["output"];
};

export type CommunitiesConnection = {
  __typename?: "CommunitiesConnection";
  edges?: Maybe<Array<Maybe<CommunityEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Community = {
  __typename?: "Community";
  bio?: Maybe<Scalars["String"]["output"]>;
  city: City;
  createdAt: Scalars["Datetime"]["output"];
  establishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  memberships?: Maybe<Array<Membership>>;
  name: Scalars["String"]["output"];
  opportunities?: Maybe<Array<Opportunity>>;
  participations?: Maybe<Array<Participation>>;
  pointName: Scalars["String"]["output"];
  state?: Maybe<State>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utilities?: Maybe<Array<Utility>>;
  wallets?: Maybe<Array<Wallet>>;
  website?: Maybe<Scalars["String"]["output"]>;
};

export type CommunityCreateInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCode: Scalars["String"]["input"];
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  pointName: Scalars["String"]["input"];
  stateCode: Scalars["String"]["input"];
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommunityCreatePayload =
  | AuthError
  | CommunityCreateSuccess
  | ComplexQueryError
  | InvalidInputValueError;

export type CommunityCreateSuccess = {
  __typename?: "CommunityCreateSuccess";
  community: Community;
};

export type CommunityDeletePayload =
  | AuthError
  | CommunityDeleteSuccess
  | ComplexQueryError
  | InvalidInputValueError;

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
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  stateCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommunitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type CommunityUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  pointName?: InputMaybe<Scalars["String"]["input"]>;
  stateCode?: InputMaybe<Scalars["String"]["input"]>;
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommunityUpdateProfilePayload =
  | AuthError
  | CommunityUpdateProfileSuccess
  | ComplexQueryError
  | InvalidInputValueError;

export type CommunityUpdateProfileSuccess = {
  __typename?: "CommunityUpdateProfileSuccess";
  community: Community;
};

export type ComplexQueryError = Error & {
  __typename?: "ComplexQueryError";
  message: Scalars["String"]["output"];
  statusCode: Scalars["Int"]["output"];
};

export type CreateUserInput = {
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  slug?: InputMaybe<Scalars["String"]["input"]>;
};

export type CurrentPointView = {
  __typename?: "CurrentPointView";
  currentPoint: Scalars["Int"]["output"];
  walletId: Scalars["String"]["output"];
};

export type CurrentUserPayload = {
  __typename?: "CurrentUserPayload";
  user?: Maybe<User>;
};

export type Edge = {
  cursor: Scalars["String"]["output"];
};

export type Error = {
  message: Scalars["String"]["output"];
  statusCode: Scalars["Int"]["output"];
};

export type Field = {
  __typename?: "Field";
  message?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

export enum IdentityPlatform {
  Facebook = "FACEBOOK",
  Line = "LINE",
}

export type ImageInput = {
  base64: Scalars["String"]["input"];
};

export type InvalidInputValueError = Error & {
  __typename?: "InvalidInputValueError";
  fields?: Maybe<Array<Field>>;
  message: Scalars["String"]["output"];
  statusCode: Scalars["Int"]["output"];
};

export type Membership = {
  __typename?: "Membership";
  community: Community;
  createdAt: Scalars["Datetime"]["output"];
  role: Role;
  status?: Maybe<MembershipStatus>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user: User;
};

export type MembershipApproveInvitationInput = {
  communityId: Scalars["String"]["input"];
};

export type MembershipAssignManagerInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MembershipAssignMemberInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MembershipAssignOwnerInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MembershipCancelInvitationInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MembershipDenyInvitationInput = {
  communityId: Scalars["String"]["input"];
};

export type MembershipEdge = Edge & {
  __typename?: "MembershipEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Membership>;
};

export type MembershipFilterInput = {
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Role>;
  status?: InputMaybe<MembershipStatus>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type MembershipInviteInput = {
  communityId: Scalars["String"]["input"];
  role?: InputMaybe<Role>;
  userId: Scalars["String"]["input"];
};

export type MembershipInvitePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | MembershipInviteSuccess;

export type MembershipInviteSuccess = {
  __typename?: "MembershipInviteSuccess";
  membership: Membership;
};

export type MembershipRemoveInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MembershipRemovePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | MembershipRemoveSuccess;

export type MembershipRemoveSuccess = {
  __typename?: "MembershipRemoveSuccess";
  communityId: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
};

export type MembershipSelfJoinInput = {
  communityId: Scalars["String"]["input"];
};

export type MembershipSelfJoinPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | MembershipSelfJoinSuccess;

export type MembershipSelfJoinSuccess = {
  __typename?: "MembershipSelfJoinSuccess";
  membership: Membership;
};

export type MembershipSetInvitationStatusPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | MembershipSetInvitationStatusSuccess;

export type MembershipSetInvitationStatusSuccess = {
  __typename?: "MembershipSetInvitationStatusSuccess";
  membership: Membership;
};

export type MembershipSetRolePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | MembershipSetRoleSuccess;

export type MembershipSetRoleSuccess = {
  __typename?: "MembershipSetRoleSuccess";
  membership: Membership;
};

export type MembershipSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export enum MembershipStatus {
  Canceled = "CANCELED",
  Invited = "INVITED",
  Joined = "JOINED",
  Withdrawed = "WITHDRAWED",
}

export type MembershipWithdrawInput = {
  communityId: Scalars["String"]["input"];
};

export type MembershipWithdrawPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | MembershipWithdrawSuccess;

export type MembershipWithdrawSuccess = {
  __typename?: "MembershipWithdrawSuccess";
  communityId: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
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
  createUser?: Maybe<CurrentUserPayload>;
  deleteUser?: Maybe<CurrentUserPayload>;
  membershipApproveInvitation?: Maybe<MembershipSetInvitationStatusPayload>;
  membershipAssignManager?: Maybe<MembershipSetRolePayload>;
  membershipAssignMemberRole?: Maybe<MembershipSetRolePayload>;
  membershipAssignOwner?: Maybe<MembershipSetRolePayload>;
  membershipCancelInvitation?: Maybe<MembershipSetInvitationStatusPayload>;
  membershipDenyInvitation?: Maybe<MembershipSetInvitationStatusPayload>;
  membershipInvite?: Maybe<MembershipInvitePayload>;
  membershipRemove?: Maybe<MembershipRemovePayload>;
  membershipSelfJoin?: Maybe<MembershipSelfJoinPayload>;
  membershipWithdraw?: Maybe<MembershipWithdrawPayload>;
  mutationEcho: Scalars["String"]["output"];
  opportunityCreate?: Maybe<OpportunityCreatePayload>;
  opportunityDelete?: Maybe<OpportunityDeletePayload>;
  opportunityEditContent?: Maybe<OpportunityEditContentPayload>;
  opportunitySetCommunityInternal?: Maybe<OpportunitySetPublishStatusPayload>;
  opportunitySetPrivate?: Maybe<OpportunitySetPublishStatusPayload>;
  opportunitySetPublic?: Maybe<OpportunitySetPublishStatusPayload>;
  participationApply?: Maybe<ParticipationApplyPayload>;
  participationApproveApplication?: Maybe<ParticipationSetStatusPayload>;
  participationApproveInvitation?: Maybe<ParticipationSetStatusPayload>;
  participationApprovePerformance?: Maybe<ParticipationSetStatusPayload>;
  participationCancelApplication?: Maybe<ParticipationSetStatusPayload>;
  participationCancelInvitation?: Maybe<ParticipationSetStatusPayload>;
  participationCancelSubmission?: Maybe<ParticipationSetStatusPayload>;
  participationDenyApplication?: Maybe<ParticipationSetStatusPayload>;
  participationDenyInvitation?: Maybe<ParticipationSetStatusPayload>;
  participationDenyPerformance?: Maybe<ParticipationSetStatusPayload>;
  participationInvite?: Maybe<ParticipationSetStatusPayload>;
  participationSubmitOutput?: Maybe<ParticipationSetStatusPayload>;
  transactionDonateSelfPoint?: Maybe<TransactionDonateSelfPointPayload>;
  transactionGrantCommunityPoint?: Maybe<TransactionGrantCommunityPointPayload>;
  transactionIssueCommunityPoint?: Maybe<TransactionIssueCommunityPointPayload>;
  userUpdateProfile?: Maybe<UserUpdateProfilePayload>;
  utilityCreate?: Maybe<UtilityCreatePayload>;
  utilityDelete?: Maybe<UtilityDeletePayload>;
  utilityUpdateInfo?: Maybe<UtilityUpdateInfoPayload>;
  utilityUse?: Maybe<UtilityUsePayload>;
};

export type MutationCommunityCreateArgs = {
  input: CommunityCreateInput;
};

export type MutationCommunityDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationCommunityUpdateProfileArgs = {
  id: Scalars["ID"]["input"];
  input: CommunityUpdateProfileInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationMembershipApproveInvitationArgs = {
  input: MembershipApproveInvitationInput;
};

export type MutationMembershipAssignManagerArgs = {
  input: MembershipAssignManagerInput;
};

export type MutationMembershipAssignMemberRoleArgs = {
  input: MembershipAssignMemberInput;
};

export type MutationMembershipAssignOwnerArgs = {
  input: MembershipAssignOwnerInput;
};

export type MutationMembershipCancelInvitationArgs = {
  input: MembershipCancelInvitationInput;
};

export type MutationMembershipDenyInvitationArgs = {
  input: MembershipDenyInvitationInput;
};

export type MutationMembershipInviteArgs = {
  input: MembershipInviteInput;
};

export type MutationMembershipRemoveArgs = {
  input: MembershipRemoveInput;
};

export type MutationMembershipSelfJoinArgs = {
  input: MembershipSelfJoinInput;
};

export type MutationMembershipWithdrawArgs = {
  input: MembershipWithdrawInput;
};

export type MutationOpportunityCreateArgs = {
  input: OpportunityCreateInput;
};

export type MutationOpportunityDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOpportunityEditContentArgs = {
  id: Scalars["ID"]["input"];
  input: OpportunityEditContentInput;
};

export type MutationOpportunitySetCommunityInternalArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOpportunitySetPrivateArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOpportunitySetPublicArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationApplyArgs = {
  input: ParticipationApplyInput;
};

export type MutationParticipationApproveApplicationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationApproveInvitationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationApprovePerformanceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationCancelApplicationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationCancelInvitationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationCancelSubmissionArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationDenyApplicationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationDenyInvitationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationDenyPerformanceArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationInviteArgs = {
  id: Scalars["ID"]["input"];
  input: ParticipationInviteInput;
};

export type MutationParticipationSubmitOutputArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationTransactionDonateSelfPointArgs = {
  input: TransactionDonateSelfPointInput;
};

export type MutationTransactionGrantCommunityPointArgs = {
  input: TransactionGrantCommunityPointInput;
};

export type MutationTransactionIssueCommunityPointArgs = {
  input: TransactionIssueCommunityPointInput;
};

export type MutationUserUpdateProfileArgs = {
  id: Scalars["ID"]["input"];
  input: UserUpdateProfileInput;
};

export type MutationUtilityCreateArgs = {
  input: UtilityCreateInput;
};

export type MutationUtilityDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationUtilityUpdateInfoArgs = {
  id: Scalars["ID"]["input"];
  input: UtilityUpdateInfoInput;
};

export type MutationUtilityUseArgs = {
  id: Scalars["ID"]["input"];
  input: UtilityUseInput;
};

export type OpportunitiesConnection = {
  __typename?: "OpportunitiesConnection";
  edges: Array<OpportunityEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Opportunity = {
  __typename?: "Opportunity";
  capacity?: Maybe<Scalars["Int"]["output"]>;
  category: OpportunityCategory;
  city: City;
  community: Community;
  createdAt: Scalars["Datetime"]["output"];
  createdByUser: User;
  description?: Maybe<Scalars["String"]["output"]>;
  endsAt?: Maybe<Scalars["Datetime"]["output"]>;
  files?: Maybe<Array<Scalars["String"]["output"]>>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  participations?: Maybe<Array<Participation>>;
  pointsPerParticipation: Scalars["Int"]["output"];
  publishStatus: PublishStatus;
  requireApproval: Scalars["Boolean"]["output"];
  startsAt?: Maybe<Scalars["Datetime"]["output"]>;
  state?: Maybe<State>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export enum OpportunityCategory {
  Conversation = "CONVERSATION",
  Event = "EVENT",
  Task = "TASK",
}

export type OpportunityCreateInput = {
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  category: OpportunityCategory;
  cityCode: Scalars["String"]["input"];
  communityId: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  files?: InputMaybe<Array<Scalars["String"]["input"]>>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  pointsPerParticipation: Scalars["Int"]["input"];
  requireApproval?: InputMaybe<Scalars["Boolean"]["input"]>;
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  stateCode?: InputMaybe<Scalars["String"]["input"]>;
  title: Scalars["String"]["input"];
};

export type OpportunityCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OpportunityCreateSuccess;

export type OpportunityCreateSuccess = {
  __typename?: "OpportunityCreateSuccess";
  opportunity: Opportunity;
};

export type OpportunityDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OpportunityDeleteSuccess;

export type OpportunityDeleteSuccess = {
  __typename?: "OpportunityDeleteSuccess";
  opportunityId: Scalars["String"]["output"];
};

export type OpportunityEdge = Edge & {
  __typename?: "OpportunityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Opportunity>;
};

export type OpportunityEditContentInput = {
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  category?: InputMaybe<OpportunityCategory>;
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  files?: InputMaybe<Array<Scalars["String"]["input"]>>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  pointsPerParticipation?: InputMaybe<Scalars["Int"]["input"]>;
  requireApproval?: InputMaybe<Scalars["Boolean"]["input"]>;
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  title?: InputMaybe<Scalars["String"]["input"]>;
};

export type OpportunityEditContentPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OpportunityEditContentSuccess;

export type OpportunityEditContentSuccess = {
  __typename?: "OpportunityEditContentSuccess";
  opportunity: Opportunity;
};

export type OpportunityFilterInput = {
  category?: InputMaybe<OpportunityCategory>;
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  createdBy?: InputMaybe<Scalars["String"]["input"]>;
  publishStatus?: InputMaybe<PublishStatus>;
  stateCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type OpportunitySetPublishStatusPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OpportunitySetPublishStatusSuccess;

export type OpportunitySetPublishStatusSuccess = {
  __typename?: "OpportunitySetPublishStatusSuccess";
  opportunity: Opportunity;
};

export type OpportunitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
  pointsPerParticipation?: InputMaybe<SortDirection>;
  startsAt?: InputMaybe<SortDirection>;
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
  id: Scalars["ID"]["output"];
  opportunity?: Maybe<Opportunity>;
  status: ParticipationStatus;
  statusHistories?: Maybe<Array<ParticipationStatusHistory>>;
  transactions?: Maybe<Array<Transaction>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type ParticipationApplyInput = {
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  opportunityId: Scalars["String"]["input"];
};

export type ParticipationApplyPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | ParticipationApplySuccess;

export type ParticipationApplySuccess = {
  __typename?: "ParticipationApplySuccess";
  participation: Participation;
};

export type ParticipationEdge = Edge & {
  __typename?: "ParticipationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Participation>;
};

export type ParticipationFilterInput = {
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  opportunityId?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<ParticipationStatus>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type ParticipationInviteInput = {
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  invitedUserId: Scalars["String"]["input"];
  opportunityId: Scalars["String"]["input"];
};

export type ParticipationInvitePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | ParticipationInviteSuccess;

export type ParticipationInviteSuccess = {
  __typename?: "ParticipationInviteSuccess";
  participation: Participation;
};

export type ParticipationSetStatusPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | ParticipationSetStatusSuccess;

export type ParticipationSetStatusSuccess = {
  __typename?: "ParticipationSetStatusSuccess";
  participation: Participation;
};

export type ParticipationSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export enum ParticipationStatus {
  Applied = "APPLIED",
  Approved = "APPROVED",
  Canceled = "CANCELED",
  Denied = "DENIED",
  Invited = "INVITED",
  NotParticipating = "NOT_PARTICIPATING",
  Participating = "PARTICIPATING",
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
  status: ParticipationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type ParticipationStatusHistoryCreateInput = {
  createdById: Scalars["String"]["input"];
  participationId: Scalars["String"]["input"];
  status: ParticipationStatus;
};

export type ParticipationStatusHistoryCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | ParticipationStatusHistoryCreateSuccess;

export type ParticipationStatusHistoryCreateSuccess = {
  __typename?: "ParticipationStatusHistoryCreateSuccess";
  participationStatusHistory: ParticipationStatusHistory;
};

export type ParticipationStatusHistoryEdge = Edge & {
  __typename?: "ParticipationStatusHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<ParticipationStatusHistory>;
};

export type ParticipationStatusHistoryFilterInput = {
  createdById?: InputMaybe<Scalars["String"]["input"]>;
  participationId?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<ParticipationStatus>;
};

export type ParticipationStatusHistorySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type ParticipationsConnection = {
  __typename?: "ParticipationsConnection";
  edges: Array<ParticipationEdge>;
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
  cities: Array<City>;
  communities: CommunitiesConnection;
  community?: Maybe<Community>;
  currentUser?: Maybe<CurrentUserPayload>;
  echo: Scalars["String"]["output"];
  membership?: Maybe<Membership>;
  memberships: MembershipsConnection;
  opportunities: OpportunitiesConnection;
  opportunity?: Maybe<Opportunity>;
  participation?: Maybe<Participation>;
  participationStatusHistories: ParticipationStatusHistoriesConnection;
  participationStatusHistory?: Maybe<ParticipationStatusHistory>;
  participations: ParticipationsConnection;
  states: Array<State>;
  transaction?: Maybe<Transaction>;
  transactions: TransactionsConnection;
  user?: Maybe<User>;
  users: UsersConnection;
  utilities: UtilitiesConnection;
  utility?: Maybe<Utility>;
  wallet?: Maybe<Wallet>;
  wallets: WalletsConnection;
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

export type QueryMembershipArgs = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type QueryMembershipsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
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

export type QueryStatesArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
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

export enum Role {
  Manager = "MANAGER",
  Member = "MEMBER",
  Owner = "OWNER",
}

export enum SortDirection {
  Asc = "asc",
  Desc = "desc",
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

export type Transaction = {
  __typename?: "Transaction";
  createdAt: Scalars["Datetime"]["output"];
  fromPointChange?: Maybe<Scalars["Int"]["output"]>;
  fromWallet?: Maybe<Wallet>;
  id: Scalars["ID"]["output"];
  participation?: Maybe<Participation>;
  reason?: Maybe<TransactionReason>;
  toPointChange?: Maybe<Scalars["Int"]["output"]>;
  toWallet?: Maybe<Wallet>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utility?: Maybe<Utility>;
};

export type TransactionDonateSelfPointInput = {
  from: Scalars["String"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  to: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
};

export type TransactionDonateSelfPointPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TransactionDonateSelfPointSuccess;

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
  fromWalletId?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  participationId?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<TransactionReason>;
  toWalletId?: InputMaybe<Scalars["String"]["input"]>;
  utilityId?: InputMaybe<Scalars["String"]["input"]>;
};

export type TransactionGiveRewardPointInput = {
  from: Scalars["String"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  participationId: Scalars["String"]["input"];
  to: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
};

export type TransactionGiveRewardPointPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TransactionGiveRewardPointSuccess;

export type TransactionGiveRewardPointSuccess = {
  __typename?: "TransactionGiveRewardPointSuccess";
  transaction: Transaction;
};

export type TransactionGrantCommunityPointInput = {
  from: Scalars["String"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  to: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
};

export type TransactionGrantCommunityPointPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TransactionGrantCommunityPointSuccess;

export type TransactionGrantCommunityPointSuccess = {
  __typename?: "TransactionGrantCommunityPointSuccess";
  transaction: Transaction;
};

export type TransactionIssueCommunityPointInput = {
  to: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
};

export type TransactionIssueCommunityPointPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TransactionIssueCommunityPointSuccess;

export type TransactionIssueCommunityPointSuccess = {
  __typename?: "TransactionIssueCommunityPointSuccess";
  transaction: Transaction;
};

export enum TransactionReason {
  Gift = "GIFT",
  MembershipDeleted = "MEMBERSHIP_DELETED",
  Other = "OTHER",
  ParticipationApproved = "PARTICIPATION_APPROVED",
  PointIssued = "POINT_ISSUED",
  UtilityUsage = "UTILITY_USAGE",
}

export type TransactionSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type TransactionUseUtilityInput = {
  from: Scalars["String"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  to: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
  utilityId: Scalars["String"]["input"];
};

export type TransactionUseUtilityPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TransactionUseUtilitySuccess;

export type TransactionUseUtilitySuccess = {
  __typename?: "TransactionUseUtilitySuccess";
  transaction: Transaction;
};

export type TransactionsConnection = {
  __typename?: "TransactionsConnection";
  edges?: Maybe<Array<Maybe<TransactionEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type User = {
  __typename?: "User";
  bio?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  memberships?: Maybe<Array<Membership>>;
  name: Scalars["String"]["output"];
  opportunitiesCreatedByMe?: Maybe<Array<Opportunity>>;
  participationStatusChangedByMe?: Maybe<Array<ParticipationStatusHistory>>;
  participations?: Maybe<Array<Participation>>;
  slug: Scalars["String"]["output"];
  sysRole?: Maybe<SysRole>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  urlFacebook?: Maybe<Scalars["String"]["output"]>;
  urlInstagram?: Maybe<Scalars["String"]["output"]>;
  urlTiktok?: Maybe<Scalars["String"]["output"]>;
  urlWebsite?: Maybe<Scalars["String"]["output"]>;
  urlX?: Maybe<Scalars["String"]["output"]>;
  urlYoutube?: Maybe<Scalars["String"]["output"]>;
  wallets?: Maybe<Array<Wallet>>;
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

export type UserSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type UserUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  slug?: InputMaybe<Scalars["String"]["input"]>;
  urlFacebook?: InputMaybe<Scalars["String"]["input"]>;
  urlInstagram?: InputMaybe<Scalars["String"]["input"]>;
  urlTiktok?: InputMaybe<Scalars["String"]["input"]>;
  urlWebsite?: InputMaybe<Scalars["String"]["input"]>;
  urlX?: InputMaybe<Scalars["String"]["input"]>;
  urlYoutube?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserUpdateProfilePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserUpdateProfileSuccess;

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
  image?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  pointsRequired: Scalars["Int"]["output"];
  transactions?: Maybe<Array<Transaction>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type UtilityCreateInput = {
  communityId: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
};

export type UtilityCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UtilityCreateSuccess;

export type UtilityCreateSuccess = {
  __typename?: "UtilityCreateSuccess";
  utility: Utility;
};

export type UtilityDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UtilityDeleteSuccess;

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
  communityId?: InputMaybe<Scalars["String"]["input"]>;
};

export type UtilitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
  pointsRequired?: InputMaybe<SortDirection>;
};

export type UtilityUpdateInfoInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
};

export type UtilityUpdateInfoPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UtilityUpdateInfoSuccess;

export type UtilityUpdateInfoSuccess = {
  __typename?: "UtilityUpdateInfoSuccess";
  utility: Utility;
};

export type UtilityUseInput = {
  userWalletId: Scalars["String"]["input"];
};

export type UtilityUsePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UtilityUseSuccess;

export type UtilityUseSuccess = {
  __typename?: "UtilityUseSuccess";
  transaction: Transaction;
};

export enum ValueType {
  Float = "FLOAT",
  Int = "INT",
}

export type Wallet = {
  __typename?: "Wallet";
  community: Community;
  createdAt: Scalars["Datetime"]["output"];
  currentPointView?: Maybe<CurrentPointView>;
  fromTransactions?: Maybe<Array<Transaction>>;
  id: Scalars["ID"]["output"];
  toTransactions?: Maybe<Array<Transaction>>;
  type: WalletType;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type WalletCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | WalletCreateSuccess;

export type WalletCreateSuccess = {
  __typename?: "WalletCreateSuccess";
  wallet: Wallet;
};

export type WalletCreateToCommunityInput = {
  communityId: Scalars["String"]["input"];
};

export type WalletCreateToMemberInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type WalletDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | WalletDeleteSuccess;

export type WalletDeleteSuccess = {
  __typename?: "WalletDeleteSuccess";
  walletId: Scalars["String"]["output"];
};

export type WalletEdge = Edge & {
  __typename?: "WalletEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Wallet>;
};

export type WalletFilterInput = {
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  type?: InputMaybe<WalletType>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
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

export type CommunityCreateMutationVariables = Exact<{
  input: CommunityCreateInput;
}>;

export type CommunityCreateMutation = {
  __typename?: "Mutation";
  communityCreate?:
    | { __typename?: "AuthError" }
    | {
        __typename?: "CommunityCreateSuccess";
        community: {
          __typename?: "Community";
          id: string;
          name: string;
          pointName: string;
          image?: string | null;
          bio?: string | null;
          establishedAt?: Date | null;
          website?: string | null;
          state?: { __typename?: "State"; code: string; name: string } | null;
          city: { __typename?: "City"; code: string; name: string };
        };
      }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | null;
};

export type CommunityDeleteMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type CommunityDeleteMutation = {
  __typename?: "Mutation";
  communityDelete?:
    | { __typename?: "AuthError" }
    | { __typename?: "CommunityDeleteSuccess"; communityId: string }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | null;
};

export type CommunityUpdateProfileMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: CommunityUpdateProfileInput;
}>;

export type CommunityUpdateProfileMutation = {
  __typename?: "Mutation";
  communityUpdateProfile?:
    | { __typename?: "AuthError" }
    | {
        __typename?: "CommunityUpdateProfileSuccess";
        community: {
          __typename?: "Community";
          id: string;
          name: string;
          pointName: string;
          image?: string | null;
          bio?: string | null;
          establishedAt?: Date | null;
          website?: string | null;
          state?: { __typename?: "State"; code: string; name: string } | null;
          city: { __typename?: "City"; code: string; name: string };
        };
      }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | null;
};

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string; name: string; slug: string } | null;
  } | null;
};

export type DeleteUserMutationVariables = Exact<{ [key: string]: never }>;

export type DeleteUserMutation = {
  __typename?: "Mutation";
  deleteUser?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string } | null;
  } | null;
};

export type MembershipInviteMutationVariables = Exact<{
  input: MembershipInviteInput;
}>;

export type MembershipInviteMutation = {
  __typename?: "Mutation";
  membershipInvite?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipInviteSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipCancelInvitationMutationVariables = Exact<{
  input: MembershipCancelInvitationInput;
}>;

export type MembershipCancelInvitationMutation = {
  __typename?: "Mutation";
  membershipCancelInvitation?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipSetInvitationStatusSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          status?: MembershipStatus | null;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipApproveInvitationMutationVariables = Exact<{
  input: MembershipApproveInvitationInput;
}>;

export type MembershipApproveInvitationMutation = {
  __typename?: "Mutation";
  membershipApproveInvitation?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipSetInvitationStatusSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          status?: MembershipStatus | null;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipDenyInvitationMutationVariables = Exact<{
  input: MembershipDenyInvitationInput;
}>;

export type MembershipDenyInvitationMutation = {
  __typename?: "Mutation";
  membershipDenyInvitation?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipSetInvitationStatusSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          status?: MembershipStatus | null;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipSelfJoinMutationVariables = Exact<{
  input: MembershipSelfJoinInput;
}>;

export type MembershipSelfJoinMutation = {
  __typename?: "Mutation";
  membershipSelfJoin?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipSelfJoinSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipWithdrawMutationVariables = Exact<{
  input: MembershipWithdrawInput;
}>;

export type MembershipWithdrawMutation = {
  __typename?: "Mutation";
  membershipWithdraw?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | { __typename?: "MembershipWithdrawSuccess"; userId: string; communityId: string }
    | null;
};

export type MembershipAssignOwnerMutationVariables = Exact<{
  input: MembershipAssignOwnerInput;
}>;

export type MembershipAssignOwnerMutation = {
  __typename?: "Mutation";
  membershipAssignOwner?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipSetRoleSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipAssignManagerMutationVariables = Exact<{
  input: MembershipAssignManagerInput;
}>;

export type MembershipAssignManagerMutation = {
  __typename?: "Mutation";
  membershipAssignManager?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipSetRoleSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipAssignMemberRoleMutationVariables = Exact<{
  input: MembershipAssignMemberInput;
}>;

export type MembershipAssignMemberRoleMutation = {
  __typename?: "Mutation";
  membershipAssignMemberRole?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "MembershipSetRoleSuccess";
        membership: {
          __typename?: "Membership";
          role: Role;
          user: { __typename?: "User"; id: string; name: string };
          community: { __typename?: "Community"; id: string; name: string };
        };
      }
    | null;
};

export type MembershipRemoveMutationVariables = Exact<{
  input: MembershipRemoveInput;
}>;

export type MembershipRemoveMutation = {
  __typename?: "Mutation";
  membershipRemove?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | { __typename?: "MembershipRemoveSuccess"; userId: string; communityId: string }
    | null;
};

export type OpportunityCreateMutationVariables = Exact<{
  input: OpportunityCreateInput;
}>;

export type OpportunityCreateMutation = {
  __typename?: "Mutation";
  opportunityCreate?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "OpportunityCreateSuccess";
        opportunity: {
          __typename?: "Opportunity";
          id: string;
          title: string;
          description?: string | null;
          category: OpportunityCategory;
          startsAt?: Date | null;
          endsAt?: Date | null;
          pointsPerParticipation: number;
          publishStatus: PublishStatus;
          community: { __typename?: "Community"; id: string; name: string };
          city: { __typename?: "City"; code: string; name: string };
        };
      }
    | null;
};

export type OpportunityEditContentMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: OpportunityEditContentInput;
}>;

export type OpportunityEditContentMutation = {
  __typename?: "Mutation";
  opportunityEditContent?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "OpportunityEditContentSuccess";
        opportunity: {
          __typename?: "Opportunity";
          id: string;
          title: string;
          description?: string | null;
          category: OpportunityCategory;
          startsAt?: Date | null;
          endsAt?: Date | null;
          pointsPerParticipation: number;
          publishStatus: PublishStatus;
          community: { __typename?: "Community"; id: string; name: string };
          city: { __typename?: "City"; code: string; name: string };
        };
      }
    | null;
};

export type OpportunityDeleteMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type OpportunityDeleteMutation = {
  __typename?: "Mutation";
  opportunityDelete?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | { __typename?: "OpportunityDeleteSuccess"; opportunityId: string }
    | null;
};

export type ParticipationInviteMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: ParticipationInviteInput;
}>;

export type ParticipationInviteMutation = {
  __typename?: "Mutation";
  participationInvite?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationCancelInvitationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationCancelInvitationMutation = {
  __typename?: "Mutation";
  participationCancelInvitation?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationApproveInvitationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationApproveInvitationMutation = {
  __typename?: "Mutation";
  participationApproveInvitation?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationDenyInvitationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationDenyInvitationMutation = {
  __typename?: "Mutation";
  participationDenyInvitation?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationApplyMutationVariables = Exact<{
  input: ParticipationApplyInput;
}>;

export type ParticipationApplyMutation = {
  __typename?: "Mutation";
  participationApply?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationApplySuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationCancelApplicationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationCancelApplicationMutation = {
  __typename?: "Mutation";
  participationCancelApplication?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationApproveApplicationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationApproveApplicationMutation = {
  __typename?: "Mutation";
  participationApproveApplication?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationDenyApplicationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationDenyApplicationMutation = {
  __typename?: "Mutation";
  participationDenyApplication?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationApprovePerformanceMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationApprovePerformanceMutation = {
  __typename?: "Mutation";
  participationApprovePerformance?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type ParticipationDenyPerformanceMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationDenyPerformanceMutation = {
  __typename?: "Mutation";
  participationDenyPerformance?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "ParticipationSetStatusSuccess";
        participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
      }
    | null;
};

export type UserUpdateProfileMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: UserUpdateProfileInput;
}>;

export type UserUpdateProfileMutation = {
  __typename?: "Mutation";
  userUpdateProfile?:
    | { __typename?: "AuthError" }
    | { __typename?: "ComplexQueryError" }
    | { __typename?: "InvalidInputValueError" }
    | {
        __typename?: "UserUpdateProfileSuccess";
        user?: {
          __typename?: "User";
          id: string;
          name: string;
          slug: string;
          image?: string | null;
          bio?: string | null;
          urlWebsite?: string | null;
          urlX?: string | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlYoutube?: string | null;
          urlTiktok?: string | null;
        } | null;
      }
    | null;
};

export type CommunitiesQueryVariables = Exact<{
  filter?: InputMaybe<CommunityFilterInput>;
  sort?: InputMaybe<CommunitySortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type CommunitiesQuery = {
  __typename?: "Query";
  communities: {
    __typename?: "CommunitiesConnection";
    edges?: Array<{
      __typename?: "CommunityEdge";
      node?: {
        __typename?: "Community";
        id: string;
        name: string;
        bio?: string | null;
        image?: string | null;
        state?: { __typename?: "State"; code: string; name: string } | null;
        city: { __typename?: "City"; code: string; name: string };
        memberships?: Array<{
          __typename?: "Membership";
          role: Role;
          user: { __typename?: "User"; id: string; name: string; image?: string | null };
        }> | null;
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; endCursor?: string | null; hasNextPage: boolean };
  };
};

export type CommunityQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type CommunityQuery = {
  __typename?: "Query";
  community?: {
    __typename?: "Community";
    id: string;
    name: string;
    pointName: string;
    image?: string | null;
    bio?: string | null;
    establishedAt?: Date | null;
    website?: string | null;
    state?: { __typename?: "State"; code: string; name: string } | null;
    city: {
      __typename?: "City";
      code: string;
      name: string;
      state: { __typename?: "State"; code: string; name: string };
    };
    memberships?: Array<{
      __typename?: "Membership";
      role: Role;
      user: { __typename?: "User"; id: string; name: string };
    }> | null;
    opportunities?: Array<{
      __typename?: "Opportunity";
      id: string;
      title: string;
      description?: string | null;
      startsAt?: Date | null;
      endsAt?: Date | null;
    }> | null;
    participations?: Array<{
      __typename?: "Participation";
      id: string;
      user?: { __typename?: "User"; id: string; name: string } | null;
      opportunity?: { __typename?: "Opportunity"; id: string; title: string } | null;
    }> | null;
    wallets?: Array<{
      __typename?: "Wallet";
      id: string;
      currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
    }> | null;
    utilities?: Array<{
      __typename?: "Utility";
      id: string;
      name: string;
      description?: string | null;
    }> | null;
  } | null;
};

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string; name: string; slug: string } | null;
  } | null;
};

export type MembershipsQueryVariables = Exact<{
  filter?: InputMaybe<MembershipFilterInput>;
  sort?: InputMaybe<MembershipSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type MembershipsQuery = {
  __typename?: "Query";
  memberships: {
    __typename?: "MembershipsConnection";
    edges?: Array<{
      __typename?: "MembershipEdge";
      node?: {
        __typename?: "Membership";
        role: Role;
        user: { __typename?: "User"; id: string; name: string };
        community: {
          __typename?: "Community";
          id: string;
          name: string;
          city: {
            __typename?: "City";
            code: string;
            name: string;
            state: { __typename?: "State"; code: string; name: string };
          };
        };
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; endCursor?: string | null; hasNextPage: boolean };
  };
};

export type MembershipQueryVariables = Exact<{
  userId: Scalars["ID"]["input"];
  communityId: Scalars["ID"]["input"];
}>;

export type MembershipQuery = {
  __typename?: "Query";
  membership?: {
    __typename?: "Membership";
    role: Role;
    user: { __typename?: "User"; id: string; name: string };
    community: {
      __typename?: "Community";
      id: string;
      name: string;
      city: {
        __typename?: "City";
        code: string;
        name: string;
        state: { __typename?: "State"; code: string; name: string };
      };
    };
  } | null;
};

export type OpportunitiesQueryVariables = Exact<{
  filter?: InputMaybe<OpportunityFilterInput>;
  sort?: InputMaybe<OpportunitySortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type OpportunitiesQuery = {
  __typename?: "Query";
  opportunities: {
    __typename?: "OpportunitiesConnection";
    edges: Array<{
      __typename?: "OpportunityEdge";
      node?: {
        __typename?: "Opportunity";
        id: string;
        title: string;
        description?: string | null;
        category: OpportunityCategory;
        requireApproval: boolean;
        pointsPerParticipation: number;
        publishStatus: PublishStatus;
        startsAt?: Date | null;
        endsAt?: Date | null;
        createdByUser: { __typename?: "User"; id: string; name: string };
        community: { __typename?: "Community"; id: string; name: string };
        city: { __typename?: "City"; code: string; name: string };
        participations?: Array<{
          __typename?: "Participation";
          id: string;
          user?: { __typename?: "User"; id: string; name: string } | null;
        }> | null;
      } | null;
    }>;
    pageInfo: { __typename?: "PageInfo"; endCursor?: string | null; hasNextPage: boolean };
  };
};

export type OpportunityQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type OpportunityQuery = {
  __typename?: "Query";
  opportunity?: {
    __typename?: "Opportunity";
    id: string;
    title: string;
    description?: string | null;
    category: OpportunityCategory;
    requireApproval: boolean;
    pointsPerParticipation: number;
    publishStatus: PublishStatus;
    startsAt?: Date | null;
    endsAt?: Date | null;
    createdByUser: { __typename?: "User"; id: string; name: string };
    community: {
      __typename?: "Community";
      id: string;
      name: string;
      city: {
        __typename?: "City";
        code: string;
        name: string;
        state: { __typename?: "State"; code: string; name: string };
      };
      wallets?: Array<{
        __typename?: "Wallet";
        id: string;
        user?: { __typename?: "User"; id: string; name: string } | null;
        currentPointView?: {
          __typename?: "CurrentPointView";
          walletId: string;
          currentPoint: number;
        } | null;
      }> | null;
    };
    city: {
      __typename?: "City";
      code: string;
      name: string;
      state: { __typename?: "State"; code: string; name: string };
    };
    participations?: Array<{
      __typename?: "Participation";
      id: string;
      user?: { __typename?: "User"; id: string; name: string } | null;
    }> | null;
  } | null;
};

export type ParticipationsQueryVariables = Exact<{
  filter?: InputMaybe<ParticipationFilterInput>;
  sort?: InputMaybe<ParticipationSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type ParticipationsQuery = {
  __typename?: "Query";
  participations: {
    __typename?: "ParticipationsConnection";
    edges: Array<{
      __typename?: "ParticipationEdge";
      node?: {
        __typename?: "Participation";
        id: string;
        status: ParticipationStatus;
        user?: { __typename?: "User"; id: string; name: string } | null;
        opportunity?: {
          __typename?: "Opportunity";
          id: string;
          title: string;
          description?: string | null;
          category: OpportunityCategory;
          requireApproval: boolean;
          pointsPerParticipation: number;
          publishStatus: PublishStatus;
          startsAt?: Date | null;
          endsAt?: Date | null;
          createdByUser: { __typename?: "User"; id: string; name: string };
          community: {
            __typename?: "Community";
            id: string;
            name: string;
            city: {
              __typename?: "City";
              code: string;
              name: string;
              state: { __typename?: "State"; code: string; name: string };
            };
            wallets?: Array<{
              __typename?: "Wallet";
              id: string;
              user?: { __typename?: "User"; id: string; name: string } | null;
              currentPointView?: {
                __typename?: "CurrentPointView";
                walletId: string;
                currentPoint: number;
              } | null;
            }> | null;
          };
          city: {
            __typename?: "City";
            code: string;
            name: string;
            state: { __typename?: "State"; code: string; name: string };
          };
        } | null;
        statusHistories?: Array<{
          __typename?: "ParticipationStatusHistory";
          id: string;
          status: ParticipationStatus;
          createdByUser?: { __typename?: "User"; id: string; name: string } | null;
          participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
        }> | null;
        transactions?: Array<{
          __typename?: "Transaction";
          id: string;
          reason?: TransactionReason | null;
          fromPointChange?: number | null;
          toPointChange?: number | null;
          createdAt: Date;
          fromWallet?: {
            __typename?: "Wallet";
            id: string;
            user?: { __typename?: "User"; id: string; name: string } | null;
          } | null;
          toWallet?: {
            __typename?: "Wallet";
            id: string;
            user?: { __typename?: "User"; id: string; name: string } | null;
          } | null;
        }> | null;
      } | null;
    }>;
    pageInfo: { __typename?: "PageInfo"; endCursor?: string | null; hasNextPage: boolean };
  };
};

export type ParticipationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ParticipationQuery = {
  __typename?: "Query";
  participation?: {
    __typename?: "Participation";
    id: string;
    status: ParticipationStatus;
    user?: { __typename?: "User"; id: string; name: string } | null;
    opportunity?: {
      __typename?: "Opportunity";
      id: string;
      title: string;
      description?: string | null;
      category: OpportunityCategory;
      requireApproval: boolean;
      pointsPerParticipation: number;
      publishStatus: PublishStatus;
      startsAt?: Date | null;
      endsAt?: Date | null;
      createdByUser: { __typename?: "User"; id: string; name: string };
      community: {
        __typename?: "Community";
        id: string;
        name: string;
        city: {
          __typename?: "City";
          code: string;
          name: string;
          state: { __typename?: "State"; code: string; name: string };
        };
        wallets?: Array<{
          __typename?: "Wallet";
          id: string;
          user?: { __typename?: "User"; id: string; name: string } | null;
          currentPointView?: {
            __typename?: "CurrentPointView";
            walletId: string;
            currentPoint: number;
          } | null;
        }> | null;
      };
      city: {
        __typename?: "City";
        code: string;
        name: string;
        state: { __typename?: "State"; code: string; name: string };
      };
      participations?: Array<{
        __typename?: "Participation";
        id: string;
        user?: { __typename?: "User"; id: string; name: string } | null;
      }> | null;
    } | null;
    statusHistories?: Array<{
      __typename?: "ParticipationStatusHistory";
      id: string;
      status: ParticipationStatus;
      createdByUser?: { __typename?: "User"; id: string; name: string } | null;
      participation: { __typename?: "Participation"; id: string; status: ParticipationStatus };
    }> | null;
    transactions?: Array<{
      __typename?: "Transaction";
      id: string;
      reason?: TransactionReason | null;
      fromPointChange?: number | null;
      toPointChange?: number | null;
      createdAt: Date;
      fromWallet?: {
        __typename?: "Wallet";
        id: string;
        user?: { __typename?: "User"; id: string; name: string } | null;
      } | null;
      toWallet?: {
        __typename?: "Wallet";
        id: string;
        user?: { __typename?: "User"; id: string; name: string } | null;
      } | null;
    }> | null;
  } | null;
};

export type UsersQueryVariables = Exact<{
  filter?: InputMaybe<UserFilterInput>;
  sort?: InputMaybe<UserSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type UsersQuery = {
  __typename?: "Query";
  users: {
    __typename?: "UsersConnection";
    edges?: Array<{
      __typename?: "UserEdge";
      node?: {
        __typename?: "User";
        id: string;
        name: string;
        slug: string;
        image?: string | null;
        bio?: string | null;
        sysRole?: SysRole | null;
        memberships?: Array<{
          __typename?: "Membership";
          role: Role;
          community: {
            __typename?: "Community";
            id: string;
            name: string;
            city: {
              __typename?: "City";
              code: string;
              name: string;
              state: { __typename?: "State"; code: string; name: string };
            };
          };
        }> | null;
        wallets?: Array<{
          __typename?: "Wallet";
          id: string;
          community: {
            __typename?: "Community";
            id: string;
            name: string;
            city: {
              __typename?: "City";
              code: string;
              name: string;
              state: { __typename?: "State"; code: string; name: string };
            };
          };
          currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
        }> | null;
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; endCursor?: string | null; hasNextPage: boolean };
  };
};

export type UserQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type UserQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    name: string;
    slug: string;
    image?: string | null;
    bio?: string | null;
    sysRole?: SysRole | null;
    urlWebsite?: string | null;
    urlX?: string | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlYoutube?: string | null;
    urlTiktok?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
    memberships?: Array<{
      __typename?: "Membership";
      role: Role;
      community: {
        __typename?: "Community";
        id: string;
        name: string;
        city: {
          __typename?: "City";
          code: string;
          name: string;
          state: { __typename?: "State"; code: string; name: string };
        };
      };
    }> | null;
    wallets?: Array<{
      __typename?: "Wallet";
      id: string;
      community: {
        __typename?: "Community";
        id: string;
        name: string;
        city: {
          __typename?: "City";
          code: string;
          name: string;
          state: { __typename?: "State"; code: string; name: string };
        };
      };
      currentPointView?: { __typename?: "CurrentPointView"; currentPoint: number } | null;
    }> | null;
    opportunitiesCreatedByMe?: Array<{
      __typename?: "Opportunity";
      id: string;
      title: string;
      description?: string | null;
    }> | null;
    participations?: Array<{
      __typename?: "Participation";
      id: string;
      opportunity?: { __typename?: "Opportunity"; id: string; title: string } | null;
    }> | null;
    participationStatusChangedByMe?: Array<{
      __typename?: "ParticipationStatusHistory";
      id: string;
      status: ParticipationStatus;
      createdAt: Date;
    }> | null;
  } | null;
};

export const CommunityCreateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "communityCreate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CommunityCreateInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "communityCreate" },
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
                    name: { kind: "Name", value: "CommunityCreateSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "community" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "pointName" } },
                            { kind: "Field", name: { kind: "Name", value: "image" } },
                            { kind: "Field", name: { kind: "Name", value: "bio" } },
                            { kind: "Field", name: { kind: "Name", value: "establishedAt" } },
                            { kind: "Field", name: { kind: "Name", value: "website" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode<CommunityCreateMutation, CommunityCreateMutationVariables>;
export const CommunityDeleteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "communityDelete" },
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
            name: { kind: "Name", value: "communityDelete" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "CommunityDeleteSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "communityId" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CommunityDeleteMutation, CommunityDeleteMutationVariables>;
export const CommunityUpdateProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "communityUpdateProfile" },
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
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "CommunityUpdateProfileInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "communityUpdateProfile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
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
                    name: { kind: "Name", value: "CommunityUpdateProfileSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "community" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "pointName" } },
                            { kind: "Field", name: { kind: "Name", value: "image" } },
                            { kind: "Field", name: { kind: "Name", value: "bio" } },
                            { kind: "Field", name: { kind: "Name", value: "establishedAt" } },
                            { kind: "Field", name: { kind: "Name", value: "website" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CommunityUpdateProfileMutation,
  CommunityUpdateProfileMutationVariables
>;
export const CreateUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "createUser" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "CreateUserInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "createUser" },
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
} as unknown as DocumentNode<CreateUserMutation, CreateUserMutationVariables>;
export const DeleteUserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "deleteUser" },
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "deleteUser" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                {
                  kind: "Field",
                  name: { kind: "Name", value: "user" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "id" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteUserMutation, DeleteUserMutationVariables>;
export const MembershipInviteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipInvite" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "MembershipInviteInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipInvite" },
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
                    name: { kind: "Name", value: "MembershipInviteSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
} as unknown as DocumentNode<MembershipInviteMutation, MembershipInviteMutationVariables>;
export const MembershipCancelInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipCancelInvitation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "MembershipCancelInvitationInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipCancelInvitation" },
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
                    name: { kind: "Name", value: "MembershipSetInvitationStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
} as unknown as DocumentNode<
  MembershipCancelInvitationMutation,
  MembershipCancelInvitationMutationVariables
>;
export const MembershipApproveInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipApproveInvitation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "MembershipApproveInvitationInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipApproveInvitation" },
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
                    name: { kind: "Name", value: "MembershipSetInvitationStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
} as unknown as DocumentNode<
  MembershipApproveInvitationMutation,
  MembershipApproveInvitationMutationVariables
>;
export const MembershipDenyInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipDenyInvitation" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "MembershipDenyInvitationInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipDenyInvitation" },
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
                    name: { kind: "Name", value: "MembershipSetInvitationStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
} as unknown as DocumentNode<
  MembershipDenyInvitationMutation,
  MembershipDenyInvitationMutationVariables
>;
export const MembershipSelfJoinDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipSelfJoin" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "MembershipSelfJoinInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipSelfJoin" },
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
                    name: { kind: "Name", value: "MembershipSelfJoinSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
} as unknown as DocumentNode<MembershipSelfJoinMutation, MembershipSelfJoinMutationVariables>;
export const MembershipWithdrawDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipWithdraw" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "MembershipWithdrawInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipWithdraw" },
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
                    name: { kind: "Name", value: "MembershipWithdrawSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "userId" } },
                      { kind: "Field", name: { kind: "Name", value: "communityId" } },
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
} as unknown as DocumentNode<MembershipWithdrawMutation, MembershipWithdrawMutationVariables>;
export const MembershipAssignOwnerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipAssignOwner" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "MembershipAssignOwnerInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipAssignOwner" },
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
                    name: { kind: "Name", value: "MembershipSetRoleSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
} as unknown as DocumentNode<MembershipAssignOwnerMutation, MembershipAssignOwnerMutationVariables>;
export const MembershipAssignManagerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipAssignManager" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "MembershipAssignManagerInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipAssignManager" },
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
                    name: { kind: "Name", value: "MembershipSetRoleSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
  MembershipAssignManagerMutation,
  MembershipAssignManagerMutationVariables
>;
export const MembershipAssignMemberRoleDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipAssignMemberRole" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "MembershipAssignMemberInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipAssignMemberRole" },
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
                    name: { kind: "Name", value: "MembershipSetRoleSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "membership" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
  MembershipAssignMemberRoleMutation,
  MembershipAssignMemberRoleMutationVariables
>;
export const MembershipRemoveDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "membershipRemove" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "MembershipRemoveInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "membershipRemove" },
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
                    name: { kind: "Name", value: "MembershipRemoveSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "userId" } },
                      { kind: "Field", name: { kind: "Name", value: "communityId" } },
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
} as unknown as DocumentNode<MembershipRemoveMutation, MembershipRemoveMutationVariables>;
export const OpportunityCreateDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "opportunityCreate" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "OpportunityCreateInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "opportunityCreate" },
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
                    name: { kind: "Name", value: "OpportunityCreateSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "opportunity" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                            { kind: "Field", name: { kind: "Name", value: "description" } },
                            { kind: "Field", name: { kind: "Name", value: "category" } },
                            { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "endsAt" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "pointsPerParticipation" },
                            },
                            { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
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
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode<OpportunityCreateMutation, OpportunityCreateMutationVariables>;
export const OpportunityEditContentDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "opportunityEditContent" },
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
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: {
              kind: "NamedType",
              name: { kind: "Name", value: "OpportunityEditContentInput" },
            },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "opportunityEditContent" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
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
                    name: { kind: "Name", value: "OpportunityEditContentSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "opportunity" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                            { kind: "Field", name: { kind: "Name", value: "description" } },
                            { kind: "Field", name: { kind: "Name", value: "category" } },
                            { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "endsAt" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "pointsPerParticipation" },
                            },
                            { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
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
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
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
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  OpportunityEditContentMutation,
  OpportunityEditContentMutationVariables
>;
export const OpportunityDeleteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "opportunityDelete" },
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
            name: { kind: "Name", value: "opportunityDelete" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "OpportunityDeleteSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [{ kind: "Field", name: { kind: "Name", value: "opportunityId" } }],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<OpportunityDeleteMutation, OpportunityDeleteMutationVariables>;
export const ParticipationInviteDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationInvite" },
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
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ParticipationInviteInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "participationInvite" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
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
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<ParticipationInviteMutation, ParticipationInviteMutationVariables>;
export const ParticipationCancelInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationCancelInvitation" },
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
            name: { kind: "Name", value: "participationCancelInvitation" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationCancelInvitationMutation,
  ParticipationCancelInvitationMutationVariables
>;
export const ParticipationApproveInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationApproveInvitation" },
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
            name: { kind: "Name", value: "participationApproveInvitation" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationApproveInvitationMutation,
  ParticipationApproveInvitationMutationVariables
>;
export const ParticipationDenyInvitationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationDenyInvitation" },
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
            name: { kind: "Name", value: "participationDenyInvitation" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationDenyInvitationMutation,
  ParticipationDenyInvitationMutationVariables
>;
export const ParticipationApplyDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationApply" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ParticipationApplyInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "participationApply" },
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
                    name: { kind: "Name", value: "ParticipationApplySuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<ParticipationApplyMutation, ParticipationApplyMutationVariables>;
export const ParticipationCancelApplicationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationCancelApplication" },
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
            name: { kind: "Name", value: "participationCancelApplication" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationCancelApplicationMutation,
  ParticipationCancelApplicationMutationVariables
>;
export const ParticipationApproveApplicationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationApproveApplication" },
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
            name: { kind: "Name", value: "participationApproveApplication" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationApproveApplicationMutation,
  ParticipationApproveApplicationMutationVariables
>;
export const ParticipationDenyApplicationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationDenyApplication" },
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
            name: { kind: "Name", value: "participationDenyApplication" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationDenyApplicationMutation,
  ParticipationDenyApplicationMutationVariables
>;
export const ParticipationApprovePerformanceDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationApprovePerformance" },
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
            name: { kind: "Name", value: "participationApprovePerformance" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationApprovePerformanceMutation,
  ParticipationApprovePerformanceMutationVariables
>;
export const ParticipationDenyPerformanceDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "participationDenyPerformance" },
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
            name: { kind: "Name", value: "participationDenyPerformance" },
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
                {
                  kind: "InlineFragment",
                  typeCondition: {
                    kind: "NamedType",
                    name: { kind: "Name", value: "ParticipationSetStatusSuccess" },
                  },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
} as unknown as DocumentNode<
  ParticipationDenyPerformanceMutation,
  ParticipationDenyPerformanceMutationVariables
>;
export const UserUpdateProfileDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "mutation",
      name: { kind: "Name", value: "userUpdateProfile" },
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
          variable: { kind: "Variable", name: { kind: "Name", value: "input" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "UserUpdateProfileInput" } },
          },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "userUpdateProfile" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "id" },
                value: { kind: "Variable", name: { kind: "Name", value: "id" } },
              },
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
                            { kind: "Field", name: { kind: "Name", value: "slug" } },
                            { kind: "Field", name: { kind: "Name", value: "image" } },
                            { kind: "Field", name: { kind: "Name", value: "bio" } },
                            { kind: "Field", name: { kind: "Name", value: "urlWebsite" } },
                            { kind: "Field", name: { kind: "Name", value: "urlX" } },
                            { kind: "Field", name: { kind: "Name", value: "urlFacebook" } },
                            { kind: "Field", name: { kind: "Name", value: "urlInstagram" } },
                            { kind: "Field", name: { kind: "Name", value: "urlYoutube" } },
                            { kind: "Field", name: { kind: "Name", value: "urlTiktok" } },
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
} as unknown as DocumentNode<UserUpdateProfileMutation, UserUpdateProfileMutationVariables>;
export const CommunitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "communities" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CommunityFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "CommunitySortInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
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
            name: { kind: "Name", value: "communities" },
            arguments: [
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
              {
                kind: "Argument",
                name: { kind: "Name", value: "cursor" },
                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
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
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "bio" } },
                            { kind: "Field", name: { kind: "Name", value: "image" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "memberships" },
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
                                      ],
                                    },
                                  },
                                  { kind: "Field", name: { kind: "Name", value: "role" } },
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
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
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
} as unknown as DocumentNode<CommunitiesQuery, CommunitiesQueryVariables>;
export const CommunityDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "community" },
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
            name: { kind: "Name", value: "community" },
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
                { kind: "Field", name: { kind: "Name", value: "pointName" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
                { kind: "Field", name: { kind: "Name", value: "bio" } },
                { kind: "Field", name: { kind: "Name", value: "establishedAt" } },
                { kind: "Field", name: { kind: "Name", value: "website" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "state" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "code" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "city" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "code" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "code" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "memberships" },
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
                      { kind: "Field", name: { kind: "Name", value: "role" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "opportunities" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                      { kind: "Field", name: { kind: "Name", value: "endsAt" } },
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
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "opportunity" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "wallets" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "currentPointView" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "currentPoint" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "utilities" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
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
} as unknown as DocumentNode<CommunityQuery, CommunityQueryVariables>;
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
} as unknown as DocumentNode<CurrentUserQuery, CurrentUserQueryVariables>;
export const MembershipsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "memberships" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "MembershipFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "MembershipSortInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
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
            name: { kind: "Name", value: "memberships" },
            arguments: [
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
              {
                kind: "Argument",
                name: { kind: "Name", value: "cursor" },
                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "city" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "code" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "state" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "code" },
                                              },
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
                            { kind: "Field", name: { kind: "Name", value: "role" } },
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
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
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
} as unknown as DocumentNode<MembershipsQuery, MembershipsQueryVariables>;
export const MembershipDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "membership" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "userId" } },
          type: {
            kind: "NonNullType",
            type: { kind: "NamedType", name: { kind: "Name", value: "ID" } },
          },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "communityId" } },
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
            name: { kind: "Name", value: "membership" },
            arguments: [
              {
                kind: "Argument",
                name: { kind: "Name", value: "userId" },
                value: { kind: "Variable", name: { kind: "Name", value: "userId" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "communityId" },
                value: { kind: "Variable", name: { kind: "Name", value: "communityId" } },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "community" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "city" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "code" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
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
                { kind: "Field", name: { kind: "Name", value: "role" } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MembershipQuery, MembershipQueryVariables>;
export const OpportunitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "opportunities" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OpportunityFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OpportunitySortInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
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
                name: { kind: "Name", value: "sort" },
                value: { kind: "Variable", name: { kind: "Name", value: "sort" } },
              },
              {
                kind: "Argument",
                name: { kind: "Name", value: "cursor" },
                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
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
                            { kind: "Field", name: { kind: "Name", value: "requireApproval" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "pointsPerParticipation" },
                            },
                            { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                            { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                            { kind: "Field", name: { kind: "Name", value: "endsAt" } },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "community" },
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
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
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
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
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
} as unknown as DocumentNode<OpportunitiesQuery, OpportunitiesQueryVariables>;
export const OpportunityDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "opportunity" },
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
            name: { kind: "Name", value: "opportunity" },
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
                { kind: "Field", name: { kind: "Name", value: "title" } },
                { kind: "Field", name: { kind: "Name", value: "description" } },
                { kind: "Field", name: { kind: "Name", value: "category" } },
                { kind: "Field", name: { kind: "Name", value: "requireApproval" } },
                { kind: "Field", name: { kind: "Name", value: "pointsPerParticipation" } },
                { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                { kind: "Field", name: { kind: "Name", value: "endsAt" } },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "community" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "city" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "code" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "wallets" },
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
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "currentPointView" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "walletId" } },
                                  { kind: "Field", name: { kind: "Name", value: "currentPoint" } },
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
                  name: { kind: "Name", value: "city" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "code" } },
                      { kind: "Field", name: { kind: "Name", value: "name" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "state" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "code" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
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
} as unknown as DocumentNode<OpportunityQuery, OpportunityQueryVariables>;
export const ParticipationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "participations" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "ParticipationFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "ParticipationSortInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
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
            name: { kind: "Name", value: "participations" },
            arguments: [
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
              {
                kind: "Argument",
                name: { kind: "Name", value: "cursor" },
                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
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
                            { kind: "Field", name: { kind: "Name", value: "status" } },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "opportunity" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "title" } },
                                  { kind: "Field", name: { kind: "Name", value: "description" } },
                                  { kind: "Field", name: { kind: "Name", value: "category" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "requireApproval" },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "pointsPerParticipation" },
                                  },
                                  { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                                  { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                                  { kind: "Field", name: { kind: "Name", value: "endsAt" } },
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
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "community" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "city" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "code" },
                                              },
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
                                                      name: { kind: "Name", value: "code" },
                                                    },
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
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "wallets" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
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
                                                  ],
                                                },
                                              },
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "currentPointView" },
                                                selectionSet: {
                                                  kind: "SelectionSet",
                                                  selections: [
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "walletId" },
                                                    },
                                                    {
                                                      kind: "Field",
                                                      name: { kind: "Name", value: "currentPoint" },
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
                                    name: { kind: "Name", value: "city" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "code" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "state" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "code" },
                                              },
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
                              name: { kind: "Name", value: "statusHistories" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "status" } },
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
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "participation" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "transactions" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "reason" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "fromWallet" },
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
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
                                              },
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
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "toWallet" },
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
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "id" },
                                              },
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
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "fromPointChange" },
                                  },
                                  { kind: "Field", name: { kind: "Name", value: "toPointChange" } },
                                  { kind: "Field", name: { kind: "Name", value: "createdAt" } },
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
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
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
} as unknown as DocumentNode<ParticipationsQuery, ParticipationsQueryVariables>;
export const ParticipationDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "participation" },
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
                { kind: "Field", name: { kind: "Name", value: "status" } },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "opportunity" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
                      { kind: "Field", name: { kind: "Name", value: "category" } },
                      { kind: "Field", name: { kind: "Name", value: "requireApproval" } },
                      { kind: "Field", name: { kind: "Name", value: "pointsPerParticipation" } },
                      { kind: "Field", name: { kind: "Name", value: "publishStatus" } },
                      { kind: "Field", name: { kind: "Name", value: "startsAt" } },
                      { kind: "Field", name: { kind: "Name", value: "endsAt" } },
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
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "community" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "state" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "code" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "wallets" },
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
                                      ],
                                    },
                                  },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "currentPointView" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "walletId" },
                                        },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "currentPoint" },
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
                        name: { kind: "Name", value: "city" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "code" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "state" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
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
                  name: { kind: "Name", value: "statusHistories" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
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
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "participation" },
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
                {
                  kind: "Field",
                  name: { kind: "Name", value: "transactions" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "reason" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "fromWallet" },
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
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "toWallet" },
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
                                ],
                              },
                            },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "fromPointChange" } },
                      { kind: "Field", name: { kind: "Name", value: "toPointChange" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
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
} as unknown as DocumentNode<ParticipationQuery, ParticipationQueryVariables>;
export const UsersDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "users" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "UserFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "UserSortInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
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
            name: { kind: "Name", value: "users" },
            arguments: [
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
              {
                kind: "Argument",
                name: { kind: "Name", value: "cursor" },
                value: { kind: "Variable", name: { kind: "Name", value: "cursor" } },
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
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "slug" } },
                            { kind: "Field", name: { kind: "Name", value: "image" } },
                            { kind: "Field", name: { kind: "Name", value: "bio" } },
                            { kind: "Field", name: { kind: "Name", value: "sysRole" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "memberships" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "community" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "city" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "code" },
                                              },
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
                                                      name: { kind: "Name", value: "code" },
                                                    },
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
                                  { kind: "Field", name: { kind: "Name", value: "role" } },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "wallets" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "community" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "id" } },
                                        { kind: "Field", name: { kind: "Name", value: "name" } },
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "city" },
                                          selectionSet: {
                                            kind: "SelectionSet",
                                            selections: [
                                              {
                                                kind: "Field",
                                                name: { kind: "Name", value: "code" },
                                              },
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
                                                      name: { kind: "Name", value: "code" },
                                                    },
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
                                    name: { kind: "Name", value: "currentPointView" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        {
                                          kind: "Field",
                                          name: { kind: "Name", value: "currentPoint" },
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
                      { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                      { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
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
} as unknown as DocumentNode<UsersQuery, UsersQueryVariables>;
export const UserDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "user" },
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
                { kind: "Field", name: { kind: "Name", value: "slug" } },
                { kind: "Field", name: { kind: "Name", value: "image" } },
                { kind: "Field", name: { kind: "Name", value: "bio" } },
                { kind: "Field", name: { kind: "Name", value: "sysRole" } },
                { kind: "Field", name: { kind: "Name", value: "urlWebsite" } },
                { kind: "Field", name: { kind: "Name", value: "urlX" } },
                { kind: "Field", name: { kind: "Name", value: "urlFacebook" } },
                { kind: "Field", name: { kind: "Name", value: "urlInstagram" } },
                { kind: "Field", name: { kind: "Name", value: "urlYoutube" } },
                { kind: "Field", name: { kind: "Name", value: "urlTiktok" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "memberships" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "community" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "state" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "code" } },
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
                      { kind: "Field", name: { kind: "Name", value: "role" } },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "wallets" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "community" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "city" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "code" } },
                                  { kind: "Field", name: { kind: "Name", value: "name" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "state" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "code" } },
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
                        name: { kind: "Name", value: "currentPointView" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "currentPoint" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "opportunitiesCreatedByMe" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "description" } },
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
                        name: { kind: "Name", value: "opportunity" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "participationStatusChangedByMe" },
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "status" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
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
} as unknown as DocumentNode<UserQuery, UserQueryVariables>;
