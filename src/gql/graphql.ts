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
  /** Custom scalar for high-precision decimal (serialized as string) */
  Decimal: { input: any; output: any };
  JSON: { input: any; output: any };
};

export type AccumulatedPointView = {
  __typename?: "AccumulatedPointView";
  accumulatedPoint: Scalars["Int"]["output"];
  walletId: Scalars["String"]["output"];
};

export type Article = {
  __typename?: "Article";
  authors?: Maybe<UsersConnection>;
  body: Scalars["String"]["output"];
  category: ArticleCategory;
  community?: Maybe<Community>;
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  introduction: Scalars["String"]["output"];
  opportunities?: Maybe<OpportunitiesConnection>;
  publishStatus: PublishStatus;
  publishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  relatedUsers?: Maybe<UsersConnection>;
  thumbnail?: Maybe<Scalars["JSON"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type ArticleAuthorsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UserSortInput>;
};

export type ArticleOpportunitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunitySortInput>;
};

export type ArticleRelatedUsersArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UserFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UserSortInput>;
};

export enum ArticleCategory {
  ActivityReport = "ACTIVITY_REPORT",
  Interview = "INTERVIEW",
}

export type ArticleCreateInput = {
  authorIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  body: Scalars["String"]["input"];
  category: ArticleCategory;
  communityId: Scalars["ID"]["input"];
  introduction: Scalars["String"]["input"];
  opportunityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  publishStatus?: InputMaybe<PublishStatus>;
  publishedAt?: InputMaybe<Scalars["String"]["input"]>;
  relatedUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  thumbnail?: InputMaybe<Scalars["JSON"]["input"]>;
  title: Scalars["String"]["input"];
};

export type ArticleCreatePayload = ArticleCreateSuccess;

export type ArticleCreateSuccess = {
  __typename?: "ArticleCreateSuccess";
  article?: Maybe<Article>;
};

export type ArticleDeletePayload = ArticleDeleteSuccess;

export type ArticleDeleteSuccess = {
  __typename?: "ArticleDeleteSuccess";
  id: Scalars["ID"]["output"];
};

export type ArticleEdge = Edge & {
  __typename?: "ArticleEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Article>;
};

export type ArticleFilterInput = {
  category?: InputMaybe<ArticleCategory>;
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  publishStatus?: InputMaybe<PublishStatus>;
  writtenByUserId?: InputMaybe<Scalars["String"]["input"]>;
};

export type ArticleSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  publishedAt?: InputMaybe<SortDirection>;
};

export type ArticleUpdateInput = {
  authorIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  body: Scalars["String"]["input"];
  category: ArticleCategory;
  communityId: Scalars["ID"]["input"];
  introduction: Scalars["String"]["input"];
  opportunityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  publishStatus?: InputMaybe<PublishStatus>;
  publishedAt?: InputMaybe<Scalars["String"]["input"]>;
  relatedUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  thumbnail?: InputMaybe<Scalars["JSON"]["input"]>;
  title: Scalars["String"]["input"];
};

export type ArticleUpdatePayload = ArticleUpdateSuccess;

export type ArticleUpdateSuccess = {
  __typename?: "ArticleUpdateSuccess";
  article?: Maybe<Article>;
};

export type ArticlesConnection = {
  __typename?: "ArticlesConnection";
  edges?: Maybe<Array<Maybe<ArticleEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type City = {
  __typename?: "City";
  code: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  state: State;
};

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
  image?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  pointName: Scalars["String"]["input"];
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommunityCreatePayload = CommunityCreateSuccess;

export type CommunityCreateSuccess = {
  __typename?: "CommunityCreateSuccess";
  community: Community;
};

export type CommunityDeleteInput = {
  communityId: Scalars["ID"]["input"];
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
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  stateCode?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommunitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type CommunityUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  communityId: Scalars["ID"]["input"];
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  pointName?: InputMaybe<Scalars["String"]["input"]>;
  stateCode?: InputMaybe<Scalars["String"]["input"]>;
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

export type CurrentUserPayload = {
  __typename?: "CurrentUserPayload";
  user?: Maybe<User>;
};

export type Edge = {
  cursor: Scalars["String"]["output"];
};

export enum IdentityPlatform {
  Facebook = "FACEBOOK",
  Line = "LINE",
}

export type ImageInput = {
  base64: Scalars["String"]["input"];
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

export type MembershipAcceptMyInvitationInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
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

export type MembershipCursorInput = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
};

export type MembershipDenyMyInvitationInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
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

export type MembershipInvitePayload = MembershipInviteSuccess;

export type MembershipInviteSuccess = {
  __typename?: "MembershipInviteSuccess";
  membership: Membership;
};

export type MembershipRemoveInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MembershipRemovePayload = MembershipRemoveSuccess;

export type MembershipRemoveSuccess = {
  __typename?: "MembershipRemoveSuccess";
  communityId: Scalars["String"]["output"];
  userId: Scalars["String"]["output"];
};

export type MembershipSetInvitationStatusPayload = MembershipSetInvitationStatusSuccess;

export type MembershipSetInvitationStatusSuccess = {
  __typename?: "MembershipSetInvitationStatusSuccess";
  membership: Membership;
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
  Canceled = "CANCELED",
  Invited = "INVITED",
  Joined = "JOINED",
  Withdrawed = "WITHDRAWED",
}

export type MembershipWithdrawInput = {
  communityId: Scalars["String"]["input"];
  userId: Scalars["String"]["input"];
};

export type MembershipWithdrawPayload = MembershipWithdrawSuccess;

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
  articleCreate?: Maybe<ArticleCreatePayload>;
  articleDelete?: Maybe<ArticleDeletePayload>;
  articleUpdate?: Maybe<ArticleUpdatePayload>;
  communityCreate?: Maybe<CommunityCreatePayload>;
  communityDelete?: Maybe<CommunityDeletePayload>;
  communityUpdateProfile?: Maybe<CommunityUpdateProfilePayload>;
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
  opportunityInvitationCreate?: Maybe<OpportunityInvitationCreatePayload>;
  opportunityInvitationDelete?: Maybe<OpportunityInvitationDeletePayload>;
  opportunityInvitationDisable?: Maybe<OpportunityInvitationDisablePayload>;
  opportunitySetPublishStatus?: Maybe<OpportunitySetPublishStatusPayload>;
  opportunitySlotsBulkUpdate?: Maybe<OpportunitySlotsBulkUpdatePayload>;
  opportunityUpdateContent?: Maybe<OpportunityUpdateContentPayload>;
  participationAcceptApplication?: Maybe<ParticipationSetStatusPayload>;
  participationAcceptMyInvitation?: Maybe<ParticipationSetStatusPayload>;
  participationApply?: Maybe<ParticipationApplyPayload>;
  participationApprovePerformance?: Maybe<ParticipationSetStatusPayload>;
  participationCancelInvitation?: Maybe<ParticipationSetStatusPayload>;
  participationCancelMyApplication?: Maybe<ParticipationSetStatusPayload>;
  participationDenyApplication?: Maybe<ParticipationSetStatusPayload>;
  participationDenyMyInvitation?: Maybe<ParticipationSetStatusPayload>;
  participationDenyPerformance?: Maybe<ParticipationSetStatusPayload>;
  participationInvite?: Maybe<ParticipationInvitePayload>;
  transactionDonateSelfPoint?: Maybe<TransactionDonateSelfPointPayload>;
  transactionGrantCommunityPoint?: Maybe<TransactionGrantCommunityPointPayload>;
  transactionIssueCommunityPoint?: Maybe<TransactionIssueCommunityPointPayload>;
  userDeleteMe?: Maybe<UserDeletePayload>;
  userSignUp?: Maybe<CurrentUserPayload>;
  userUpdateMyProfile?: Maybe<UserUpdateProfilePayload>;
  utilityCreate?: Maybe<UtilityCreatePayload>;
  utilityDelete?: Maybe<UtilityDeletePayload>;
  utilityRedeem?: Maybe<UtilityRedeemPayload>;
  utilityUpdateInfo?: Maybe<UtilityUpdateInfoPayload>;
  utilityUse?: Maybe<UtilityUsePayload>;
};

export type MutationArticleCreateArgs = {
  input: ArticleCreateInput;
};

export type MutationArticleDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationArticleUpdateArgs = {
  id: Scalars["ID"]["input"];
  input: ArticleUpdateInput;
};

export type MutationCommunityCreateArgs = {
  input: CommunityCreateInput;
};

export type MutationCommunityDeleteArgs = {
  id: Scalars["ID"]["input"];
  input: CommunityDeleteInput;
};

export type MutationCommunityUpdateProfileArgs = {
  id: Scalars["ID"]["input"];
  input: CommunityUpdateProfileInput;
};

export type MutationMembershipAcceptMyInvitationArgs = {
  input: MembershipAcceptMyInvitationInput;
};

export type MutationMembershipAssignManagerArgs = {
  input: MembershipAssignManagerInput;
};

export type MutationMembershipAssignMemberArgs = {
  input: MembershipAssignMemberInput;
};

export type MutationMembershipAssignOwnerArgs = {
  input: MembershipAssignOwnerInput;
};

export type MutationMembershipCancelInvitationArgs = {
  input: MembershipCancelInvitationInput;
};

export type MutationMembershipDenyMyInvitationArgs = {
  input: MembershipDenyMyInvitationInput;
};

export type MutationMembershipInviteArgs = {
  input: MembershipInviteInput;
};

export type MutationMembershipRemoveArgs = {
  input: MembershipRemoveInput;
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

export type MutationOpportunityInvitationCreateArgs = {
  input: OpportunityInvitationCreateInput;
};

export type MutationOpportunityInvitationDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOpportunityInvitationDisableArgs = {
  id: Scalars["ID"]["input"];
  input: OpportunityInvitationDisableInput;
};

export type MutationOpportunitySetPublishStatusArgs = {
  id: Scalars["ID"]["input"];
  input: OpportunitySetPublishStatusInput;
};

export type MutationOpportunitySlotsBulkUpdateArgs = {
  input: OpportunitySlotsBulkUpdateInput;
};

export type MutationOpportunityUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: OpportunityUpdateContentInput;
};

export type MutationParticipationAcceptApplicationArgs = {
  id: Scalars["ID"]["input"];
  input: ParticipationSetStatusInput;
};

export type MutationParticipationAcceptMyInvitationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationApplyArgs = {
  input: ParticipationApplyInput;
};

export type MutationParticipationApprovePerformanceArgs = {
  id: Scalars["ID"]["input"];
  input: ParticipationSetStatusInput;
};

export type MutationParticipationCancelInvitationArgs = {
  id: Scalars["ID"]["input"];
  input: ParticipationSetStatusInput;
};

export type MutationParticipationCancelMyApplicationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationDenyApplicationArgs = {
  id: Scalars["ID"]["input"];
  input: ParticipationSetStatusInput;
};

export type MutationParticipationDenyMyInvitationArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationParticipationDenyPerformanceArgs = {
  id: Scalars["ID"]["input"];
  input: ParticipationSetStatusInput;
};

export type MutationParticipationInviteArgs = {
  input: ParticipationInviteInput;
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

export type MutationUserDeleteMeArgs = {
  input: UserDeleteInput;
};

export type MutationUserSignUpArgs = {
  input: UserSignUpInput;
};

export type MutationUserUpdateMyProfileArgs = {
  input: UserUpdateProfileInput;
};

export type MutationUtilityCreateArgs = {
  input: UtilityCreateInput;
};

export type MutationUtilityDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationUtilityRedeemArgs = {
  id: Scalars["ID"]["input"];
  input: UtilityRedeemInput;
};

export type MutationUtilityUpdateInfoArgs = {
  id: Scalars["ID"]["input"];
  input: UtilityUpdateInfoInput;
};

export type MutationUtilityUseArgs = {
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
  articles?: Maybe<ArticlesConnection>;
  body?: Maybe<Scalars["String"]["output"]>;
  capacity?: Maybe<Scalars["Int"]["output"]>;
  category: OpportunityCategory;
  community?: Maybe<Community>;
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  description: Scalars["String"]["output"];
  endsAt?: Maybe<Scalars["Datetime"]["output"]>;
  feeRequired?: Maybe<Scalars["Int"]["output"]>;
  files?: Maybe<Scalars["JSON"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  invitations?: Maybe<OpportunityInvitationsConnection>;
  participations?: Maybe<ParticipationsConnection>;
  place?: Maybe<Place>;
  pointsRequired?: Maybe<Scalars["Int"]["output"]>;
  pointsToEarn?: Maybe<Scalars["Int"]["output"]>;
  publishStatus: PublishStatus;
  requireApproval: Scalars["Boolean"]["output"];
  slots?: Maybe<OpportunitySlotsConnection>;
  startsAt?: Maybe<Scalars["Datetime"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type OpportunityArticlesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ArticleFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ArticleSortInput>;
};

export type OpportunityInvitationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityInvitationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunityInvitationSortInput>;
};

export type OpportunityParticipationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationSortInput>;
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
  communityId: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  files?: InputMaybe<Scalars["JSON"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  placeId?: InputMaybe<Scalars["String"]["input"]>;
  pointsRequired?: InputMaybe<Scalars["Int"]["input"]>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: PublishStatus;
  requireApproval: Scalars["Boolean"]["input"];
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
  opportunityId: Scalars["String"]["output"];
};

export type OpportunityEdge = Edge & {
  __typename?: "OpportunityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Opportunity>;
};

export type OpportunityFilterInput = {
  articleId?: InputMaybe<Scalars["String"]["input"]>;
  category?: InputMaybe<OpportunityCategory>;
  communityId?: InputMaybe<Scalars["String"]["input"]>;
  createdByUserId?: InputMaybe<Scalars["String"]["input"]>;
  placeId?: InputMaybe<Scalars["String"]["input"]>;
  publishStatus?: InputMaybe<PublishStatus>;
};

export type OpportunityInvitation = {
  __typename?: "OpportunityInvitation";
  code: Scalars["String"]["output"];
  createdAt: Scalars["Datetime"]["output"];
  createdByUser?: Maybe<User>;
  histories?: Maybe<OpportunityInvitationHistoriesConnection>;
  id: Scalars["ID"]["output"];
  isValid: Scalars["Boolean"]["output"];
  opportunity?: Maybe<Opportunity>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type OpportunityInvitationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityInvitationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunityInvitationHistorySortInput>;
};

export type OpportunityInvitationCreateInput = {
  code: Scalars["String"]["input"];
  communityId: Scalars["ID"]["input"];
  opportunityId: Scalars["ID"]["input"];
};

export type OpportunityInvitationCreatePayload = OpportunityInvitationCreateSuccess;

export type OpportunityInvitationCreateSuccess = {
  __typename?: "OpportunityInvitationCreateSuccess";
  opportunityInvitation?: Maybe<OpportunityInvitation>;
};

export type OpportunityInvitationDeletePayload = OpportunityInvitationDeleteSuccess;

export type OpportunityInvitationDeleteSuccess = {
  __typename?: "OpportunityInvitationDeleteSuccess";
  id: Scalars["ID"]["output"];
};

export type OpportunityInvitationDisableInput = {
  communityId: Scalars["ID"]["input"];
};

export type OpportunityInvitationDisablePayload = OpportunityInvitationDisableSuccess;

export type OpportunityInvitationDisableSuccess = {
  __typename?: "OpportunityInvitationDisableSuccess";
  opportunityInvitation?: Maybe<OpportunityInvitation>;
};

export type OpportunityInvitationEdge = Edge & {
  __typename?: "OpportunityInvitationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<OpportunityInvitation>;
};

export type OpportunityInvitationFilterInput = {
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  isValid?: InputMaybe<Scalars["Boolean"]["input"]>;
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type OpportunityInvitationHistoriesConnection = {
  __typename?: "OpportunityInvitationHistoriesConnection";
  edges?: Maybe<Array<Maybe<OpportunityInvitationHistoryEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type OpportunityInvitationHistory = {
  __typename?: "OpportunityInvitationHistory";
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  invitation?: Maybe<OpportunityInvitation>;
  invitedUser?: Maybe<User>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type OpportunityInvitationHistoryCreateInput = {
  invitationId: Scalars["ID"]["input"];
  invitedUserId: Scalars["ID"]["input"];
};

export type OpportunityInvitationHistoryCreatePayload = OpportunityInvitationHistoryCreateSuccess;

export type OpportunityInvitationHistoryCreateSuccess = {
  __typename?: "OpportunityInvitationHistoryCreateSuccess";
  opportunityInvitationHistory?: Maybe<OpportunityInvitationHistory>;
};

export type OpportunityInvitationHistoryEdge = Edge & {
  __typename?: "OpportunityInvitationHistoryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<OpportunityInvitationHistory>;
};

export type OpportunityInvitationHistoryFilterInput = {
  invitationId?: InputMaybe<Scalars["ID"]["input"]>;
  invitedUserId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type OpportunityInvitationHistorySortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type OpportunityInvitationSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type OpportunityInvitationsConnection = {
  __typename?: "OpportunityInvitationsConnection";
  edges?: Maybe<Array<Maybe<OpportunityInvitationEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type OpportunitySetPublishStatusInput = {
  communityId: Scalars["String"]["input"];
  status: PublishStatus;
};

export type OpportunitySetPublishStatusPayload = OpportunitySetPublishStatusSuccess;

export type OpportunitySetPublishStatusSuccess = {
  __typename?: "OpportunitySetPublishStatusSuccess";
  opportunity: Opportunity;
};

export type OpportunitySlot = {
  __typename?: "OpportunitySlot";
  createdAt: Scalars["Datetime"]["output"];
  endsAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  opportunity?: Maybe<Opportunity>;
  participations?: Maybe<ParticipationsConnection>;
  startsAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type OpportunitySlotParticipationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ParticipationSortInput>;
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

export type OpportunitySlotSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  endsAt?: InputMaybe<SortDirection>;
  startsAt?: InputMaybe<SortDirection>;
};

export type OpportunitySlotUpdateInput = {
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  id: Scalars["ID"]["input"];
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
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
  pointsRequired?: InputMaybe<SortDirection>;
  startsAt?: InputMaybe<SortDirection>;
};

export type OpportunityUpdateContentInput = {
  body?: InputMaybe<Scalars["String"]["input"]>;
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  category: OpportunityCategory;
  communityId: Scalars["String"]["input"];
  description: Scalars["String"]["input"];
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  files?: InputMaybe<Scalars["JSON"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  placeId?: InputMaybe<Scalars["String"]["input"]>;
  pointsRequired?: InputMaybe<Scalars["Int"]["input"]>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: PublishStatus;
  requireApproval: Scalars["Boolean"]["input"];
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
  id: Scalars["ID"]["output"];
  images?: Maybe<Scalars["JSON"]["output"]>;
  opportunity?: Maybe<Opportunity>;
  opportunitySlot?: Maybe<OpportunitySlot>;
  status: ParticipationStatus;
  statusHistories?: Maybe<ParticipationStatusHistoriesConnection>;
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

export type ParticipationApplyInput = {
  opportunityId: Scalars["String"]["input"];
};

export type ParticipationApplyPayload = ParticipationApplySuccess;

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
  opportunitySlotId?: InputMaybe<Scalars["String"]["input"]>;
  status?: InputMaybe<ParticipationStatus>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type ParticipationInviteInput = {
  communityId: Scalars["String"]["input"];
  invitedUserId: Scalars["String"]["input"];
  opportunityId: Scalars["String"]["input"];
};

export type ParticipationInvitePayload = ParticipationInviteSuccess;

export type ParticipationInviteSuccess = {
  __typename?: "ParticipationInviteSuccess";
  participation: Participation;
};

export type ParticipationSetStatusInput = {
  communityId: Scalars["String"]["input"];
};

export type ParticipationSetStatusPayload = ParticipationSetStatusSuccess;

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

export type ParticipationStatusHistoryCreatePayload = ParticipationStatusHistoryCreateSuccess;

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

export type Place = {
  __typename?: "Place";
  address: Scalars["String"]["output"];
  city?: Maybe<City>;
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
  cityCode: Scalars["String"]["input"];
  googlePlaceId?: InputMaybe<Scalars["String"]["input"]>;
  isManual: Scalars["Boolean"]["input"];
  latitude: Scalars["Decimal"]["input"];
  longitude: Scalars["Decimal"]["input"];
  mapLocation?: InputMaybe<Scalars["JSON"]["input"]>;
  name: Scalars["String"]["input"];
};

export type PlaceCreatePayload = PlaceCreateSuccess;

export type PlaceCreateSuccess = {
  __typename?: "PlaceCreateSuccess";
  place?: Maybe<Place>;
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
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type PlaceSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type PlaceUpdateInput = {
  address?: InputMaybe<Scalars["String"]["input"]>;
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  googlePlaceId?: InputMaybe<Scalars["String"]["input"]>;
  isManual?: InputMaybe<Scalars["Boolean"]["input"]>;
  latitude?: InputMaybe<Scalars["Decimal"]["input"]>;
  longitude?: InputMaybe<Scalars["Decimal"]["input"]>;
  mapLocation?: InputMaybe<Scalars["JSON"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type PlaceUpdatePayload = PlaceUpdateSuccess;

export type PlaceUpdateSuccess = {
  __typename?: "PlaceUpdateSuccess";
  place?: Maybe<Place>;
};

export type PlacesConnection = {
  __typename?: "PlacesConnection";
  edges?: Maybe<Array<Maybe<PlaceEdge>>>;
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
  membership?: Maybe<Membership>;
  memberships: MembershipsConnection;
  opportunities: OpportunitiesConnection;
  opportunity?: Maybe<Opportunity>;
  opportunityInvitation?: Maybe<OpportunityInvitation>;
  opportunityInvitationHistories: OpportunityInvitationHistoriesConnection;
  opportunityInvitationHistory?: Maybe<OpportunityInvitationHistory>;
  opportunityInvitations: OpportunityInvitationsConnection;
  opportunitySlot?: Maybe<OpportunitySlot>;
  opportunitySlots: OpportunitySlotsConnection;
  participation?: Maybe<Participation>;
  participationStatusHistories: ParticipationStatusHistoriesConnection;
  participationStatusHistory?: Maybe<ParticipationStatusHistory>;
  participations: ParticipationsConnection;
  place?: Maybe<Place>;
  places: PlacesConnection;
  states: Array<State>;
  transaction?: Maybe<Transaction>;
  transactions: TransactionsConnection;
  user?: Maybe<User>;
  users: UsersConnection;
  utilities: UtilitiesConnection;
  utility?: Maybe<Utility>;
  utilityHistories: UtilityHistoriesConnection;
  utilityHistory?: Maybe<UtilityHistory>;
  wallet?: Maybe<Wallet>;
  wallets: WalletsConnection;
};

export type QueryArticleArgs = {
  id: Scalars["ID"]["input"];
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

export type QueryMembershipArgs = {
  communityId: Scalars["ID"]["input"];
  userId: Scalars["ID"]["input"];
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
};

export type QueryOpportunityInvitationArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryOpportunityInvitationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityInvitationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunityInvitationHistorySortInput>;
};

export type QueryOpportunityInvitationHistoryArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryOpportunityInvitationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityInvitationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunityInvitationSortInput>;
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

export type QueryUtilityHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UtilityHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UtilityHistorySortInput>;
};

export type QueryUtilityHistoryArgs = {
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
  reason: TransactionReason;
  toPointChange?: Maybe<Scalars["Int"]["output"]>;
  toWallet?: Maybe<Wallet>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utilityHistories?: Maybe<UtilityHistoriesConnection>;
};

export type TransactionUtilityHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UtilityHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UtilityHistorySortInput>;
};

export type TransactionDonateSelfPointInput = {
  communityId: Scalars["String"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  fromWalletId: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
  toUserId: Scalars["String"]["input"];
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
  fromWalletId?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  participationId?: InputMaybe<Scalars["String"]["input"]>;
  reason?: InputMaybe<TransactionReason>;
  toWalletId?: InputMaybe<Scalars["String"]["input"]>;
};

export type TransactionGiveRewardPointInput = {
  fromPointChange: Scalars["Int"]["input"];
  fromWalletId: Scalars["String"]["input"];
  participationId: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
  toWalletId: Scalars["String"]["input"];
};

export type TransactionGiveRewardPointPayload = TransactionGiveRewardPointSuccess;

export type TransactionGiveRewardPointSuccess = {
  __typename?: "TransactionGiveRewardPointSuccess";
  transaction: Transaction;
};

export type TransactionGrantCommunityPointInput = {
  communityId: Scalars["String"]["input"];
  fromPointChange: Scalars["Int"]["input"];
  fromWalletId: Scalars["String"]["input"];
  toPointChange: Scalars["Int"]["input"];
  toUserId: Scalars["String"]["input"];
};

export type TransactionGrantCommunityPointPayload = TransactionGrantCommunityPointSuccess;

export type TransactionGrantCommunityPointSuccess = {
  __typename?: "TransactionGrantCommunityPointSuccess";
  transaction: Transaction;
};

export type TransactionIssueCommunityPointInput = {
  toPointChange: Scalars["Int"]["input"];
  toWalletId: Scalars["String"]["input"];
};

export type TransactionIssueCommunityPointPayload = TransactionIssueCommunityPointSuccess;

export type TransactionIssueCommunityPointSuccess = {
  __typename?: "TransactionIssueCommunityPointSuccess";
  transaction: Transaction;
};

export enum TransactionReason {
  Donation = "DONATION",
  Grant = "GRANT",
  MembershipDeleted = "MEMBERSHIP_DELETED",
  PointIssued = "POINT_ISSUED",
  PointReward = "POINT_REWARD",
  UtilityRedeemed = "UTILITY_REDEEMED",
}

export type TransactionRedeemUtilityInput = {
  fromWalletId: Scalars["String"]["input"];
  toWalletId: Scalars["String"]["input"];
  transferPoints: Scalars["Int"]["input"];
};

export type TransactionRedeemUtilityPayload = TransactionRedeemUtilitySuccess;

export type TransactionRedeemUtilitySuccess = {
  __typename?: "TransactionRedeemUtilitySuccess";
  transaction: Transaction;
};

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
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  invitationHistories?: Maybe<OpportunityInvitationHistoriesConnection>;
  invitations?: Maybe<OpportunityInvitationsConnection>;
  memberships?: Maybe<MembershipsConnection>;
  name: Scalars["String"]["output"];
  opportunitiesCreatedByMe?: Maybe<OpportunitiesConnection>;
  participationStatusChangedByMe?: Maybe<ParticipationStatusHistoriesConnection>;
  participations?: Maybe<ParticipationsConnection>;
  slug: Scalars["String"]["output"];
  sysRole: SysRole;
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

export type UserInvitationHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityInvitationHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunityInvitationHistorySortInput>;
};

export type UserInvitationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OpportunityInvitationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OpportunityInvitationSortInput>;
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

export type UserWalletsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<WalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<WalletSortInput>;
};

export type UserDeleteInput = {
  userId: Scalars["String"]["input"];
};

export type UserDeletePayload = {
  __typename?: "UserDeletePayload";
  userId: Scalars["String"]["output"];
};

export type UserEdge = Edge & {
  __typename?: "UserEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<User>;
};

export type UserFilterInput = {
  articleAuthorId?: InputMaybe<Scalars["ID"]["input"]>;
  articleWriterId?: InputMaybe<Scalars["ID"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  sysRole?: InputMaybe<SysRole>;
};

export type UserSignUpInput = {
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  slug?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type UserUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  id: Scalars["String"]["input"];
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
  community?: Maybe<Community>;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  histories?: Maybe<UtilityHistoriesConnection>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  pointsRequired: Scalars["Int"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type UtilityHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UtilityHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UtilityHistorySortInput>;
};

export type UtilityCreateInput = {
  communityId: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  image?: InputMaybe<ImageInput>;
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
  communityId?: InputMaybe<Scalars["String"]["input"]>;
};

export type UtilityHistoriesConnection = {
  __typename?: "UtilityHistoriesConnection";
  edges: Array<UtilityHistoryEdge>;
  pageInfo: PageInfo;
};

export type UtilityHistory = {
  __typename?: "UtilityHistory";
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  transaction: Transaction;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  usedAt?: Maybe<Scalars["Datetime"]["output"]>;
  utility: Utility;
  wallet: Wallet;
};

export type UtilityHistoryCreateInput = {
  transactionId: Scalars["String"]["input"];
  usedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  utilityId: Scalars["String"]["input"];
  walletId: Scalars["String"]["input"];
};

export type UtilityHistoryCreatePayload = UtilityHistoryCreateSuccess;

export type UtilityHistoryCreateSuccess = {
  __typename?: "UtilityHistoryCreateSuccess";
  utilityHistory: UtilityHistory;
};

export type UtilityHistoryEdge = {
  __typename?: "UtilityHistoryEdge";
  cursor: Scalars["String"]["output"];
  node: UtilityHistory;
};

export type UtilityHistoryFilterInput = {
  transactionId?: InputMaybe<Scalars["ID"]["input"]>;
  usedAtExists?: InputMaybe<Scalars["Boolean"]["input"]>;
  utilityId?: InputMaybe<Scalars["ID"]["input"]>;
  walletId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type UtilityHistorySortInput = {
  createdAt: SortDirection;
  usedAt: SortDirection;
};

export type UtilityRedeemInput = {
  communityId: Scalars["String"]["input"];
  userWalletId: Scalars["String"]["input"];
};

export type UtilityRedeemPayload = UtilityRedeemSuccess;

export type UtilityRedeemSuccess = {
  __typename?: "UtilityRedeemSuccess";
  transaction: Transaction;
};

export type UtilitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
  pointsRequired?: InputMaybe<SortDirection>;
};

export type UtilityUpdateInfoInput = {
  communityId: Scalars["String"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  image?: InputMaybe<ImageInput>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
};

export type UtilityUpdateInfoPayload = UtilityUpdateInfoSuccess;

export type UtilityUpdateInfoSuccess = {
  __typename?: "UtilityUpdateInfoSuccess";
  utility: Utility;
};

export type UtilityUseInput = {
  communityId: Scalars["String"]["input"];
  utilityHistoryId: Scalars["String"]["input"];
};

export type UtilityUsePayload = UtilityUseSuccess;

export type UtilityUseSuccess = {
  __typename?: "UtilityUseSuccess";
  utilityHistory: UtilityHistory;
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
  transactions?: Maybe<TransactionsConnection>;
  type: WalletType;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
  utilityHistories?: Maybe<UtilityHistoriesConnection>;
};

export type WalletTransactionsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TransactionFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TransactionSortInput>;
};

export type WalletUtilityHistoriesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<UtilityHistoryFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<UtilityHistorySortInput>;
};

export type WalletCreatePayload = WalletCreateSuccess;

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

export type WalletDeletePayload = WalletDeleteSuccess;

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

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string; name: string } | null;
  } | null;
};

export type GetUserWithDetailsQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GetUserWithDetailsQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    name: string;
    image?: string | null;
    bio?: string | null;
    sysRole: SysRole;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlWebsite?: string | null;
    urlX?: string | null;
    urlYoutube?: string | null;
  } | null;
};

export type GetUserActivitiesQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  articlesFirst?: InputMaybe<Scalars["Int"]["input"]>;
  articlesCursor?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetUserActivitiesQuery = {
  __typename?: "Query";
  user?: {
    __typename?: "User";
    id: string;
    articlesAboutMe?: {
      __typename?: "ArticlesConnection";
      edges?: Array<{
        __typename?: "ArticleEdge";
        cursor: string;
        node?: { __typename?: "Article"; id: string } | null;
      } | null> | null;
    } | null;
    articlesWrittenByMe?: {
      __typename?: "ArticlesConnection";
      edges?: Array<{
        __typename?: "ArticleEdge";
        cursor: string;
        node?: { __typename?: "Article"; id: string } | null;
      } | null> | null;
    } | null;
  } | null;
};

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
export const GetUserWithDetailsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUserWithDetails" },
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
} as unknown as DocumentNode<GetUserWithDetailsQuery, GetUserWithDetailsQueryVariables>;
export const GetUserActivitiesDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "GetUserActivities" },
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
          variable: { kind: "Variable", name: { kind: "Name", value: "articlesFirst" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "articlesCursor" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
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
                  name: { kind: "Name", value: "articlesAboutMe" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "first" },
                      value: { kind: "Variable", name: { kind: "Name", value: "articlesFirst" } },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "cursor" },
                      value: { kind: "Variable", name: { kind: "Name", value: "articlesCursor" } },
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
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "cursor" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "articlesWrittenByMe" },
                  arguments: [
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "first" },
                      value: { kind: "Variable", name: { kind: "Name", value: "articlesFirst" } },
                    },
                    {
                      kind: "Argument",
                      name: { kind: "Name", value: "cursor" },
                      value: { kind: "Variable", name: { kind: "Name", value: "articlesCursor" } },
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
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "cursor" } },
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
} as unknown as DocumentNode<GetUserActivitiesQuery, GetUserActivitiesQueryVariables>;
