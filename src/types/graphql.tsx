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
  BigInt: { input: any; output: any };
  DateTime: { input: any; output: any };
  Datetime: { input: Date; output: Date };
  Decimal: { input: any; output: any };
  JSON: { input: any; output: any };
  Upload: { input: any; output: any };
};

export type GqlAccumulatedPointView = {
  __typename?: "AccumulatedPointView";
  accumulatedPoint: Scalars["BigInt"]["output"];
  walletId?: Maybe<Scalars["String"]["output"]>;
};

export type GqlAdminReportSummaryConnection = {
  __typename?: "AdminReportSummaryConnection";
  edges?: Maybe<Array<Maybe<GqlAdminReportSummaryEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlAdminReportSummaryEdge = GqlEdge & {
  __typename?: "AdminReportSummaryEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlAdminReportSummaryRow>;
};

export type GqlAdminReportSummaryRow = {
  __typename?: "AdminReportSummaryRow";
  community: GqlCommunity;
  daysSinceLastPublish?: Maybe<Scalars["Int"]["output"]>;
  lastPublishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  lastPublishedReport?: Maybe<GqlReport>;
  publishedCountLast90Days: Scalars["Int"]["output"];
};

export type GqlAdminTemplateFeedbackStats = {
  __typename?: "AdminTemplateFeedbackStats";
  avgRating?: Maybe<Scalars["Float"]["output"]>;
  ratingDistribution: Array<GqlReportFeedbackRatingBucket>;
  totalCount: Scalars["Int"]["output"];
};

export type GqlApproveReportPayload = GqlApproveReportSuccess;

export type GqlApproveReportSuccess = {
  __typename?: "ApproveReportSuccess";
  report: GqlReport;
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
  thumbnail?: Maybe<Scalars["String"]["output"]>;
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export const GqlArticleCategory = {
  ActivityReport: "ACTIVITY_REPORT",
  Interview: "INTERVIEW",
} as const;

export type GqlArticleCategory = (typeof GqlArticleCategory)[keyof typeof GqlArticleCategory];
export type GqlArticleCreateInput = {
  authorIds: Array<Scalars["ID"]["input"]>;
  body?: InputMaybe<Scalars["String"]["input"]>;
  category: GqlArticleCategory;
  introduction: Scalars["String"]["input"];
  publishStatus: GqlPublishStatus;
  relatedOpportunityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  relatedUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  thumbnail?: InputMaybe<GqlImageInput>;
  title: Scalars["String"]["input"];
};

export type GqlArticleCreatePayload = GqlArticleCreateSuccess;

export type GqlArticleCreateSuccess = {
  __typename?: "ArticleCreateSuccess";
  article: GqlArticle;
};

export type GqlArticleDeletePayload = GqlArticleDeleteSuccess;

export type GqlArticleDeleteSuccess = {
  __typename?: "ArticleDeleteSuccess";
  articleId: Scalars["ID"]["output"];
};

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

export type GqlArticleUpdateContentInput = {
  authorIds: Array<Scalars["ID"]["input"]>;
  body?: InputMaybe<Scalars["String"]["input"]>;
  category: GqlArticleCategory;
  introduction: Scalars["String"]["input"];
  publishStatus: GqlPublishStatus;
  publishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  relatedOpportunityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  relatedUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  thumbnail?: InputMaybe<GqlImageInput>;
  title: Scalars["String"]["input"];
};

export type GqlArticleUpdateContentPayload = GqlArticleUpdateContentSuccess;

export type GqlArticleUpdateContentSuccess = {
  __typename?: "ArticleUpdateContentSuccess";
  article: GqlArticle;
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
  CanManageOpportunity: "CanManageOpportunity",
  IsAdmin: "IsAdmin",
  IsCommunityManager: "IsCommunityManager",
  IsCommunityMember: "IsCommunityMember",
  IsCommunityOwner: "IsCommunityOwner",
  IsSelf: "IsSelf",
  IsUser: "IsUser",
} as const;

export type GqlAuthZRules = (typeof GqlAuthZRules)[keyof typeof GqlAuthZRules];
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

export type GqlCitiesConnection = {
  __typename?: "CitiesConnection";
  edges: Array<GqlCityEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlCitiesInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlCitiesSortInput = {
  code?: InputMaybe<GqlSortDirection>;
};

export type GqlCity = {
  __typename?: "City";
  code: Scalars["ID"]["output"];
  name: Scalars["String"]["output"];
  state?: Maybe<GqlState>;
};

export type GqlCityEdge = GqlEdge & {
  __typename?: "CityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlCity>;
};

export const GqlClaimLinkStatus = {
  Claimed: "CLAIMED",
  Expired: "EXPIRED",
  Issued: "ISSUED",
} as const;

export type GqlClaimLinkStatus = (typeof GqlClaimLinkStatus)[keyof typeof GqlClaimLinkStatus];
export type GqlCommonDocumentOverrides = {
  __typename?: "CommonDocumentOverrides";
  privacy?: Maybe<GqlCommunityDocument>;
  terms?: Maybe<GqlCommunityDocument>;
};

export type GqlCommonDocumentOverridesInput = {
  privacy?: InputMaybe<GqlCommunityDocumentInput>;
  terms?: InputMaybe<GqlCommunityDocumentInput>;
};

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
  config?: Maybe<GqlCommunityConfig>;
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

export type GqlCommunityConfig = {
  __typename?: "CommunityConfig";
  firebaseConfig?: Maybe<GqlCommunityFirebaseConfig>;
  lineConfig?: Maybe<GqlCommunityLineConfig>;
  signupBonusConfig?: Maybe<GqlCommunitySignupBonusConfig>;
};

export type GqlCommunityConfigInput = {
  lineConfig?: InputMaybe<GqlCommunityLineConfigInput>;
  portalConfig?: InputMaybe<GqlCommunityPortalConfigInput>;
};

export type GqlCommunityCreateInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  config?: InputMaybe<GqlCommunityConfigInput>;
  createdBy?: InputMaybe<Scalars["ID"]["input"]>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<GqlImageInput>;
  name: Scalars["String"]["input"];
  originalId?: InputMaybe<Scalars["String"]["input"]>;
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

export type GqlCommunityDocument = {
  __typename?: "CommunityDocument";
  id: Scalars["String"]["output"];
  order?: Maybe<Scalars["Int"]["output"]>;
  path: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type GqlCommunityDocumentInput = {
  id: Scalars["String"]["input"];
  order?: InputMaybe<Scalars["Int"]["input"]>;
  path: Scalars["String"]["input"];
  title: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
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

export type GqlCommunityFirebaseConfig = {
  __typename?: "CommunityFirebaseConfig";
  tenantId?: Maybe<Scalars["String"]["output"]>;
};

export type GqlCommunityLineConfig = {
  __typename?: "CommunityLineConfig";
  accessToken?: Maybe<Scalars["String"]["output"]>;
  channelId?: Maybe<Scalars["String"]["output"]>;
  channelSecret?: Maybe<Scalars["String"]["output"]>;
  liffAppId?: Maybe<Scalars["String"]["output"]>;
  liffBaseUrl?: Maybe<Scalars["String"]["output"]>;
  liffId?: Maybe<Scalars["String"]["output"]>;
  richMenus?: Maybe<Array<GqlCommunityLineRichMenuConfig>>;
};

export type GqlCommunityLineConfigInput = {
  accessToken: Scalars["String"]["input"];
  channelId: Scalars["String"]["input"];
  channelSecret: Scalars["String"]["input"];
  liffAppId?: InputMaybe<Scalars["String"]["input"]>;
  liffBaseUrl: Scalars["String"]["input"];
  liffId: Scalars["String"]["input"];
  richMenus: Array<GqlCommunityLineRichMenuConfigInput>;
};

export type GqlCommunityLineRichMenuConfig = {
  __typename?: "CommunityLineRichMenuConfig";
  richMenuId: Scalars["String"]["output"];
  type: GqlLineRichMenuType;
};

export type GqlCommunityLineRichMenuConfigInput = {
  richMenuId: Scalars["String"]["input"];
  type: GqlLineRichMenuType;
};

export type GqlCommunityPortalConfig = {
  __typename?: "CommunityPortalConfig";
  adminRootPath: Scalars["String"]["output"];
  commonDocumentOverrides?: Maybe<GqlCommonDocumentOverrides>;
  communityId: Scalars["String"]["output"];
  description: Scalars["String"]["output"];
  documents?: Maybe<Array<GqlCommunityDocument>>;
  domain: Scalars["String"]["output"];
  enableFeatures: Array<Scalars["String"]["output"]>;
  faviconPrefix: Scalars["String"]["output"];
  firebaseTenantId?: Maybe<Scalars["String"]["output"]>;
  liffAppId?: Maybe<Scalars["String"]["output"]>;
  liffBaseUrl?: Maybe<Scalars["String"]["output"]>;
  liffId?: Maybe<Scalars["String"]["output"]>;
  logoPath: Scalars["String"]["output"];
  ogImagePath: Scalars["String"]["output"];
  regionKey?: Maybe<Scalars["String"]["output"]>;
  regionName?: Maybe<Scalars["String"]["output"]>;
  rootPath: Scalars["String"]["output"];
  shortDescription?: Maybe<Scalars["String"]["output"]>;
  squareLogoPath: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  tokenName: Scalars["String"]["output"];
};

export type GqlCommunityPortalConfigInput = {
  adminRootPath?: InputMaybe<Scalars["String"]["input"]>;
  commonDocumentOverrides?: InputMaybe<GqlCommonDocumentOverridesInput>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  documents?: InputMaybe<Array<GqlCommunityDocumentInput>>;
  domain?: InputMaybe<Scalars["String"]["input"]>;
  enableFeatures?: InputMaybe<Array<Scalars["String"]["input"]>>;
  favicon?: InputMaybe<GqlImageInput>;
  logo?: InputMaybe<GqlImageInput>;
  ogImage?: InputMaybe<GqlImageInput>;
  regionKey?: InputMaybe<Scalars["String"]["input"]>;
  regionName?: InputMaybe<Scalars["String"]["input"]>;
  rootPath?: InputMaybe<Scalars["String"]["input"]>;
  shortDescription?: InputMaybe<Scalars["String"]["input"]>;
  squareLogo?: InputMaybe<GqlImageInput>;
  title?: InputMaybe<Scalars["String"]["input"]>;
  tokenName?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlCommunitySignupBonusConfig = {
  __typename?: "CommunitySignupBonusConfig";
  bonusPoint: Scalars["Int"]["output"];
  isEnabled: Scalars["Boolean"]["output"];
  message?: Maybe<Scalars["String"]["output"]>;
};

export type GqlCommunitySortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlCommunityUpdateProfileInput = {
  bio?: InputMaybe<Scalars["String"]["input"]>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<GqlImageInput>;
  name: Scalars["String"]["input"];
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
  currentPoint: Scalars["BigInt"]["output"];
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

export type GqlDateTimeRangeFilter = {
  gt?: InputMaybe<Scalars["Datetime"]["input"]>;
  gte?: InputMaybe<Scalars["Datetime"]["input"]>;
  lt?: InputMaybe<Scalars["Datetime"]["input"]>;
  lte?: InputMaybe<Scalars["Datetime"]["input"]>;
};

export type GqlDidIssuanceRequest = {
  __typename?: "DidIssuanceRequest";
  completedAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  didValue?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  processedAt?: Maybe<Scalars["Datetime"]["output"]>;
  requestedAt?: Maybe<Scalars["Datetime"]["output"]>;
  status: GqlDidIssuanceStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export const GqlDidIssuanceStatus = {
  Completed: "COMPLETED",
  Failed: "FAILED",
  Pending: "PENDING",
  Processing: "PROCESSING",
} as const;

export type GqlDidIssuanceStatus = (typeof GqlDidIssuanceStatus)[keyof typeof GqlDidIssuanceStatus];
export type GqlEdge = {
  cursor: Scalars["String"]["output"];
};

export type GqlError = {
  __typename?: "Error";
  code: GqlErrorCode;
  message: Scalars["String"]["output"];
};

export const GqlErrorCode = {
  AlreadyEvaluated: "ALREADY_EVALUATED",
  AlreadyJoined: "ALREADY_JOINED",
  AlreadyStartedReservation: "ALREADY_STARTED_RESERVATION",
  AlreadyUsedClaimLink: "ALREADY_USED_CLAIM_LINK",
  CannotEvaluateBeforeOpportunityStart: "CANNOT_EVALUATE_BEFORE_OPPORTUNITY_START",
  ClaimLinkExpired: "CLAIM_LINK_EXPIRED",
  ConcurrentRetryDetected: "CONCURRENT_RETRY_DETECTED",
  Forbidden: "FORBIDDEN",
  IncentiveDisabled: "INCENTIVE_DISABLED",
  InsufficientBalance: "INSUFFICIENT_BALANCE",
  InternalServerError: "INTERNAL_SERVER_ERROR",
  InvalidGrantStatus: "INVALID_GRANT_STATUS",
  InvalidTransferMethod: "INVALID_TRANSFER_METHOD",
  MissingWalletInformation: "MISSING_WALLET_INFORMATION",
  NotFound: "NOT_FOUND",
  NoAvailableParticipationSlots: "NO_AVAILABLE_PARTICIPATION_SLOTS",
  PersonalRecordOnlyDeletable: "PERSONAL_RECORD_ONLY_DELETABLE",
  RateLimit: "RATE_LIMIT",
  ReservationAdvanceBookingRequired: "RESERVATION_ADVANCE_BOOKING_REQUIRED",
  ReservationCancellationTimeout: "RESERVATION_CANCELLATION_TIMEOUT",
  ReservationFull: "RESERVATION_FULL",
  ReservationNotAccepted: "RESERVATION_NOT_ACCEPTED",
  SlotNotScheduled: "SLOT_NOT_SCHEDULED",
  TicketParticipantMismatch: "TICKET_PARTICIPANT_MISMATCH",
  Unauthenticated: "UNAUTHENTICATED",
  Unknown: "UNKNOWN",
  UnsupportedGrantType: "UNSUPPORTED_GRANT_TYPE",
  UnsupportedTransactionReason: "UNSUPPORTED_TRANSACTION_REASON",
  ValidationError: "VALIDATION_ERROR",
  VoteTopicNotEditable: "VOTE_TOPIC_NOT_EDITABLE",
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
  vcIssuanceRequest?: Maybe<GqlVcIssuanceRequest>;
};

export type GqlEvaluationBulkCreateInput = {
  evaluations: Array<GqlEvaluationItem>;
};

export type GqlEvaluationBulkCreatePayload = GqlEvaluationBulkCreateSuccess;

export type GqlEvaluationBulkCreateSuccess = {
  __typename?: "EvaluationBulkCreateSuccess";
  evaluations: Array<GqlEvaluation>;
};

export type GqlEvaluationCreateInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  participationId: Scalars["ID"]["input"];
};

export type GqlEvaluationEdge = GqlEdge & {
  __typename?: "EvaluationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlEvaluation>;
};

export type GqlEvaluationFilterInput = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
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

export type GqlEvaluationItem = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  participationId: Scalars["ID"]["input"];
  status: GqlEvaluationStatus;
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

export type GqlGenerateReportInput = {
  communityId: Scalars["ID"]["input"];
  parentRunId?: InputMaybe<Scalars["ID"]["input"]>;
  periodFrom: Scalars["Datetime"]["input"];
  periodTo: Scalars["Datetime"]["input"];
  variant: GqlReportVariant;
};

export type GqlGenerateReportPayload = GqlGenerateReportSuccess;

export type GqlGenerateReportSuccess = {
  __typename?: "GenerateReportSuccess";
  report: GqlReport;
};

export type GqlIdentity = {
  __typename?: "Identity";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  platform?: Maybe<GqlIdentityPlatform>;
  uid: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<GqlUser>;
};

export type GqlIdentityCheckPhoneUserInput = {
  phoneUid: Scalars["String"]["input"];
};

export type GqlIdentityCheckPhoneUserPayload = {
  __typename?: "IdentityCheckPhoneUserPayload";
  membership?: Maybe<GqlMembership>;
  status: GqlPhoneUserStatus;
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
  file?: InputMaybe<Scalars["Upload"]["input"]>;
};

export type GqlIncentiveGrant = {
  __typename?: "IncentiveGrant";
  attemptCount: Scalars["Int"]["output"];
  community?: Maybe<GqlCommunity>;
  createdAt: Scalars["Datetime"]["output"];
  failureCode?: Maybe<GqlIncentiveGrantFailureCode>;
  id: Scalars["ID"]["output"];
  lastAttemptedAt?: Maybe<Scalars["Datetime"]["output"]>;
  lastError?: Maybe<Scalars["String"]["output"]>;
  sourceId: Scalars["String"]["output"];
  status: GqlIncentiveGrantStatus;
  transaction?: Maybe<GqlTransaction>;
  type: GqlIncentiveGrantType;
  updatedAt: Scalars["Datetime"]["output"];
  user?: Maybe<GqlUser>;
};

export type GqlIncentiveGrantEdge = GqlEdge & {
  __typename?: "IncentiveGrantEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlIncentiveGrant>;
};

export const GqlIncentiveGrantFailureCode = {
  DatabaseError: "DATABASE_ERROR",
  InsufficientFunds: "INSUFFICIENT_FUNDS",
  Timeout: "TIMEOUT",
  Unknown: "UNKNOWN",
  WalletNotFound: "WALLET_NOT_FOUND",
} as const;

export type GqlIncentiveGrantFailureCode =
  (typeof GqlIncentiveGrantFailureCode)[keyof typeof GqlIncentiveGrantFailureCode];
export type GqlIncentiveGrantFilterInput = {
  and?: InputMaybe<Array<GqlIncentiveGrantFilterInput>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  not?: InputMaybe<GqlIncentiveGrantFilterInput>;
  or?: InputMaybe<Array<GqlIncentiveGrantFilterInput>>;
  status?: InputMaybe<GqlIncentiveGrantStatus>;
  type?: InputMaybe<GqlIncentiveGrantType>;
  userId?: InputMaybe<Scalars["ID"]["input"]>;
};

export type GqlIncentiveGrantRetryInput = {
  incentiveGrantId: Scalars["ID"]["input"];
};

export type GqlIncentiveGrantRetryPayload = GqlIncentiveGrantRetrySuccess;

export type GqlIncentiveGrantRetrySuccess = {
  __typename?: "IncentiveGrantRetrySuccess";
  incentiveGrant: GqlIncentiveGrant;
  transaction?: Maybe<GqlTransaction>;
};

export type GqlIncentiveGrantSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  updatedAt?: InputMaybe<GqlSortDirection>;
};

export const GqlIncentiveGrantStatus = {
  Completed: "COMPLETED",
  Failed: "FAILED",
  Pending: "PENDING",
  Retrying: "RETRYING",
} as const;

export type GqlIncentiveGrantStatus =
  (typeof GqlIncentiveGrantStatus)[keyof typeof GqlIncentiveGrantStatus];
export const GqlIncentiveGrantType = {
  Signup: "SIGNUP",
} as const;

export type GqlIncentiveGrantType =
  (typeof GqlIncentiveGrantType)[keyof typeof GqlIncentiveGrantType];
export type GqlIncentiveGrantsConnection = {
  __typename?: "IncentiveGrantsConnection";
  edges?: Maybe<Array<Maybe<GqlIncentiveGrantEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export const GqlLanguage = {
  En: "EN",
  Ja: "JA",
} as const;

export type GqlLanguage = (typeof GqlLanguage)[keyof typeof GqlLanguage];
export const GqlLineRichMenuType = {
  Admin: "ADMIN",
  Public: "PUBLIC",
  User: "USER",
} as const;

export type GqlLineRichMenuType = (typeof GqlLineRichMenuType)[keyof typeof GqlLineRichMenuType];
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
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  role?: InputMaybe<Array<GqlRole>>;
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

export type GqlMutation = {
  __typename?: "Mutation";
  approveReport?: Maybe<GqlApproveReportPayload>;
  articleCreate?: Maybe<GqlArticleCreatePayload>;
  articleDelete?: Maybe<GqlArticleDeletePayload>;
  articleUpdateContent?: Maybe<GqlArticleUpdateContentPayload>;
  communityCreate?: Maybe<GqlCommunityCreatePayload>;
  communityDelete?: Maybe<GqlCommunityDeletePayload>;
  communityUpdateProfile?: Maybe<GqlCommunityUpdateProfilePayload>;
  evaluationBulkCreate?: Maybe<GqlEvaluationBulkCreatePayload>;
  generateReport?: Maybe<GqlGenerateReportPayload>;
  identityCheckPhoneUser: GqlIdentityCheckPhoneUserPayload;
  incentiveGrantRetry?: Maybe<GqlIncentiveGrantRetryPayload>;
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
  opportunitySlotCreate?: Maybe<GqlOpportunitySlotCreatePayload>;
  opportunitySlotSetHostingStatus?: Maybe<GqlOpportunitySlotSetHostingStatusPayload>;
  opportunitySlotsBulkUpdate?: Maybe<GqlOpportunitySlotsBulkUpdatePayload>;
  opportunityUpdateContent?: Maybe<GqlOpportunityUpdateContentPayload>;
  participationBulkCreate?: Maybe<GqlParticipationBulkCreatePayload>;
  participationCreatePersonalRecord?: Maybe<GqlParticipationCreatePersonalRecordPayload>;
  participationDeletePersonalRecord?: Maybe<GqlParticipationDeletePayload>;
  placeCreate?: Maybe<GqlPlaceCreatePayload>;
  placeDelete?: Maybe<GqlPlaceDeletePayload>;
  placeUpdate?: Maybe<GqlPlaceUpdatePayload>;
  publishReport?: Maybe<GqlPublishReportPayload>;
  rejectReport?: Maybe<GqlRejectReportPayload>;
  reservationAccept?: Maybe<GqlReservationSetStatusPayload>;
  reservationCancel?: Maybe<GqlReservationSetStatusPayload>;
  reservationCreate?: Maybe<GqlReservationCreatePayload>;
  reservationJoin?: Maybe<GqlReservationSetStatusPayload>;
  reservationReject?: Maybe<GqlReservationSetStatusPayload>;
  storePhoneAuthToken?: Maybe<GqlStorePhoneAuthTokenPayload>;
  submitReportFeedback?: Maybe<GqlSubmitReportFeedbackPayload>;
  ticketClaim?: Maybe<GqlTicketClaimPayload>;
  ticketIssue?: Maybe<GqlTicketIssuePayload>;
  ticketPurchase?: Maybe<GqlTicketPurchasePayload>;
  ticketRefund?: Maybe<GqlTicketRefundPayload>;
  ticketUse?: Maybe<GqlTicketUsePayload>;
  transactionDonateSelfPoint?: Maybe<GqlTransactionDonateSelfPointPayload>;
  transactionGrantCommunityPoint?: Maybe<GqlTransactionGrantCommunityPointPayload>;
  transactionIssueCommunityPoint?: Maybe<GqlTransactionIssueCommunityPointPayload>;
  transactionUpdateMetadata?: Maybe<GqlTransactionUpdateMetadataPayload>;
  updatePortalConfig: GqlCommunityPortalConfig;
  updateReportTemplate?: Maybe<GqlUpdateReportTemplatePayload>;
  updateSignupBonusConfig: GqlCommunitySignupBonusConfig;
  userDeleteMe?: Maybe<GqlUserDeletePayload>;
  userSignUp?: Maybe<GqlCurrentUserPayload>;
  userUpdateMyProfile?: Maybe<GqlUserUpdateProfilePayload>;
  utilityCreate?: Maybe<GqlUtilityCreatePayload>;
  utilityDelete?: Maybe<GqlUtilityDeletePayload>;
  utilitySetPublishStatus?: Maybe<GqlUtilitySetPublishStatusPayload>;
  utilityUpdateInfo?: Maybe<GqlUtilityUpdateInfoPayload>;
  /**
   * ユーザー: 投票実行。
   * 同一 topicId への再投票は **upsert で上書き** される（投票履歴は残らない）。
   * 投票の取消（withdraw）は現時点で未サポート。
   * eligibility と power は呼び出しごとに再チェックされ、NFT_COUNT の場合は呼び出し時点の保有数が新しい power として記録される。
   */
  voteCast: GqlVoteCastPayload;
  /**
   * 管理者: 投票テーマ・ゲート・ポリシー・選択肢を 1 トランザクションで一括作成。
   * Gate.type=NFT かつ PowerPolicy.type=NFT_COUNT の場合、両者の nftTokenId は
   * 一致していなければならない（バックエンドで検証、違反時は `VALIDATION_ERROR`）。
   * 詳細は VoteGate 型の説明を参照。
   */
  voteTopicCreate: GqlVoteTopicCreatePayload;
  /**
   * 管理者: 投票テーマ削除。UPCOMING フェーズ（投票開始前）のみ許可。
   * OPEN / CLOSED フェーズでは `VOTE_TOPIC_NOT_EDITABLE` エラーが返る。
   * gate / powerPolicy / options は onDelete: Cascade で自動削除される（UPCOMING 限定なので ballots は存在しない）。
   */
  voteTopicDelete: GqlVoteTopicDeletePayload;
  /**
   * 管理者: 投票テーマを更新する。UPCOMING フェーズ（投票開始前）のみ許可。
   * OPEN / CLOSED フェーズでは `VOTE_TOPIC_NOT_EDITABLE` エラーが返る。
   * options は全量置換される（UPCOMING なので投票0件が保証されており安全）。
   * gate / powerPolicy も同時に再設定可能。
   */
  voteTopicUpdate: GqlVoteTopicUpdatePayload;
};

export type GqlMutationApproveReportArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlMutationArticleCreateArgs = {
  input: GqlArticleCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationArticleDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationArticleUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: GqlArticleUpdateContentInput;
  permission: GqlCheckCommunityPermissionInput;
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

export type GqlMutationEvaluationBulkCreateArgs = {
  input: GqlEvaluationBulkCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationGenerateReportArgs = {
  input: GqlGenerateReportInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationIdentityCheckPhoneUserArgs = {
  input: GqlIdentityCheckPhoneUserInput;
};

export type GqlMutationIncentiveGrantRetryArgs = {
  input: GqlIncentiveGrantRetryInput;
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
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationOpportunitySetPublishStatusArgs = {
  id: Scalars["ID"]["input"];
  input: GqlOpportunitySetPublishStatusInput;
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationOpportunitySlotCreateArgs = {
  input: GqlOpportunitySlotCreateInput;
  opportunityId: Scalars["ID"]["input"];
  permission: GqlCheckOpportunityPermissionInput;
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
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationParticipationBulkCreateArgs = {
  input: GqlParticipationBulkCreateInput;
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

export type GqlMutationPublishReportArgs = {
  finalContent: Scalars["String"]["input"];
  id: Scalars["ID"]["input"];
};

export type GqlMutationRejectReportArgs = {
  id: Scalars["ID"]["input"];
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
  input: GqlReservationRejectInput;
  permission: GqlCheckOpportunityPermissionInput;
};

export type GqlMutationStorePhoneAuthTokenArgs = {
  input: GqlStorePhoneAuthTokenInput;
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationSubmitReportFeedbackArgs = {
  input: GqlSubmitReportFeedbackInput;
  permission: GqlCheckCommunityPermissionInput;
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
  permission: GqlCheckIsSelfPermissionInput;
};

export type GqlMutationTransactionGrantCommunityPointArgs = {
  input: GqlTransactionGrantCommunityPointInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationTransactionIssueCommunityPointArgs = {
  input: GqlTransactionIssueCommunityPointInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationTransactionUpdateMetadataArgs = {
  communityPermission?: InputMaybe<GqlCheckCommunityPermissionInput>;
  id: Scalars["ID"]["input"];
  input: GqlTransactionUpdateMetadataInput;
  permission?: InputMaybe<GqlCheckIsSelfPermissionInput>;
};

export type GqlMutationUpdatePortalConfigArgs = {
  input: GqlCommunityPortalConfigInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationUpdateReportTemplateArgs = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  input: GqlUpdateReportTemplateInput;
  variant: GqlReportVariant;
};

export type GqlMutationUpdateSignupBonusConfigArgs = {
  input: GqlUpdateSignupBonusConfigInput;
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

export type GqlMutationVoteCastArgs = {
  input: GqlVoteCastInput;
};

export type GqlMutationVoteTopicCreateArgs = {
  input: GqlVoteTopicCreateInput;
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationVoteTopicDeleteArgs = {
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
};

export type GqlMutationVoteTopicUpdateArgs = {
  id: Scalars["ID"]["input"];
  input: GqlVoteTopicUpdateInput;
  permission: GqlCheckCommunityPermissionInput;
};

/** ログインユーザーの投票資格と現状。再投票可能性の判定にも利用する。 */
export type GqlMyVoteEligibility = {
  __typename?: "MyVoteEligibility";
  /**
   * **リクエスト時点**で計算される power。
   * VoteBallot.power（投票時スナップショット）とは別物で、NFT_COUNT ポリシー下では乖離しうる。
   */
  currentPower?: Maybe<Scalars["Int"]["output"]>;
  /**
   * 投票可能か。**投票済みでも再投票可能なら true** を返す
   * （期間内 & ゲート通過なら常に true。投票済みフラグは myBallot の有無で判定）。
   */
  eligible: Scalars["Boolean"]["output"];
  /** ログインユーザーの投票（VoteTopic.myBallot と同じ値）。 */
  myBallot?: Maybe<GqlVoteBallot>;
  /**
   * eligible=false 時の理由コード。次のいずれか:
   * GATE_NOT_CONFIGURED / GATE_NFT_TOKEN_NOT_CONFIGURED / REQUIRED_NFT_NOT_FOUND /
   * NOT_A_MEMBER / INSUFFICIENT_ROLE / UNKNOWN_GATE_TYPE
   */
  reason?: Maybe<Scalars["String"]["output"]>;
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

export type GqlNftInstance = {
  __typename?: "NftInstance";
  community?: Maybe<GqlCommunity>;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  imageUrl?: Maybe<Scalars["String"]["output"]>;
  instanceId: Scalars["String"]["output"];
  json?: Maybe<Scalars["JSON"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  nftToken?: Maybe<GqlNftToken>;
  nftWallet?: Maybe<GqlNftWallet>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlNftInstanceEdge = GqlEdge & {
  __typename?: "NftInstanceEdge";
  cursor: Scalars["String"]["output"];
  node: GqlNftInstance;
};

export type GqlNftInstanceFilterInput = {
  and?: InputMaybe<Array<GqlNftInstanceFilterInput>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  hasDescription?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasImage?: InputMaybe<Scalars["Boolean"]["input"]>;
  hasName?: InputMaybe<Scalars["Boolean"]["input"]>;
  nftTokenAddress?: InputMaybe<Array<Scalars["String"]["input"]>>;
  nftTokenType?: InputMaybe<Array<Scalars["String"]["input"]>>;
  nftWalletId?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  not?: InputMaybe<GqlNftInstanceFilterInput>;
  or?: InputMaybe<Array<GqlNftInstanceFilterInput>>;
  userId?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlNftInstanceSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  instanceId?: InputMaybe<GqlSortDirection>;
  name?: InputMaybe<GqlSortDirection>;
};

export type GqlNftInstancesConnection = {
  __typename?: "NftInstancesConnection";
  edges: Array<GqlNftInstanceEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlNftToken = {
  __typename?: "NftToken";
  address: Scalars["String"]["output"];
  /**
   * トークンを所有するコミュニティ。複数コミュニティで共用する場合や運用都合で未設定の場合は null。
   * portal 側の「このコミュニティに属する NftToken」一覧取得で参照される。
   */
  community?: Maybe<GqlCommunity>;
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  json?: Maybe<Scalars["JSON"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  symbol?: Maybe<Scalars["String"]["output"]>;
  type: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlNftTokenEdge = GqlEdge & {
  __typename?: "NftTokenEdge";
  cursor: Scalars["String"]["output"];
  node: GqlNftToken;
};

export type GqlNftTokenFilterInput = {
  address?: InputMaybe<Array<Scalars["String"]["input"]>>;
  and?: InputMaybe<Array<GqlNftTokenFilterInput>>;
  /**
   * 指定したコミュニティに直接紐付く NftToken に絞る（NftToken.community_id を直接参照）。
   * NftToken.communityId が NULL のトークンは除外される。
   */
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  not?: InputMaybe<GqlNftTokenFilterInput>;
  or?: InputMaybe<Array<GqlNftTokenFilterInput>>;
  type?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type GqlNftTokenSortInput = {
  address?: InputMaybe<GqlSortDirection>;
  createdAt?: InputMaybe<GqlSortDirection>;
  name?: InputMaybe<GqlSortDirection>;
};

export type GqlNftTokensConnection = {
  __typename?: "NftTokensConnection";
  edges: Array<GqlNftTokenEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlNftWallet = {
  __typename?: "NftWallet";
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  id: Scalars["ID"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user: GqlUser;
  walletAddress: Scalars["String"]["output"];
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
  pointsRequired?: Maybe<Scalars["Int"]["output"]>;
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
  category: GqlOpportunityCategory;
  createdBy?: InputMaybe<Scalars["ID"]["input"]>;
  description: Scalars["String"]["input"];
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  placeId?: InputMaybe<Scalars["ID"]["input"]>;
  pointsRequired?: InputMaybe<Scalars["Int"]["input"]>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: GqlPublishStatus;
  relatedArticleIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  requireApproval: Scalars["Boolean"]["input"];
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  slots?: InputMaybe<Array<GqlOpportunitySlotCreateInput>>;
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
  isReservableWithPoint?: InputMaybe<Scalars["Boolean"]["input"]>;
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
  isFullyEvaluated?: Maybe<Scalars["Boolean"]["output"]>;
  numEvaluated?: Maybe<Scalars["Int"]["output"]>;
  numParticipants?: Maybe<Scalars["Int"]["output"]>;
  opportunity?: Maybe<GqlOpportunity>;
  remainingCapacity?: Maybe<Scalars["Int"]["output"]>;
  reservations?: Maybe<Array<GqlReservation>>;
  startsAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  vcIssuanceRequests?: Maybe<Array<GqlVcIssuanceRequest>>;
};

export type GqlOpportunitySlotCreateInput = {
  capacity: Scalars["Int"]["input"];
  endsAt: Scalars["Datetime"]["input"];
  startsAt: Scalars["Datetime"]["input"];
};

export type GqlOpportunitySlotCreatePayload = GqlOpportunitySlotCreateSuccess;

export type GqlOpportunitySlotCreateSuccess = {
  __typename?: "OpportunitySlotCreateSuccess";
  slot: GqlOpportunitySlot;
};

export type GqlOpportunitySlotEdge = GqlEdge & {
  __typename?: "OpportunitySlotEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlOpportunitySlot>;
};

export type GqlOpportunitySlotFilterInput = {
  dateRange?: InputMaybe<GqlDateTimeRangeFilter>;
  hostingStatus?: InputMaybe<Array<GqlOpportunitySlotHostingStatus>>;
  opportunityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
};

export const GqlOpportunitySlotHostingStatus = {
  Cancelled: "CANCELLED",
  Completed: "COMPLETED",
  Scheduled: "SCHEDULED",
} as const;

export type GqlOpportunitySlotHostingStatus =
  (typeof GqlOpportunitySlotHostingStatus)[keyof typeof GqlOpportunitySlotHostingStatus];
export type GqlOpportunitySlotSetHostingStatusInput = {
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
  comment?: InputMaybe<Scalars["String"]["input"]>;
  createdBy?: InputMaybe<Scalars["ID"]["input"]>;
  endsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  startsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
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
  capacity?: InputMaybe<Scalars["Int"]["input"]>;
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
  category: GqlOpportunityCategory;
  createdBy?: InputMaybe<Scalars["ID"]["input"]>;
  description: Scalars["String"]["input"];
  feeRequired?: InputMaybe<Scalars["Int"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  placeId?: InputMaybe<Scalars["ID"]["input"]>;
  pointsRequired?: InputMaybe<Scalars["Int"]["input"]>;
  pointsToEarn?: InputMaybe<Scalars["Int"]["input"]>;
  publishStatus: GqlPublishStatus;
  relatedArticleIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  requireApproval: Scalars["Boolean"]["input"];
  requiredUtilityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
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
  opportunitySlot?: Maybe<GqlOpportunitySlot>;
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

export type GqlParticipationBulkCreateInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  slotId: Scalars["ID"]["input"];
  userIds: Array<Scalars["ID"]["input"]>;
};

export type GqlParticipationBulkCreatePayload = GqlParticipationBulkCreateSuccess;

export type GqlParticipationBulkCreateSuccess = {
  __typename?: "ParticipationBulkCreateSuccess";
  participations: Array<GqlParticipation>;
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

export const GqlPhoneUserStatus = {
  ExistingDifferentCommunity: "EXISTING_DIFFERENT_COMMUNITY",
  ExistingSameCommunity: "EXISTING_SAME_COMMUNITY",
  NewUser: "NEW_USER",
} as const;

export type GqlPhoneUserStatus = (typeof GqlPhoneUserStatus)[keyof typeof GqlPhoneUserStatus];
export type GqlPlace = {
  __typename?: "Place";
  accumulatedParticipants?: Maybe<Scalars["Int"]["output"]>;
  address: Scalars["String"]["output"];
  city?: Maybe<GqlCity>;
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  currentPublicOpportunityCount?: Maybe<Scalars["Int"]["output"]>;
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
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
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
  evaluationStatus?: Maybe<GqlEvaluationStatus>;
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
export type GqlPortfolioEdge = GqlEdge & {
  __typename?: "PortfolioEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlPortfolio>;
};

export type GqlPortfolioFilterInput = {
  communityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  dateRange?: InputMaybe<GqlDateTimeRangeFilter>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlPortfolioSortInput = {
  date?: InputMaybe<GqlSortDirection>;
};

export const GqlPortfolioSource = {
  Article: "ARTICLE",
  Opportunity: "OPPORTUNITY",
} as const;

export type GqlPortfolioSource = (typeof GqlPortfolioSource)[keyof typeof GqlPortfolioSource];
export type GqlPortfoliosConnection = {
  __typename?: "PortfoliosConnection";
  edges: Array<GqlPortfolioEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlPublishReportPayload = GqlPublishReportSuccess;

export type GqlPublishReportSuccess = {
  __typename?: "PublishReportSuccess";
  report: GqlReport;
};

export const GqlPublishStatus = {
  CommunityInternal: "COMMUNITY_INTERNAL",
  Private: "PRIVATE",
  Public: "PUBLIC",
} as const;

export type GqlPublishStatus = (typeof GqlPublishStatus)[keyof typeof GqlPublishStatus];
export type GqlQuery = {
  __typename?: "Query";
  adminBrowseReports: GqlReportsConnection;
  adminReportSummary: GqlAdminReportSummaryConnection;
  adminTemplateFeedbackStats: GqlAdminTemplateFeedbackStats;
  adminTemplateFeedbacks: GqlReportFeedbacksConnection;
  article?: Maybe<GqlArticle>;
  articles: GqlArticlesConnection;
  cities: GqlCitiesConnection;
  communities: GqlCommunitiesConnection;
  community?: Maybe<GqlCommunity>;
  communityPortalConfig?: Maybe<GqlCommunityPortalConfig>;
  currentUser?: Maybe<GqlCurrentUserPayload>;
  echo: Scalars["String"]["output"];
  evaluation?: Maybe<GqlEvaluation>;
  evaluationHistories: GqlEvaluationHistoriesConnection;
  evaluationHistory?: Maybe<GqlEvaluationHistory>;
  evaluations: GqlEvaluationsConnection;
  incentiveGrant?: Maybe<GqlIncentiveGrant>;
  incentiveGrants: GqlIncentiveGrantsConnection;
  membership?: Maybe<GqlMembership>;
  memberships: GqlMembershipsConnection;
  /**
   * ログインユーザーの投票資格確認。
   * 投票画面（単一トピックにフォーカス）で利用する想定。
   * 一覧画面では各ノードの VoteTopic.myEligibility を使う方が効率的。
   */
  myVoteEligibility: GqlMyVoteEligibility;
  myWallet?: Maybe<GqlWallet>;
  nftInstance?: Maybe<GqlNftInstance>;
  nftInstances: GqlNftInstancesConnection;
  nftToken?: Maybe<GqlNftToken>;
  nftTokens: GqlNftTokensConnection;
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
  portfolios?: Maybe<Array<GqlPortfolio>>;
  report?: Maybe<GqlReport>;
  reportTemplate?: Maybe<GqlReportTemplate>;
  reportTemplateStats: GqlReportTemplateStats;
  reportTemplateStatsBreakdown: GqlReportTemplateStatsBreakdownConnection;
  reportTemplates: Array<GqlReportTemplate>;
  reports: GqlReportsConnection;
  reservation?: Maybe<GqlReservation>;
  reservationHistories: GqlReservationHistoriesConnection;
  reservationHistory?: Maybe<GqlReservationHistory>;
  reservations: GqlReservationsConnection;
  signupBonusConfig?: Maybe<GqlCommunitySignupBonusConfig>;
  states: GqlStatesConnection;
  /**
   * L2 detail for a single community: summary card, stage distribution,
   * trailing-window trends, cohort retention, and a paginated member list.
   * Intended for answering "what are kibotcha's numbers?" in an external
   * report conversation.
   */
  sysAdminCommunityDetail: GqlSysAdminCommunityDetailPayload;
  /**
   * L1 overview: platform totals plus one row per community. Intended for
   * the "is any community stalling?" scan. Community fan-out is served
   * with N in-process calls (acceptable at today's community count —
   * switch to a GROUP BY implementation once the platform exceeds ~20
   * communities).
   */
  sysAdminDashboard: GqlSysAdminDashboardPayload;
  ticket?: Maybe<GqlTicket>;
  ticketClaimLink?: Maybe<GqlTicketClaimLink>;
  ticketClaimLinks: GqlTicketClaimLinksConnection;
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
  vcIssuanceRequest?: Maybe<GqlVcIssuanceRequest>;
  vcIssuanceRequests: GqlVcIssuanceRequestsConnection;
  /**
   * Verify transactions against the Cardano blockchain.
   * - Retrieves Merkle proofs for specified transactions
   * - Recalculates root hash using proofs
   * - Compares with Cardano blockchain metadata
   * - Returns data integrity verification results
   */
  verifyTransactions?: Maybe<Array<GqlTransactionVerificationResult>>;
  /** 投票テーマ詳細（myBallot / myEligibility はフィールドリゾルバー経由で解決）。 */
  voteTopic?: Maybe<GqlVoteTopic>;
  /**
   * コミュニティの投票テーマ一覧（カーソルページネーション）。
   * 各ノードの myBallot / myEligibility は DataLoader 経由で解決され、N+1 は発生しない。
   */
  voteTopics: GqlVoteTopicsConnection;
  wallet?: Maybe<GqlWallet>;
  wallets: GqlWalletsConnection;
};

export type GqlQueryAdminBrowseReportsArgs = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  publishedAfter?: InputMaybe<Scalars["Datetime"]["input"]>;
  publishedBefore?: InputMaybe<Scalars["Datetime"]["input"]>;
  status?: InputMaybe<GqlReportStatus>;
  variant?: InputMaybe<GqlReportVariant>;
};

export type GqlQueryAdminReportSummaryArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GqlQueryAdminTemplateFeedbackStatsArgs = {
  kind?: InputMaybe<GqlReportTemplateKind>;
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GqlQueryAdminTemplateFeedbacksArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  feedbackType?: InputMaybe<GqlReportFeedbackType>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  kind?: InputMaybe<GqlReportTemplateKind>;
  maxRating?: InputMaybe<Scalars["Int"]["input"]>;
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
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
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlCitiesInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlCitiesSortInput>;
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

export type GqlQueryCommunityPortalConfigArgs = {
  communityId: Scalars["String"]["input"];
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

export type GqlQueryIncentiveGrantArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryIncentiveGrantsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlIncentiveGrantFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlIncentiveGrantSortInput>;
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

export type GqlQueryMyVoteEligibilityArgs = {
  topicId: Scalars["ID"]["input"];
};

export type GqlQueryNftInstanceArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryNftInstancesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlNftInstanceFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlNftInstanceSortInput>;
};

export type GqlQueryNftTokenArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryNftTokensArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlNftTokenFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlNftTokenSortInput>;
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

export type GqlQueryPortfoliosArgs = {
  filter?: InputMaybe<GqlPortfolioFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlPortfolioSortInput>;
};

export type GqlQueryReportArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryReportTemplateArgs = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  variant: GqlReportVariant;
};

export type GqlQueryReportTemplateStatsArgs = {
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GqlQueryReportTemplateStatsBreakdownArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  includeInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  kind?: InputMaybe<GqlReportTemplateKind>;
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GqlQueryReportTemplatesArgs = {
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  includeInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  kind?: InputMaybe<GqlReportTemplateKind>;
  variant: GqlReportVariant;
};

export type GqlQueryReportsArgs = {
  communityId: Scalars["ID"]["input"];
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  permission: GqlCheckCommunityPermissionInput;
  status?: InputMaybe<GqlReportStatus>;
  variant?: InputMaybe<GqlReportVariant>;
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

export type GqlQuerySignupBonusConfigArgs = {
  communityId: Scalars["ID"]["input"];
};

export type GqlQueryStatesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlStatesInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GqlQuerySysAdminCommunityDetailArgs = {
  input: GqlSysAdminCommunityDetailInput;
};

export type GqlQuerySysAdminDashboardArgs = {
  input?: InputMaybe<GqlSysAdminDashboardInput>;
};

export type GqlQueryTicketArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryTicketClaimLinkArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryTicketClaimLinksArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlTicketClaimLinkFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlTicketClaimLinkSortInput>;
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

export type GqlQueryVcIssuanceRequestArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryVcIssuanceRequestsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlVcIssuanceRequestFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlVcIssuanceRequestSortInput>;
};

export type GqlQueryVerifyTransactionsArgs = {
  txIds: Array<Scalars["ID"]["input"]>;
};

export type GqlQueryVoteTopicArgs = {
  id: Scalars["ID"]["input"];
};

export type GqlQueryVoteTopicsArgs = {
  communityId: Scalars["ID"]["input"];
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
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

export type GqlRejectReportPayload = GqlRejectReportSuccess;

export type GqlRejectReportSuccess = {
  __typename?: "RejectReportSuccess";
  report: GqlReport;
};

export type GqlReport = {
  __typename?: "Report";
  cacheReadTokens?: Maybe<Scalars["Int"]["output"]>;
  community: GqlCommunity;
  createdAt: Scalars["Datetime"]["output"];
  feedbacks: GqlReportFeedbacksConnection;
  finalContent?: Maybe<Scalars["String"]["output"]>;
  generatedByUser?: Maybe<GqlUser>;
  id: Scalars["ID"]["output"];
  inputTokens?: Maybe<Scalars["Int"]["output"]>;
  model?: Maybe<Scalars["String"]["output"]>;
  myFeedback?: Maybe<GqlReportFeedback>;
  outputMarkdown?: Maybe<Scalars["String"]["output"]>;
  outputTokens?: Maybe<Scalars["Int"]["output"]>;
  parentRun?: Maybe<GqlReport>;
  periodFrom: Scalars["Datetime"]["output"];
  periodTo: Scalars["Datetime"]["output"];
  publishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  publishedByUser?: Maybe<GqlUser>;
  regenerateCount: Scalars["Int"]["output"];
  regenerations: Array<GqlReport>;
  skipReason?: Maybe<Scalars["String"]["output"]>;
  status: GqlReportStatus;
  targetUser?: Maybe<GqlUser>;
  template?: Maybe<GqlReportTemplate>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  variant: GqlReportVariant;
};

export type GqlReportFeedbacksArgs = {
  after?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
};

export type GqlReportEdge = GqlEdge & {
  __typename?: "ReportEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlReport>;
};

export type GqlReportFeedback = {
  __typename?: "ReportFeedback";
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  feedbackType?: Maybe<GqlReportFeedbackType>;
  id: Scalars["ID"]["output"];
  rating: Scalars["Int"]["output"];
  report: GqlReport;
  reportId: Scalars["ID"]["output"];
  sectionKey?: Maybe<Scalars["String"]["output"]>;
  user: GqlUser;
};

export type GqlReportFeedbackEdge = GqlEdge & {
  __typename?: "ReportFeedbackEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlReportFeedback>;
};

export type GqlReportFeedbackRatingBucket = {
  __typename?: "ReportFeedbackRatingBucket";
  count: Scalars["Int"]["output"];
  rating: Scalars["Int"]["output"];
};

export const GqlReportFeedbackType = {
  Accuracy: "ACCURACY",
  Other: "OTHER",
  Quality: "QUALITY",
  Structure: "STRUCTURE",
  Tone: "TONE",
} as const;

export type GqlReportFeedbackType =
  (typeof GqlReportFeedbackType)[keyof typeof GqlReportFeedbackType];
export type GqlReportFeedbacksConnection = {
  __typename?: "ReportFeedbacksConnection";
  edges?: Maybe<Array<Maybe<GqlReportFeedbackEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export const GqlReportStatus = {
  Approved: "APPROVED",
  Draft: "DRAFT",
  Published: "PUBLISHED",
  Rejected: "REJECTED",
  Skipped: "SKIPPED",
  Superseded: "SUPERSEDED",
} as const;

export type GqlReportStatus = (typeof GqlReportStatus)[keyof typeof GqlReportStatus];
export type GqlReportTemplate = {
  __typename?: "ReportTemplate";
  community?: Maybe<GqlCommunity>;
  communityContext?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  experimentKey?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  isActive: Scalars["Boolean"]["output"];
  isEnabled: Scalars["Boolean"]["output"];
  kind: GqlReportTemplateKind;
  maxTokens: Scalars["Int"]["output"];
  model: Scalars["String"]["output"];
  scope: GqlReportTemplateScope;
  stopSequences: Array<Scalars["String"]["output"]>;
  systemPrompt: Scalars["String"]["output"];
  temperature?: Maybe<Scalars["Float"]["output"]>;
  trafficWeight: Scalars["Int"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  updatedByUser?: Maybe<GqlUser>;
  userPromptTemplate: Scalars["String"]["output"];
  variant: GqlReportVariant;
  version: Scalars["Int"]["output"];
};

export const GqlReportTemplateKind = {
  Generation: "GENERATION",
  Judge: "JUDGE",
} as const;

export type GqlReportTemplateKind =
  (typeof GqlReportTemplateKind)[keyof typeof GqlReportTemplateKind];
export const GqlReportTemplateScope = {
  Community: "COMMUNITY",
  System: "SYSTEM",
} as const;

export type GqlReportTemplateScope =
  (typeof GqlReportTemplateScope)[keyof typeof GqlReportTemplateScope];
export type GqlReportTemplateStats = {
  __typename?: "ReportTemplateStats";
  avgJudgeScore?: Maybe<Scalars["Float"]["output"]>;
  avgRating?: Maybe<Scalars["Float"]["output"]>;
  correlationWarning: Scalars["Boolean"]["output"];
  feedbackCount: Scalars["Int"]["output"];
  judgeHumanCorrelation?: Maybe<Scalars["Float"]["output"]>;
  variant: GqlReportVariant;
  version?: Maybe<Scalars["Int"]["output"]>;
};

export type GqlReportTemplateStatsBreakdownConnection = {
  __typename?: "ReportTemplateStatsBreakdownConnection";
  edges?: Maybe<Array<Maybe<GqlReportTemplateStatsBreakdownEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlReportTemplateStatsBreakdownEdge = GqlEdge & {
  __typename?: "ReportTemplateStatsBreakdownEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlReportTemplateStatsBreakdownRow>;
};

export type GqlReportTemplateStatsBreakdownRow = {
  __typename?: "ReportTemplateStatsBreakdownRow";
  avgJudgeScore?: Maybe<Scalars["Float"]["output"]>;
  avgRating?: Maybe<Scalars["Float"]["output"]>;
  correlationWarning: Scalars["Boolean"]["output"];
  experimentKey?: Maybe<Scalars["String"]["output"]>;
  feedbackCount: Scalars["Int"]["output"];
  isActive: Scalars["Boolean"]["output"];
  isEnabled: Scalars["Boolean"]["output"];
  judgeHumanCorrelation?: Maybe<Scalars["Float"]["output"]>;
  kind: GqlReportTemplateKind;
  scope: GqlReportTemplateScope;
  templateId: Scalars["ID"]["output"];
  trafficWeight: Scalars["Int"]["output"];
  version: Scalars["Int"]["output"];
};

export const GqlReportVariant = {
  GrantApplication: "GRANT_APPLICATION",
  MediaPr: "MEDIA_PR",
  MemberNewsletter: "MEMBER_NEWSLETTER",
  PersonalRecap: "PERSONAL_RECAP",
  WeeklySummary: "WEEKLY_SUMMARY",
} as const;

export type GqlReportVariant = (typeof GqlReportVariant)[keyof typeof GqlReportVariant];
export type GqlReportsConnection = {
  __typename?: "ReportsConnection";
  edges?: Maybe<Array<Maybe<GqlReportEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlReservation = {
  __typename?: "Reservation";
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  histories?: Maybe<Array<GqlReservationHistory>>;
  id: Scalars["ID"]["output"];
  opportunitySlot?: Maybe<GqlOpportunitySlot>;
  participantCountWithPoint?: Maybe<Scalars["Int"]["output"]>;
  participations?: Maybe<Array<GqlParticipation>>;
  status: GqlReservationStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlReservationCancelInput = {
  paymentMethod: GqlReservationPaymentMethod;
  ticketIdsIfExists?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlReservationCreateInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  opportunitySlotId: Scalars["ID"]["input"];
  otherUserIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  participantCountWithPoint?: InputMaybe<Scalars["Int"]["input"]>;
  paymentMethod: GqlReservationPaymentMethod;
  ticketIdsIfNeed?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  totalParticipantCount: Scalars["Int"]["input"];
};

export type GqlReservationCreatePayload = GqlReservationCreateSuccess;

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
  and?: InputMaybe<Array<GqlReservationFilterInput>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  createdByUserId?: InputMaybe<Scalars["ID"]["input"]>;
  evaluationStatus?: InputMaybe<GqlEvaluationStatus>;
  hostingStatus?: InputMaybe<Array<GqlOpportunitySlotHostingStatus>>;
  not?: InputMaybe<Array<GqlReservationFilterInput>>;
  opportunityId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunityOwnerId?: InputMaybe<Scalars["ID"]["input"]>;
  opportunitySlotId?: InputMaybe<Scalars["ID"]["input"]>;
  or?: InputMaybe<Array<GqlReservationFilterInput>>;
  participationStatus?: InputMaybe<Array<GqlParticipationStatus>>;
  reservationStatus?: InputMaybe<Array<GqlReservationStatus>>;
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

export const GqlReservationPaymentMethod = {
  Fee: "FEE",
  Ticket: "TICKET",
} as const;

export type GqlReservationPaymentMethod =
  (typeof GqlReservationPaymentMethod)[keyof typeof GqlReservationPaymentMethod];
export type GqlReservationRejectInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlReservationSetStatusPayload = GqlReservationSetStatusSuccess;

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

export type GqlStateEdge = GqlEdge & {
  __typename?: "StateEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlState>;
};

export type GqlStatesConnection = {
  __typename?: "StatesConnection";
  edges: Array<GqlStateEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlStatesInput = {
  name?: InputMaybe<Scalars["String"]["input"]>;
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

export type GqlSubmitReportFeedbackInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  feedbackType?: InputMaybe<GqlReportFeedbackType>;
  rating: Scalars["Int"]["input"];
  reportId: Scalars["ID"]["input"];
  sectionKey?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlSubmitReportFeedbackPayload = GqlSubmitReportFeedbackSuccess;

export type GqlSubmitReportFeedbackSuccess = {
  __typename?: "SubmitReportFeedbackSuccess";
  feedback: GqlReportFeedback;
};

/**
 * One bucket of the all-time DONATION chain-depth histogram. See
 * `SysAdminCommunityDetailPayload.chainDepthDistribution`.
 */
export type GqlSysAdminChainDepthBucket = {
  __typename?: "SysAdminChainDepthBucket";
  /**
   * Number of all-time DONATION transactions whose `chain_depth`
   * falls into this bucket. Always non-negative.
   */
  count: Scalars["Int"]["output"];
  /**
   * Chain-depth bucket key. Range 1..5; the 5 bucket aggregates
   * `chain_depth >= 5`. See `SysAdminCommunitySummaryCard
   * .maxChainDepthAllTime` for the underlying semantic.
   */
  depth: Scalars["Int"]["output"];
};

/**
 * One cohort's funnel progression. See
 * `SysAdminCommunityDetailPayload.cohortFunnel` for the stage
 * semantics and the JOINED-at-asOf scoping rule.
 */
export type GqlSysAdminCohortFunnelPoint = {
  __typename?: "SysAdminCohortFunnelPoint";
  /**
   * Cohort size: number of JOINED memberships whose `created_at`
   * falls within this cohort month. The funnel's entry stage —
   * the denominator the client divides downstream stages by to
   * derive percentages.
   */
  acquired: Scalars["Int"]["output"];
  /**
   * Of the cohort, members who sent at least one DONATION within
   * 30 days of their join (per-member, measured from each
   * individual's `created_at` rather than a calendar-clamped
   * window). The "first-30-day activation" funnel stage.
   */
  activatedD30: Scalars["Int"]["output"];
  /**
   * JST first day of the cohort's entry month, e.g.
   * 2025-10-01T00:00+09:00. UTC-encoded at JST midnight, same
   * convention as `SysAdminMonthlyActivityPoint.month` and
   * `SysAdminCohortRetentionPoint.cohortMonth`.
   */
  cohortMonth: Scalars["Datetime"]["output"];
  /**
   * Of the cohort, members currently in the habitual segment
   * (`userSendRate >= segmentThresholds.tier1` AND tenure floor).
   * THRESHOLD-DEPENDENT — see the parent field's doc.
   */
  habitual: Scalars["Int"]["output"];
  /**
   * Of the cohort, members who sent DONATION in >= 2 distinct JST
   * months as of asOf. The "came back at least once" stage.
   * Cumulative — once a member has 2+ donation months in their
   * history they stay counted in this stage even if they later go
   * quiet.
   */
  repeated: Scalars["Int"]["output"];
};

/** One entry-month cohort's retention curve. */
export type GqlSysAdminCohortRetentionPoint = {
  __typename?: "SysAdminCohortRetentionPoint";
  /** Entry month, first day JST (e.g. 2025-10-01T00:00+09:00). */
  cohortMonth: Scalars["Datetime"]["output"];
  /** Cohort size at entry (status='JOINED' joiners in the month). */
  cohortSize: Scalars["Int"]["output"];
  /**
   * Fraction of the cohort with a DONATION out in the SECOND month after
   * entry (m+1). null for an empty cohort or a cohort too recent to have
   * a completed m+1 window.
   */
  retentionM1?: Maybe<Scalars["Float"]["output"]>;
  /** Fraction active in m+3. */
  retentionM3?: Maybe<Scalars["Float"]["output"]>;
  /** Fraction active in m+6. */
  retentionM6?: Maybe<Scalars["Float"]["output"]>;
};

/**
 * API-side alert flags. Boolean only: the server owns the cross-field
 * judgement, the client just renders the badge.
 */
export type GqlSysAdminCommunityAlerts = {
  __typename?: "SysAdminCommunityAlerts";
  /** Month-over-month communityActivityRate change <= -20%. */
  activeDrop: Scalars["Boolean"]["output"];
  /** Latest-week churned_senders > retained_senders. */
  churnSpike: Scalars["Boolean"]["output"];
  /** No t_memberships.created_at rows (status='JOINED') in the last 14 days. */
  noNewMembers: Scalars["Boolean"]["output"];
};

export type GqlSysAdminCommunityDetailInput = {
  /** As-of timestamp (see SysAdminDashboardInput.asOf). */
  asOf?: InputMaybe<Scalars["Datetime"]["input"]>;
  /** Target community id. */
  communityId: Scalars["ID"]["input"];
  /**
   * Opaque cursor for pagination. Internally a base64-encoded offset of
   * the prior page's position. Treat as opaque — pass back the cursor
   * returned by the previous response unchanged.
   */
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  /**
   * Days since a member's most recent DONATION above which they are
   * classified as "dormant". Used to populate
   * `SysAdminCommunityDetailPayload.dormantCount`. See the same-named
   * field on SysAdminDashboardInput for the full semantic.
   *
   * Default 30 (≈ one month of silence). Effective range 1..365;
   * values outside are silently clamped on the server.
   */
  dormantThresholdDays?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Minimum number of distinct DONATION recipients within the trailing
   * 28-day window ending at each month-end for a member to be classified
   * as a hub in that month. Used to populate
   * `SysAdminMonthlyActivityPoint.hubMemberCount`. Same semantic as
   * `SysAdminDashboardInput.hubBreadthThreshold`, applied at month-end
   * rather than at request `asOf`.
   *
   * Default 3. Effective range 1..1000; values outside are silently
   * clamped on the server. Pass the same value used on
   * `SysAdminDashboardInput.hubBreadthThreshold` to keep the L1
   * hubMemberCount and the latest entry of
   * `monthlyActivityTrend.hubMemberCount` directly comparable.
   */
  hubBreadthThreshold?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Member list page size (default 50, max 1000). Raised from the
   * previous max of 200 so client-side aggregations that need every
   * member of a community (e.g. the "受領→送付 転換率" /
   * recipient-to-sender conversion rate, hub-persistence cohorts,
   * new-member retention breakdowns) can pull a single full page
   * without N round-trips. Communities larger than 1000 members
   * still need cursor pagination.
   */
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  /** Stage-count thresholds for the stage distribution and tier counts. */
  segmentThresholds?: InputMaybe<GqlSysAdminSegmentThresholdsInput>;
  /** Member list filter. Defaults to `minSendRate = 0.7` (habitual only). */
  userFilter?: InputMaybe<GqlSysAdminUserListFilter>;
  /** Member list sort. Defaults to SEND_RATE DESC. */
  userSort?: InputMaybe<GqlSysAdminUserListSort>;
  /**
   * How many trailing JST months to include in the trend / cohort arrays.
   * Default 10.
   */
  windowMonths?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Root payload for sysAdminCommunityDetail (L2). */
export type GqlSysAdminCommunityDetailPayload = {
  __typename?: "SysAdminCommunityDetailPayload";
  /** Alert flags (same structure as L1, evaluated for this community). */
  alerts: GqlSysAdminCommunityAlerts;
  /** As-of timestamp echoed back. */
  asOf: Scalars["Datetime"]["output"];
  /**
   * Distribution of DONATION `chain_depth` values across all-time
   * DONATION transactions in this community. Each bucket counts
   * distinct DONATION transactions whose `chain_depth` falls into
   * the bucket key (see `SysAdminCommunitySummaryCard.maxChainDepthAllTime`
   * for the depth semantic — depth 1 is a root donation, depth N+1
   * means the sender's most recent received DONATION had depth N).
   *
   * Buckets are `{depth: 1..5, count}`; the depth-5 bucket
   * aggregates all transactions with `chain_depth >= 5`. Buckets
   * are returned in ascending depth order, with every bucket
   * emitted (count = 0 for depths with no transactions) so the
   * client can render a contiguous histogram axis without
   * zero-padding logic. Adjust the ceiling upward (e.g., to 10+)
   * in a follow-up if real-data inspection of `maxChainDepthAllTime`
   * shows meaningful population in the 5+ bucket.
   *
   * Powers the L3 "/network" chain-depth histogram: visualizes
   * whether donations propagate deeply (multi-hop reciprocity, tail
   * populated) or shallowly (one-shot direct gifts, mass at depth 1).
   */
  chainDepthDistribution: Array<GqlSysAdminChainDepthBucket>;
  /**
   * Per-cohort funnel progression for the L3 "/activity" deep-dive.
   * One entry per JST entry-month within the trailing `windowMonths`
   * range, returned in ascending order (newest cohort last). Stages
   * match the L2 send-funnel structure:
   *
   *   acquisition  — cohort size at entry (JOINED memberships
   *                  created during the cohort month)
   *   activatedD30 — cohort members who sent >= 1 DONATION within
   *                  30 days of their join (per-member, not
   *                  calendar-clamped)
   *   repeated     — cohort members who sent DONATION in >= 2
   *                  distinct JST months (cumulative as of asOf)
   *   habitual     — cohort members currently in the habitual
   *                  segment (`userSendRate >= segmentThresholds
   *                  .tier1` AND tenure floor)
   *
   * ⚠ The `habitual` stage is THRESHOLD-DEPENDENT: it is derived
   * from the request's `segmentThresholds.tier1` (default 0.7),
   * same behaviour as `stages.habitual` and the L2 habitual count
   * card. Cross-request comparisons of the funnel's last stage
   * require matching threshold inputs. The `acquisition`,
   * `activatedD30`, and `repeated` stages are threshold-
   * independent by construction.
   *
   * All counts are JOINED-at-asOf scoped — a cohort member who
   * later left the community is excluded from `activatedD30` /
   * `repeated` / `habitual` even if they donated during the
   * measurement window. Same membership filter as `dormantCount`
   * / L1 `senderCount` / L2 monthly `hubMemberCount`.
   */
  cohortFunnel: Array<GqlSysAdminCohortFunnelPoint>;
  /**
   * One entry per entry month (length <= windowMonths), newest last.
   * `retentionM*` fields are null when the cohort is empty or too recent.
   */
  cohortRetention: Array<GqlSysAdminCohortRetentionPoint>;
  /** Community id. */
  communityId: Scalars["ID"]["output"];
  /** Community display name. */
  communityName: Scalars["String"]["output"];
  /**
   * Members who donated at some point but whose most recent
   * DONATION is older than `dormantThresholdDays` (default 30). See
   * the same-named field on `SysAdminCommunityOverview` for the
   * full semantic. Exposed at L2 so the user-scope card can show
   * the dormancy ratio directly without re-aggregating from the
   * member list.
   */
  dormantCount: Scalars["Int"]["output"];
  /** Paginated member list — see type doc. */
  memberList: GqlSysAdminMemberList;
  /**
   * One entry per month (length <= windowMonths), newest last. Older
   * months with no MV data are omitted rather than zero-padded.
   */
  monthlyActivityTrend: Array<GqlSysAdminMonthlyActivityPoint>;
  /**
   * One entry per ISO week, newest last. Length approximates
   * `windowMonths * ~4.3` weeks; sparse weeks with no activity still emit
   * a row with zero counters.
   */
  retentionTrend: Array<GqlSysAdminRetentionTrendPoint>;
  /**
   * Stage distribution, classified server-side with the request's
   * thresholds. Computed over ALL members (independent of member-list
   * filter).
   */
  stages: GqlSysAdminStageDistribution;
  /** Summary card — see type doc. */
  summary: GqlSysAdminCommunitySummaryCard;
  /** Trailing window length in JST months (echoed back). */
  windowMonths: Scalars["Int"]["output"];
};

/**
 * One row of the L1 all-community table. Designed for at-a-glance
 * intervention judgment: each row carries the raw counts the client
 * needs to derive rates, growth, alerts, sort keys, and filter
 * predicates without a second round-trip.
 *
 * Calendar-month metrics live on the L2 detail card
 * (SysAdminCommunitySummaryCard) — L1 is rolling-window only.
 */
export type GqlSysAdminCommunityOverview = {
  __typename?: "SysAdminCommunityOverview";
  /** Community id. */
  communityId: Scalars["ID"]["output"];
  /** Community display name (t_communities.name). */
  communityName: Scalars["String"]["output"];
  /**
   * Members who donated at some point but whose most recent
   * DONATION is older than `dormantThresholdDays` (default 30).
   * Distinct from `segmentCounts.passiveCount` (= "latent", never
   * donated): operators care about the difference because the
   * intervention is different — re-engage the dormant, onboard the
   * latent.
   *
   * Computed as
   *   COUNT(DISTINCT user_id)
   *   WHERE the user has at least one historical DONATION in this
   *     community AND `MAX(donation.created_at) < asOf -
   *     dormantThresholdDays`
   *     AND status='JOINED' at asOf
   *
   * Invariants the client may assert:
   *   0 <= dormantCount <= totalMembers - segmentCounts.passiveCount
   *
   * The upper bound holds because dormant members are by
   * construction ever-donated, which `passiveCount` excludes.
   */
  dormantCount: Scalars["Int"]["output"];
  /**
   * Number of members classified as a "hub" within the parametric
   * window (`windowDays`):
   *
   *   hubMemberCount = COUNT(member)
   *     WHERE windowUniqueDonationRecipients >= input.hubBreadthThreshold
   *
   * `windowUniqueDonationRecipients` is the count of DISTINCT users
   * this member sent a DONATION to during
   * `[asOf - windowDays JST日, asOf + 1 JST日)` — distinct from the
   * L2 `SysAdminMemberRow.uniqueDonationRecipients` field which is
   * tenure-wide. The window-scoped variant is computed on demand in
   * this aggregate but not exposed per-member at L1 (members
   * themselves are an L2 concern).
   *
   * Hub classification deliberately uses BREADTH only — a member
   * who reached `hubBreadthThreshold` distinct recipients during
   * the window necessarily transacted at least that many times,
   * making an explicit frequency floor redundant. This keeps the
   * threshold knobs to one (`hubBreadthThreshold`).
   *
   * Invariants (the client may assert these):
   *   hubMemberCount <= windowActivity.senderCount <= totalMembers
   *
   * The first holds because any hub member sent DONATION to
   * `>= hubBreadthThreshold` distinct counterparties during the
   * window — which requires at least that many DONATION
   * transactions — so they are necessarily a window sender. The
   * second because both `hubMemberCount` and `windowActivity.senderCount`
   * are computed from senders restricted to JOINED-at-asOf members
   * (a former member who left the community before asOf is excluded
   * even if they donated during the window) and totalMembers is
   * also JOINED-at-asOf, so the chain stays consistent.
   */
  hubMemberCount: Scalars["Int"]["output"];
  /**
   * Latest completed monthly cohort and its M+1 activity. See
   * SysAdminLatestCohort.
   */
  latestCohort: GqlSysAdminLatestCohort;
  /**
   * Per-stage member counts (tier1 / tier2 / passive, cumulative
   * per the type doc) classified against input.segmentThresholds.
   */
  segmentCounts: GqlSysAdminSegmentCounts;
  /**
   * Tenure-bucket distribution of members at asOf. See
   * SysAdminTenureDistribution. Sum of buckets equals totalMembers.
   *
   * Lets the client surface community age structure at L1 without
   * drilling into the L2 member list (which would otherwise force
   * an N+1 round trip per community to compute distribution).
   */
  tenureDistribution: GqlSysAdminTenureDistribution;
  /**
   * Total status='JOINED' members as of asOf. Members whose
   * created_at is after asOf are excluded from the count.
   */
  totalMembers: Scalars["Int"]["output"];
  /**
   * Latest completed-week retention signals for client-side churn
   * detection. See SysAdminWeeklyRetention.
   */
  weeklyRetention: GqlSysAdminWeeklyRetention;
  /** Rolling-window DONATION activity. See SysAdminWindowActivity. */
  windowActivity: GqlSysAdminWindowActivity;
};

/**
 * Summary card for a single community. Fronts the L2 detail screen and
 * answers "is this community improving?" in one row of numbers.
 */
export type GqlSysAdminCommunitySummaryCard = {
  __typename?: "SysAdminCommunitySummaryCard";
  /**
   * Latest-month communityActivityRate (PRIMARY indicator — see module
   * docstring for the distinction vs userSendRate).
   */
  communityActivityRate: Scalars["Float"]["output"];
  /**
   * 3-month trailing average of communityActivityRate, ending at the JST
   * calendar month containing asOf (inclusive). null when fewer than 3
   * months of data exist.
   */
  communityActivityRate3mAvg?: Maybe<Scalars["Float"]["output"]>;
  /** Community id. */
  communityId: Scalars["ID"]["output"];
  /** Community display name. */
  communityName: Scalars["String"]["output"];
  /** Oldest date with MV data for this community (JST calendar). */
  dataFrom?: Maybe<Scalars["Datetime"]["output"]>;
  /** Newest date with MV data for this community (JST calendar). */
  dataTo?: Maybe<Scalars["Datetime"]["output"]>;
  /**
   * Month-over-month % change in communityActivityRate (fraction, e.g.
   * -0.2 == -20%). null when the prior month has no data.
   */
  growthRateActivity?: Maybe<Scalars["Float"]["output"]>;
  /**
   * Maximum `chain_depth` observed in any DONATION, all-time, in
   * this community. null when no DONATION transactions exist.
   *
   * `chain_depth` semantics (set in transaction creation —
   * src/application/domain/transaction/service.ts:89, via
   * `findLatestReceivedTx`):
   *   - chain_depth = 1: a "root" donation. Either the sender
   *     had no prior received DONATION (= self-funded gift) or
   *     this is treated as the start of a chain.
   *   - chain_depth = N + 1: the sender's most recent received
   *     DONATION (parentTx) had `chain_depth = N`; the new
   *     donation propagates the chain by one step.
   *
   * Example trace: A donates to B → chain_depth 1.
   * B then donates to C, citing the receipt from A → chain_depth 2.
   * C donates to D similarly → chain_depth 3.
   *
   * `maxChainDepthAllTime = 1` therefore means "no propagation
   * ever happened" (every donation was a fresh root).
   * `maxChainDepthAllTime >= 2` means at least one
   * receive-then-pass-it-on event occurred.
   */
  maxChainDepthAllTime?: Maybe<Scalars["Int"]["output"]>;
  /** Cumulative members in tier2 or above under the supplied thresholds. */
  tier2Count: Scalars["Int"]["output"];
  /** tier2Count / totalMembers (0.0–1.0). */
  tier2Pct: Scalars["Float"]["output"];
  /**
   * Total DONATION points transferred, all-time (no window). Uses
   * t_transactions directly so the value is independent of MV retention.
   */
  totalDonationPointsAllTime: Scalars["Float"]["output"];
  /** Total status='JOINED' members at asOf. */
  totalMembers: Scalars["Int"]["output"];
};

/** Input for the L1 all-community overview (`sysAdminDashboard`). */
export type GqlSysAdminDashboardInput = {
  /**
   * As-of timestamp anchor. All trailing-window calculations are
   * anchored here:
   *   - parametric activity window: [asOf - windowDays, asOf + 1 JST日)
   *   - weekly retention: latest completed ISO week before asOf
   *   - latest cohort: (asOf JST月 - 2) so its M+1 window is fully past
   * Defaults to now when omitted.
   */
  asOf?: InputMaybe<Scalars["Datetime"]["input"]>;
  /**
   * Days since a member's most recent DONATION above which they are
   * classified as "dormant" — i.e. they donated at some point but
   * have gone quiet. Used to populate
   * `SysAdminCommunityOverview.dormantCount`.
   *
   * Distinct from `segmentCounts.passiveCount` (= "latent", never
   * donated): operators care about the difference because the
   * intervention is different (re-engage a sleeper vs onboard a
   * newcomer). A member with `MAX(donation.created_at) < asOf -
   * dormantThresholdDays` is dormant.
   *
   * Default 30 (≈ one month of silence). Effective range 1..365;
   * values outside are silently clamped on the server.
   */
  dormantThresholdDays?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Minimum number of distinct DONATION recipients within the
   * parametric window (`windowDays`) for a member to be classified
   * as a hub. Used to populate `SysAdminCommunityOverview.hubMemberCount`.
   *
   * Defaults to 3, meaning "sent DONATION to at least 3 different
   * people during the window". The threshold is on **unique
   * counterparties** (set cardinality), not transaction count, so a
   * member who donated 100 times to the same recipient does not
   * qualify on this axis alone.
   *
   * Effective range 1..1000; values outside are silently clamped on
   * the server.
   *
   * This is intentionally an absolute threshold rather than a
   * community-relative percentile: a percentile-based hub would
   * always classify ~N% of members as hubs by definition, defeating
   * cross-community comparison ("which communities have the highest
   * hub ratio?"). Community size differences are absorbed
   * client-side by displaying `hubMemberCount / totalMembers` rather
   * than the raw count.
   */
  hubBreadthThreshold?: InputMaybe<Scalars["Int"]["input"]>;
  /** Stage classification thresholds (see SysAdminSegmentThresholdsInput). */
  segmentThresholds?: InputMaybe<GqlSysAdminSegmentThresholdsInput>;
  /**
   * Length of the rolling activity window in JST days. Effective
   * range 7-90; values outside are silently clamped on the server.
   * Defaults to 28 (= 4 weeks, absorbs day-of-week variance).
   */
  windowDays?: InputMaybe<Scalars["Int"]["input"]>;
};

/** Root payload for sysAdminDashboard (L1). */
export type GqlSysAdminDashboardPayload = {
  __typename?: "SysAdminDashboardPayload";
  /** As-of timestamp echoed back (UTC instant). */
  asOf: Scalars["Datetime"]["output"];
  /** One row per community, in dashboard sort order. */
  communities: Array<GqlSysAdminCommunityOverview>;
  /** Platform-wide aggregate row. */
  platform: GqlSysAdminPlatformSummary;
};

/**
 * Most recently completed monthly cohort plus its M+1 activity.
 * "M+1" follows standard cohort-analysis convention: the calendar
 * month immediately after the joining month.
 *
 * The cohort is selected as (asOf's JST month - 2 months) so its
 * M+1 window — the JST month immediately preceding asOf's month —
 * is fully past. This avoids reporting an artificially low retention
 * during the in-progress month.
 *
 * Raw counts are returned; the client divides for the retention rate
 * and decides how to handle small-N cohorts via `size`.
 */
export type GqlSysAdminLatestCohort = {
  __typename?: "SysAdminLatestCohort";
  /**
   * Of those cohort members, how many sent at least one DONATION
   * during the M+1 month.
   */
  activeAtM1: Scalars["Int"]["output"];
  /**
   * Cohort size: status='JOINED' members whose created_at falls
   * within the cohort month. 0 when no one joined that month
   * (callers should treat M+1 retention as null in that case).
   */
  size: Scalars["Int"]["output"];
};

/** Paginated member list for the L2 detail. */
export type GqlSysAdminMemberList = {
  __typename?: "SysAdminMemberList";
  /** Whether more pages exist after this one. */
  hasNextPage: Scalars["Boolean"]["output"];
  /**
   * Opaque cursor to pass back in `SysAdminCommunityDetailInput.cursor` to
   * fetch the next page. null when no further pages exist.
   */
  nextCursor?: Maybe<Scalars["String"]["output"]>;
  /**
   * Member rows for the current page, matching filter & sort applied
   * server-side.
   */
  users: Array<GqlSysAdminMemberRow>;
};

/**
 * One row of the L2 member list. Raw values only — stage classification
 * (habitual / regular / occasional / latent) is the client's concern so
 * server-side thresholds can be tuned without a schema change.
 */
export type GqlSysAdminMemberRow = {
  __typename?: "SysAdminMemberRow";
  /**
   * Tenure in JST calendar days (floor, minimum 1). Daily-grain
   * counterpart to `monthsIn`. Useful when the client wants a
   * finer-grained activity rate than the monthly `userSendRate`,
   * or when grouping members into tenure buckets that don't align
   * with calendar-month boundaries.
   */
  daysIn: Scalars["Int"]["output"];
  /**
   * Distinct JST days the member received at least one DONATION.
   * Daily-grain counterpart to `donationInMonths`. Receiver-side
   * counterpart to `donationOutDays`.
   */
  donationInDays: Scalars["Int"]["output"];
  /**
   * Distinct months with at least one DONATION in. Receiver-side
   * counterpart to `donationOutMonths`. Combined with
   * `totalPointsIn`, identifies members who have been part of the
   * receiving side of the gift economy and over how broad a span.
   */
  donationInMonths: Scalars["Int"]["output"];
  /**
   * Distinct JST days the member sent at least one DONATION.
   * Daily-grain counterpart to `donationOutMonths`. Combined with
   * `daysIn`, the client can compute `donationOutDays / daysIn` as
   * a daily-cadence rate, complementing the monthly `userSendRate`.
   */
  donationOutDays: Scalars["Int"]["output"];
  /** Distinct months with at least one DONATION out. */
  donationOutMonths: Scalars["Int"]["output"];
  /**
   * JST date (UTC-encoded at JST midnight) of this member's most
   * recent DONATION out in this community. null when the member has
   * never sent a DONATION (= latent on the sender axis).
   *
   * Powers the L3 "/members" dormancy list: clients sort dormant
   * members by `lastDonationAt ASC` to surface the longest-quiet
   * senders first, and compute days-since-last-donation as
   * `(asOf - lastDonationAt) / 1 day` for the per-row badge. Same
   * underlying signal as `dormantCount`'s threshold check
   * (`MAX(donation.created_at) < asOf - dormantThresholdDays`),
   * exposed as the raw timestamp so the client can derive multiple
   * derived views without a server-side recomputation per request.
   */
  lastDonationAt?: Maybe<Scalars["Datetime"]["output"]>;
  /** Tenure in JST calendar months (floor, minimum 1). */
  monthsIn: Scalars["Int"]["output"];
  /** User display name (users.name). null when the user has no name set. */
  name?: Maybe<Scalars["String"]["output"]>;
  /**
   * All-time DONATION points received by this user in this community.
   * Receiver-side counterpart to `totalPointsOut`. Sums
   * `to_point_change` across DONATION transactions whose receiver
   * wallet belongs to this user in this community. Burn / system
   * sources (sender wallets without a user_id) are excluded so a
   * member who only received from a system grant scores 0 — same
   * scope as `totalPointsOut`.
   */
  totalPointsIn: Scalars["Float"]["output"];
  /** All-time DONATION points sent by this user in this community. */
  totalPointsOut: Scalars["Float"]["output"];
  /**
   * All-time count of distinct OTHER users this member has sent at
   * least one DONATION to in this community. The "network breadth"
   * half of the donor profile (paired with frequency-based
   * `userSendRate` and volume-based `totalPointsOut`):
   *
   *   breadth × frequency × volume → the client's per-member
   *   classification space (e.g. true hub vs single-target loyal vs
   *   rare-but-far-reaching).
   *
   * Counts unique counterparty user_id, not transaction count, so a
   * member who sent 100 donations to the same recipient still scores
   * 1. Excludes burn / system targets (recipient wallets without a
   * user_id).
   */
  uniqueDonationRecipients: Scalars["Int"]["output"];
  /**
   * All-time count of distinct OTHER users that have sent at least
   * one DONATION to this member in this community. The receiver-side
   * counterpart to `uniqueDonationRecipients`. Counts unique sender
   * user_id, excludes burn / system sources (sender wallets without
   * a user_id) and self-donations (a user who somehow sent to their
   * own wallet does not increment the count). Used by the L2
   * dashboard to compute the "受領→送付 転換率" (recipient-to-sender
   * conversion rate) — share of DONATION recipients who have also
   * sent at least one DONATION — distinguishing reciprocal
   * participation networks from one-way distribution structures.
   */
  uniqueDonationSenders: Scalars["Int"]["output"];
  /** User id. */
  userId: Scalars["ID"]["output"];
  /**
   * Individual monthly-send rate: `donationOutMonths / monthsIn`, 0.0–1.0,
   * rounded to 3 decimals. INDIVIDUAL LTV variable (not the same as
   * communityActivityRate elsewhere in this schema).
   */
  userSendRate: Scalars["Float"]["output"];
};

/** One month of community activity trend. */
export type GqlSysAdminMonthlyActivityPoint = {
  __typename?: "SysAdminMonthlyActivityPoint";
  /**
   * Share of DONATION transactions that were part of a chain (chain_depth
   * > 0) in the month. 0.0–1.0.
   */
  chainPct?: Maybe<Scalars["Float"]["output"]>;
  /**
   * senderCount / month-end totalMembers. Read alongside newMembers: a
   * month with many new joiners can dip the rate even if absolute activity
   * grew.
   */
  communityActivityRate: Scalars["Float"]["output"];
  /** Sum of DONATION points transferred in the month. */
  donationPointsSum: Scalars["Float"]["output"];
  /**
   * Members who had no DONATION out in the trailing 30 days as of
   * the END of this month. Snapshot of the dormant base at
   * month-end. Pair with the NEXT month's `returnedMembers` to
   * compute the monthly recovery rate
   * (`returnedMembers[N] / dormantCount[N-1]`).
   *
   * Aligns with `SysAdminCommunityOverview.dormantCount` /
   * `SysAdminCommunityDetailPayload.dormantCount` semantics: an
   * ever-donated member whose most recent DONATION is older than
   * 30 days as of the month-end timestamp. The latest month's
   * value should equal `SysAdminCommunityDetailPayload.dormantCount`
   * when `asOf` falls at or near the JST month-end, modulo the
   * difference between the request's `dormantThresholdDays` input
   * (which the trend ignores in favor of a fixed 30-day window so
   * monthly returnedMembers / dormantCount stay comparable across
   * requests).
   */
  dormantCount: Scalars["Int"]["output"];
  /**
   * Distinct members who, AS OF the END of this month, had sent
   * DONATIONs to >= `hubBreadthThreshold` distinct recipients within
   * the trailing 28-day window ending at the month-end. Same
   * window-scoped semantic as
   * `SysAdminCommunityOverview.hubMemberCount`, evaluated at
   * month-end rather than at request `asOf`.
   *
   * Window: `[monthEnd - 28 JST days, monthEnd)`. The 28-day window is
   * fixed (independent of any request input) so monthly
   * hubMemberCount values across the trend stay comparable to each
   * other — same precedent as `dormantCount`'s fixed 30-day window.
   * `hubBreadthThreshold` follows
   * `SysAdminCommunityDetailInput.hubBreadthThreshold` (default 3).
   *
   * Senders are restricted to users JOINED in the community at the
   * month-end timestamp — same membership filter as
   * `dormantCount` / L1 `senderCount` / L1 `hubMemberCount`. A
   * member who left the community before this month-end is
   * excluded even if they donated during the trailing window.
   *
   * When the L1 dashboard is queried with the default
   * `windowDays = 28` and an `asOf` that falls at or near a JST
   * month-end, the latest entry of `monthlyActivityTrend.hubMemberCount`
   * equals `SysAdminCommunityOverview.hubMemberCount` for the same
   * community (provided both queries pass the same
   * `hubBreadthThreshold`).
   *
   * Currently always returns a non-null integer (0 for months with
   * no qualifying senders), matching the precedent set by sibling
   * monthly counters (`senderCount`, `dormantCount`). The field is
   * declared nullable to preserve forward compatibility for a future
   * refinement that may suppress months entirely outside the
   * community's MV data range — clients should still tolerate null.
   */
  hubMemberCount?: Maybe<Scalars["Int"]["output"]>;
  /** First day (JST) of the calendar month, e.g. 2025-10-01T00:00+09:00. */
  month: Scalars["Datetime"]["output"];
  /** t_memberships.created_at (status='JOINED') rows falling in the month. */
  newMembers: Scalars["Int"]["output"];
  /**
   * Members who were dormant at the END of the previous calendar
   * month but had at least one DONATION out in this month. Monthly
   * counterpart to `SysAdminRetentionTrendPoint.returnedSenders`.
   * null for the first month in the series (no prior month to
   * reference).
   *
   * "Dormant at the end of previous month" uses the same threshold
   * semantic as `SysAdminCommunityOverview.dormantCount` /
   * `SysAdminMonthlyActivityPoint.dormantCount` — no DONATION out in
   * the trailing 30 days as of the previous month-end. This may
   * diverge slightly from the sum of weekly `returnedSenders` over
   * the month because the weekly metric uses a 12-week look-back at
   * ISO-week granularity while this monthly metric uses the
   * 30-day-trailing dormant snapshot at month-end. The discrepancy
   * is week/month boundary alignment only.
   */
  returnedMembers?: Maybe<Scalars["Int"]["output"]>;
  /** Distinct DONATION senders in the month. */
  senderCount: Scalars["Int"]["output"];
};

/**
 * Platform-wide headline, computed by summing across every community in
 * scope for the caller (which is every community since this query is
 * SYS_ADMIN-gated).
 */
export type GqlSysAdminPlatformSummary = {
  __typename?: "SysAdminPlatformSummary";
  /** Number of communities included in the response. */
  communitiesCount: Scalars["Int"]["output"];
  /**
   * Sum of DONATION points transferred during the JST calendar month
   * containing `asOf`, across every community.
   */
  latestMonthDonationPoints: Scalars["Float"]["output"];
  /** Sum of status='JOINED' members across every community. */
  totalMembers: Scalars["Int"]["output"];
};

/** One ISO week of retention signals. */
export type GqlSysAdminRetentionTrendPoint = {
  __typename?: "SysAdminRetentionTrendPoint";
  /** Senders in the prior week who did NOT send this week. */
  churnedSenders: Scalars["Int"]["output"];
  /**
   * Community activity rate for the week: distinct senders / totalMembers
   * as of week end. null when the community had zero members during the
   * week.
   */
  communityActivityRate?: Maybe<Scalars["Float"]["output"]>;
  /** New t_memberships.created_at rows (status='JOINED') this week. */
  newMembers: Scalars["Int"]["output"];
  /**
   * Senders in both the prior week and this week (same-user on
   * donation_out_count > 0).
   */
  retainedSenders: Scalars["Int"]["output"];
  /**
   * Senders this week who did NOT send last week but DID send some week
   * in the prior 12-week window.
   */
  returnedSenders: Scalars["Int"]["output"];
  /** Monday 00:00 JST of the ISO week. */
  week: Scalars["Datetime"]["output"];
};

/**
 * Stage-count snapshot for one community, computed by the server using the
 * client-supplied `SysAdminSegmentThresholdsInput`. Cumulative semantics:
 * `tier2Count` INCLUDES members counted in `tier1Count`.
 */
export type GqlSysAdminSegmentCounts = {
  __typename?: "SysAdminSegmentCounts";
  /** Members with userSendRate > 0 (excludes latent). */
  activeCount: Scalars["Int"]["output"];
  /** Members with donationOutMonths == 0 (latent / not-yet-participated). */
  passiveCount: Scalars["Int"]["output"];
  /** Members with userSendRate >= tier1. */
  tier1Count: Scalars["Int"]["output"];
  /** Members with userSendRate >= tier2 (includes tier1). */
  tier2Count: Scalars["Int"]["output"];
  /** Total status='JOINED' members at asOf. */
  total: Scalars["Int"]["output"];
};

/**
 * Stage classification thresholds, supplied by the client.
 * Thresholds define WHERE the boundary between stages sits, but naming
 * (habitual / regular / occasional / latent) remains fixed on the server.
 */
export type GqlSysAdminSegmentThresholdsInput = {
  /**
   * Minimum tenure a member must have before being eligible for
   * tier1 / tier2 classification. Expressed in calendar months for
   * ergonomic operator-facing semantics, but evaluated internally as
   * `daysIn >= minMonthsIn × 30` so a member who joined yesterday
   * but happens to straddle a calendar-month boundary cannot sneak
   * past the filter. Filters out the short-tenure artifact where a
   * brand-new member who donated once gets
   * `userSendRate = 1/1 = 1.0` and is auto-classified as habitual
   * despite no actual track record.
   *
   * Only affects `tier1Count` and `tier2Count`; `activeCount`
   * ("ever donated") and `passiveCount` ("never donated") are
   * semantically tenure-independent and remain unfiltered.
   *
   * Default 1 → roughly "must have been around at least 30 days".
   * Set to 3 for "must have been around 3+ months (~90 days)" so
   * the operator-facing reading of `tier1Count` matches the
   * intuitive meaning of "habitual sender".
   *
   * Effective range 1..120; values outside are silently clamped on
   * the server. The 30-day-per-month conversion matches
   * `tenureDistribution`'s bucket boundaries so the stage classifier
   * and the tenure-distribution chart agree on what "1 month" means.
   */
  minMonthsIn?: InputMaybe<Scalars["Int"]["input"]>;
  /**
   * Habitual stage threshold. A user with `userSendRate >= tier1` is
   * counted as "habitual" (i.e. sends donations in at least tier1 share
   * of their tenure). Default 0.7.
   */
  tier1?: InputMaybe<Scalars["Float"]["input"]>;
  /**
   * Regular stage threshold. `userSendRate >= tier2` AND `< tier1`
   * classifies as "regular". Default 0.4.
   */
  tier2?: InputMaybe<Scalars["Float"]["input"]>;
};

/** Sort direction for the member list. */
export const GqlSysAdminSortOrder = {
  /**
   * Ascending — smallest value first (e.g. SEND_RATE ASC puts latent
   * and occasional members before habitual).
   */
  Asc: "ASC",
  /**
   * Descending — largest value first (e.g. SEND_RATE DESC puts habitual
   * members at the top). This is the default.
   */
  Desc: "DESC",
} as const;

export type GqlSysAdminSortOrder = (typeof GqlSysAdminSortOrder)[keyof typeof GqlSysAdminSortOrder];
/**
 * Summary for one stage (habitual / regular / occasional / latent).
 * Stage membership is classified server-side using the thresholds supplied
 * in the request. `pointsContributionPct` is the share of total DONATION
 * points-out attributed to members in this stage, in the asOf month.
 */
export type GqlSysAdminStageBucket = {
  __typename?: "SysAdminStageBucket";
  /** Average monthsIn across members in this stage. */
  avgMonthsIn: Scalars["Float"]["output"];
  /** Average userSendRate across members in this stage (0.0–1.0). */
  avgSendRate: Scalars["Float"]["output"];
  /** Number of members in this stage. */
  count: Scalars["Int"]["output"];
  /** count / totalMembers (0.0–1.0). */
  pct: Scalars["Float"]["output"];
  /**
   * Stage's share of this community's all-time DONATION points-out
   * (0.0–1.0). Numerator is the sum of `totalPointsOut` across the
   * stage's members; denominator is the same sum across all members.
   * 0 for the latent stage by definition.
   */
  pointsContributionPct: Scalars["Float"]["output"];
};

/**
 * Four-stage distribution of the community's membership.
 * `pointsContributionPct` on `latent` is always 0 since latent members
 * haven't donated by definition.
 */
export type GqlSysAdminStageDistribution = {
  __typename?: "SysAdminStageDistribution";
  /** userSendRate >= tier1. */
  habitual: GqlSysAdminStageBucket;
  /** donationOutMonths == 0. */
  latent: GqlSysAdminStageBucket;
  /** 0 < userSendRate < tier2. */
  occasional: GqlSysAdminStageBucket;
  /** tier2 <= userSendRate < tier1. */
  regular: GqlSysAdminStageBucket;
};

/**
 * Tenure-bucket distribution of a community's members at asOf,
 * classified on `daysIn` (JST calendar-day tenure). Lets the L1
 * dashboard surface community age structure (e.g. "lots of brand
 * new members, few established") without drilling into the L2
 * member list.
 *
 * Buckets are mutually exclusive and exhaustive; the sum equals
 * totalMembers. Boundaries are intentionally calendar-day rather
 * than month so a 28-day-tenure member doesn't get double-counted
 * into "1 month" purely because of `monthsIn`'s GREATEST(1, ...)
 * floor.
 */
export type GqlSysAdminTenureDistribution = {
  __typename?: "SysAdminTenureDistribution";
  /**
   * Members with `daysIn >= 365` — long-time members. Combined
   * with `lt1Month`, signals the community's age structure.
   */
  gte12Months: Scalars["Int"]["output"];
  /**
   * Members with `daysIn < 30` — newly joined cohort. Useful for
   * spotting communities flooded with new members where downstream
   * metrics (userSendRate, retention) are not yet meaningful.
   */
  lt1Month: Scalars["Int"]["output"];
  /** Members with `30 <= daysIn < 90` — "still settling in" cohort. */
  m1to3Months: Scalars["Int"]["output"];
  /** Members with `90 <= daysIn < 365` — established members. */
  m3to12Months: Scalars["Int"]["output"];
  /**
   * Detailed monthly histogram for the L3 tenure deep-dive.
   *
   * Each entry counts currently-JOINED members whose `daysIn` falls
   * into the bucket. Bucket boundaries are aligned with the coarse
   * `gte12Months` cutoff so the histogram and coarse buckets agree:
   *
   *   - bucket 0:  daysIn <  30
   *   - bucket k (1..10):  k * 30 <= daysIn < (k + 1) * 30
   *   - bucket 11: 330 <= daysIn < 365
   *   - bucket 12: daysIn >= 365
   *
   * The 12 bucket therefore matches `gte12Months` exactly; bucket 11
   * is widened from the bare `[330, 360)` slot to `[330, 365)` so a
   * member at 360..364 days lands in 11 rather than 12
   * (`floor(daysIn / 30)` would otherwise have placed them in 12,
   * creating an asymmetry with the coarse `m3to12Months` cutoff at
   * 365).
   *
   * Returned in ascending bucket order (`monthsIn` 0..12), with every
   * bucket emitted (count = 0 for buckets with no members) so the
   * client can render a contiguous histogram axis without
   * zero-padding.
   *
   * Sum of `count` equals `totalMembers`. A member with `daysIn < 0`
   * (data anomaly — `daysIn` is floor-1-clamped at the SQL boundary
   * so this should be impossible) is clamped into bucket 0 rather
   * than excluded, matching the service implementation.
   *
   * The existing 4 coarse buckets (`lt1Month` / `m1to3Months` /
   * `m3to12Months` / `gte12Months`) remain for L1 / L2 callers; the
   * monthly histogram is additional, not a replacement.
   */
  monthlyHistogram: Array<GqlSysAdminTenureHistogramBucket>;
};

/**
 * One bucket of the L3 tenure histogram. See
 * `SysAdminTenureDistribution.monthlyHistogram`.
 */
export type GqlSysAdminTenureHistogramBucket = {
  __typename?: "SysAdminTenureHistogramBucket";
  /** Number of currently-JOINED members in this bucket. */
  count: Scalars["Int"]["output"];
  /**
   * Tenure bucket index, range 0..12. The 0 bucket aggregates
   * `daysIn < 30`; buckets 1..10 cover `k * 30 <= daysIn <
   * (k + 1) * 30`; bucket 11 covers `330 <= daysIn < 365`; the 12
   * bucket aggregates `daysIn >= 365` (matching the coarse
   * `gte12Months` boundary). Members at 330..364 days land in
   * bucket 11, not bucket 12.
   */
  monthsIn: Scalars["Int"]["output"];
};

/**
 * Member-list filters for the L2 detail (`sysAdminCommunityDetail`).
 * All conditions AND together. Unspecified fields do not filter.
 */
export type GqlSysAdminUserListFilter = {
  /** Inclusive upper bound on userSendRate. */
  maxSendRate?: InputMaybe<Scalars["Float"]["input"]>;
  /** Inclusive lower bound on donationOutMonths. */
  minDonationOutMonths?: InputMaybe<Scalars["Int"]["input"]>;
  /** Inclusive lower bound on monthsIn (JST-calendar months). */
  minMonthsIn?: InputMaybe<Scalars["Int"]["input"]>;
  /** Inclusive lower bound on userSendRate. Default 0.7 (habitual only). */
  minSendRate?: InputMaybe<Scalars["Float"]["input"]>;
};

/**
 * Sort configuration for the L2 member list. Both fields are optional;
 * omitting either falls back to the default (SEND_RATE DESC) so the
 * "top habitual members first" view renders out of the box.
 */
export type GqlSysAdminUserListSort = {
  /**
   * Column to sort on. See SysAdminUserSortField for what each value
   * addresses. Default: SEND_RATE.
   */
  field?: InputMaybe<GqlSysAdminUserSortField>;
  /** Sort direction. Default: DESC. */
  order?: InputMaybe<GqlSysAdminSortOrder>;
};

/** Sortable columns on the member list. */
export const GqlSysAdminUserSortField = {
  /** donationOutMonths (distinct months with a DONATION out). */
  DonationOutMonths: "DONATION_OUT_MONTHS",
  /** monthsIn (tenure in JST calendar months). */
  MonthsIn: "MONTHS_IN",
  /** userSendRate (individual monthly-send rate, 0.0–1.0). */
  SendRate: "SEND_RATE",
  /** totalPointsOut (lifetime DONATION points sent). */
  TotalPointsOut: "TOTAL_POINTS_OUT",
} as const;

export type GqlSysAdminUserSortField =
  (typeof GqlSysAdminUserSortField)[keyof typeof GqlSysAdminUserSortField];
/**
 * DONATION sender retention against the most recently completed
 * ISO week (Monday 00:00 JST). Raw signals only; the client composes
 * churn alerts (e.g. churnedSenders > retainedSenders).
 */
export type GqlSysAdminWeeklyRetention = {
  __typename?: "SysAdminWeeklyRetention";
  /**
   * Users who sent DONATION in the week-before-latest but NOT in
   * the latest completed week. "Lost this week, was engaged last week."
   */
  churnedSenders: Scalars["Int"]["output"];
  /**
   * Users who sent DONATION in the latest completed week AND in
   * the week before it. "Engaged this week, was engaged last week."
   */
  retainedSenders: Scalars["Int"]["output"];
};

/**
 * DONATION activity within the parametric window driven by
 * `SysAdminDashboardInput.windowDays`. Both the current window and
 * the immediately preceding window of equal length are returned so
 * the client can derive growth rates without a second query.
 *
 *   current  = [asOf - windowDays JST日, asOf + 1 JST日)
 *   previous = [asOf - 2 * windowDays, asOf - windowDays)
 */
export type GqlSysAdminWindowActivity = {
  __typename?: "SysAdminWindowActivity";
  /**
   * New JOINED memberships (t_memberships.created_at within the
   * current window, status='JOINED').
   */
  newMemberCount: Scalars["Int"]["output"];
  /** Same metric for the previous window. */
  newMemberCountPrev: Scalars["Int"]["output"];
  /**
   * Users who sent at least one DONATION in BOTH the current window
   * AND the previous window (set intersection on user_id). Same
   * shape as SysAdminWeeklyRetention.retainedSenders but at
   * windowDays scale, enabling client-side leaky-bucket derivation:
   *
   *   newlyActivatedSenders = senderCount     - retainedSenders
   *   churnedSenders        = senderCountPrev - retainedSenders
   */
  retainedSenders: Scalars["Int"]["output"];
  /**
   * Unique users with at least one outgoing DONATION transaction
   * during the current window (donation_out_count > 0 in
   * mv_user_transaction_daily). Restricted to users who are still
   * JOINED in this community at asOf — a now-departed member who
   * donated during the window is excluded, mirroring the
   * membership filter on `totalMembers`.
   */
  senderCount: Scalars["Int"]["output"];
  /**
   * Same metric for the previous window of equal length. Same
   * JOINED-at-asOf membership restriction applies (so the
   * `senderCount` / `senderCountPrev` comparison stays
   * apples-to-apples even when membership churn happens between
   * the two windows).
   */
  senderCountPrev: Scalars["Int"]["output"];
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

export type GqlTicketClaimLinkEdge = GqlEdge & {
  __typename?: "TicketClaimLinkEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlTicketClaimLink>;
};

export type GqlTicketClaimLinkFilterInput = {
  hasAvailableTickets?: InputMaybe<Scalars["Boolean"]["input"]>;
  issuedTo?: InputMaybe<Scalars["ID"]["input"]>;
  issuerId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlClaimLinkStatus>;
};

export type GqlTicketClaimLinkSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  status?: InputMaybe<GqlSortDirection>;
};

export type GqlTicketClaimLinksConnection = {
  __typename?: "TicketClaimLinksConnection";
  edges?: Maybe<Array<Maybe<GqlTicketClaimLinkEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
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
  ownerId?: InputMaybe<Scalars["ID"]["input"]>;
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
  /**
   * ポイントの旅のステップを返します（最大10段階）。
   * 再帰CTEによる単一クエリで取得しますが、循環・異常データ対策のため深さ上限を10としています。
   * transactions などのリスト取得で chain を要求すると、各 Transaction ごとにこのクエリが実行されるため高コストになりえます。
   * transaction(id) での単体取得時のみ使用し、深さだけ必要な場合は chainDepth を使用してください。
   */
  chain?: Maybe<GqlTransactionChain>;
  chainDepth?: Maybe<Scalars["Int"]["output"]>;
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdByUser?: Maybe<GqlUser>;
  fromPointChange?: Maybe<Scalars["Int"]["output"]>;
  fromWallet?: Maybe<GqlWallet>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  participation?: Maybe<GqlParticipation>;
  reason: GqlTransactionReason;
  reservation?: Maybe<GqlReservation>;
  ticketStatusHistories?: Maybe<Array<GqlTicketStatusHistory>>;
  toPointChange?: Maybe<Scalars["Int"]["output"]>;
  toWallet?: Maybe<GqlWallet>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

/**
 * ポイントの旅（chain）の全体像。
 * depth はチェーンの長さ（ステップ数）、steps は古い順（起点→現在）に並ぶ。
 */
export type GqlTransactionChain = {
  __typename?: "TransactionChain";
  depth: Scalars["Int"]["output"];
  steps: Array<GqlTransactionChainStep>;
};

/**
 * 参加者がコミュニティ（COMMUNITY wallet の所有者）である場合の表現。
 * id は Community.id。GRANT / ONBOARDING のような、community wallet から
 * 発行される transaction の起点ステップで登場する。
 */
export type GqlTransactionChainCommunity = GqlTransactionChainParticipant & {
  __typename?: "TransactionChainCommunity";
  bio?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

/**
 * chain の 1 ステップに登場する参加者（User または Community）。
 * 共通フィールドを束ねた interface。実体の判別は __typename で行う。
 */
export type GqlTransactionChainParticipant = {
  bio?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

/**
 * chain の1ステップ。ある transaction（ポイントの移動 1回分）に対応する。
 * from が送信元、to が送信先。どちらも User または Community を表す
 * TransactionChainParticipant interface で、__typename で判別できる。
 */
export type GqlTransactionChainStep = {
  __typename?: "TransactionChainStep";
  createdAt: Scalars["Datetime"]["output"];
  /**
   * 送信元の参加者。
   * - GRANT / ONBOARDING の起点ステップでは TransactionChainCommunity（community wallet 発）
   * - それ以外のステップは TransactionChainUser
   * - ウォレットが削除済み（退会済みユーザー等）の場合は null
   */
  from?: Maybe<GqlTransactionChainParticipant>;
  id: Scalars["ID"]["output"];
  points: Scalars["Int"]["output"];
  reason: GqlTransactionReason;
  /**
   * 送信先の参加者。
   * 現状の業務ロジックでは常に TransactionChainUser（MEMBER wallet 宛）。
   * ウォレットが削除済みの場合は null。
   */
  to?: Maybe<GqlTransactionChainParticipant>;
};

/**
 * 参加者がユーザー（MEMBER wallet の所有者）である場合の表現。
 * id は User.id。
 */
export type GqlTransactionChainUser = GqlTransactionChainParticipant & {
  __typename?: "TransactionChainUser";
  bio?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

export type GqlTransactionDonateSelfPointInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  communityId: Scalars["ID"]["input"];
  images?: InputMaybe<Array<GqlImageInput>>;
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
  and?: InputMaybe<Array<GqlTransactionFilterInput>>;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  fromDidValue?: InputMaybe<Scalars["String"]["input"]>;
  fromUserId?: InputMaybe<Scalars["ID"]["input"]>;
  fromUserName?: InputMaybe<Scalars["String"]["input"]>;
  fromWalletId?: InputMaybe<Scalars["ID"]["input"]>;
  fromWalletType?: InputMaybe<GqlWalletType>;
  not?: InputMaybe<GqlTransactionFilterInput>;
  or?: InputMaybe<Array<GqlTransactionFilterInput>>;
  reason?: InputMaybe<GqlTransactionReason>;
  toDidValue?: InputMaybe<Scalars["String"]["input"]>;
  toUserId?: InputMaybe<Scalars["ID"]["input"]>;
  toUserName?: InputMaybe<Scalars["String"]["input"]>;
  toWalletId?: InputMaybe<Scalars["ID"]["input"]>;
  toWalletType?: InputMaybe<GqlWalletType>;
};

export type GqlTransactionGrantCommunityPointInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  toUserId: Scalars["ID"]["input"];
  transferPoints: Scalars["Int"]["input"];
};

export type GqlTransactionGrantCommunityPointPayload = GqlTransactionGrantCommunityPointSuccess;

export type GqlTransactionGrantCommunityPointSuccess = {
  __typename?: "TransactionGrantCommunityPointSuccess";
  transaction: GqlTransaction;
};

export type GqlTransactionIssueCommunityPointInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
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
  OpportunityReservationCanceled: "OPPORTUNITY_RESERVATION_CANCELED",
  OpportunityReservationCreated: "OPPORTUNITY_RESERVATION_CREATED",
  OpportunityReservationRejected: "OPPORTUNITY_RESERVATION_REJECTED",
  PointIssued: "POINT_ISSUED",
  PointReward: "POINT_REWARD",
  TicketPurchased: "TICKET_PURCHASED",
  TicketRefunded: "TICKET_REFUNDED",
} as const;

export type GqlTransactionReason = (typeof GqlTransactionReason)[keyof typeof GqlTransactionReason];
export type GqlTransactionSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
};

export type GqlTransactionUpdateMetadataInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
};

export type GqlTransactionUpdateMetadataPayload = GqlTransactionUpdateMetadataSuccess;

export type GqlTransactionUpdateMetadataSuccess = {
  __typename?: "TransactionUpdateMetadataSuccess";
  transaction: GqlTransaction;
};

export type GqlTransactionVerificationResult = {
  __typename?: "TransactionVerificationResult";
  label: Scalars["Int"]["output"];
  rootHash: Scalars["String"]["output"];
  status: GqlVerificationStatus;
  transactionHash: Scalars["String"]["output"];
  txId: Scalars["ID"]["output"];
};

export type GqlTransactionsConnection = {
  __typename?: "TransactionsConnection";
  edges?: Maybe<Array<Maybe<GqlTransactionEdge>>>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlUpdateReportTemplateInput = {
  communityContext?: InputMaybe<Scalars["String"]["input"]>;
  experimentKey?: InputMaybe<Scalars["String"]["input"]>;
  isActive?: InputMaybe<Scalars["Boolean"]["input"]>;
  isEnabled?: InputMaybe<Scalars["Boolean"]["input"]>;
  maxTokens: Scalars["Int"]["input"];
  model: Scalars["String"]["input"];
  stopSequences?: InputMaybe<Array<Scalars["String"]["input"]>>;
  systemPrompt: Scalars["String"]["input"];
  temperature?: InputMaybe<Scalars["Float"]["input"]>;
  trafficWeight?: InputMaybe<Scalars["Int"]["input"]>;
  userPromptTemplate: Scalars["String"]["input"];
};

export type GqlUpdateReportTemplatePayload = GqlUpdateReportTemplateSuccess;

export type GqlUpdateReportTemplateSuccess = {
  __typename?: "UpdateReportTemplateSuccess";
  reportTemplate: GqlReportTemplate;
};

export type GqlUpdateSignupBonusConfigInput = {
  bonusPoint: Scalars["Int"]["input"];
  isEnabled: Scalars["Boolean"]["input"];
  message?: InputMaybe<Scalars["String"]["input"]>;
};

export type GqlUser = {
  __typename?: "User";
  articlesAboutMe?: Maybe<Array<GqlArticle>>;
  articlesWrittenByMe?: Maybe<Array<GqlArticle>>;
  bio?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  currentPrefecture?: Maybe<GqlCurrentPrefecture>;
  didIssuanceRequests?: Maybe<Array<GqlDidIssuanceRequest>>;
  evaluationCreatedByMe?: Maybe<Array<GqlEvaluationHistory>>;
  evaluations?: Maybe<Array<GqlEvaluation>>;
  id: Scalars["ID"]["output"];
  identities?: Maybe<Array<GqlIdentity>>;
  image?: Maybe<Scalars["String"]["output"]>;
  membershipChangedByMe?: Maybe<Array<GqlMembershipHistory>>;
  memberships?: Maybe<Array<GqlMembership>>;
  name: Scalars["String"]["output"];
  nftInstances?: Maybe<GqlNftInstancesConnection>;
  nftWallet?: Maybe<GqlNftWallet>;
  opportunitiesCreatedByMe?: Maybe<Array<GqlOpportunity>>;
  participationStatusChangedByMe?: Maybe<Array<GqlParticipationStatusHistory>>;
  participations?: Maybe<Array<GqlParticipation>>;
  phoneNumber?: Maybe<Scalars["String"]["output"]>;
  portfolios?: Maybe<Array<GqlPortfolio>>;
  preferredLanguage?: Maybe<GqlLanguage>;
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

export type GqlUserNftInstancesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlNftInstanceFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlNftInstanceSortInput>;
};

export type GqlUserPortfoliosArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlPortfolioFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlPortfolioSortInput>;
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
  ids?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  keywords?: InputMaybe<Array<Scalars["String"]["input"]>>;
  sysRole?: InputMaybe<GqlSysRole>;
};

export type GqlUserSignUpInput = {
  currentPrefecture: GqlCurrentPrefecture;
  image?: InputMaybe<GqlImageInput>;
  lineRefreshToken?: InputMaybe<Scalars["String"]["input"]>;
  lineTokenExpiresAt?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  phoneAccessToken?: InputMaybe<Scalars["String"]["input"]>;
  phoneNumber?: InputMaybe<Scalars["String"]["input"]>;
  phoneRefreshToken?: InputMaybe<Scalars["String"]["input"]>;
  phoneTokenExpiresAt?: InputMaybe<Scalars["String"]["input"]>;
  phoneUid?: InputMaybe<Scalars["String"]["input"]>;
  preferredLanguage?: InputMaybe<GqlLanguage>;
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
  preferredLanguage?: InputMaybe<GqlLanguage>;
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
  owner?: Maybe<GqlUser>;
  pointsRequired: Scalars["Int"]["output"];
  publishStatus: GqlPublishStatus;
  requiredForOpportunities?: Maybe<Array<GqlOpportunity>>;
  ticketIssuers?: Maybe<Array<GqlTicketIssuer>>;
  tickets?: Maybe<Array<GqlTicket>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlUtilityCreateInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<GqlImageInput>>;
  name: Scalars["String"]["input"];
  pointsRequired: Scalars["Int"]["input"];
  requiredForOpportunityIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
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
  communityIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
  not?: InputMaybe<GqlUtilityFilterInput>;
  or?: InputMaybe<Array<GqlUtilityFilterInput>>;
  ownerIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
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

export const GqlValueType = {
  Float: "FLOAT",
  Int: "INT",
} as const;

export type GqlValueType = (typeof GqlValueType)[keyof typeof GqlValueType];
export type GqlVcIssuanceRequest = {
  __typename?: "VcIssuanceRequest";
  completedAt?: Maybe<Scalars["Datetime"]["output"]>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  evaluation?: Maybe<GqlEvaluation>;
  id: Scalars["ID"]["output"];
  processedAt?: Maybe<Scalars["Datetime"]["output"]>;
  requestedAt?: Maybe<Scalars["Datetime"]["output"]>;
  status: GqlVcIssuanceStatus;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<GqlUser>;
};

export type GqlVcIssuanceRequestEdge = GqlEdge & {
  __typename?: "VcIssuanceRequestEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<GqlVcIssuanceRequest>;
};

export type GqlVcIssuanceRequestFilterInput = {
  evaluationId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlVcIssuanceStatus>;
  userIds?: InputMaybe<Array<Scalars["ID"]["input"]>>;
};

export type GqlVcIssuanceRequestSortInput = {
  createdAt?: InputMaybe<GqlSortDirection>;
  updatedAt?: InputMaybe<GqlSortDirection>;
};

export type GqlVcIssuanceRequestsConnection = {
  __typename?: "VcIssuanceRequestsConnection";
  edges: Array<GqlVcIssuanceRequestEdge>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export const GqlVcIssuanceStatus = {
  Completed: "COMPLETED",
  Failed: "FAILED",
  Pending: "PENDING",
  Processing: "PROCESSING",
} as const;

export type GqlVcIssuanceStatus = (typeof GqlVcIssuanceStatus)[keyof typeof GqlVcIssuanceStatus];
export const GqlVerificationStatus = {
  Error: "ERROR",
  NotVerified: "NOT_VERIFIED",
  Pending: "PENDING",
  Verified: "VERIFIED",
} as const;

export type GqlVerificationStatus =
  (typeof GqlVerificationStatus)[keyof typeof GqlVerificationStatus];
/**
 * 個々の投票レコード。同一 (userId, topicId) に対し常に 1 レコード。
 * 再投票は upsert で上書きされるため**投票履歴は保持されない**。
 * 投票の取消（withdraw）は現時点で未サポート。
 */
export type GqlVoteBallot = {
  __typename?: "VoteBallot";
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  option: GqlVoteOption;
  /**
   * 投票時点の power **スナップショット**。
   * NFT_COUNT ポリシーの場合、投票後に NFT 保有数が変化しても本フィールドは変わらない
   * （現時点の power は MyVoteEligibility.currentPower を参照）。
   */
  power: Scalars["Int"]["output"];
  /** 再投票（upsert）時に現在時刻で更新される。初回投票時は null。 */
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlVoteCastInput = {
  optionId: Scalars["ID"]["input"];
  topicId: Scalars["ID"]["input"];
};

export type GqlVoteCastPayload = GqlVoteCastSuccess;

export type GqlVoteCastSuccess = {
  __typename?: "VoteCastSuccess";
  ballot: GqlVoteBallot;
};

/**
 * 誰が投票できるか（資格ゲート）。
 * VotePowerPolicy（何票持つか）とは**独立に設定される**が、両方が NFT 系
 * （Gate.type=NFT かつ PowerPolicy.type=NFT_COUNT）の場合に限り、参照する
 * **nftTokenId は一致していなければならない**（バックエンドで検証、違反時は
 * `VALIDATION_ERROR`）。異なる token を指定した場合、A 保有者のうち B 非保有者が
 * eligible=true / currentPower=0 になる「投票しても効かない」状態が生じる設定ミスを防ぐため。
 *
 * 許容される組み合わせ:
 * - Gate=NFT(A) + Policy=NFT_COUNT(A)  典型的
 * - Gate=MEMBERSHIP + Policy=NFT_COUNT(A)  メンバー内で NFT ホルダーのみ重み付け（非ホルダーは power=0）
 * - Gate=NFT(A) + Policy=FLAT  A 保有者は一律 1 票
 * - Gate=MEMBERSHIP + Policy=FLAT  全員 1 票
 */
export type GqlVoteGate = {
  __typename?: "VoteGate";
  id: Scalars["ID"]["output"];
  /** type=NFT のときの参照 NftToken */
  nftToken?: Maybe<GqlNftToken>;
  /** type=MEMBERSHIP のときに要求する最低ロール（未指定時は MEMBER 以上） */
  requiredRole?: Maybe<GqlRole>;
  type: GqlVoteGateType;
};

export type GqlVoteGateInput = {
  /** type=NFT のとき必須。MEMBERSHIP のときは無視される。 */
  nftTokenId?: InputMaybe<Scalars["ID"]["input"]>;
  /** type=MEMBERSHIP のときに任意指定（未指定時は MEMBER 以上で可）。NFT のときは無視される。 */
  requiredRole?: InputMaybe<GqlRole>;
  type: GqlVoteGateType;
};

export const GqlVoteGateType = {
  Membership: "MEMBERSHIP",
  Nft: "NFT",
} as const;

export type GqlVoteGateType = (typeof GqlVoteGateType)[keyof typeof GqlVoteGateType];
/**
 * 投票選択肢。
 * voteCount / totalPower は投票・再投票時にトランザクション内で直接更新される**非正規化カラム**で、
 * 集計コストを O(1) に抑える。PowerPolicy=FLAT のとき voteCount == totalPower、
 * NFT_COUNT では乖離する。一般的には勝敗判定に totalPower、参加者数表示に voteCount を使う。
 */
export type GqlVoteOption = {
  __typename?: "VoteOption";
  id: Scalars["ID"]["output"];
  label: Scalars["String"]["output"];
  /**
   * 作成時（VoteOptionInput）に指定した値がそのまま保持される。
   * VoteTopic.options は本フィールドの昇順で返るため、UI 側で追加のソートは不要。
   */
  orderIndex: Scalars["Int"]["output"];
  /** 票の重み合計（= Σ power）。endsAt 到達前は一般ユーザーに null（管理者は常に実値を参照可）。 */
  totalPower?: Maybe<Scalars["Int"]["output"]>;
  /** 投票した**人数**。endsAt 到達前は一般ユーザーに null（管理者は常に実値を参照可）。 */
  voteCount?: Maybe<Scalars["Int"]["output"]>;
};

export type GqlVoteOptionInput = {
  label: Scalars["String"]["input"];
  /** 0 以上の整数。オプション間で重複不可。 */
  orderIndex: Scalars["Int"]["input"];
};

/**
 * 投票の重み（1 人が何票持つか）を決めるポリシー。
 * VoteGate（投票可能か）とは独立に設定される。
 */
export type GqlVotePowerPolicy = {
  __typename?: "VotePowerPolicy";
  id: Scalars["ID"]["output"];
  /** type=NFT_COUNT のときに参照する NftToken（保有数を power とする） */
  nftToken?: Maybe<GqlNftToken>;
  type: GqlVotePowerPolicyType;
};

export type GqlVotePowerPolicyInput = {
  /** type=NFT_COUNT のとき必須。FLAT のときは無視される。 */
  nftTokenId?: InputMaybe<Scalars["ID"]["input"]>;
  type: GqlVotePowerPolicyType;
};

export const GqlVotePowerPolicyType = {
  Flat: "FLAT",
  NftCount: "NFT_COUNT",
} as const;

export type GqlVotePowerPolicyType =
  (typeof GqlVotePowerPolicyType)[keyof typeof GqlVotePowerPolicyType];
export type GqlVoteTopic = {
  __typename?: "VoteTopic";
  community: GqlCommunity;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  endsAt: Scalars["Datetime"]["output"];
  gate: GqlVoteGate;
  id: Scalars["ID"]["output"];
  /**
   * ログインユーザーの投票（未ログイン・未投票は null）。
   * MyVoteEligibility.myBallot と同じ値を返すため、一覧画面ではこちらを利用することを推奨
   * （投票画面のように資格情報も必要な場合は myEligibility.myBallot を使う）。
   */
  myBallot?: Maybe<GqlVoteBallot>;
  /** ログインユーザーの投票資格情報（未ログインは null）。 */
  myEligibility?: Maybe<GqlMyVoteEligibility>;
  /** 投票選択肢。orderIndex 昇順で返る（UI 側でのソートは不要）。 */
  options: Array<GqlVoteOption>;
  /**
   * 現在フェーズ。**レスポンス時点でサーバ時刻から計算される値**であり DB カラムではない。
   * 詳細は VoteTopicPhase の説明を参照。
   */
  phase: GqlVoteTopicPhase;
  powerPolicy: GqlVotePowerPolicy;
  startsAt: Scalars["Datetime"]["output"];
  title: Scalars["String"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type GqlVoteTopicCreateInput = {
  communityId: Scalars["ID"]["input"];
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt: Scalars["Datetime"]["input"];
  gate: GqlVoteGateInput;
  options: Array<GqlVoteOptionInput>;
  powerPolicy: GqlVotePowerPolicyInput;
  startsAt: Scalars["Datetime"]["input"];
  title: Scalars["String"]["input"];
};

export type GqlVoteTopicCreatePayload = GqlVoteTopicCreateSuccess;

export type GqlVoteTopicCreateSuccess = {
  __typename?: "VoteTopicCreateSuccess";
  voteTopic: GqlVoteTopic;
};

export type GqlVoteTopicDeletePayload = GqlVoteTopicDeleteSuccess;

export type GqlVoteTopicDeleteSuccess = {
  __typename?: "VoteTopicDeleteSuccess";
  voteTopicId: Scalars["ID"]["output"];
};

export type GqlVoteTopicEdge = {
  __typename?: "VoteTopicEdge";
  cursor: Scalars["String"]["output"];
  node: GqlVoteTopic;
};

/**
 * 投票テーマの現在フェーズ。
 * startsAt / endsAt と現在時刻から**レスポンス時点で**計算される値で、DB カラムではない。
 * 長時間開いたままの画面（カウントダウン等）ではクライアント側で古くなるため、
 * 精密な期間判定には startsAt / endsAt を直接比較すること。一覧表示などでは phase を利用して構わない。
 */
export const GqlVoteTopicPhase = {
  Closed: "CLOSED",
  Open: "OPEN",
  Upcoming: "UPCOMING",
} as const;

export type GqlVoteTopicPhase = (typeof GqlVoteTopicPhase)[keyof typeof GqlVoteTopicPhase];
/**
 * voteTopicUpdate 用の入力。**既存の全フィールドを置き換える**（部分更新は未サポート）。
 * options は delete → create で全量置換される。gate / powerPolicy も同様に再生成されるため、
 * 既存の id 値は保持されない点に注意。UPCOMING フェーズ限定で呼ばれるため、投票は存在しない前提。
 */
export type GqlVoteTopicUpdateInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt: Scalars["Datetime"]["input"];
  gate: GqlVoteGateInput;
  options: Array<GqlVoteOptionInput>;
  powerPolicy: GqlVotePowerPolicyInput;
  startsAt: Scalars["Datetime"]["input"];
  title: Scalars["String"]["input"];
};

export type GqlVoteTopicUpdatePayload = GqlVoteTopicUpdateSuccess;

export type GqlVoteTopicUpdateSuccess = {
  __typename?: "VoteTopicUpdateSuccess";
  voteTopic: GqlVoteTopic;
};

export type GqlVoteTopicsConnection = {
  __typename?: "VoteTopicsConnection";
  edges: Array<GqlVoteTopicEdge>;
  nodes: Array<GqlVoteTopic>;
  pageInfo: GqlPageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type GqlWallet = {
  __typename?: "Wallet";
  accumulatedPointView?: Maybe<GqlAccumulatedPointView>;
  community?: Maybe<GqlCommunity>;
  createdAt?: Maybe<Scalars["Datetime"]["output"]>;
  currentPointView?: Maybe<GqlCurrentPointView>;
  id: Scalars["ID"]["output"];
  tickets?: Maybe<Array<GqlTicket>>;
  /** @deprecated Use transactionsConnection for pagination support */
  transactions?: Maybe<Array<GqlTransaction>>;
  transactionsConnection?: Maybe<GqlTransactionsConnection>;
  type: GqlWalletType;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<GqlUser>;
};

export type GqlWalletTransactionsConnectionArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GqlTransactionSortInput>;
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

export type GqlGetStatesQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetStatesQuery = {
  __typename?: "Query";
  states: {
    __typename?: "StatesConnection";
    edges: Array<{
      __typename?: "StateEdge";
      node?: { __typename?: "State"; code: string; name: string } | null;
    }>;
  };
};

export type GqlGetCitiesQueryVariables = Exact<{
  filter?: InputMaybe<GqlCitiesInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<GqlCitiesSortInput>;
}>;

export type GqlGetCitiesQuery = {
  __typename?: "Query";
  cities: {
    __typename?: "CitiesConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges: Array<{
      __typename?: "CityEdge";
      cursor: string;
      node?: {
        __typename?: "City";
        code: string;
        name: string;
        state?: { __typename?: "State"; code: string; name: string } | null;
      } | null;
    }>;
  };
};

export type GqlAdminReportSummaryRowFieldsFragment = {
  __typename?: "AdminReportSummaryRow";
  lastPublishedAt?: Date | null;
  daysSinceLastPublish?: number | null;
  publishedCountLast90Days: number;
  community: { __typename?: "Community"; id: string; name?: string | null };
  lastPublishedReport?: {
    __typename?: "Report";
    id: string;
    variant: GqlReportVariant;
    status: GqlReportStatus;
    publishedAt?: Date | null;
  } | null;
};

export type GqlAdminBrowseReportFieldsFragment = {
  __typename?: "Report";
  id: string;
  variant: GqlReportVariant;
  status: GqlReportStatus;
  publishedAt?: Date | null;
  createdAt: Date;
  community: { __typename?: "Community"; id: string; name?: string | null };
  feedbacks: { __typename?: "ReportFeedbacksConnection"; totalCount: number };
};

export type GqlGetAdminBrowseReportsQueryVariables = Exact<{
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  status?: InputMaybe<GqlReportStatus>;
  variant?: InputMaybe<GqlReportVariant>;
  publishedAfter?: InputMaybe<Scalars["Datetime"]["input"]>;
  publishedBefore?: InputMaybe<Scalars["Datetime"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetAdminBrowseReportsQuery = {
  __typename?: "Query";
  adminBrowseReports: {
    __typename?: "ReportsConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "ReportEdge";
      cursor: string;
      node?: {
        __typename?: "Report";
        id: string;
        variant: GqlReportVariant;
        status: GqlReportStatus;
        publishedAt?: Date | null;
        createdAt: Date;
        community: { __typename?: "Community"; id: string; name?: string | null };
        feedbacks: { __typename?: "ReportFeedbacksConnection"; totalCount: number };
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GqlGetAdminReportSummaryQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetAdminReportSummaryQuery = {
  __typename?: "Query";
  adminReportSummary: {
    __typename?: "AdminReportSummaryConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "AdminReportSummaryEdge";
      cursor: string;
      node?: {
        __typename?: "AdminReportSummaryRow";
        lastPublishedAt?: Date | null;
        daysSinceLastPublish?: number | null;
        publishedCountLast90Days: number;
        community: { __typename?: "Community"; id: string; name?: string | null };
        lastPublishedReport?: {
          __typename?: "Report";
          id: string;
          variant: GqlReportVariant;
          status: GqlReportStatus;
          publishedAt?: Date | null;
        } | null;
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GqlGetAdminTemplateFeedbacksQueryVariables = Exact<{
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
  kind?: InputMaybe<GqlReportTemplateKind>;
  feedbackType?: InputMaybe<GqlReportFeedbackType>;
  maxRating?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetAdminTemplateFeedbacksQuery = {
  __typename?: "Query";
  adminTemplateFeedbacks: {
    __typename?: "ReportFeedbacksConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "ReportFeedbackEdge";
      cursor: string;
      node?: {
        __typename?: "ReportFeedback";
        id: string;
        rating: number;
        comment?: string | null;
        feedbackType?: GqlReportFeedbackType | null;
        sectionKey?: string | null;
        createdAt: Date;
        report: {
          __typename?: "Report";
          id: string;
          variant: GqlReportVariant;
          periodFrom: Date;
          periodTo: Date;
          community: { __typename?: "Community"; id: string; name?: string | null };
        };
        user: { __typename?: "User"; id: string; name: string };
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GqlGetAdminTemplateFeedbackStatsQueryVariables = Exact<{
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
  kind?: InputMaybe<GqlReportTemplateKind>;
}>;

export type GqlGetAdminTemplateFeedbackStatsQuery = {
  __typename?: "Query";
  adminTemplateFeedbackStats: {
    __typename?: "AdminTemplateFeedbackStats";
    totalCount: number;
    avgRating?: number | null;
    ratingDistribution: Array<{
      __typename?: "ReportFeedbackRatingBucket";
      rating: number;
      count: number;
    }>;
  };
};

export type GqlCommunityFieldsFragment = {
  __typename?: "Community";
  id: string;
  name?: string | null;
  image?: string | null;
};

export type GqlCommunityCreateMutationVariables = Exact<{
  input: GqlCommunityCreateInput;
}>;

export type GqlCommunityCreateMutation = {
  __typename?: "Mutation";
  communityCreate?: {
    __typename?: "CommunityCreateSuccess";
    community: {
      __typename?: "Community";
      id: string;
      name?: string | null;
      image?: string | null;
    };
  } | null;
};

export type GqlUpdateSignupBonusConfigMutationVariables = Exact<{
  input: GqlUpdateSignupBonusConfigInput;
  communityId: Scalars["ID"]["input"];
}>;

export type GqlUpdateSignupBonusConfigMutation = {
  __typename?: "Mutation";
  updateSignupBonusConfig: {
    __typename?: "CommunitySignupBonusConfig";
    bonusPoint: number;
    isEnabled: boolean;
    message?: string | null;
  };
};

export type GqlIncentiveGrantRetryMutationVariables = Exact<{
  incentiveGrantId: Scalars["ID"]["input"];
  communityId: Scalars["ID"]["input"];
}>;

export type GqlIncentiveGrantRetryMutation = {
  __typename?: "Mutation";
  incentiveGrantRetry?: {
    __typename?: "IncentiveGrantRetrySuccess";
    incentiveGrant: { __typename?: "IncentiveGrant"; id: string };
    transaction?: { __typename?: "Transaction"; id: string } | null;
  } | null;
};

export type GqlUpdatePortalConfigMutationVariables = Exact<{
  input: GqlCommunityPortalConfigInput;
  communityId: Scalars["ID"]["input"];
}>;

export type GqlUpdatePortalConfigMutation = {
  __typename?: "Mutation";
  updatePortalConfig: {
    __typename?: "CommunityPortalConfig";
    communityId: string;
    title: string;
    description: string;
    shortDescription?: string | null;
    logoPath: string;
    squareLogoPath: string;
    ogImagePath: string;
    faviconPrefix: string;
  };
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

export type GqlGetSignupBonusConfigQueryVariables = Exact<{
  communityId: Scalars["ID"]["input"];
}>;

export type GqlGetSignupBonusConfigQuery = {
  __typename?: "Query";
  signupBonusConfig?: {
    __typename?: "CommunitySignupBonusConfig";
    bonusPoint: number;
    isEnabled: boolean;
    message?: string | null;
  } | null;
};

export type GqlGetFailedIncentiveGrantsQueryVariables = Exact<{
  communityId: Scalars["ID"]["input"];
}>;

export type GqlGetFailedIncentiveGrantsQuery = {
  __typename?: "Query";
  incentiveGrants: {
    __typename?: "IncentiveGrantsConnection";
    edges?: Array<{
      __typename?: "IncentiveGrantEdge";
      node?: {
        __typename?: "IncentiveGrant";
        id: string;
        failureCode?: GqlIncentiveGrantFailureCode | null;
        lastError?: string | null;
        attemptCount: number;
        lastAttemptedAt?: Date | null;
        user?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetCommunityPortalConfigQueryVariables = Exact<{
  communityId: Scalars["String"]["input"];
}>;

export type GqlGetCommunityPortalConfigQuery = {
  __typename?: "Query";
  communityPortalConfig?: {
    __typename?: "CommunityPortalConfig";
    communityId: string;
    tokenName: string;
    title: string;
    description: string;
    shortDescription?: string | null;
    domain: string;
    faviconPrefix: string;
    logoPath: string;
    squareLogoPath: string;
    ogImagePath: string;
    enableFeatures: Array<string>;
    rootPath: string;
    adminRootPath: string;
    regionName?: string | null;
    regionKey?: string | null;
    liffId?: string | null;
    liffBaseUrl?: string | null;
    firebaseTenantId?: string | null;
    documents?: Array<{
      __typename?: "CommunityDocument";
      id: string;
      title: string;
      path: string;
      type: string;
      order?: number | null;
    }> | null;
    commonDocumentOverrides?: {
      __typename?: "CommonDocumentOverrides";
      terms?: {
        __typename?: "CommunityDocument";
        id: string;
        title: string;
        path: string;
        type: string;
      } | null;
      privacy?: {
        __typename?: "CommunityDocument";
        id: string;
        title: string;
        path: string;
        type: string;
      } | null;
    } | null;
  } | null;
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
  permission: GqlCheckIsSelfPermissionInput;
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

export type GqlIdentityCheckPhoneUserMutationVariables = Exact<{
  input: GqlIdentityCheckPhoneUserInput;
}>;

export type GqlIdentityCheckPhoneUserMutation = {
  __typename?: "Mutation";
  identityCheckPhoneUser: {
    __typename?: "IdentityCheckPhoneUserPayload";
    status: GqlPhoneUserStatus;
    user?: { __typename?: "User"; id: string; name: string } | null;
    membership?: { __typename?: "Membership"; role: GqlRole } | null;
  };
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
        user?: {
          __typename?: "User";
          id: string;
          name: string;
          preferredLanguage?: GqlLanguage | null;
        } | null;
        community?: { __typename?: "Community"; id: string; name?: string | null } | null;
      }> | null;
    } | null;
  } | null;
};

export type GqlCurrentUserServerQueryVariables = Exact<{ [key: string]: never }>;

export type GqlCurrentUserServerQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "CurrentUserPayload";
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      preferredLanguage?: GqlLanguage | null;
      identities?: Array<{
        __typename?: "Identity";
        uid: string;
        platform?: GqlIdentityPlatform | null;
      }> | null;
      memberships?: Array<{
        __typename?: "Membership";
        role: GqlRole;
        status: GqlMembershipStatus;
        headline?: string | null;
        bio?: string | null;
        reason: GqlMembershipStatusReason;
        user?: {
          __typename?: "User";
          id: string;
          name: string;
          preferredLanguage?: GqlLanguage | null;
        } | null;
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

export type GqlAssignOwnerMutationVariables = Exact<{
  input: GqlMembershipSetRoleInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlAssignOwnerMutation = {
  __typename?: "Mutation";
  membershipAssignOwner?: {
    __typename?: "MembershipSetRoleSuccess";
    membership: {
      __typename?: "Membership";
      headline?: string | null;
      bio?: string | null;
      role: GqlRole;
      status: GqlMembershipStatus;
      reason: GqlMembershipStatusReason;
    };
  } | null;
};

export type GqlAssignManagerMutationVariables = Exact<{
  input: GqlMembershipSetRoleInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlAssignManagerMutation = {
  __typename?: "Mutation";
  membershipAssignManager?: {
    __typename?: "MembershipSetRoleSuccess";
    membership: {
      __typename?: "Membership";
      headline?: string | null;
      bio?: string | null;
      role: GqlRole;
      status: GqlMembershipStatus;
      reason: GqlMembershipStatusReason;
    };
  } | null;
};

export type GqlAssignMemberMutationVariables = Exact<{
  input: GqlMembershipSetRoleInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlAssignMemberMutation = {
  __typename?: "Mutation";
  membershipAssignMember?: {
    __typename?: "MembershipSetRoleSuccess";
    membership: {
      __typename?: "Membership";
      headline?: string | null;
      bio?: string | null;
      role: GqlRole;
      status: GqlMembershipStatus;
      reason: GqlMembershipStatusReason;
    };
  } | null;
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
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      phoneNumber?: string | null;
      preferredLanguage?: GqlLanguage | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
  withWallets?: Scalars["Boolean"]["input"];
  withDidIssuanceRequests?: Scalars["Boolean"]["input"];
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
        role: GqlRole;
        status: GqlMembershipStatus;
        user?: {
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          didIssuanceRequests?: Array<{
            __typename?: "DidIssuanceRequest";
            status: GqlDidIssuanceStatus;
            didValue?: string | null;
          }> | null;
          wallets?: Array<{
            __typename?: "Wallet";
            id: string;
            type: GqlWalletType;
            currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
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
    } | null> | null;
  };
};

export type GqlGetNftTokensQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlNftTokenFilterInput>;
  sort?: InputMaybe<GqlNftTokenSortInput>;
}>;

export type GqlGetNftTokensQuery = {
  __typename?: "Query";
  nftTokens: {
    __typename?: "NftTokensConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "NftTokenEdge";
      cursor: string;
      node: {
        __typename?: "NftToken";
        id: string;
        address: string;
        name?: string | null;
        symbol?: string | null;
        type: string;
      };
    }>;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GqlGetNftInstancesQueryVariables = Exact<{
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GqlNftInstanceFilterInput>;
}>;

export type GqlGetNftInstancesQuery = {
  __typename?: "Query";
  nftInstances: {
    __typename?: "NftInstancesConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "NftInstanceEdge";
      cursor: string;
      node: {
        __typename?: "NftInstance";
        id: string;
        instanceId: string;
        name?: string | null;
        createdAt: Date;
        description?: string | null;
        imageUrl?: string | null;
        nftWallet?: {
          __typename?: "NftWallet";
          id: string;
          walletAddress: string;
          user: {
            __typename?: "User";
            id: string;
            name: string;
            didIssuanceRequests?: Array<{
              __typename?: "DidIssuanceRequest";
              id: string;
              status: GqlDidIssuanceStatus;
              didValue?: string | null;
              requestedAt?: Date | null;
              completedAt?: Date | null;
            }> | null;
          };
        } | null;
        community?: { __typename?: "Community"; id: string } | null;
        nftToken?: {
          __typename?: "NftToken";
          id: string;
          address: string;
          name?: string | null;
          symbol?: string | null;
          type: string;
          createdAt: Date;
        } | null;
      };
    }>;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GqlGetNftInstanceWithDidQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetNftInstanceWithDidQuery = {
  __typename?: "Query";
  nftInstance?: {
    __typename?: "NftInstance";
    id: string;
    instanceId: string;
    name?: string | null;
    description?: string | null;
    imageUrl?: string | null;
    json?: any | null;
    createdAt: Date;
    updatedAt?: Date | null;
    community?: { __typename?: "Community"; id: string } | null;
    nftToken?: {
      __typename?: "NftToken";
      id: string;
      address: string;
      name?: string | null;
      symbol?: string | null;
      type: string;
      json?: any | null;
    } | null;
    nftWallet?: {
      __typename?: "NftWallet";
      id: string;
      walletAddress: string;
      user: {
        __typename?: "User";
        id: string;
        name: string;
        didIssuanceRequests?: Array<{
          __typename?: "DidIssuanceRequest";
          id: string;
          status: GqlDidIssuanceStatus;
          didValue?: string | null;
          requestedAt?: Date | null;
          processedAt?: Date | null;
          completedAt?: Date | null;
          createdAt?: Date | null;
          updatedAt?: Date | null;
        }> | null;
      };
    } | null;
  } | null;
};

export type GqlAdminReportDetailFieldsFragment = {
  __typename?: "Report";
  id: string;
  variant: GqlReportVariant;
  status: GqlReportStatus;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt?: Date | null;
  periodFrom: Date;
  periodTo: Date;
  outputMarkdown?: string | null;
  finalContent?: string | null;
  skipReason?: string | null;
  regenerateCount: number;
  community: { __typename?: "Community"; id: string; name?: string | null };
  template?: {
    __typename?: "ReportTemplate";
    id: string;
    variant: GqlReportVariant;
    version: number;
    kind: GqlReportTemplateKind;
    experimentKey?: string | null;
    trafficWeight: number;
  } | null;
  generatedByUser?: { __typename?: "User"; id: string; name: string } | null;
  publishedByUser?: { __typename?: "User"; id: string; name: string } | null;
  myFeedback?: {
    __typename?: "ReportFeedback";
    id: string;
    rating: number;
    comment?: string | null;
    feedbackType?: GqlReportFeedbackType | null;
    sectionKey?: string | null;
    createdAt: Date;
    user: { __typename?: "User"; id: string; name: string };
  } | null;
};

export type GqlSubmitReportFeedbackMutationVariables = Exact<{
  input: GqlSubmitReportFeedbackInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlSubmitReportFeedbackMutation = {
  __typename?: "Mutation";
  submitReportFeedback?: {
    __typename?: "SubmitReportFeedbackSuccess";
    feedback: {
      __typename?: "ReportFeedback";
      id: string;
      rating: number;
      comment?: string | null;
      feedbackType?: GqlReportFeedbackType | null;
      sectionKey?: string | null;
      createdAt: Date;
      user: { __typename?: "User"; id: string; name: string };
    };
  } | null;
};

export type GqlGetAdminReportQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetAdminReportQuery = {
  __typename?: "Query";
  report?: {
    __typename?: "Report";
    id: string;
    variant: GqlReportVariant;
    status: GqlReportStatus;
    publishedAt?: Date | null;
    createdAt: Date;
    updatedAt?: Date | null;
    periodFrom: Date;
    periodTo: Date;
    outputMarkdown?: string | null;
    finalContent?: string | null;
    skipReason?: string | null;
    regenerateCount: number;
    community: { __typename?: "Community"; id: string; name?: string | null };
    template?: {
      __typename?: "ReportTemplate";
      id: string;
      variant: GqlReportVariant;
      version: number;
      kind: GqlReportTemplateKind;
      experimentKey?: string | null;
      trafficWeight: number;
    } | null;
    generatedByUser?: { __typename?: "User"; id: string; name: string } | null;
    publishedByUser?: { __typename?: "User"; id: string; name: string } | null;
    myFeedback?: {
      __typename?: "ReportFeedback";
      id: string;
      rating: number;
      comment?: string | null;
      feedbackType?: GqlReportFeedbackType | null;
      sectionKey?: string | null;
      createdAt: Date;
      user: { __typename?: "User"; id: string; name: string };
    } | null;
  } | null;
};

export type GqlGetAdminReportFeedbacksQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetAdminReportFeedbacksQuery = {
  __typename?: "Query";
  report?: {
    __typename?: "Report";
    id: string;
    feedbacks: {
      __typename?: "ReportFeedbacksConnection";
      totalCount: number;
      edges?: Array<{
        __typename?: "ReportFeedbackEdge";
        cursor: string;
        node?: {
          __typename?: "ReportFeedback";
          id: string;
          rating: number;
          comment?: string | null;
          feedbackType?: GqlReportFeedbackType | null;
          sectionKey?: string | null;
          createdAt: Date;
          user: { __typename?: "User"; id: string; name: string };
        } | null;
      } | null> | null;
      pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
    };
  } | null;
};

export type GqlReportFeedbackFieldsFragment = {
  __typename?: "ReportFeedback";
  id: string;
  rating: number;
  comment?: string | null;
  feedbackType?: GqlReportFeedbackType | null;
  sectionKey?: string | null;
  createdAt: Date;
  user: { __typename?: "User"; id: string; name: string };
};

export type GqlReportFeedbackWithReportFieldsFragment = {
  __typename?: "ReportFeedback";
  id: string;
  rating: number;
  comment?: string | null;
  feedbackType?: GqlReportFeedbackType | null;
  sectionKey?: string | null;
  createdAt: Date;
  report: {
    __typename?: "Report";
    id: string;
    variant: GqlReportVariant;
    periodFrom: Date;
    periodTo: Date;
    community: { __typename?: "Community"; id: string; name?: string | null };
  };
  user: { __typename?: "User"; id: string; name: string };
};

export type GqlReportTemplateFieldsFragment = {
  __typename?: "ReportTemplate";
  id: string;
  variant: GqlReportVariant;
  version: number;
  scope: GqlReportTemplateScope;
  kind: GqlReportTemplateKind;
  model: string;
  maxTokens: number;
  temperature?: number | null;
  systemPrompt: string;
  userPromptTemplate: string;
  stopSequences: Array<string>;
  trafficWeight: number;
  isActive: boolean;
  isEnabled: boolean;
  experimentKey?: string | null;
  communityContext?: string | null;
  createdAt: Date;
  updatedAt?: Date | null;
  community?: { __typename?: "Community"; id: string; name?: string | null } | null;
  updatedByUser?: { __typename?: "User"; id: string; name: string } | null;
};

export type GqlReportTemplateStatsFieldsFragment = {
  __typename?: "ReportTemplateStats";
  variant: GqlReportVariant;
  version?: number | null;
  feedbackCount: number;
  avgRating?: number | null;
  avgJudgeScore?: number | null;
  judgeHumanCorrelation?: number | null;
  correlationWarning: boolean;
};

export type GqlReportTemplateStatsBreakdownRowFieldsFragment = {
  __typename?: "ReportTemplateStatsBreakdownRow";
  templateId: string;
  version: number;
  scope: GqlReportTemplateScope;
  kind: GqlReportTemplateKind;
  experimentKey?: string | null;
  isActive: boolean;
  isEnabled: boolean;
  trafficWeight: number;
  feedbackCount: number;
  avgRating?: number | null;
  avgJudgeScore?: number | null;
  judgeHumanCorrelation?: number | null;
  correlationWarning: boolean;
};

export type GqlUpdateReportTemplateMutationVariables = Exact<{
  variant: GqlReportVariant;
  input: GqlUpdateReportTemplateInput;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
}>;

export type GqlUpdateReportTemplateMutation = {
  __typename?: "Mutation";
  updateReportTemplate?: {
    __typename?: "UpdateReportTemplateSuccess";
    reportTemplate: {
      __typename?: "ReportTemplate";
      id: string;
      variant: GqlReportVariant;
      version: number;
      scope: GqlReportTemplateScope;
      kind: GqlReportTemplateKind;
      model: string;
      maxTokens: number;
      temperature?: number | null;
      systemPrompt: string;
      userPromptTemplate: string;
      stopSequences: Array<string>;
      trafficWeight: number;
      isActive: boolean;
      isEnabled: boolean;
      experimentKey?: string | null;
      communityContext?: string | null;
      createdAt: Date;
      updatedAt?: Date | null;
      community?: { __typename?: "Community"; id: string; name?: string | null } | null;
      updatedByUser?: { __typename?: "User"; id: string; name: string } | null;
    };
  } | null;
};

export type GqlGetReportTemplateQueryVariables = Exact<{
  variant: GqlReportVariant;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
}>;

export type GqlGetReportTemplateQuery = {
  __typename?: "Query";
  reportTemplate?: {
    __typename?: "ReportTemplate";
    id: string;
    variant: GqlReportVariant;
    version: number;
    scope: GqlReportTemplateScope;
    kind: GqlReportTemplateKind;
    model: string;
    maxTokens: number;
    temperature?: number | null;
    systemPrompt: string;
    userPromptTemplate: string;
    stopSequences: Array<string>;
    trafficWeight: number;
    isActive: boolean;
    isEnabled: boolean;
    experimentKey?: string | null;
    communityContext?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
    community?: { __typename?: "Community"; id: string; name?: string | null } | null;
    updatedByUser?: { __typename?: "User"; id: string; name: string } | null;
  } | null;
};

export type GqlGetReportTemplateStatsQueryVariables = Exact<{
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetReportTemplateStatsQuery = {
  __typename?: "Query";
  reportTemplateStats: {
    __typename?: "ReportTemplateStats";
    variant: GqlReportVariant;
    version?: number | null;
    feedbackCount: number;
    avgRating?: number | null;
    avgJudgeScore?: number | null;
    judgeHumanCorrelation?: number | null;
    correlationWarning: boolean;
  };
};

export type GqlGetReportTemplatesQueryVariables = Exact<{
  variant: GqlReportVariant;
  communityId?: InputMaybe<Scalars["ID"]["input"]>;
  kind?: InputMaybe<GqlReportTemplateKind>;
  includeInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
}>;

export type GqlGetReportTemplatesQuery = {
  __typename?: "Query";
  reportTemplates: Array<{
    __typename?: "ReportTemplate";
    id: string;
    variant: GqlReportVariant;
    version: number;
    scope: GqlReportTemplateScope;
    kind: GqlReportTemplateKind;
    model: string;
    maxTokens: number;
    temperature?: number | null;
    systemPrompt: string;
    userPromptTemplate: string;
    stopSequences: Array<string>;
    trafficWeight: number;
    isActive: boolean;
    isEnabled: boolean;
    experimentKey?: string | null;
    communityContext?: string | null;
    createdAt: Date;
    updatedAt?: Date | null;
    community?: { __typename?: "Community"; id: string; name?: string | null } | null;
    updatedByUser?: { __typename?: "User"; id: string; name: string } | null;
  }>;
};

export type GqlGetReportTemplateStatsBreakdownQueryVariables = Exact<{
  variant: GqlReportVariant;
  version?: InputMaybe<Scalars["Int"]["input"]>;
  kind?: InputMaybe<GqlReportTemplateKind>;
  includeInactive?: InputMaybe<Scalars["Boolean"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetReportTemplateStatsBreakdownQuery = {
  __typename?: "Query";
  reportTemplateStatsBreakdown: {
    __typename?: "ReportTemplateStatsBreakdownConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "ReportTemplateStatsBreakdownEdge";
      cursor: string;
      node?: {
        __typename?: "ReportTemplateStatsBreakdownRow";
        templateId: string;
        version: number;
        scope: GqlReportTemplateScope;
        kind: GqlReportTemplateKind;
        experimentKey?: string | null;
        isActive: boolean;
        isEnabled: boolean;
        trafficWeight: number;
        feedbackCount: number;
        avgRating?: number | null;
        avgJudgeScore?: number | null;
        judgeHumanCorrelation?: number | null;
        correlationWarning: boolean;
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; hasNextPage: boolean; endCursor?: string | null };
  };
};

export type GqlSysAdminSegmentCountsFieldsFragment = {
  __typename?: "SysAdminSegmentCounts";
  total: number;
  activeCount: number;
  passiveCount: number;
  tier1Count: number;
  tier2Count: number;
};

export type GqlSysAdminWindowActivityFieldsFragment = {
  __typename?: "SysAdminWindowActivity";
  senderCount: number;
  senderCountPrev: number;
  newMemberCount: number;
  newMemberCountPrev: number;
  retainedSenders: number;
};

export type GqlSysAdminWeeklyRetentionFieldsFragment = {
  __typename?: "SysAdminWeeklyRetention";
  retainedSenders: number;
  churnedSenders: number;
};

export type GqlSysAdminLatestCohortFieldsFragment = {
  __typename?: "SysAdminLatestCohort";
  size: number;
  activeAtM1: number;
};

export type GqlSysAdminPlatformSummaryFieldsFragment = {
  __typename?: "SysAdminPlatformSummary";
  communitiesCount: number;
  latestMonthDonationPoints: number;
  totalMembers: number;
};

export type GqlSysAdminTenureDistributionFieldsFragment = {
  __typename?: "SysAdminTenureDistribution";
  lt1Month: number;
  m1to3Months: number;
  m3to12Months: number;
  gte12Months: number;
};

export type GqlSysAdminCommunityOverviewRowFieldsFragment = {
  __typename?: "SysAdminCommunityOverview";
  communityId: string;
  communityName: string;
  totalMembers: number;
  hubMemberCount: number;
  dormantCount: number;
  segmentCounts: {
    __typename?: "SysAdminSegmentCounts";
    total: number;
    activeCount: number;
    passiveCount: number;
    tier1Count: number;
    tier2Count: number;
  };
  tenureDistribution: {
    __typename?: "SysAdminTenureDistribution";
    lt1Month: number;
    m1to3Months: number;
    m3to12Months: number;
    gte12Months: number;
  };
  windowActivity: {
    __typename?: "SysAdminWindowActivity";
    senderCount: number;
    senderCountPrev: number;
    newMemberCount: number;
    newMemberCountPrev: number;
    retainedSenders: number;
  };
  weeklyRetention: {
    __typename?: "SysAdminWeeklyRetention";
    retainedSenders: number;
    churnedSenders: number;
  };
  latestCohort: { __typename?: "SysAdminLatestCohort"; size: number; activeAtM1: number };
};

export type GqlSysAdminAlertFieldsFragment = {
  __typename?: "SysAdminCommunityAlerts";
  activeDrop: boolean;
  churnSpike: boolean;
  noNewMembers: boolean;
};

export type GqlSysAdminCommunityDetailSummaryFieldsFragment = {
  __typename?: "SysAdminCommunitySummaryCard";
  communityId: string;
  communityName: string;
  communityActivityRate: number;
  communityActivityRate3mAvg?: number | null;
  growthRateActivity?: number | null;
  totalMembers: number;
  tier2Count: number;
  tier2Pct: number;
  totalDonationPointsAllTime: number;
  maxChainDepthAllTime?: number | null;
  dataFrom?: Date | null;
  dataTo?: Date | null;
};

export type GqlSysAdminStageBucketFieldsFragment = {
  __typename?: "SysAdminStageBucket";
  count: number;
  pct: number;
  avgSendRate: number;
  avgMonthsIn: number;
  pointsContributionPct: number;
};

export type GqlSysAdminStageDistributionFieldsFragment = {
  __typename?: "SysAdminStageDistribution";
  habitual: {
    __typename?: "SysAdminStageBucket";
    count: number;
    pct: number;
    avgSendRate: number;
    avgMonthsIn: number;
    pointsContributionPct: number;
  };
  regular: {
    __typename?: "SysAdminStageBucket";
    count: number;
    pct: number;
    avgSendRate: number;
    avgMonthsIn: number;
    pointsContributionPct: number;
  };
  occasional: {
    __typename?: "SysAdminStageBucket";
    count: number;
    pct: number;
    avgSendRate: number;
    avgMonthsIn: number;
    pointsContributionPct: number;
  };
  latent: {
    __typename?: "SysAdminStageBucket";
    count: number;
    pct: number;
    avgSendRate: number;
    avgMonthsIn: number;
    pointsContributionPct: number;
  };
};

export type GqlSysAdminMonthlyActivityPointFieldsFragment = {
  __typename?: "SysAdminMonthlyActivityPoint";
  month: Date;
  communityActivityRate: number;
  senderCount: number;
  newMembers: number;
  donationPointsSum: number;
  chainPct?: number | null;
  dormantCount: number;
  returnedMembers?: number | null;
  hubMemberCount?: number | null;
};

export type GqlSysAdminRetentionTrendPointFieldsFragment = {
  __typename?: "SysAdminRetentionTrendPoint";
  week: Date;
  communityActivityRate?: number | null;
  retainedSenders: number;
  churnedSenders: number;
  returnedSenders: number;
  newMembers: number;
};

export type GqlSysAdminCohortRetentionPointFieldsFragment = {
  __typename?: "SysAdminCohortRetentionPoint";
  cohortMonth: Date;
  cohortSize: number;
  retentionM1?: number | null;
  retentionM3?: number | null;
  retentionM6?: number | null;
};

export type GqlSysAdminCohortFunnelPointFieldsFragment = {
  __typename?: "SysAdminCohortFunnelPoint";
  cohortMonth: Date;
  acquired: number;
  activatedD30: number;
  repeated: number;
  habitual: number;
};

export type GqlSysAdminMemberRowFieldsFragment = {
  __typename?: "SysAdminMemberRow";
  userId: string;
  name?: string | null;
  userSendRate: number;
  totalPointsOut: number;
  donationOutMonths: number;
  monthsIn: number;
  daysIn: number;
  donationOutDays: number;
  uniqueDonationRecipients: number;
  totalPointsIn: number;
  donationInMonths: number;
  donationInDays: number;
  uniqueDonationSenders: number;
};

export type GqlGetSysAdminDashboardQueryVariables = Exact<{
  input?: InputMaybe<GqlSysAdminDashboardInput>;
}>;

export type GqlGetSysAdminDashboardQuery = {
  __typename?: "Query";
  sysAdminDashboard: {
    __typename?: "SysAdminDashboardPayload";
    asOf: Date;
    platform: {
      __typename?: "SysAdminPlatformSummary";
      communitiesCount: number;
      latestMonthDonationPoints: number;
      totalMembers: number;
    };
    communities: Array<{
      __typename?: "SysAdminCommunityOverview";
      communityId: string;
      communityName: string;
      totalMembers: number;
      hubMemberCount: number;
      dormantCount: number;
      segmentCounts: {
        __typename?: "SysAdminSegmentCounts";
        total: number;
        activeCount: number;
        passiveCount: number;
        tier1Count: number;
        tier2Count: number;
      };
      tenureDistribution: {
        __typename?: "SysAdminTenureDistribution";
        lt1Month: number;
        m1to3Months: number;
        m3to12Months: number;
        gte12Months: number;
      };
      windowActivity: {
        __typename?: "SysAdminWindowActivity";
        senderCount: number;
        senderCountPrev: number;
        newMemberCount: number;
        newMemberCountPrev: number;
        retainedSenders: number;
      };
      weeklyRetention: {
        __typename?: "SysAdminWeeklyRetention";
        retainedSenders: number;
        churnedSenders: number;
      };
      latestCohort: { __typename?: "SysAdminLatestCohort"; size: number; activeAtM1: number };
    }>;
  };
};

export type GqlGetSysAdminCommunityDetailQueryVariables = Exact<{
  input: GqlSysAdminCommunityDetailInput;
}>;

export type GqlGetSysAdminCommunityDetailQuery = {
  __typename?: "Query";
  sysAdminCommunityDetail: {
    __typename?: "SysAdminCommunityDetailPayload";
    asOf: Date;
    communityId: string;
    communityName: string;
    windowMonths: number;
    dormantCount: number;
    alerts: {
      __typename?: "SysAdminCommunityAlerts";
      activeDrop: boolean;
      churnSpike: boolean;
      noNewMembers: boolean;
    };
    summary: {
      __typename?: "SysAdminCommunitySummaryCard";
      communityId: string;
      communityName: string;
      communityActivityRate: number;
      communityActivityRate3mAvg?: number | null;
      growthRateActivity?: number | null;
      totalMembers: number;
      tier2Count: number;
      tier2Pct: number;
      totalDonationPointsAllTime: number;
      maxChainDepthAllTime?: number | null;
      dataFrom?: Date | null;
      dataTo?: Date | null;
    };
    stages: {
      __typename?: "SysAdminStageDistribution";
      habitual: {
        __typename?: "SysAdminStageBucket";
        count: number;
        pct: number;
        avgSendRate: number;
        avgMonthsIn: number;
        pointsContributionPct: number;
      };
      regular: {
        __typename?: "SysAdminStageBucket";
        count: number;
        pct: number;
        avgSendRate: number;
        avgMonthsIn: number;
        pointsContributionPct: number;
      };
      occasional: {
        __typename?: "SysAdminStageBucket";
        count: number;
        pct: number;
        avgSendRate: number;
        avgMonthsIn: number;
        pointsContributionPct: number;
      };
      latent: {
        __typename?: "SysAdminStageBucket";
        count: number;
        pct: number;
        avgSendRate: number;
        avgMonthsIn: number;
        pointsContributionPct: number;
      };
    };
    monthlyActivityTrend: Array<{
      __typename?: "SysAdminMonthlyActivityPoint";
      month: Date;
      communityActivityRate: number;
      senderCount: number;
      newMembers: number;
      donationPointsSum: number;
      chainPct?: number | null;
      dormantCount: number;
      returnedMembers?: number | null;
      hubMemberCount?: number | null;
    }>;
    retentionTrend: Array<{
      __typename?: "SysAdminRetentionTrendPoint";
      week: Date;
      communityActivityRate?: number | null;
      retainedSenders: number;
      churnedSenders: number;
      returnedSenders: number;
      newMembers: number;
    }>;
    cohortRetention: Array<{
      __typename?: "SysAdminCohortRetentionPoint";
      cohortMonth: Date;
      cohortSize: number;
      retentionM1?: number | null;
      retentionM3?: number | null;
      retentionM6?: number | null;
    }>;
    cohortFunnel: Array<{
      __typename?: "SysAdminCohortFunnelPoint";
      cohortMonth: Date;
      acquired: number;
      activatedD30: number;
      repeated: number;
      habitual: number;
    }>;
    memberList: {
      __typename?: "SysAdminMemberList";
      hasNextPage: boolean;
      nextCursor?: string | null;
      users: Array<{
        __typename?: "SysAdminMemberRow";
        userId: string;
        name?: string | null;
        userSendRate: number;
        totalPointsOut: number;
        donationOutMonths: number;
        monthsIn: number;
        daysIn: number;
        donationOutDays: number;
        uniqueDonationRecipients: number;
        totalPointsIn: number;
        donationInMonths: number;
        donationInDays: number;
        uniqueDonationSenders: number;
      }>;
    };
  };
};

export type GqlGetCurrentUserProfileQueryVariables = Exact<{ [key: string]: never }>;

export type GqlGetCurrentUserProfileQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "CurrentUserPayload";
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      phoneNumber?: string | null;
      preferredLanguage?: GqlLanguage | null;
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
        evaluationStatus?: GqlEvaluationStatus | null;
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
        participants?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
        }> | null;
      }> | null;
      nftInstances?: {
        __typename?: "NftInstancesConnection";
        totalCount: number;
        edges: Array<{
          __typename?: "NftInstanceEdge";
          node: {
            __typename?: "NftInstance";
            id: string;
            instanceId: string;
            name?: string | null;
            imageUrl?: string | null;
            createdAt: Date;
            community?: { __typename?: "Community"; id: string } | null;
          };
        }>;
      } | null;
      wallets?: Array<{
        __typename?: "Wallet";
        id: string;
        type: GqlWalletType;
        community?: { __typename?: "Community"; id: string } | null;
        tickets?: Array<{ __typename?: "Ticket"; id: string; status: GqlTicketStatus }> | null;
        currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
      }> | null;
      nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
      didIssuanceRequests?: Array<{
        __typename?: "DidIssuanceRequest";
        id: string;
        status: GqlDidIssuanceStatus;
        didValue?: string | null;
        requestedAt?: Date | null;
        processedAt?: Date | null;
        completedAt?: Date | null;
        createdAt?: Date | null;
        updatedAt?: Date | null;
      }> | null;
      opportunitiesCreatedByMe?: Array<{
        __typename?: "Opportunity";
        id: string;
        title: string;
        images?: Array<string> | null;
      }> | null;
    } | null;
  } | null;
};

export type GqlUserFieldsFragment = {
  __typename?: "User";
  id: string;
  name: string;
  image?: string | null;
  bio?: string | null;
  currentPrefecture?: GqlCurrentPrefecture | null;
  phoneNumber?: string | null;
  preferredLanguage?: GqlLanguage | null;
  urlFacebook?: string | null;
  urlInstagram?: string | null;
  urlX?: string | null;
  nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
  evaluationStatus?: GqlEvaluationStatus | null;
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
    phoneNumber?: string | null;
    preferredLanguage?: GqlLanguage | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlX?: string | null;
    nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
      preferredLanguage?: GqlLanguage | null;
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
  portfolioFilter?: InputMaybe<GqlPortfolioFilterInput>;
  portfolioSort?: InputMaybe<GqlPortfolioSortInput>;
  portfolioFirst?: InputMaybe<Scalars["Int"]["input"]>;
  withWallets?: Scalars["Boolean"]["input"];
  withOpportunities?: Scalars["Boolean"]["input"];
  withDidIssuanceRequests?: Scalars["Boolean"]["input"];
  withNftInstances?: Scalars["Boolean"]["input"];
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
    phoneNumber?: string | null;
    preferredLanguage?: GqlLanguage | null;
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
      evaluationStatus?: GqlEvaluationStatus | null;
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
        phoneNumber?: string | null;
        preferredLanguage?: GqlLanguage | null;
        urlFacebook?: string | null;
        urlInstagram?: string | null;
        urlX?: string | null;
        nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
      }> | null;
    }> | null;
    nftInstances?: {
      __typename?: "NftInstancesConnection";
      totalCount: number;
      pageInfo: {
        __typename?: "PageInfo";
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor?: string | null;
        endCursor?: string | null;
      };
      edges: Array<{
        __typename?: "NftInstanceEdge";
        cursor: string;
        node: {
          __typename?: "NftInstance";
          id: string;
          instanceId: string;
          imageUrl?: string | null;
          name?: string | null;
          createdAt: Date;
          community?: { __typename?: "Community"; id: string } | null;
        };
      }>;
    } | null;
    didIssuanceRequests?: Array<{
      __typename?: "DidIssuanceRequest";
      id: string;
      status: GqlDidIssuanceStatus;
      didValue?: string | null;
      requestedAt?: Date | null;
      processedAt?: Date | null;
      completedAt?: Date | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
    }> | null;
    wallets?: Array<{
      __typename?: "Wallet";
      id: string;
      type: GqlWalletType;
      community?: {
        __typename?: "Community";
        id: string;
        name?: string | null;
        image?: string | null;
      } | null;
      tickets?: Array<{
        __typename?: "Ticket";
        id: string;
        reason: GqlTicketStatusReason;
        status: GqlTicketStatus;
      }> | null;
      currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
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
      pointsRequired?: number | null;
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
    nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
    phoneNumber?: string | null;
    preferredLanguage?: GqlLanguage | null;
    urlFacebook?: string | null;
    urlInstagram?: string | null;
    urlX?: string | null;
    wallets?: Array<{
      __typename?: "Wallet";
      id: string;
      type: GqlWalletType;
      community?: {
        __typename?: "Community";
        id: string;
        name?: string | null;
        image?: string | null;
      } | null;
      transactions?: Array<{
        __typename?: "Transaction";
        id: string;
        reason: GqlTransactionReason;
        comment?: string | null;
        images?: Array<string> | null;
        fromPointChange?: number | null;
        toPointChange?: number | null;
        chainDepth?: number | null;
        createdAt?: Date | null;
        fromWallet?: {
          __typename?: "Wallet";
          id: string;
          type: GqlWalletType;
          user?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
          community?: {
            __typename?: "Community";
            id: string;
            name?: string | null;
            image?: string | null;
          } | null;
          currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
        } | null;
        toWallet?: {
          __typename?: "Wallet";
          id: string;
          type: GqlWalletType;
          user?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
          community?: {
            __typename?: "Community";
            id: string;
            name?: string | null;
            image?: string | null;
          } | null;
          currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
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
          owner?: { __typename?: "User"; id: string; name: string } | null;
        } | null;
      }> | null;
      currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
    }> | null;
    nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
  } | null;
};

export type GqlWalletFieldsFragment = {
  __typename?: "Wallet";
  id: string;
  type: GqlWalletType;
  currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
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
          comment?: string | null;
          images?: Array<string> | null;
          fromPointChange?: number | null;
          toPointChange?: number | null;
          chainDepth?: number | null;
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
              phoneNumber?: string | null;
              preferredLanguage?: GqlLanguage | null;
              urlFacebook?: string | null;
              urlInstagram?: string | null;
              urlX?: string | null;
              nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
            } | null;
            currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
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
              phoneNumber?: string | null;
              preferredLanguage?: GqlLanguage | null;
              urlFacebook?: string | null;
              urlInstagram?: string | null;
              urlX?: string | null;
              nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
            } | null;
            currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
          } | null;
        }> | null;
        currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
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
        currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetCommunityWalletQueryVariables = Exact<{
  communityId: Scalars["ID"]["input"];
}>;

export type GqlGetCommunityWalletQuery = {
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
        community?: {
          __typename?: "Community";
          id: string;
          name?: string | null;
          image?: string | null;
        } | null;
        currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetMemberWalletsQueryVariables = Exact<{
  filter?: InputMaybe<GqlWalletFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  withDidIssuanceRequests?: Scalars["Boolean"]["input"];
}>;

export type GqlGetMemberWalletsQuery = {
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
        currentPointView?: { __typename?: "CurrentPointView"; currentPoint: any } | null;
        user?: {
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          didIssuanceRequests?: Array<{
            __typename?: "DidIssuanceRequest";
            status: GqlDidIssuanceStatus;
            didValue?: string | null;
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

export type GqlArticleFieldsFragment = {
  __typename?: "Article";
  id: string;
  title: string;
  body?: string | null;
  introduction: string;
  thumbnail?: string | null;
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
        thumbnail?: string | null;
        category: GqlArticleCategory;
        publishStatus: GqlPublishStatus;
        publishedAt?: Date | null;
        relatedUsers?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
    thumbnail?: string | null;
    category: GqlArticleCategory;
    publishStatus: GqlPublishStatus;
    publishedAt?: Date | null;
    relatedUsers?: Array<{
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      phoneNumber?: string | null;
      preferredLanguage?: GqlLanguage | null;
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
        pointsRequired?: number | null;
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
      nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
    }> | null;
    authors?: Array<{
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      phoneNumber?: string | null;
      preferredLanguage?: GqlLanguage | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
        thumbnail?: string | null;
        category: GqlArticleCategory;
        publishStatus: GqlPublishStatus;
        publishedAt?: Date | null;
        relatedUsers?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
        }> | null;
      } | null;
    } | null> | null;
  };
};

export type GqlDidIssuanceRequestFieldsFragment = {
  __typename?: "DidIssuanceRequest";
  id: string;
  status: GqlDidIssuanceStatus;
  didValue?: string | null;
  requestedAt?: Date | null;
  processedAt?: Date | null;
  completedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
};

export type GqlGetDidIssuanceRequestsQueryVariables = Exact<{
  userIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
}>;

export type GqlGetDidIssuanceRequestsQuery = {
  __typename?: "Query";
  users: {
    __typename?: "UsersConnection";
    edges?: Array<{
      __typename?: "UserEdge";
      node?: {
        __typename?: "User";
        id: string;
        didIssuanceRequests?: Array<{
          __typename?: "DidIssuanceRequest";
          id: string;
          status: GqlDidIssuanceStatus;
          didValue?: string | null;
          requestedAt?: Date | null;
          processedAt?: Date | null;
          completedAt?: Date | null;
          createdAt?: Date | null;
          updatedAt?: Date | null;
        }> | null;
      } | null;
    } | null> | null;
  };
};

export type GqlEvaluationBulkCreateMutationVariables = Exact<{
  input: GqlEvaluationBulkCreateInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlEvaluationBulkCreateMutation = {
  __typename?: "Mutation";
  evaluationBulkCreate?: {
    __typename?: "EvaluationBulkCreateSuccess";
    evaluations: Array<{
      __typename?: "Evaluation";
      id: string;
      comment?: string | null;
      credentialUrl?: string | null;
      status: GqlEvaluationStatus;
      createdAt?: Date | null;
      updatedAt?: Date | null;
      issuedAt?: Date | null;
    }>;
  } | null;
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

export type GqlGetEvaluationsQueryVariables = Exact<{
  filter?: InputMaybe<GqlEvaluationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  withDidIssuanceRequests?: Scalars["Boolean"]["input"];
}>;

export type GqlGetEvaluationsQuery = {
  __typename?: "Query";
  evaluations: {
    __typename?: "EvaluationsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "EvaluationEdge";
      node?: {
        __typename?: "Evaluation";
        id: string;
        status: GqlEvaluationStatus;
        createdAt?: Date | null;
        vcIssuanceRequest?: {
          __typename?: "VcIssuanceRequest";
          id: string;
          status: GqlVcIssuanceStatus;
          requestedAt?: Date | null;
          completedAt?: Date | null;
          user?: { __typename?: "User"; id: string; name: string } | null;
        } | null;
        participation?: {
          __typename?: "Participation";
          user?: {
            __typename?: "User";
            didIssuanceRequests?: Array<{
              __typename?: "DidIssuanceRequest";
              id: string;
              status: GqlDidIssuanceStatus;
              didValue?: string | null;
              requestedAt?: Date | null;
              processedAt?: Date | null;
              completedAt?: Date | null;
              createdAt?: Date | null;
              updatedAt?: Date | null;
            }> | null;
          } | null;
          opportunitySlot?: {
            __typename?: "OpportunitySlot";
            id: string;
            startsAt: Date;
            endsAt: Date;
            capacity?: number | null;
            opportunity?: {
              __typename?: "Opportunity";
              id: string;
              title: string;
              description: string;
              community?: { __typename?: "Community"; id: string } | null;
              createdByUser?: {
                __typename?: "User";
                id: string;
                name: string;
                didIssuanceRequests?: Array<{
                  __typename?: "DidIssuanceRequest";
                  id: string;
                  status: GqlDidIssuanceStatus;
                  didValue?: string | null;
                  requestedAt?: Date | null;
                  processedAt?: Date | null;
                  completedAt?: Date | null;
                  createdAt?: Date | null;
                  updatedAt?: Date | null;
                }> | null;
              } | null;
            } | null;
          } | null;
        } | null;
      } | null;
    }>;
  };
};

export type GqlGetEvaluationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetEvaluationQuery = {
  __typename?: "Query";
  evaluation?: {
    __typename?: "Evaluation";
    id: string;
    vcIssuanceRequest?: {
      __typename?: "VcIssuanceRequest";
      id: string;
      status: GqlVcIssuanceStatus;
      requestedAt?: Date | null;
      completedAt?: Date | null;
      user?: { __typename?: "User"; id: string; name: string } | null;
    } | null;
    participation?: {
      __typename?: "Participation";
      opportunitySlot?: {
        __typename?: "OpportunitySlot";
        id: string;
        startsAt: Date;
        endsAt: Date;
        capacity?: number | null;
        opportunity?: {
          __typename?: "Opportunity";
          id: string;
          title: string;
          description: string;
          createdByUser?: { __typename?: "User"; id: string; name: string } | null;
        } | null;
      } | null;
    } | null;
  } | null;
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
  pointsRequired?: number | null;
  earliestReservableAt?: Date | null;
};

export type GqlCreateOpportunityMutationVariables = Exact<{
  input: GqlOpportunityCreateInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlCreateOpportunityMutation = {
  __typename?: "Mutation";
  opportunityCreate?: {
    __typename?: "OpportunityCreateSuccess";
    opportunity: {
      __typename?: "Opportunity";
      id: string;
      title: string;
      category: GqlOpportunityCategory;
      description: string;
      body?: string | null;
      publishStatus: GqlPublishStatus;
      images?: Array<string> | null;
      requireApproval: boolean;
      feeRequired?: number | null;
      pointsToEarn?: number | null;
      pointsRequired?: number | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
      createdByUser?: { __typename?: "User"; id: string; name: string } | null;
      place?: { __typename?: "Place"; id: string; name: string } | null;
      slots?: Array<{
        __typename?: "OpportunitySlot";
        id: string;
        startsAt: Date;
        endsAt: Date;
        capacity?: number | null;
        hostingStatus: GqlOpportunitySlotHostingStatus;
      }> | null;
    };
  } | null;
};

export type GqlUpdateOpportunityContentMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlOpportunityUpdateContentInput;
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlUpdateOpportunityContentMutation = {
  __typename?: "Mutation";
  opportunityUpdateContent?: {
    __typename?: "OpportunityUpdateContentSuccess";
    opportunity: {
      __typename?: "Opportunity";
      id: string;
      title: string;
      category: GqlOpportunityCategory;
      description: string;
      body?: string | null;
      publishStatus: GqlPublishStatus;
      images?: Array<string> | null;
      requireApproval: boolean;
      feeRequired?: number | null;
      pointsToEarn?: number | null;
      pointsRequired?: number | null;
      updatedAt?: Date | null;
      place?: { __typename?: "Place"; id: string; name: string } | null;
      createdByUser?: { __typename?: "User"; id: string; name: string } | null;
    };
  } | null;
};

export type GqlUpdateOpportunitySlotsBulkMutationVariables = Exact<{
  input: GqlOpportunitySlotsBulkUpdateInput;
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlUpdateOpportunitySlotsBulkMutation = {
  __typename?: "Mutation";
  opportunitySlotsBulkUpdate?: {
    __typename?: "OpportunitySlotsBulkUpdateSuccess";
    slots: Array<{
      __typename?: "OpportunitySlot";
      id: string;
      startsAt: Date;
      endsAt: Date;
      capacity?: number | null;
      hostingStatus: GqlOpportunitySlotHostingStatus;
      remainingCapacity?: number | null;
    }>;
  } | null;
};

export type GqlSetPublishStatusMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlOpportunitySetPublishStatusInput;
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlSetPublishStatusMutation = {
  __typename?: "Mutation";
  opportunitySetPublishStatus?: {
    __typename?: "OpportunitySetPublishStatusSuccess";
    opportunity: {
      __typename?: "Opportunity";
      id: string;
      publishStatus: GqlPublishStatus;
      updatedAt?: Date | null;
    };
  } | null;
};

export type GqlSetOpportunitySlotHostingStatusMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlOpportunitySlotSetHostingStatusInput;
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlSetOpportunitySlotHostingStatusMutation = {
  __typename?: "Mutation";
  opportunitySlotSetHostingStatus?: {
    __typename?: "OpportunitySlotSetHostingStatusSuccess";
    slot: {
      __typename?: "OpportunitySlot";
      id: string;
      startsAt: Date;
      endsAt: Date;
      capacity?: number | null;
      hostingStatus: GqlOpportunitySlotHostingStatus;
      remainingCapacity?: number | null;
    };
  } | null;
};

export type GqlDeleteOpportunityMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlDeleteOpportunityMutation = {
  __typename?: "Mutation";
  opportunityDelete?: { __typename?: "OpportunityDeleteSuccess"; opportunityId: string } | null;
};

export type GqlGetAdminOpportunitiesQueryVariables = Exact<{
  filter?: InputMaybe<GqlOpportunityFilterInput>;
  sort?: InputMaybe<GqlOpportunitySortInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GqlGetAdminOpportunitiesQuery = {
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
        publishStatus: GqlPublishStatus;
        category: GqlOpportunityCategory;
        images?: Array<string> | null;
        requireApproval: boolean;
        createdAt?: Date | null;
        updatedAt?: Date | null;
        createdByUser?: { __typename?: "User"; id: string; name: string } | null;
      } | null;
    }>;
  };
};

export type GqlGetOpportunitiesQueryVariables = Exact<{
  filter?: InputMaybe<GqlOpportunityFilterInput>;
  sort?: InputMaybe<GqlOpportunitySortInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  includeSlot?: Scalars["Boolean"]["input"];
  slotFilter?: InputMaybe<GqlOpportunitySlotFilterInput>;
  slotSort?: InputMaybe<GqlOpportunitySlotSortInput>;
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
        category: GqlOpportunityCategory;
        images?: Array<string> | null;
        isReservableWithTicket?: boolean | null;
        feeRequired?: number | null;
        pointsToEarn?: number | null;
        pointsRequired?: number | null;
        place?: { __typename?: "Place"; id: string; name: string } | null;
        slots?: Array<{
          __typename?: "OpportunitySlot";
          id: string;
          startsAt: Date;
          endsAt: Date;
          capacity?: number | null;
          remainingCapacity?: number | null;
          hostingStatus: GqlOpportunitySlotHostingStatus;
        }> | null;
      } | null;
    }>;
  };
};

export type GqlGetOpportunityQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
  slotFilter?: InputMaybe<GqlOpportunitySlotFilterInput>;
  slotSort?: InputMaybe<GqlOpportunitySlotSortInput>;
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
    pointsRequired?: number | null;
    earliestReservableAt?: Date | null;
    requiredUtilities?: Array<{
      __typename?: "Utility";
      id: string;
      pointsRequired: number;
      publishStatus: GqlPublishStatus;
    }> | null;
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
      city?: { __typename?: "City"; state?: { __typename?: "State"; code: string } | null } | null;
    } | null;
    slots?: Array<{
      __typename?: "OpportunitySlot";
      id: string;
      startsAt: Date;
      endsAt: Date;
      capacity?: number | null;
      remainingCapacity?: number | null;
      hostingStatus: GqlOpportunitySlotHostingStatus;
    }> | null;
    articles?: Array<{
      __typename?: "Article";
      id: string;
      category: GqlArticleCategory;
      title: string;
      thumbnail?: string | null;
      introduction: string;
      publishedAt?: Date | null;
    }> | null;
    createdByUser?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      articlesAboutMe?: Array<{
        __typename?: "Article";
        id: string;
        category: GqlArticleCategory;
        title: string;
        thumbnail?: string | null;
        introduction: string;
        publishedAt?: Date | null;
      }> | null;
    } | null;
  } | null;
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

export type GqlOpportunitySlotSetHostingStatusMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlOpportunitySlotSetHostingStatusInput;
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlOpportunitySlotSetHostingStatusMutation = {
  __typename?: "Mutation";
  opportunitySlotSetHostingStatus?: {
    __typename?: "OpportunitySlotSetHostingStatusSuccess";
    slot: {
      __typename?: "OpportunitySlot";
      id: string;
      hostingStatus: GqlOpportunitySlotHostingStatus;
      startsAt: Date;
      endsAt: Date;
      capacity?: number | null;
      remainingCapacity?: number | null;
    };
  } | null;
};

export type GqlGetOpportunitySlotsQueryVariables = Exact<{
  filter?: InputMaybe<GqlOpportunitySlotFilterInput>;
  sort?: InputMaybe<GqlOpportunitySlotSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
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
        isFullyEvaluated?: boolean | null;
        numParticipants?: number | null;
        numEvaluated?: number | null;
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
          pointsRequired?: number | null;
          earliestReservableAt?: Date | null;
        } | null;
        reservations?: Array<{
          __typename?: "Reservation";
          id: string;
          status: GqlReservationStatus;
          comment?: string | null;
          participantCountWithPoint?: number | null;
          participations?: Array<{
            __typename?: "Participation";
            id: string;
            source?: GqlSource | null;
            status: GqlParticipationStatus;
            reason: GqlParticipationStatusReason;
            images?: Array<string> | null;
            description?: string | null;
            evaluation?: {
              __typename?: "Evaluation";
              id: string;
              status: GqlEvaluationStatus;
            } | null;
          }> | null;
        }> | null;
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

export type GqlGetOpportunitySlotWithParticipationsQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetOpportunitySlotWithParticipationsQuery = {
  __typename?: "Query";
  opportunitySlot?: {
    __typename?: "OpportunitySlot";
    id: string;
    hostingStatus: GqlOpportunitySlotHostingStatus;
    startsAt: Date;
    endsAt: Date;
    capacity?: number | null;
    remainingCapacity?: number | null;
    isFullyEvaluated?: boolean | null;
    numParticipants?: number | null;
    numEvaluated?: number | null;
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
      pointsRequired?: number | null;
      earliestReservableAt?: Date | null;
      community?: {
        __typename?: "Community";
        id: string;
        name?: string | null;
        image?: string | null;
      } | null;
    } | null;
    reservations?: Array<{
      __typename?: "Reservation";
      id: string;
      status: GqlReservationStatus;
      comment?: string | null;
      participantCountWithPoint?: number | null;
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
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
        } | null;
        evaluation?: { __typename?: "Evaluation"; id: string; status: GqlEvaluationStatus } | null;
      }> | null;
    }> | null;
  } | null;
};

export type GqlGetSlotReservationsQueryVariables = Exact<{
  slotId: Scalars["ID"]["input"];
}>;

export type GqlGetSlotReservationsQuery = {
  __typename?: "Query";
  opportunitySlot?: {
    __typename?: "OpportunitySlot";
    id: string;
    reservations?: Array<{
      __typename?: "Reservation";
      id: string;
      status: GqlReservationStatus;
    }> | null;
  } | null;
};

export type GqlParticipationBulkCreateMutationVariables = Exact<{
  input: GqlParticipationBulkCreateInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlParticipationBulkCreateMutation = {
  __typename?: "Mutation";
  participationBulkCreate?: {
    __typename?: "ParticipationBulkCreateSuccess";
    participations: Array<{
      __typename?: "Participation";
      id: string;
      source?: GqlSource | null;
      status: GqlParticipationStatus;
      reason: GqlParticipationStatusReason;
      images?: Array<string> | null;
      description?: string | null;
    }>;
  } | null;
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

export type GqlGetParticipationsQueryVariables = Exact<{
  filter?: InputMaybe<GqlParticipationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetParticipationsQuery = {
  __typename?: "Query";
  participations: {
    __typename?: "ParticipationsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "ParticipationEdge";
      node?: {
        __typename?: "Participation";
        id: string;
        reason: GqlParticipationStatusReason;
        user?: { __typename?: "User"; id: string } | null;
        reservation?: {
          __typename?: "Reservation";
          opportunitySlot?: {
            __typename?: "OpportunitySlot";
            id: string;
            reservations?: Array<{
              __typename?: "Reservation";
              createdByUser?: { __typename?: "User"; id: string } | null;
            }> | null;
          } | null;
        } | null;
        opportunitySlot?: {
          __typename?: "OpportunitySlot";
          id: string;
          reservations?: Array<{
            __typename?: "Reservation";
            createdByUser?: { __typename?: "User"; id: string } | null;
          }> | null;
        } | null;
      } | null;
    }>;
  };
};

export type GqlGetParticipationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  withDidIssuanceRequests?: Scalars["Boolean"]["input"];
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
      comment?: string | null;
      participantCountWithPoint?: number | null;
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
          pointsRequired?: number | null;
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
            phoneNumber?: string | null;
            preferredLanguage?: GqlLanguage | null;
            urlFacebook?: string | null;
            urlInstagram?: string | null;
            urlX?: string | null;
            nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
        pointsRequired?: number | null;
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
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          didIssuanceRequests?: Array<{
            __typename?: "DidIssuanceRequest";
            id: string;
            status: GqlDidIssuanceStatus;
            didValue?: string | null;
            requestedAt?: Date | null;
            processedAt?: Date | null;
            completedAt?: Date | null;
            createdAt?: Date | null;
            updatedAt?: Date | null;
          }> | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
    evaluation?: {
      __typename?: "Evaluation";
      id: string;
      status: GqlEvaluationStatus;
      participation?: {
        __typename?: "Participation";
        user?: {
          __typename?: "User";
          didIssuanceRequests?: Array<{
            __typename?: "DidIssuanceRequest";
            id: string;
            status: GqlDidIssuanceStatus;
            didValue?: string | null;
            requestedAt?: Date | null;
            processedAt?: Date | null;
            completedAt?: Date | null;
            createdAt?: Date | null;
            updatedAt?: Date | null;
          }> | null;
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
        phoneNumber?: string | null;
        preferredLanguage?: GqlLanguage | null;
        urlFacebook?: string | null;
        urlInstagram?: string | null;
        urlX?: string | null;
        nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
      } | null;
    }> | null;
    user?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      phoneNumber?: string | null;
      preferredLanguage?: GqlLanguage | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
    } | null;
  } | null;
};

export type GqlReservationFieldsFragment = {
  __typename?: "Reservation";
  id: string;
  status: GqlReservationStatus;
  comment?: string | null;
  participantCountWithPoint?: number | null;
};

export type GqlCreateReservationMutationVariables = Exact<{
  input: GqlReservationCreateInput;
}>;

export type GqlCreateReservationMutation = {
  __typename?: "Mutation";
  reservationCreate?: {
    __typename?: "ReservationCreateSuccess";
    reservation: {
      __typename?: "Reservation";
      id: string;
      status: GqlReservationStatus;
      comment?: string | null;
      participantCountWithPoint?: number | null;
      participations?: Array<{
        __typename?: "Participation";
        id: string;
        source?: GqlSource | null;
        status: GqlParticipationStatus;
        reason: GqlParticipationStatusReason;
        images?: Array<string> | null;
        description?: string | null;
      }> | null;
    };
  } | null;
};

export type GqlCancelReservationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlReservationCancelInput;
  permission: GqlCheckIsSelfPermissionInput;
}>;

export type GqlCancelReservationMutation = {
  __typename?: "Mutation";
  reservationCancel?: {
    __typename?: "ReservationSetStatusSuccess";
    reservation: {
      __typename?: "Reservation";
      id: string;
      status: GqlReservationStatus;
      comment?: string | null;
      participantCountWithPoint?: number | null;
    };
  } | null;
};

export type GqlReservationAcceptMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlReservationAcceptMutation = {
  __typename?: "Mutation";
  reservationAccept?: {
    __typename?: "ReservationSetStatusSuccess";
    reservation: { __typename?: "Reservation"; id: string; status: GqlReservationStatus };
  } | null;
};

export type GqlRejectReservationMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlReservationRejectInput;
  permission: GqlCheckOpportunityPermissionInput;
}>;

export type GqlRejectReservationMutation = {
  __typename?: "Mutation";
  reservationReject?: {
    __typename?: "ReservationSetStatusSuccess";
    reservation: {
      __typename?: "Reservation";
      id: string;
      status: GqlReservationStatus;
      comment?: string | null;
    };
  } | null;
};

export type GqlGetReservationsQueryVariables = Exact<{
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<GqlReservationSortInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  filter?: InputMaybe<GqlReservationFilterInput>;
}>;

export type GqlGetReservationsQuery = {
  __typename?: "Query";
  reservations: {
    __typename?: "ReservationsConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges: Array<{
      __typename?: "ReservationEdge";
      cursor: string;
      node?: {
        __typename?: "Reservation";
        createdAt?: Date | null;
        id: string;
        status: GqlReservationStatus;
        comment?: string | null;
        participantCountWithPoint?: number | null;
        createdByUser?: {
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
        } | null;
        opportunitySlot?: {
          __typename?: "OpportunitySlot";
          id: string;
          hostingStatus: GqlOpportunitySlotHostingStatus;
          startsAt: Date;
          endsAt: Date;
          opportunity?: {
            __typename?: "Opportunity";
            id: string;
            title: string;
            category: GqlOpportunityCategory;
            description: string;
            publishStatus: GqlPublishStatus;
            requireApproval: boolean;
          } | null;
        } | null;
        participations?: Array<{
          __typename?: "Participation";
          id: string;
          status: GqlParticipationStatus;
          reason: GqlParticipationStatusReason;
          user?: { __typename?: "User"; id: string; name: string } | null;
          evaluation?: {
            __typename?: "Evaluation";
            id: string;
            status: GqlEvaluationStatus;
          } | null;
        }> | null;
      } | null;
    }>;
  };
};

export type GqlGetReservationQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
  includeHostArticle?: Scalars["Boolean"]["input"];
}>;

export type GqlGetReservationQuery = {
  __typename?: "Query";
  reservation?: {
    __typename?: "Reservation";
    id: string;
    status: GqlReservationStatus;
    comment?: string | null;
    participantCountWithPoint?: number | null;
    createdByUser?: {
      __typename?: "User";
      id: string;
      name: string;
      image?: string | null;
      bio?: string | null;
      currentPrefecture?: GqlCurrentPrefecture | null;
      phoneNumber?: string | null;
      preferredLanguage?: GqlLanguage | null;
      urlFacebook?: string | null;
      urlInstagram?: string | null;
      urlX?: string | null;
      nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
    } | null;
    opportunitySlot?: {
      __typename?: "OpportunitySlot";
      isFullyEvaluated?: boolean | null;
      numParticipants?: number | null;
      numEvaluated?: number | null;
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
        pointsRequired?: number | null;
        earliestReservableAt?: Date | null;
        slots?: Array<{
          __typename?: "OpportunitySlot";
          isFullyEvaluated?: boolean | null;
          numParticipants?: number | null;
          numEvaluated?: number | null;
          id: string;
          hostingStatus: GqlOpportunitySlotHostingStatus;
          startsAt: Date;
          endsAt: Date;
          capacity?: number | null;
          remainingCapacity?: number | null;
        }> | null;
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
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          articlesAboutMe?: Array<{
            __typename?: "Article";
            id: string;
            title: string;
            body?: string | null;
            introduction: string;
            thumbnail?: string | null;
            category: GqlArticleCategory;
            publishStatus: GqlPublishStatus;
            publishedAt?: Date | null;
          }> | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
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
      user?: {
        __typename?: "User";
        id: string;
        name: string;
        image?: string | null;
        bio?: string | null;
        currentPrefecture?: GqlCurrentPrefecture | null;
        phoneNumber?: string | null;
        preferredLanguage?: GqlLanguage | null;
        urlFacebook?: string | null;
        urlInstagram?: string | null;
        urlX?: string | null;
        nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
      } | null;
      evaluation?: {
        __typename?: "Evaluation";
        id: string;
        comment?: string | null;
        credentialUrl?: string | null;
        status: GqlEvaluationStatus;
        createdAt?: Date | null;
        updatedAt?: Date | null;
        issuedAt?: Date | null;
      } | null;
      ticketStatusHistories?: Array<{
        __typename?: "TicketStatusHistory";
        id: string;
        reason: GqlTicketStatusReason;
        status: GqlTicketStatus;
        ticket?: {
          __typename?: "Ticket";
          id: string;
          reason: GqlTicketStatusReason;
          status: GqlTicketStatus;
        } | null;
      }> | null;
    }> | null;
  } | null;
};

export type GqlGetVcIssuanceRequestByEvaluationQueryVariables = Exact<{
  evaluationId: Scalars["ID"]["input"];
}>;

export type GqlGetVcIssuanceRequestByEvaluationQuery = {
  __typename?: "Query";
  vcIssuanceRequests: {
    __typename?: "VcIssuanceRequestsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "VcIssuanceRequestEdge";
      node?: {
        __typename?: "VcIssuanceRequest";
        id: string;
        completedAt?: Date | null;
        status: GqlVcIssuanceStatus;
      } | null;
    }>;
  };
};

export type GqlGetVcIssuanceRequestsByUserQueryVariables = Exact<{
  userIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
}>;

export type GqlGetVcIssuanceRequestsByUserQuery = {
  __typename?: "Query";
  vcIssuanceRequests: {
    __typename?: "VcIssuanceRequestsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "VcIssuanceRequestEdge";
      node?: {
        __typename?: "VcIssuanceRequest";
        id: string;
        status: GqlVcIssuanceStatus;
        completedAt?: Date | null;
        createdAt?: Date | null;
        evaluation?: {
          __typename?: "Evaluation";
          id: string;
          status: GqlEvaluationStatus;
          participation?: {
            __typename?: "Participation";
            id: string;
            opportunitySlot?: { __typename?: "OpportunitySlot"; id: string } | null;
          } | null;
        } | null;
        user?: { __typename?: "User"; id: string } | null;
      } | null;
    }>;
  };
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

export type GqlPlaceCreateMutationVariables = Exact<{
  input: GqlPlaceCreateInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlPlaceCreateMutation = {
  __typename?: "Mutation";
  placeCreate?: {
    __typename?: "PlaceCreateSuccess";
    place: {
      __typename?: "Place";
      id: string;
      name: string;
      address: string;
      latitude: any;
      longitude: any;
      googlePlaceId?: string | null;
      isManual?: boolean | null;
      mapLocation?: any | null;
      image?: string | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
      city?: {
        __typename?: "City";
        code: string;
        name: string;
        state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
      } | null;
      community?: { __typename?: "Community"; id: string } | null;
    };
  } | null;
};

export type GqlPlaceUpdateMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlPlaceUpdateInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlPlaceUpdateMutation = {
  __typename?: "Mutation";
  placeUpdate?: {
    __typename?: "PlaceUpdateSuccess";
    place: {
      __typename?: "Place";
      id: string;
      name: string;
      address: string;
      latitude: any;
      longitude: any;
      googlePlaceId?: string | null;
      isManual?: boolean | null;
      mapLocation?: any | null;
      image?: string | null;
      updatedAt?: Date | null;
      city?: {
        __typename?: "City";
        code: string;
        name: string;
        state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
      } | null;
    };
  } | null;
};

export type GqlPlaceDeleteMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlPlaceDeleteMutation = {
  __typename?: "Mutation";
  placeDelete?: { __typename?: "PlaceDeleteSuccess"; id: string } | null;
};

export type GqlGetPlacesQueryVariables = Exact<{
  filter?: InputMaybe<GqlPlaceFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  sort?: InputMaybe<GqlPlaceSortInput>;
  IsCard?: Scalars["Boolean"]["input"];
}>;

export type GqlGetPlacesQuery = {
  __typename?: "Query";
  places: {
    __typename?: "PlacesConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges?: Array<{
      __typename?: "PlaceEdge";
      cursor: string;
      node?: {
        __typename?: "Place";
        accumulatedParticipants?: number | null;
        currentPublicOpportunityCount?: number | null;
        id: string;
        name: string;
        address: string;
        latitude: any;
        longitude: any;
        opportunities?: Array<{
          __typename?: "Opportunity";
          id: string;
          images?: Array<string> | null;
          articles?: Array<{
            __typename?: "Article";
            id: string;
            title: string;
            body?: string | null;
            introduction: string;
            thumbnail?: string | null;
            category: GqlArticleCategory;
            publishStatus: GqlPublishStatus;
            publishedAt?: Date | null;
            relatedUsers?: Array<{
              __typename?: "User";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
              currentPrefecture?: GqlCurrentPrefecture | null;
              phoneNumber?: string | null;
              preferredLanguage?: GqlLanguage | null;
              urlFacebook?: string | null;
              urlInstagram?: string | null;
              urlX?: string | null;
              nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
            }> | null;
          }> | null;
          createdByUser?: {
            __typename?: "User";
            image?: string | null;
            articlesAboutMe?: Array<{
              __typename?: "Article";
              title: string;
              introduction: string;
              thumbnail?: string | null;
            }> | null;
          } | null;
        }> | null;
        city?: {
          __typename?: "City";
          code: string;
          name: string;
          state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
        } | null;
      } | null;
    } | null> | null;
  };
};

export type GqlGetPlaceQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetPlaceQuery = {
  __typename?: "Query";
  place?: {
    __typename?: "Place";
    id: string;
    name: string;
    address: string;
    latitude: any;
    longitude: any;
    opportunities?: Array<{
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
      pointsRequired?: number | null;
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
          state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
        } | null;
      } | null;
      createdByUser?: {
        __typename?: "User";
        id: string;
        name: string;
        image?: string | null;
        bio?: string | null;
        currentPrefecture?: GqlCurrentPrefecture | null;
        phoneNumber?: string | null;
        preferredLanguage?: GqlLanguage | null;
        urlFacebook?: string | null;
        urlInstagram?: string | null;
        urlX?: string | null;
        articlesAboutMe?: Array<{
          __typename?: "Article";
          id: string;
          title: string;
          body?: string | null;
          introduction: string;
          thumbnail?: string | null;
          category: GqlArticleCategory;
          publishStatus: GqlPublishStatus;
          publishedAt?: Date | null;
        }> | null;
        nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
      } | null;
      articles?: Array<{
        __typename?: "Article";
        id: string;
        title: string;
        body?: string | null;
        introduction: string;
        thumbnail?: string | null;
        category: GqlArticleCategory;
        publishStatus: GqlPublishStatus;
        publishedAt?: Date | null;
        relatedUsers?: Array<{
          __typename?: "User";
          id: string;
          name: string;
          image?: string | null;
          bio?: string | null;
          currentPrefecture?: GqlCurrentPrefecture | null;
          phoneNumber?: string | null;
          preferredLanguage?: GqlLanguage | null;
          urlFacebook?: string | null;
          urlInstagram?: string | null;
          urlX?: string | null;
          nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
        }> | null;
      }> | null;
    }> | null;
    city?: {
      __typename?: "City";
      code: string;
      name: string;
      state?: { __typename?: "State"; code: string; countryCode: string; name: string } | null;
    } | null;
  } | null;
};

export type GqlTicketFieldsFragment = {
  __typename?: "Ticket";
  id: string;
  reason: GqlTicketStatusReason;
  status: GqlTicketStatus;
};

export type GqlTicketIssueMutationVariables = Exact<{
  input: GqlTicketIssueInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlTicketIssueMutation = {
  __typename?: "Mutation";
  ticketIssue?: {
    __typename?: "TicketIssueSuccess";
    issue: {
      __typename?: "TicketIssuer";
      id: string;
      qtyToBeIssued: number;
      claimLink?: {
        __typename?: "TicketClaimLink";
        id: string;
        qty: number;
        status: GqlClaimLinkStatus;
        claimedAt?: Date | null;
      } | null;
      utility?: {
        __typename?: "Utility";
        id: string;
        name?: string | null;
        description?: string | null;
        images?: Array<string> | null;
        publishStatus: GqlPublishStatus;
        pointsRequired: number;
      } | null;
    };
  } | null;
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

export type GqlGetTicketsQueryVariables = Exact<{
  filter?: InputMaybe<GqlTicketFilterInput>;
  sort?: InputMaybe<GqlTicketSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetTicketsQuery = {
  __typename?: "Query";
  tickets: {
    __typename?: "TicketsConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges?: Array<{
      __typename?: "TicketEdge";
      cursor: string;
      node?: {
        __typename?: "Ticket";
        id: string;
        reason: GqlTicketStatusReason;
        status: GqlTicketStatus;
        claimLink?: {
          __typename?: "TicketClaimLink";
          id: string;
          qty: number;
          status: GqlClaimLinkStatus;
          claimedAt?: Date | null;
          issuer?: {
            __typename?: "TicketIssuer";
            id: string;
            qtyToBeIssued: number;
            owner?: {
              __typename?: "User";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
              currentPrefecture?: GqlCurrentPrefecture | null;
              phoneNumber?: string | null;
              preferredLanguage?: GqlLanguage | null;
              urlFacebook?: string | null;
              urlInstagram?: string | null;
              urlX?: string | null;
              nftWallet?: { __typename?: "NftWallet"; id: string; walletAddress: string } | null;
            } | null;
          } | null;
        } | null;
      } | null;
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
    createdAt?: Date | null;
    claimedAt?: Date | null;
    issuer?: {
      __typename?: "TicketIssuer";
      qtyToBeIssued: number;
      owner?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
      utility?: {
        __typename?: "Utility";
        name?: string | null;
        description?: string | null;
      } | null;
    } | null;
    tickets?: Array<{
      __typename?: "Ticket";
      wallet?: {
        __typename?: "Wallet";
        user?: { __typename?: "User"; id: string; name: string } | null;
      } | null;
    }> | null;
  } | null;
};

export type GqlTicketClaimLinksQueryVariables = Exact<{
  filter?: InputMaybe<GqlTicketClaimLinkFilterInput>;
  sort?: InputMaybe<GqlTicketClaimLinkSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlTicketClaimLinksQuery = {
  __typename?: "Query";
  ticketClaimLinks: {
    __typename?: "TicketClaimLinksConnection";
    totalCount: number;
    edges?: Array<{
      __typename?: "TicketClaimLinkEdge";
      cursor: string;
      node?: {
        __typename?: "TicketClaimLink";
        id: string;
        status: GqlClaimLinkStatus;
        qty: number;
        claimedAt?: Date | null;
        createdAt?: Date | null;
        issuer?: {
          __typename?: "TicketIssuer";
          id: string;
          owner?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
        } | null;
        tickets?: Array<{ __typename?: "Ticket"; status: GqlTicketStatus }> | null;
      } | null;
    } | null> | null;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GqlGetTicketIssuersQueryVariables = Exact<{
  filter?: InputMaybe<GqlTicketIssuerFilterInput>;
  sort?: InputMaybe<GqlTicketIssuerSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetTicketIssuersQuery = {
  __typename?: "Query";
  ticketIssuers: {
    __typename?: "TicketIssuersConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges?: Array<{
      __typename?: "TicketIssuerEdge";
      cursor: string;
      node?: {
        __typename?: "TicketIssuer";
        id: string;
        qtyToBeIssued: number;
        createdAt?: Date | null;
        utility?: { __typename?: "Utility"; id: string; name?: string | null } | null;
        claimLink?: {
          __typename?: "TicketClaimLink";
          id: string;
          qty: number;
          status: GqlClaimLinkStatus;
          claimedAt?: Date | null;
        } | null;
        owner?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
      } | null;
    } | null> | null;
  };
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

export type GqlUtilityWithOwnerFieldsFragment = {
  __typename?: "Utility";
  id: string;
  name?: string | null;
  description?: string | null;
  images?: Array<string> | null;
  publishStatus: GqlPublishStatus;
  pointsRequired: number;
  owner?: { __typename?: "User"; id: string; name: string } | null;
};

export type GqlCreateUtilityMutationVariables = Exact<{
  input: GqlUtilityCreateInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlCreateUtilityMutation = {
  __typename?: "Mutation";
  utilityCreate?: {
    __typename?: "UtilityCreateSuccess";
    utility: {
      __typename?: "Utility";
      id: string;
      name?: string | null;
      description?: string | null;
      images?: Array<string> | null;
      publishStatus: GqlPublishStatus;
      pointsRequired: number;
    };
  } | null;
};

export type GqlGetUtilitiesQueryVariables = Exact<{
  filter?: InputMaybe<GqlUtilityFilterInput>;
  sort?: InputMaybe<GqlUtilitySortInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetUtilitiesQuery = {
  __typename?: "Query";
  utilities: {
    __typename?: "UtilitiesConnection";
    totalCount: number;
    pageInfo: {
      __typename?: "PageInfo";
      startCursor?: string | null;
      endCursor?: string | null;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    edges?: Array<{
      __typename?: "UtilityEdge";
      cursor: string;
      node?: {
        __typename?: "Utility";
        id: string;
        name?: string | null;
        description?: string | null;
        pointsRequired: number;
        requiredForOpportunities?: Array<{
          __typename?: "Opportunity";
          id: string;
          title: string;
          description: string;
          images?: Array<string> | null;
          feeRequired?: number | null;
          category: GqlOpportunityCategory;
          publishStatus: GqlPublishStatus;
          requireApproval: boolean;
          place?: {
            __typename?: "Place";
            id: string;
            name: string;
            address: string;
            latitude: any;
            longitude: any;
          } | null;
        }> | null;
      } | null;
    } | null> | null;
  };
};

export type GqlTransactionFieldsFragment = {
  __typename?: "Transaction";
  id: string;
  reason: GqlTransactionReason;
  comment?: string | null;
  images?: Array<string> | null;
  fromPointChange?: number | null;
  toPointChange?: number | null;
  chainDepth?: number | null;
  createdAt?: Date | null;
};

export type GqlPointIssueMutationVariables = Exact<{
  input: GqlTransactionIssueCommunityPointInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlPointIssueMutation = {
  __typename?: "Mutation";
  transactionIssueCommunityPoint?: {
    __typename?: "TransactionIssueCommunityPointSuccess";
    transaction: {
      __typename?: "Transaction";
      id: string;
      reason: GqlTransactionReason;
      comment?: string | null;
      images?: Array<string> | null;
      fromPointChange?: number | null;
      toPointChange?: number | null;
      chainDepth?: number | null;
      createdAt?: Date | null;
    };
  } | null;
};

export type GqlPointGrantMutationVariables = Exact<{
  input: GqlTransactionGrantCommunityPointInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlPointGrantMutation = {
  __typename?: "Mutation";
  transactionGrantCommunityPoint?: {
    __typename?: "TransactionGrantCommunityPointSuccess";
    transaction: {
      __typename?: "Transaction";
      id: string;
      reason: GqlTransactionReason;
      comment?: string | null;
      images?: Array<string> | null;
      fromPointChange?: number | null;
      toPointChange?: number | null;
      chainDepth?: number | null;
      createdAt?: Date | null;
    };
  } | null;
};

export type GqlPointDonateMutationVariables = Exact<{
  input: GqlTransactionDonateSelfPointInput;
  permission: GqlCheckIsSelfPermissionInput;
}>;

export type GqlPointDonateMutation = {
  __typename?: "Mutation";
  transactionDonateSelfPoint?: {
    __typename?: "TransactionDonateSelfPointSuccess";
    transaction: {
      __typename?: "Transaction";
      id: string;
      reason: GqlTransactionReason;
      comment?: string | null;
      images?: Array<string> | null;
      fromPointChange?: number | null;
      toPointChange?: number | null;
      chainDepth?: number | null;
      createdAt?: Date | null;
    };
  } | null;
};

export type GqlTransactionUpdateMetadataMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  input: GqlTransactionUpdateMetadataInput;
  permission?: InputMaybe<GqlCheckIsSelfPermissionInput>;
  communityPermission?: InputMaybe<GqlCheckCommunityPermissionInput>;
}>;

export type GqlTransactionUpdateMetadataMutation = {
  __typename?: "Mutation";
  transactionUpdateMetadata?: {
    __typename?: "TransactionUpdateMetadataSuccess";
    transaction: {
      __typename?: "Transaction";
      id: string;
      comment?: string | null;
      images?: Array<string> | null;
    };
  } | null;
};

export type GqlGetTransactionsQueryVariables = Exact<{
  filter?: InputMaybe<GqlTransactionFilterInput>;
  sort?: InputMaybe<GqlTransactionSortInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  withDidIssuanceRequests?: InputMaybe<Scalars["Boolean"]["input"]>;
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
        comment?: string | null;
        images?: Array<string> | null;
        fromPointChange?: number | null;
        toPointChange?: number | null;
        chainDepth?: number | null;
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
            didIssuanceRequests?: Array<{
              __typename?: "DidIssuanceRequest";
              status: GqlDidIssuanceStatus;
              didValue?: string | null;
            }> | null;
          } | null;
          community?: {
            __typename?: "Community";
            id: string;
            name?: string | null;
            image?: string | null;
          } | null;
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
            didIssuanceRequests?: Array<{
              __typename?: "DidIssuanceRequest";
              status: GqlDidIssuanceStatus;
              didValue?: string | null;
            }> | null;
          } | null;
          community?: {
            __typename?: "Community";
            id: string;
            name?: string | null;
            image?: string | null;
          } | null;
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

export type GqlGetTransactionDetailQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetTransactionDetailQuery = {
  __typename?: "Query";
  transaction?: {
    __typename?: "Transaction";
    id: string;
    reason: GqlTransactionReason;
    comment?: string | null;
    images?: Array<string> | null;
    fromPointChange?: number | null;
    toPointChange?: number | null;
    chainDepth?: number | null;
    createdAt?: Date | null;
    chain?: {
      __typename?: "TransactionChain";
      depth: number;
      steps: Array<{
        __typename?: "TransactionChainStep";
        id: string;
        points: number;
        reason: GqlTransactionReason;
        createdAt: Date;
        from?:
          | {
              __typename: "TransactionChainCommunity";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
            }
          | {
              __typename: "TransactionChainUser";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
            }
          | null;
        to?:
          | {
              __typename: "TransactionChainCommunity";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
            }
          | {
              __typename: "TransactionChainUser";
              id: string;
              name: string;
              image?: string | null;
              bio?: string | null;
            }
          | null;
      }>;
    } | null;
    fromWallet?: {
      __typename?: "Wallet";
      id: string;
      type: GqlWalletType;
      user?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
      community?: {
        __typename?: "Community";
        id: string;
        name?: string | null;
        image?: string | null;
      } | null;
    } | null;
    toWallet?: {
      __typename?: "Wallet";
      id: string;
      type: GqlWalletType;
      user?: { __typename?: "User"; id: string; name: string; image?: string | null } | null;
      community?: {
        __typename?: "Community";
        id: string;
        name?: string | null;
        image?: string | null;
      } | null;
    } | null;
  } | null;
};

export type GqlVerifyTransactionsQueryVariables = Exact<{
  txIds: Array<Scalars["ID"]["input"]> | Scalars["ID"]["input"];
}>;

export type GqlVerifyTransactionsQuery = {
  __typename?: "Query";
  verifyTransactions?: Array<{
    __typename?: "TransactionVerificationResult";
    txId: string;
    status: GqlVerificationStatus;
    transactionHash: string;
    rootHash: string;
    label: number;
  }> | null;
};

export type GqlVoteTopicFieldsFragment = {
  __typename?: "VoteTopic";
  id: string;
  title: string;
  description?: string | null;
  startsAt: Date;
  endsAt: Date;
  phase: GqlVoteTopicPhase;
  createdAt: Date;
  updatedAt?: Date | null;
  options: Array<{
    __typename?: "VoteOption";
    id: string;
    label: string;
    orderIndex: number;
    voteCount?: number | null;
    totalPower?: number | null;
  }>;
  gate: {
    __typename?: "VoteGate";
    id: string;
    type: GqlVoteGateType;
    requiredRole?: GqlRole | null;
    nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
  };
  powerPolicy: {
    __typename?: "VotePowerPolicy";
    id: string;
    type: GqlVotePowerPolicyType;
    nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
  };
};

export type GqlCreateVoteTopicMutationVariables = Exact<{
  input: GqlVoteTopicCreateInput;
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlCreateVoteTopicMutation = {
  __typename?: "Mutation";
  voteTopicCreate: {
    __typename?: "VoteTopicCreateSuccess";
    voteTopic: {
      __typename?: "VoteTopic";
      id: string;
      title: string;
      description?: string | null;
      startsAt: Date;
      endsAt: Date;
      phase: GqlVoteTopicPhase;
      createdAt: Date;
      updatedAt?: Date | null;
      options: Array<{
        __typename?: "VoteOption";
        id: string;
        label: string;
        orderIndex: number;
        voteCount?: number | null;
        totalPower?: number | null;
      }>;
      gate: {
        __typename?: "VoteGate";
        id: string;
        type: GqlVoteGateType;
        requiredRole?: GqlRole | null;
        nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
      };
      powerPolicy: {
        __typename?: "VotePowerPolicy";
        id: string;
        type: GqlVotePowerPolicyType;
        nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
      };
    };
  };
};

export type GqlDeleteVoteTopicMutationVariables = Exact<{
  id: Scalars["ID"]["input"];
  permission: GqlCheckCommunityPermissionInput;
}>;

export type GqlDeleteVoteTopicMutation = {
  __typename?: "Mutation";
  voteTopicDelete: { __typename?: "VoteTopicDeleteSuccess"; voteTopicId: string };
};

export type GqlVoteTopicListItemFieldsFragment = {
  __typename?: "VoteTopic";
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  phase: GqlVoteTopicPhase;
  options: Array<{ __typename?: "VoteOption"; id: string }>;
  gate: {
    __typename?: "VoteGate";
    id: string;
    type: GqlVoteGateType;
    requiredRole?: GqlRole | null;
    nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
  };
  powerPolicy: {
    __typename?: "VotePowerPolicy";
    id: string;
    type: GqlVotePowerPolicyType;
    nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
  };
};

export type GqlGetVoteTopicsQueryVariables = Exact<{
  communityId: Scalars["ID"]["input"];
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GqlGetVoteTopicsQuery = {
  __typename?: "Query";
  voteTopics: {
    __typename?: "VoteTopicsConnection";
    totalCount: number;
    edges: Array<{
      __typename?: "VoteTopicEdge";
      cursor: string;
      node: {
        __typename?: "VoteTopic";
        id: string;
        title: string;
        startsAt: Date;
        endsAt: Date;
        phase: GqlVoteTopicPhase;
        options: Array<{ __typename?: "VoteOption"; id: string }>;
        gate: {
          __typename?: "VoteGate";
          id: string;
          type: GqlVoteGateType;
          requiredRole?: GqlRole | null;
          nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
        };
        powerPolicy: {
          __typename?: "VotePowerPolicy";
          id: string;
          type: GqlVotePowerPolicyType;
          nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
        };
      };
    }>;
    pageInfo: {
      __typename?: "PageInfo";
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
  };
};

export type GqlGetVoteTopicQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type GqlGetVoteTopicQuery = {
  __typename?: "Query";
  voteTopic?: {
    __typename?: "VoteTopic";
    id: string;
    title: string;
    description?: string | null;
    startsAt: Date;
    endsAt: Date;
    phase: GqlVoteTopicPhase;
    createdAt: Date;
    updatedAt?: Date | null;
    options: Array<{
      __typename?: "VoteOption";
      id: string;
      label: string;
      orderIndex: number;
      voteCount?: number | null;
      totalPower?: number | null;
    }>;
    gate: {
      __typename?: "VoteGate";
      id: string;
      type: GqlVoteGateType;
      requiredRole?: GqlRole | null;
      nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
    };
    powerPolicy: {
      __typename?: "VotePowerPolicy";
      id: string;
      type: GqlVotePowerPolicyType;
      nftToken?: { __typename?: "NftToken"; id: string; name?: string | null } | null;
    };
  } | null;
};

export const AdminReportSummaryRowFieldsFragmentDoc = gql`
  fragment AdminReportSummaryRowFields on AdminReportSummaryRow {
    community {
      id
      name
    }
    lastPublishedReport {
      id
      variant
      status
      publishedAt
    }
    lastPublishedAt
    daysSinceLastPublish
    publishedCountLast90Days
  }
`;
export const AdminBrowseReportFieldsFragmentDoc = gql`
  fragment AdminBrowseReportFields on Report {
    id
    variant
    status
    publishedAt
    createdAt
    community {
      id
      name
    }
    feedbacks {
      totalCount
    }
  }
`;
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
export const ReportFeedbackFieldsFragmentDoc = gql`
  fragment ReportFeedbackFields on ReportFeedback {
    id
    rating
    comment
    feedbackType
    sectionKey
    createdAt
    user {
      id
      name
    }
  }
`;
export const AdminReportDetailFieldsFragmentDoc = gql`
  fragment AdminReportDetailFields on Report {
    id
    variant
    status
    publishedAt
    createdAt
    updatedAt
    periodFrom
    periodTo
    outputMarkdown
    finalContent
    skipReason
    regenerateCount
    community {
      id
      name
    }
    template {
      id
      variant
      version
      kind
      experimentKey
      trafficWeight
    }
    generatedByUser {
      id
      name
    }
    publishedByUser {
      id
      name
    }
    myFeedback {
      ...ReportFeedbackFields
    }
  }
  ${ReportFeedbackFieldsFragmentDoc}
`;
export const ReportFeedbackWithReportFieldsFragmentDoc = gql`
  fragment ReportFeedbackWithReportFields on ReportFeedback {
    ...ReportFeedbackFields
    report {
      id
      variant
      periodFrom
      periodTo
      community {
        id
        name
      }
    }
  }
  ${ReportFeedbackFieldsFragmentDoc}
`;
export const ReportTemplateFieldsFragmentDoc = gql`
  fragment ReportTemplateFields on ReportTemplate {
    id
    variant
    version
    scope
    kind
    model
    maxTokens
    temperature
    systemPrompt
    userPromptTemplate
    stopSequences
    trafficWeight
    isActive
    isEnabled
    experimentKey
    communityContext
    createdAt
    updatedAt
    community {
      id
      name
    }
    updatedByUser {
      id
      name
    }
  }
`;
export const ReportTemplateStatsFieldsFragmentDoc = gql`
  fragment ReportTemplateStatsFields on ReportTemplateStats {
    variant
    version
    feedbackCount
    avgRating
    avgJudgeScore
    judgeHumanCorrelation
    correlationWarning
  }
`;
export const ReportTemplateStatsBreakdownRowFieldsFragmentDoc = gql`
  fragment ReportTemplateStatsBreakdownRowFields on ReportTemplateStatsBreakdownRow {
    templateId
    version
    scope
    kind
    experimentKey
    isActive
    isEnabled
    trafficWeight
    feedbackCount
    avgRating
    avgJudgeScore
    judgeHumanCorrelation
    correlationWarning
  }
`;
export const SysAdminPlatformSummaryFieldsFragmentDoc = gql`
  fragment SysAdminPlatformSummaryFields on SysAdminPlatformSummary {
    communitiesCount
    latestMonthDonationPoints
    totalMembers
  }
`;
export const SysAdminSegmentCountsFieldsFragmentDoc = gql`
  fragment SysAdminSegmentCountsFields on SysAdminSegmentCounts {
    total
    activeCount
    passiveCount
    tier1Count
    tier2Count
  }
`;
export const SysAdminTenureDistributionFieldsFragmentDoc = gql`
  fragment SysAdminTenureDistributionFields on SysAdminTenureDistribution {
    lt1Month
    m1to3Months
    m3to12Months
    gte12Months
  }
`;
export const SysAdminWindowActivityFieldsFragmentDoc = gql`
  fragment SysAdminWindowActivityFields on SysAdminWindowActivity {
    senderCount
    senderCountPrev
    newMemberCount
    newMemberCountPrev
    retainedSenders
  }
`;
export const SysAdminWeeklyRetentionFieldsFragmentDoc = gql`
  fragment SysAdminWeeklyRetentionFields on SysAdminWeeklyRetention {
    retainedSenders
    churnedSenders
  }
`;
export const SysAdminLatestCohortFieldsFragmentDoc = gql`
  fragment SysAdminLatestCohortFields on SysAdminLatestCohort {
    size
    activeAtM1
  }
`;
export const SysAdminCommunityOverviewRowFieldsFragmentDoc = gql`
  fragment SysAdminCommunityOverviewRowFields on SysAdminCommunityOverview {
    communityId
    communityName
    totalMembers
    hubMemberCount
    dormantCount
    segmentCounts {
      ...SysAdminSegmentCountsFields
    }
    tenureDistribution {
      ...SysAdminTenureDistributionFields
    }
    windowActivity {
      ...SysAdminWindowActivityFields
    }
    weeklyRetention {
      ...SysAdminWeeklyRetentionFields
    }
    latestCohort {
      ...SysAdminLatestCohortFields
    }
  }
  ${SysAdminSegmentCountsFieldsFragmentDoc}
  ${SysAdminTenureDistributionFieldsFragmentDoc}
  ${SysAdminWindowActivityFieldsFragmentDoc}
  ${SysAdminWeeklyRetentionFieldsFragmentDoc}
  ${SysAdminLatestCohortFieldsFragmentDoc}
`;
export const SysAdminAlertFieldsFragmentDoc = gql`
  fragment SysAdminAlertFields on SysAdminCommunityAlerts {
    activeDrop
    churnSpike
    noNewMembers
  }
`;
export const SysAdminCommunityDetailSummaryFieldsFragmentDoc = gql`
  fragment SysAdminCommunityDetailSummaryFields on SysAdminCommunitySummaryCard {
    communityId
    communityName
    communityActivityRate
    communityActivityRate3mAvg
    growthRateActivity
    totalMembers
    tier2Count
    tier2Pct
    totalDonationPointsAllTime
    maxChainDepthAllTime
    dataFrom
    dataTo
  }
`;
export const SysAdminStageBucketFieldsFragmentDoc = gql`
  fragment SysAdminStageBucketFields on SysAdminStageBucket {
    count
    pct
    avgSendRate
    avgMonthsIn
    pointsContributionPct
  }
`;
export const SysAdminStageDistributionFieldsFragmentDoc = gql`
  fragment SysAdminStageDistributionFields on SysAdminStageDistribution {
    habitual {
      ...SysAdminStageBucketFields
    }
    regular {
      ...SysAdminStageBucketFields
    }
    occasional {
      ...SysAdminStageBucketFields
    }
    latent {
      ...SysAdminStageBucketFields
    }
  }
  ${SysAdminStageBucketFieldsFragmentDoc}
`;
export const SysAdminMonthlyActivityPointFieldsFragmentDoc = gql`
  fragment SysAdminMonthlyActivityPointFields on SysAdminMonthlyActivityPoint {
    month
    communityActivityRate
    senderCount
    newMembers
    donationPointsSum
    chainPct
    dormantCount
    returnedMembers
    hubMemberCount
  }
`;
export const SysAdminRetentionTrendPointFieldsFragmentDoc = gql`
  fragment SysAdminRetentionTrendPointFields on SysAdminRetentionTrendPoint {
    week
    communityActivityRate
    retainedSenders
    churnedSenders
    returnedSenders
    newMembers
  }
`;
export const SysAdminCohortRetentionPointFieldsFragmentDoc = gql`
  fragment SysAdminCohortRetentionPointFields on SysAdminCohortRetentionPoint {
    cohortMonth
    cohortSize
    retentionM1
    retentionM3
    retentionM6
  }
`;
export const SysAdminCohortFunnelPointFieldsFragmentDoc = gql`
  fragment SysAdminCohortFunnelPointFields on SysAdminCohortFunnelPoint {
    cohortMonth
    acquired
    activatedD30
    repeated
    habitual
  }
`;
export const SysAdminMemberRowFieldsFragmentDoc = gql`
  fragment SysAdminMemberRowFields on SysAdminMemberRow {
    userId
    name
    userSendRate
    totalPointsOut
    donationOutMonths
    monthsIn
    daysIn
    donationOutDays
    uniqueDonationRecipients
    totalPointsIn
    donationInMonths
    donationInDays
    uniqueDonationSenders
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
    phoneNumber
    preferredLanguage
    nftWallet {
      id
      walletAddress
    }
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
    evaluationStatus
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
export const DidIssuanceRequestFieldsFragmentDoc = gql`
  fragment DidIssuanceRequestFields on DidIssuanceRequest {
    id
    status
    didValue
    requestedAt
    processedAt
    completedAt
    createdAt
    updatedAt
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
    pointsRequired
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
    comment
    participantCountWithPoint
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
export const UtilityWithOwnerFieldsFragmentDoc = gql`
  fragment UtilityWithOwnerFields on Utility {
    id
    name
    description
    images
    publishStatus
    pointsRequired
    owner {
      id
      name
    }
  }
`;
export const TransactionFieldsFragmentDoc = gql`
  fragment TransactionFields on Transaction {
    id
    reason
    comment
    images
    fromPointChange
    toPointChange
    chainDepth
    createdAt
  }
`;
export const VoteTopicFieldsFragmentDoc = gql`
  fragment VoteTopicFields on VoteTopic {
    id
    title
    description
    startsAt
    endsAt
    phase
    createdAt
    updatedAt
    options {
      id
      label
      orderIndex
      voteCount
      totalPower
    }
    gate {
      id
      type
      requiredRole
      nftToken {
        id
        name
      }
    }
    powerPolicy {
      id
      type
      nftToken {
        id
        name
      }
    }
  }
`;
export const VoteTopicListItemFieldsFragmentDoc = gql`
  fragment VoteTopicListItemFields on VoteTopic {
    id
    title
    startsAt
    endsAt
    phase
    options {
      id
    }
    gate {
      id
      type
      requiredRole
      nftToken {
        id
        name
      }
    }
    powerPolicy {
      id
      type
      nftToken {
        id
        name
      }
    }
  }
`;
export const GetStatesDocument = gql`
  query GetStates($first: Int) {
    states(first: $first) {
      edges {
        node {
          code
          name
        }
      }
    }
  }
`;

/**
 * __useGetStatesQuery__
 *
 * To run a query within a React component, call `useGetStatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStatesQuery({
 *   variables: {
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetStatesQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetStatesQuery, GqlGetStatesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetStatesQuery, GqlGetStatesQueryVariables>(GetStatesDocument, options);
}
export function useGetStatesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetStatesQuery, GqlGetStatesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetStatesQuery, GqlGetStatesQueryVariables>(
    GetStatesDocument,
    options,
  );
}
export function useGetStatesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetStatesQuery, GqlGetStatesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetStatesQuery, GqlGetStatesQueryVariables>(
    GetStatesDocument,
    options,
  );
}
export type GetStatesQueryHookResult = ReturnType<typeof useGetStatesQuery>;
export type GetStatesLazyQueryHookResult = ReturnType<typeof useGetStatesLazyQuery>;
export type GetStatesSuspenseQueryHookResult = ReturnType<typeof useGetStatesSuspenseQuery>;
export type GetStatesQueryResult = Apollo.QueryResult<
  GqlGetStatesQuery,
  GqlGetStatesQueryVariables
>;
export const GetCitiesDocument = gql`
  query GetCities($filter: CitiesInput, $first: Int, $cursor: String, $sort: CitiesSortInput) {
    cities(filter: $filter, first: $first, cursor: $cursor, sort: $sort) {
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
          code
          name
          state {
            code
            name
          }
        }
      }
    }
  }
`;

/**
 * __useGetCitiesQuery__
 *
 * To run a query within a React component, call `useGetCitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCitiesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetCitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetCitiesQuery, GqlGetCitiesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetCitiesQuery, GqlGetCitiesQueryVariables>(GetCitiesDocument, options);
}
export function useGetCitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetCitiesQuery, GqlGetCitiesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetCitiesQuery, GqlGetCitiesQueryVariables>(
    GetCitiesDocument,
    options,
  );
}
export function useGetCitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetCitiesQuery, GqlGetCitiesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetCitiesQuery, GqlGetCitiesQueryVariables>(
    GetCitiesDocument,
    options,
  );
}
export type GetCitiesQueryHookResult = ReturnType<typeof useGetCitiesQuery>;
export type GetCitiesLazyQueryHookResult = ReturnType<typeof useGetCitiesLazyQuery>;
export type GetCitiesSuspenseQueryHookResult = ReturnType<typeof useGetCitiesSuspenseQuery>;
export type GetCitiesQueryResult = Apollo.QueryResult<
  GqlGetCitiesQuery,
  GqlGetCitiesQueryVariables
>;
export const GetAdminBrowseReportsDocument = gql`
  query GetAdminBrowseReports(
    $communityId: ID
    $status: ReportStatus
    $variant: ReportVariant
    $publishedAfter: Datetime
    $publishedBefore: Datetime
    $cursor: String
    $first: Int
  ) {
    adminBrowseReports(
      communityId: $communityId
      status: $status
      variant: $variant
      publishedAfter: $publishedAfter
      publishedBefore: $publishedBefore
      cursor: $cursor
      first: $first
    ) {
      edges {
        cursor
        node {
          ...AdminBrowseReportFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${AdminBrowseReportFieldsFragmentDoc}
`;

/**
 * __useGetAdminBrowseReportsQuery__
 *
 * To run a query within a React component, call `useGetAdminBrowseReportsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminBrowseReportsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminBrowseReportsQuery({
 *   variables: {
 *      communityId: // value for 'communityId'
 *      status: // value for 'status'
 *      variant: // value for 'variant'
 *      publishedAfter: // value for 'publishedAfter'
 *      publishedBefore: // value for 'publishedBefore'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetAdminBrowseReportsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetAdminBrowseReportsQuery,
    GqlGetAdminBrowseReportsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetAdminBrowseReportsQuery, GqlGetAdminBrowseReportsQueryVariables>(
    GetAdminBrowseReportsDocument,
    options,
  );
}
export function useGetAdminBrowseReportsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetAdminBrowseReportsQuery,
    GqlGetAdminBrowseReportsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetAdminBrowseReportsQuery, GqlGetAdminBrowseReportsQueryVariables>(
    GetAdminBrowseReportsDocument,
    options,
  );
}
export function useGetAdminBrowseReportsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetAdminBrowseReportsQuery,
        GqlGetAdminBrowseReportsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetAdminBrowseReportsQuery,
    GqlGetAdminBrowseReportsQueryVariables
  >(GetAdminBrowseReportsDocument, options);
}
export type GetAdminBrowseReportsQueryHookResult = ReturnType<typeof useGetAdminBrowseReportsQuery>;
export type GetAdminBrowseReportsLazyQueryHookResult = ReturnType<
  typeof useGetAdminBrowseReportsLazyQuery
>;
export type GetAdminBrowseReportsSuspenseQueryHookResult = ReturnType<
  typeof useGetAdminBrowseReportsSuspenseQuery
>;
export type GetAdminBrowseReportsQueryResult = Apollo.QueryResult<
  GqlGetAdminBrowseReportsQuery,
  GqlGetAdminBrowseReportsQueryVariables
>;
export const GetAdminReportSummaryDocument = gql`
  query GetAdminReportSummary($cursor: String, $first: Int) {
    adminReportSummary(cursor: $cursor, first: $first) {
      edges {
        cursor
        node {
          ...AdminReportSummaryRowFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${AdminReportSummaryRowFieldsFragmentDoc}
`;

/**
 * __useGetAdminReportSummaryQuery__
 *
 * To run a query within a React component, call `useGetAdminReportSummaryQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminReportSummaryQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminReportSummaryQuery({
 *   variables: {
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetAdminReportSummaryQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetAdminReportSummaryQuery,
    GqlGetAdminReportSummaryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetAdminReportSummaryQuery, GqlGetAdminReportSummaryQueryVariables>(
    GetAdminReportSummaryDocument,
    options,
  );
}
export function useGetAdminReportSummaryLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetAdminReportSummaryQuery,
    GqlGetAdminReportSummaryQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetAdminReportSummaryQuery, GqlGetAdminReportSummaryQueryVariables>(
    GetAdminReportSummaryDocument,
    options,
  );
}
export function useGetAdminReportSummarySuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetAdminReportSummaryQuery,
        GqlGetAdminReportSummaryQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetAdminReportSummaryQuery,
    GqlGetAdminReportSummaryQueryVariables
  >(GetAdminReportSummaryDocument, options);
}
export type GetAdminReportSummaryQueryHookResult = ReturnType<typeof useGetAdminReportSummaryQuery>;
export type GetAdminReportSummaryLazyQueryHookResult = ReturnType<
  typeof useGetAdminReportSummaryLazyQuery
>;
export type GetAdminReportSummarySuspenseQueryHookResult = ReturnType<
  typeof useGetAdminReportSummarySuspenseQuery
>;
export type GetAdminReportSummaryQueryResult = Apollo.QueryResult<
  GqlGetAdminReportSummaryQuery,
  GqlGetAdminReportSummaryQueryVariables
>;
export const GetAdminTemplateFeedbacksDocument = gql`
  query GetAdminTemplateFeedbacks(
    $variant: ReportVariant!
    $version: Int
    $kind: ReportTemplateKind
    $feedbackType: ReportFeedbackType
    $maxRating: Int
    $cursor: String
    $first: Int
  ) {
    adminTemplateFeedbacks(
      variant: $variant
      version: $version
      kind: $kind
      feedbackType: $feedbackType
      maxRating: $maxRating
      cursor: $cursor
      first: $first
    ) {
      edges {
        cursor
        node {
          ...ReportFeedbackWithReportFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${ReportFeedbackWithReportFieldsFragmentDoc}
`;

/**
 * __useGetAdminTemplateFeedbacksQuery__
 *
 * To run a query within a React component, call `useGetAdminTemplateFeedbacksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminTemplateFeedbacksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminTemplateFeedbacksQuery({
 *   variables: {
 *      variant: // value for 'variant'
 *      version: // value for 'version'
 *      kind: // value for 'kind'
 *      feedbackType: // value for 'feedbackType'
 *      maxRating: // value for 'maxRating'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetAdminTemplateFeedbacksQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetAdminTemplateFeedbacksQuery,
    GqlGetAdminTemplateFeedbacksQueryVariables
  > &
    ({ variables: GqlGetAdminTemplateFeedbacksQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetAdminTemplateFeedbacksQuery,
    GqlGetAdminTemplateFeedbacksQueryVariables
  >(GetAdminTemplateFeedbacksDocument, options);
}
export function useGetAdminTemplateFeedbacksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetAdminTemplateFeedbacksQuery,
    GqlGetAdminTemplateFeedbacksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetAdminTemplateFeedbacksQuery,
    GqlGetAdminTemplateFeedbacksQueryVariables
  >(GetAdminTemplateFeedbacksDocument, options);
}
export function useGetAdminTemplateFeedbacksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetAdminTemplateFeedbacksQuery,
        GqlGetAdminTemplateFeedbacksQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetAdminTemplateFeedbacksQuery,
    GqlGetAdminTemplateFeedbacksQueryVariables
  >(GetAdminTemplateFeedbacksDocument, options);
}
export type GetAdminTemplateFeedbacksQueryHookResult = ReturnType<
  typeof useGetAdminTemplateFeedbacksQuery
>;
export type GetAdminTemplateFeedbacksLazyQueryHookResult = ReturnType<
  typeof useGetAdminTemplateFeedbacksLazyQuery
>;
export type GetAdminTemplateFeedbacksSuspenseQueryHookResult = ReturnType<
  typeof useGetAdminTemplateFeedbacksSuspenseQuery
>;
export type GetAdminTemplateFeedbacksQueryResult = Apollo.QueryResult<
  GqlGetAdminTemplateFeedbacksQuery,
  GqlGetAdminTemplateFeedbacksQueryVariables
>;
export const GetAdminTemplateFeedbackStatsDocument = gql`
  query GetAdminTemplateFeedbackStats(
    $variant: ReportVariant!
    $version: Int
    $kind: ReportTemplateKind
  ) {
    adminTemplateFeedbackStats(variant: $variant, version: $version, kind: $kind) {
      totalCount
      avgRating
      ratingDistribution {
        rating
        count
      }
    }
  }
`;

/**
 * __useGetAdminTemplateFeedbackStatsQuery__
 *
 * To run a query within a React component, call `useGetAdminTemplateFeedbackStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminTemplateFeedbackStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminTemplateFeedbackStatsQuery({
 *   variables: {
 *      variant: // value for 'variant'
 *      version: // value for 'version'
 *      kind: // value for 'kind'
 *   },
 * });
 */
export function useGetAdminTemplateFeedbackStatsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetAdminTemplateFeedbackStatsQuery,
    GqlGetAdminTemplateFeedbackStatsQueryVariables
  > &
    (
      | { variables: GqlGetAdminTemplateFeedbackStatsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetAdminTemplateFeedbackStatsQuery,
    GqlGetAdminTemplateFeedbackStatsQueryVariables
  >(GetAdminTemplateFeedbackStatsDocument, options);
}
export function useGetAdminTemplateFeedbackStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetAdminTemplateFeedbackStatsQuery,
    GqlGetAdminTemplateFeedbackStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetAdminTemplateFeedbackStatsQuery,
    GqlGetAdminTemplateFeedbackStatsQueryVariables
  >(GetAdminTemplateFeedbackStatsDocument, options);
}
export function useGetAdminTemplateFeedbackStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetAdminTemplateFeedbackStatsQuery,
        GqlGetAdminTemplateFeedbackStatsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetAdminTemplateFeedbackStatsQuery,
    GqlGetAdminTemplateFeedbackStatsQueryVariables
  >(GetAdminTemplateFeedbackStatsDocument, options);
}
export type GetAdminTemplateFeedbackStatsQueryHookResult = ReturnType<
  typeof useGetAdminTemplateFeedbackStatsQuery
>;
export type GetAdminTemplateFeedbackStatsLazyQueryHookResult = ReturnType<
  typeof useGetAdminTemplateFeedbackStatsLazyQuery
>;
export type GetAdminTemplateFeedbackStatsSuspenseQueryHookResult = ReturnType<
  typeof useGetAdminTemplateFeedbackStatsSuspenseQuery
>;
export type GetAdminTemplateFeedbackStatsQueryResult = Apollo.QueryResult<
  GqlGetAdminTemplateFeedbackStatsQuery,
  GqlGetAdminTemplateFeedbackStatsQueryVariables
>;
export const CommunityCreateDocument = gql`
  mutation CommunityCreate($input: CommunityCreateInput!) {
    communityCreate(input: $input) {
      ... on CommunityCreateSuccess {
        community {
          id
          name
          image
        }
      }
    }
  }
`;
export type GqlCommunityCreateMutationFn = Apollo.MutationFunction<
  GqlCommunityCreateMutation,
  GqlCommunityCreateMutationVariables
>;

/**
 * __useCommunityCreateMutation__
 *
 * To run a mutation, you first call `useCommunityCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCommunityCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [communityCreateMutation, { data, loading, error }] = useCommunityCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCommunityCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlCommunityCreateMutation,
    GqlCommunityCreateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlCommunityCreateMutation, GqlCommunityCreateMutationVariables>(
    CommunityCreateDocument,
    options,
  );
}
export type CommunityCreateMutationHookResult = ReturnType<typeof useCommunityCreateMutation>;
export type CommunityCreateMutationResult = Apollo.MutationResult<GqlCommunityCreateMutation>;
export type CommunityCreateMutationOptions = Apollo.BaseMutationOptions<
  GqlCommunityCreateMutation,
  GqlCommunityCreateMutationVariables
>;
export const UpdateSignupBonusConfigDocument = gql`
  mutation UpdateSignupBonusConfig($input: UpdateSignupBonusConfigInput!, $communityId: ID!) {
    updateSignupBonusConfig(input: $input, permission: { communityId: $communityId }) {
      bonusPoint
      isEnabled
      message
    }
  }
`;
export type GqlUpdateSignupBonusConfigMutationFn = Apollo.MutationFunction<
  GqlUpdateSignupBonusConfigMutation,
  GqlUpdateSignupBonusConfigMutationVariables
>;

/**
 * __useUpdateSignupBonusConfigMutation__
 *
 * To run a mutation, you first call `useUpdateSignupBonusConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateSignupBonusConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateSignupBonusConfigMutation, { data, loading, error }] = useUpdateSignupBonusConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useUpdateSignupBonusConfigMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlUpdateSignupBonusConfigMutation,
    GqlUpdateSignupBonusConfigMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlUpdateSignupBonusConfigMutation,
    GqlUpdateSignupBonusConfigMutationVariables
  >(UpdateSignupBonusConfigDocument, options);
}
export type UpdateSignupBonusConfigMutationHookResult = ReturnType<
  typeof useUpdateSignupBonusConfigMutation
>;
export type UpdateSignupBonusConfigMutationResult =
  Apollo.MutationResult<GqlUpdateSignupBonusConfigMutation>;
export type UpdateSignupBonusConfigMutationOptions = Apollo.BaseMutationOptions<
  GqlUpdateSignupBonusConfigMutation,
  GqlUpdateSignupBonusConfigMutationVariables
>;
export const IncentiveGrantRetryDocument = gql`
  mutation IncentiveGrantRetry($incentiveGrantId: ID!, $communityId: ID!) {
    incentiveGrantRetry(
      input: { incentiveGrantId: $incentiveGrantId }
      permission: { communityId: $communityId }
    ) {
      ... on IncentiveGrantRetrySuccess {
        incentiveGrant {
          id
        }
        transaction {
          id
        }
      }
    }
  }
`;
export type GqlIncentiveGrantRetryMutationFn = Apollo.MutationFunction<
  GqlIncentiveGrantRetryMutation,
  GqlIncentiveGrantRetryMutationVariables
>;

/**
 * __useIncentiveGrantRetryMutation__
 *
 * To run a mutation, you first call `useIncentiveGrantRetryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIncentiveGrantRetryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [incentiveGrantRetryMutation, { data, loading, error }] = useIncentiveGrantRetryMutation({
 *   variables: {
 *      incentiveGrantId: // value for 'incentiveGrantId'
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useIncentiveGrantRetryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlIncentiveGrantRetryMutation,
    GqlIncentiveGrantRetryMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlIncentiveGrantRetryMutation,
    GqlIncentiveGrantRetryMutationVariables
  >(IncentiveGrantRetryDocument, options);
}
export type IncentiveGrantRetryMutationHookResult = ReturnType<
  typeof useIncentiveGrantRetryMutation
>;
export type IncentiveGrantRetryMutationResult =
  Apollo.MutationResult<GqlIncentiveGrantRetryMutation>;
export type IncentiveGrantRetryMutationOptions = Apollo.BaseMutationOptions<
  GqlIncentiveGrantRetryMutation,
  GqlIncentiveGrantRetryMutationVariables
>;
export const UpdatePortalConfigDocument = gql`
  mutation UpdatePortalConfig($input: CommunityPortalConfigInput!, $communityId: ID!) {
    updatePortalConfig(input: $input, permission: { communityId: $communityId }) {
      communityId
      title
      description
      shortDescription
      logoPath
      squareLogoPath
      ogImagePath
      faviconPrefix
    }
  }
`;
export type GqlUpdatePortalConfigMutationFn = Apollo.MutationFunction<
  GqlUpdatePortalConfigMutation,
  GqlUpdatePortalConfigMutationVariables
>;

/**
 * __useUpdatePortalConfigMutation__
 *
 * To run a mutation, you first call `useUpdatePortalConfigMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePortalConfigMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePortalConfigMutation, { data, loading, error }] = useUpdatePortalConfigMutation({
 *   variables: {
 *      input: // value for 'input'
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useUpdatePortalConfigMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlUpdatePortalConfigMutation,
    GqlUpdatePortalConfigMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlUpdatePortalConfigMutation, GqlUpdatePortalConfigMutationVariables>(
    UpdatePortalConfigDocument,
    options,
  );
}
export type UpdatePortalConfigMutationHookResult = ReturnType<typeof useUpdatePortalConfigMutation>;
export type UpdatePortalConfigMutationResult = Apollo.MutationResult<GqlUpdatePortalConfigMutation>;
export type UpdatePortalConfigMutationOptions = Apollo.BaseMutationOptions<
  GqlUpdatePortalConfigMutation,
  GqlUpdatePortalConfigMutationVariables
>;
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
export const GetSignupBonusConfigDocument = gql`
  query GetSignupBonusConfig($communityId: ID!) {
    signupBonusConfig(communityId: $communityId) {
      bonusPoint
      isEnabled
      message
    }
  }
`;

/**
 * __useGetSignupBonusConfigQuery__
 *
 * To run a query within a React component, call `useGetSignupBonusConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSignupBonusConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSignupBonusConfigQuery({
 *   variables: {
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useGetSignupBonusConfigQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetSignupBonusConfigQuery,
    GqlGetSignupBonusConfigQueryVariables
  > &
    ({ variables: GqlGetSignupBonusConfigQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetSignupBonusConfigQuery, GqlGetSignupBonusConfigQueryVariables>(
    GetSignupBonusConfigDocument,
    options,
  );
}
export function useGetSignupBonusConfigLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetSignupBonusConfigQuery,
    GqlGetSignupBonusConfigQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetSignupBonusConfigQuery, GqlGetSignupBonusConfigQueryVariables>(
    GetSignupBonusConfigDocument,
    options,
  );
}
export function useGetSignupBonusConfigSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetSignupBonusConfigQuery,
        GqlGetSignupBonusConfigQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetSignupBonusConfigQuery,
    GqlGetSignupBonusConfigQueryVariables
  >(GetSignupBonusConfigDocument, options);
}
export type GetSignupBonusConfigQueryHookResult = ReturnType<typeof useGetSignupBonusConfigQuery>;
export type GetSignupBonusConfigLazyQueryHookResult = ReturnType<
  typeof useGetSignupBonusConfigLazyQuery
>;
export type GetSignupBonusConfigSuspenseQueryHookResult = ReturnType<
  typeof useGetSignupBonusConfigSuspenseQuery
>;
export type GetSignupBonusConfigQueryResult = Apollo.QueryResult<
  GqlGetSignupBonusConfigQuery,
  GqlGetSignupBonusConfigQueryVariables
>;
export const GetFailedIncentiveGrantsDocument = gql`
  query GetFailedIncentiveGrants($communityId: ID!) {
    incentiveGrants(
      filter: { communityId: $communityId, type: SIGNUP, status: FAILED }
      sort: { updatedAt: desc }
    ) {
      edges {
        node {
          id
          user {
            id
            name
            image
          }
          failureCode
          lastError
          attemptCount
          lastAttemptedAt
        }
      }
    }
  }
`;

/**
 * __useGetFailedIncentiveGrantsQuery__
 *
 * To run a query within a React component, call `useGetFailedIncentiveGrantsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFailedIncentiveGrantsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFailedIncentiveGrantsQuery({
 *   variables: {
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useGetFailedIncentiveGrantsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetFailedIncentiveGrantsQuery,
    GqlGetFailedIncentiveGrantsQueryVariables
  > &
    ({ variables: GqlGetFailedIncentiveGrantsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetFailedIncentiveGrantsQuery,
    GqlGetFailedIncentiveGrantsQueryVariables
  >(GetFailedIncentiveGrantsDocument, options);
}
export function useGetFailedIncentiveGrantsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetFailedIncentiveGrantsQuery,
    GqlGetFailedIncentiveGrantsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetFailedIncentiveGrantsQuery,
    GqlGetFailedIncentiveGrantsQueryVariables
  >(GetFailedIncentiveGrantsDocument, options);
}
export function useGetFailedIncentiveGrantsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetFailedIncentiveGrantsQuery,
        GqlGetFailedIncentiveGrantsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetFailedIncentiveGrantsQuery,
    GqlGetFailedIncentiveGrantsQueryVariables
  >(GetFailedIncentiveGrantsDocument, options);
}
export type GetFailedIncentiveGrantsQueryHookResult = ReturnType<
  typeof useGetFailedIncentiveGrantsQuery
>;
export type GetFailedIncentiveGrantsLazyQueryHookResult = ReturnType<
  typeof useGetFailedIncentiveGrantsLazyQuery
>;
export type GetFailedIncentiveGrantsSuspenseQueryHookResult = ReturnType<
  typeof useGetFailedIncentiveGrantsSuspenseQuery
>;
export type GetFailedIncentiveGrantsQueryResult = Apollo.QueryResult<
  GqlGetFailedIncentiveGrantsQuery,
  GqlGetFailedIncentiveGrantsQueryVariables
>;
export const GetCommunityPortalConfigDocument = gql`
  query GetCommunityPortalConfig($communityId: String!) {
    communityPortalConfig(communityId: $communityId) {
      communityId
      tokenName
      title
      description
      shortDescription
      domain
      faviconPrefix
      logoPath
      squareLogoPath
      ogImagePath
      enableFeatures
      rootPath
      adminRootPath
      documents {
        id
        title
        path
        type
        order
      }
      commonDocumentOverrides {
        terms {
          id
          title
          path
          type
        }
        privacy {
          id
          title
          path
          type
        }
      }
      regionName
      regionKey
      liffId
      liffBaseUrl
      firebaseTenantId
    }
  }
`;

/**
 * __useGetCommunityPortalConfigQuery__
 *
 * To run a query within a React component, call `useGetCommunityPortalConfigQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommunityPortalConfigQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommunityPortalConfigQuery({
 *   variables: {
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useGetCommunityPortalConfigQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetCommunityPortalConfigQuery,
    GqlGetCommunityPortalConfigQueryVariables
  > &
    ({ variables: GqlGetCommunityPortalConfigQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetCommunityPortalConfigQuery,
    GqlGetCommunityPortalConfigQueryVariables
  >(GetCommunityPortalConfigDocument, options);
}
export function useGetCommunityPortalConfigLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetCommunityPortalConfigQuery,
    GqlGetCommunityPortalConfigQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetCommunityPortalConfigQuery,
    GqlGetCommunityPortalConfigQueryVariables
  >(GetCommunityPortalConfigDocument, options);
}
export function useGetCommunityPortalConfigSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetCommunityPortalConfigQuery,
        GqlGetCommunityPortalConfigQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetCommunityPortalConfigQuery,
    GqlGetCommunityPortalConfigQueryVariables
  >(GetCommunityPortalConfigDocument, options);
}
export type GetCommunityPortalConfigQueryHookResult = ReturnType<
  typeof useGetCommunityPortalConfigQuery
>;
export type GetCommunityPortalConfigLazyQueryHookResult = ReturnType<
  typeof useGetCommunityPortalConfigLazyQuery
>;
export type GetCommunityPortalConfigSuspenseQueryHookResult = ReturnType<
  typeof useGetCommunityPortalConfigSuspenseQuery
>;
export type GetCommunityPortalConfigQueryResult = Apollo.QueryResult<
  GqlGetCommunityPortalConfigQuery,
  GqlGetCommunityPortalConfigQueryVariables
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
  mutation storePhoneAuthToken(
    $input: StorePhoneAuthTokenInput!
    $permission: CheckIsSelfPermissionInput!
  ) {
    storePhoneAuthToken(input: $input, permission: $permission) {
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
 *      permission: // value for 'permission'
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
export const IdentityCheckPhoneUserDocument = gql`
  mutation identityCheckPhoneUser($input: IdentityCheckPhoneUserInput!) {
    identityCheckPhoneUser(input: $input) {
      status
      user {
        id
        name
      }
      membership {
        role
      }
    }
  }
`;
export type GqlIdentityCheckPhoneUserMutationFn = Apollo.MutationFunction<
  GqlIdentityCheckPhoneUserMutation,
  GqlIdentityCheckPhoneUserMutationVariables
>;

/**
 * __useIdentityCheckPhoneUserMutation__
 *
 * To run a mutation, you first call `useIdentityCheckPhoneUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useIdentityCheckPhoneUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [identityCheckPhoneUserMutation, { data, loading, error }] = useIdentityCheckPhoneUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useIdentityCheckPhoneUserMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlIdentityCheckPhoneUserMutation,
    GqlIdentityCheckPhoneUserMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlIdentityCheckPhoneUserMutation,
    GqlIdentityCheckPhoneUserMutationVariables
  >(IdentityCheckPhoneUserDocument, options);
}
export type IdentityCheckPhoneUserMutationHookResult = ReturnType<
  typeof useIdentityCheckPhoneUserMutation
>;
export type IdentityCheckPhoneUserMutationResult =
  Apollo.MutationResult<GqlIdentityCheckPhoneUserMutation>;
export type IdentityCheckPhoneUserMutationOptions = Apollo.BaseMutationOptions<
  GqlIdentityCheckPhoneUserMutation,
  GqlIdentityCheckPhoneUserMutationVariables
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
            preferredLanguage
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
export const CurrentUserServerDocument = gql`
  query currentUserServer {
    currentUser {
      user {
        id
        name
        preferredLanguage
        identities {
          uid
          platform
        }
        memberships {
          ...MembershipFields
          user {
            id
            name
            preferredLanguage
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
 * __useCurrentUserServerQuery__
 *
 * To run a query within a React component, call `useCurrentUserServerQuery` and pass it any options that fit your needs.
 * When your component renders, `useCurrentUserServerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCurrentUserServerQuery({
 *   variables: {
 *   },
 * });
 */
export function useCurrentUserServerQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlCurrentUserServerQuery,
    GqlCurrentUserServerQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlCurrentUserServerQuery, GqlCurrentUserServerQueryVariables>(
    CurrentUserServerDocument,
    options,
  );
}
export function useCurrentUserServerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlCurrentUserServerQuery,
    GqlCurrentUserServerQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlCurrentUserServerQuery, GqlCurrentUserServerQueryVariables>(
    CurrentUserServerDocument,
    options,
  );
}
export function useCurrentUserServerSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlCurrentUserServerQuery,
        GqlCurrentUserServerQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlCurrentUserServerQuery, GqlCurrentUserServerQueryVariables>(
    CurrentUserServerDocument,
    options,
  );
}
export type CurrentUserServerQueryHookResult = ReturnType<typeof useCurrentUserServerQuery>;
export type CurrentUserServerLazyQueryHookResult = ReturnType<typeof useCurrentUserServerLazyQuery>;
export type CurrentUserServerSuspenseQueryHookResult = ReturnType<
  typeof useCurrentUserServerSuspenseQuery
>;
export type CurrentUserServerQueryResult = Apollo.QueryResult<
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables
>;
export const AssignOwnerDocument = gql`
  mutation assignOwner(
    $input: MembershipSetRoleInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    membershipAssignOwner(input: $input, permission: $permission) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
  ${MembershipFieldsFragmentDoc}
`;
export type GqlAssignOwnerMutationFn = Apollo.MutationFunction<
  GqlAssignOwnerMutation,
  GqlAssignOwnerMutationVariables
>;

/**
 * __useAssignOwnerMutation__
 *
 * To run a mutation, you first call `useAssignOwnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignOwnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignOwnerMutation, { data, loading, error }] = useAssignOwnerMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useAssignOwnerMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlAssignOwnerMutation, GqlAssignOwnerMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlAssignOwnerMutation, GqlAssignOwnerMutationVariables>(
    AssignOwnerDocument,
    options,
  );
}
export type AssignOwnerMutationHookResult = ReturnType<typeof useAssignOwnerMutation>;
export type AssignOwnerMutationResult = Apollo.MutationResult<GqlAssignOwnerMutation>;
export type AssignOwnerMutationOptions = Apollo.BaseMutationOptions<
  GqlAssignOwnerMutation,
  GqlAssignOwnerMutationVariables
>;
export const AssignManagerDocument = gql`
  mutation assignManager(
    $input: MembershipSetRoleInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    membershipAssignManager(input: $input, permission: $permission) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
  ${MembershipFieldsFragmentDoc}
`;
export type GqlAssignManagerMutationFn = Apollo.MutationFunction<
  GqlAssignManagerMutation,
  GqlAssignManagerMutationVariables
>;

/**
 * __useAssignManagerMutation__
 *
 * To run a mutation, you first call `useAssignManagerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignManagerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignManagerMutation, { data, loading, error }] = useAssignManagerMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useAssignManagerMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlAssignManagerMutation,
    GqlAssignManagerMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlAssignManagerMutation, GqlAssignManagerMutationVariables>(
    AssignManagerDocument,
    options,
  );
}
export type AssignManagerMutationHookResult = ReturnType<typeof useAssignManagerMutation>;
export type AssignManagerMutationResult = Apollo.MutationResult<GqlAssignManagerMutation>;
export type AssignManagerMutationOptions = Apollo.BaseMutationOptions<
  GqlAssignManagerMutation,
  GqlAssignManagerMutationVariables
>;
export const AssignMemberDocument = gql`
  mutation assignMember(
    $input: MembershipSetRoleInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    membershipAssignMember(input: $input, permission: $permission) {
      ... on MembershipSetRoleSuccess {
        membership {
          ...MembershipFields
        }
      }
    }
  }
  ${MembershipFieldsFragmentDoc}
`;
export type GqlAssignMemberMutationFn = Apollo.MutationFunction<
  GqlAssignMemberMutation,
  GqlAssignMemberMutationVariables
>;

/**
 * __useAssignMemberMutation__
 *
 * To run a mutation, you first call `useAssignMemberMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAssignMemberMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [assignMemberMutation, { data, loading, error }] = useAssignMemberMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useAssignMemberMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlAssignMemberMutation,
    GqlAssignMemberMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlAssignMemberMutation, GqlAssignMemberMutationVariables>(
    AssignMemberDocument,
    options,
  );
}
export type AssignMemberMutationHookResult = ReturnType<typeof useAssignMemberMutation>;
export type AssignMemberMutationResult = Apollo.MutationResult<GqlAssignMemberMutation>;
export type AssignMemberMutationOptions = Apollo.BaseMutationOptions<
  GqlAssignMemberMutation,
  GqlAssignMemberMutationVariables
>;
export const GetSingleMembershipDocument = gql`
  query GetSingleMembership($communityId: ID!, $userId: ID!) {
    membership(communityId: $communityId, userId: $userId) {
      ...MembershipFields
      user {
        ...UserFields
      }
      community {
        ...CommunityFields
      }
    }
  }
  ${MembershipFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
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
    $withWallets: Boolean! = false
    $withDidIssuanceRequests: Boolean! = false
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
          role
          status
          user {
            id
            name
            image
            didIssuanceRequests @include(if: $withDidIssuanceRequests) {
              status
              didValue
            }
            wallets @include(if: $withWallets) {
              id
              type
              currentPointView {
                currentPoint
              }
              community {
                id
                name
                image
              }
            }
          }
          community {
            id
            name
            image
          }
        }
      }
    }
  }
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
 *      withWallets: // value for 'withWallets'
 *      withDidIssuanceRequests: // value for 'withDidIssuanceRequests'
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
export const GetNftTokensDocument = gql`
  query GetNftTokens(
    $first: Int
    $cursor: String
    $filter: NftTokenFilterInput
    $sort: NftTokenSortInput
  ) {
    nftTokens(first: $first, cursor: $cursor, filter: $filter, sort: $sort) {
      edges {
        cursor
        node {
          id
          address
          name
          symbol
          type
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

/**
 * __useGetNftTokensQuery__
 *
 * To run a query within a React component, call `useGetNftTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftTokensQuery({
 *   variables: {
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *   },
 * });
 */
export function useGetNftTokensQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetNftTokensQuery, GqlGetNftTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetNftTokensQuery, GqlGetNftTokensQueryVariables>(
    GetNftTokensDocument,
    options,
  );
}
export function useGetNftTokensLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetNftTokensQuery, GqlGetNftTokensQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetNftTokensQuery, GqlGetNftTokensQueryVariables>(
    GetNftTokensDocument,
    options,
  );
}
export function useGetNftTokensSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetNftTokensQuery, GqlGetNftTokensQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetNftTokensQuery, GqlGetNftTokensQueryVariables>(
    GetNftTokensDocument,
    options,
  );
}
export type GetNftTokensQueryHookResult = ReturnType<typeof useGetNftTokensQuery>;
export type GetNftTokensLazyQueryHookResult = ReturnType<typeof useGetNftTokensLazyQuery>;
export type GetNftTokensSuspenseQueryHookResult = ReturnType<typeof useGetNftTokensSuspenseQuery>;
export type GetNftTokensQueryResult = Apollo.QueryResult<
  GqlGetNftTokensQuery,
  GqlGetNftTokensQueryVariables
>;
export const GetNftInstancesDocument = gql`
  query GetNftInstances($first: Int, $cursor: String, $filter: NftInstanceFilterInput) {
    nftInstances(first: $first, cursor: $cursor, filter: $filter) {
      edges {
        cursor
        node {
          id
          instanceId
          name
          createdAt
          nftWallet {
            id
            walletAddress
            user {
              id
              name
              didIssuanceRequests {
                id
                status
                didValue
                requestedAt
                completedAt
              }
            }
          }
          description
          imageUrl
          community {
            id
          }
          nftToken {
            id
            address
            name
            symbol
            type
            createdAt
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

/**
 * __useGetNftInstancesQuery__
 *
 * To run a query within a React component, call `useGetNftInstancesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftInstancesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftInstancesQuery({
 *   variables: {
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetNftInstancesQuery(
  baseOptions?: Apollo.QueryHookOptions<GqlGetNftInstancesQuery, GqlGetNftInstancesQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetNftInstancesQuery, GqlGetNftInstancesQueryVariables>(
    GetNftInstancesDocument,
    options,
  );
}
export function useGetNftInstancesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetNftInstancesQuery,
    GqlGetNftInstancesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetNftInstancesQuery, GqlGetNftInstancesQueryVariables>(
    GetNftInstancesDocument,
    options,
  );
}
export function useGetNftInstancesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetNftInstancesQuery, GqlGetNftInstancesQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetNftInstancesQuery, GqlGetNftInstancesQueryVariables>(
    GetNftInstancesDocument,
    options,
  );
}
export type GetNftInstancesQueryHookResult = ReturnType<typeof useGetNftInstancesQuery>;
export type GetNftInstancesLazyQueryHookResult = ReturnType<typeof useGetNftInstancesLazyQuery>;
export type GetNftInstancesSuspenseQueryHookResult = ReturnType<
  typeof useGetNftInstancesSuspenseQuery
>;
export type GetNftInstancesQueryResult = Apollo.QueryResult<
  GqlGetNftInstancesQuery,
  GqlGetNftInstancesQueryVariables
>;
export const GetNftInstanceWithDidDocument = gql`
  query GetNftInstanceWithDid($id: ID!) {
    nftInstance(id: $id) {
      id
      instanceId
      name
      description
      imageUrl
      json
      createdAt
      updatedAt
      community {
        id
      }
      nftToken {
        id
        address
        name
        symbol
        type
        json
      }
      nftWallet {
        id
        walletAddress
        user {
          id
          name
          didIssuanceRequests {
            id
            status
            didValue
            requestedAt
            processedAt
            completedAt
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

/**
 * __useGetNftInstanceWithDidQuery__
 *
 * To run a query within a React component, call `useGetNftInstanceWithDidQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNftInstanceWithDidQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNftInstanceWithDidQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetNftInstanceWithDidQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetNftInstanceWithDidQuery,
    GqlGetNftInstanceWithDidQueryVariables
  > &
    ({ variables: GqlGetNftInstanceWithDidQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetNftInstanceWithDidQuery, GqlGetNftInstanceWithDidQueryVariables>(
    GetNftInstanceWithDidDocument,
    options,
  );
}
export function useGetNftInstanceWithDidLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetNftInstanceWithDidQuery,
    GqlGetNftInstanceWithDidQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetNftInstanceWithDidQuery, GqlGetNftInstanceWithDidQueryVariables>(
    GetNftInstanceWithDidDocument,
    options,
  );
}
export function useGetNftInstanceWithDidSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetNftInstanceWithDidQuery,
        GqlGetNftInstanceWithDidQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetNftInstanceWithDidQuery,
    GqlGetNftInstanceWithDidQueryVariables
  >(GetNftInstanceWithDidDocument, options);
}
export type GetNftInstanceWithDidQueryHookResult = ReturnType<typeof useGetNftInstanceWithDidQuery>;
export type GetNftInstanceWithDidLazyQueryHookResult = ReturnType<
  typeof useGetNftInstanceWithDidLazyQuery
>;
export type GetNftInstanceWithDidSuspenseQueryHookResult = ReturnType<
  typeof useGetNftInstanceWithDidSuspenseQuery
>;
export type GetNftInstanceWithDidQueryResult = Apollo.QueryResult<
  GqlGetNftInstanceWithDidQuery,
  GqlGetNftInstanceWithDidQueryVariables
>;
export const SubmitReportFeedbackDocument = gql`
  mutation SubmitReportFeedback(
    $input: SubmitReportFeedbackInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    submitReportFeedback(input: $input, permission: $permission) {
      ... on SubmitReportFeedbackSuccess {
        feedback {
          ...ReportFeedbackFields
        }
      }
    }
  }
  ${ReportFeedbackFieldsFragmentDoc}
`;
export type GqlSubmitReportFeedbackMutationFn = Apollo.MutationFunction<
  GqlSubmitReportFeedbackMutation,
  GqlSubmitReportFeedbackMutationVariables
>;

/**
 * __useSubmitReportFeedbackMutation__
 *
 * To run a mutation, you first call `useSubmitReportFeedbackMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSubmitReportFeedbackMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [submitReportFeedbackMutation, { data, loading, error }] = useSubmitReportFeedbackMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useSubmitReportFeedbackMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlSubmitReportFeedbackMutation,
    GqlSubmitReportFeedbackMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlSubmitReportFeedbackMutation,
    GqlSubmitReportFeedbackMutationVariables
  >(SubmitReportFeedbackDocument, options);
}
export type SubmitReportFeedbackMutationHookResult = ReturnType<
  typeof useSubmitReportFeedbackMutation
>;
export type SubmitReportFeedbackMutationResult =
  Apollo.MutationResult<GqlSubmitReportFeedbackMutation>;
export type SubmitReportFeedbackMutationOptions = Apollo.BaseMutationOptions<
  GqlSubmitReportFeedbackMutation,
  GqlSubmitReportFeedbackMutationVariables
>;
export const GetAdminReportDocument = gql`
  query GetAdminReport($id: ID!) {
    report(id: $id) {
      ...AdminReportDetailFields
    }
  }
  ${AdminReportDetailFieldsFragmentDoc}
`;

/**
 * __useGetAdminReportQuery__
 *
 * To run a query within a React component, call `useGetAdminReportQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminReportQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminReportQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAdminReportQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetAdminReportQuery, GqlGetAdminReportQueryVariables> &
    ({ variables: GqlGetAdminReportQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetAdminReportQuery, GqlGetAdminReportQueryVariables>(
    GetAdminReportDocument,
    options,
  );
}
export function useGetAdminReportLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetAdminReportQuery,
    GqlGetAdminReportQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetAdminReportQuery, GqlGetAdminReportQueryVariables>(
    GetAdminReportDocument,
    options,
  );
}
export function useGetAdminReportSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetAdminReportQuery, GqlGetAdminReportQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetAdminReportQuery, GqlGetAdminReportQueryVariables>(
    GetAdminReportDocument,
    options,
  );
}
export type GetAdminReportQueryHookResult = ReturnType<typeof useGetAdminReportQuery>;
export type GetAdminReportLazyQueryHookResult = ReturnType<typeof useGetAdminReportLazyQuery>;
export type GetAdminReportSuspenseQueryHookResult = ReturnType<
  typeof useGetAdminReportSuspenseQuery
>;
export type GetAdminReportQueryResult = Apollo.QueryResult<
  GqlGetAdminReportQuery,
  GqlGetAdminReportQueryVariables
>;
export const GetAdminReportFeedbacksDocument = gql`
  query GetAdminReportFeedbacks($id: ID!, $cursor: String, $first: Int) {
    report(id: $id) {
      id
      feedbacks(after: $cursor, first: $first) {
        edges {
          cursor
          node {
            ...ReportFeedbackFields
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
  ${ReportFeedbackFieldsFragmentDoc}
`;

/**
 * __useGetAdminReportFeedbacksQuery__
 *
 * To run a query within a React component, call `useGetAdminReportFeedbacksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminReportFeedbacksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminReportFeedbacksQuery({
 *   variables: {
 *      id: // value for 'id'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetAdminReportFeedbacksQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetAdminReportFeedbacksQuery,
    GqlGetAdminReportFeedbacksQueryVariables
  > &
    ({ variables: GqlGetAdminReportFeedbacksQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetAdminReportFeedbacksQuery, GqlGetAdminReportFeedbacksQueryVariables>(
    GetAdminReportFeedbacksDocument,
    options,
  );
}
export function useGetAdminReportFeedbacksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetAdminReportFeedbacksQuery,
    GqlGetAdminReportFeedbacksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetAdminReportFeedbacksQuery,
    GqlGetAdminReportFeedbacksQueryVariables
  >(GetAdminReportFeedbacksDocument, options);
}
export function useGetAdminReportFeedbacksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetAdminReportFeedbacksQuery,
        GqlGetAdminReportFeedbacksQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetAdminReportFeedbacksQuery,
    GqlGetAdminReportFeedbacksQueryVariables
  >(GetAdminReportFeedbacksDocument, options);
}
export type GetAdminReportFeedbacksQueryHookResult = ReturnType<
  typeof useGetAdminReportFeedbacksQuery
>;
export type GetAdminReportFeedbacksLazyQueryHookResult = ReturnType<
  typeof useGetAdminReportFeedbacksLazyQuery
>;
export type GetAdminReportFeedbacksSuspenseQueryHookResult = ReturnType<
  typeof useGetAdminReportFeedbacksSuspenseQuery
>;
export type GetAdminReportFeedbacksQueryResult = Apollo.QueryResult<
  GqlGetAdminReportFeedbacksQuery,
  GqlGetAdminReportFeedbacksQueryVariables
>;
export const UpdateReportTemplateDocument = gql`
  mutation UpdateReportTemplate(
    $variant: ReportVariant!
    $input: UpdateReportTemplateInput!
    $communityId: ID
  ) {
    updateReportTemplate(variant: $variant, input: $input, communityId: $communityId) {
      ... on UpdateReportTemplateSuccess {
        reportTemplate {
          ...ReportTemplateFields
        }
      }
    }
  }
  ${ReportTemplateFieldsFragmentDoc}
`;
export type GqlUpdateReportTemplateMutationFn = Apollo.MutationFunction<
  GqlUpdateReportTemplateMutation,
  GqlUpdateReportTemplateMutationVariables
>;

/**
 * __useUpdateReportTemplateMutation__
 *
 * To run a mutation, you first call `useUpdateReportTemplateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateReportTemplateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateReportTemplateMutation, { data, loading, error }] = useUpdateReportTemplateMutation({
 *   variables: {
 *      variant: // value for 'variant'
 *      input: // value for 'input'
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useUpdateReportTemplateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlUpdateReportTemplateMutation,
    GqlUpdateReportTemplateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlUpdateReportTemplateMutation,
    GqlUpdateReportTemplateMutationVariables
  >(UpdateReportTemplateDocument, options);
}
export type UpdateReportTemplateMutationHookResult = ReturnType<
  typeof useUpdateReportTemplateMutation
>;
export type UpdateReportTemplateMutationResult =
  Apollo.MutationResult<GqlUpdateReportTemplateMutation>;
export type UpdateReportTemplateMutationOptions = Apollo.BaseMutationOptions<
  GqlUpdateReportTemplateMutation,
  GqlUpdateReportTemplateMutationVariables
>;
export const GetReportTemplateDocument = gql`
  query GetReportTemplate($variant: ReportVariant!, $communityId: ID) {
    reportTemplate(variant: $variant, communityId: $communityId) {
      ...ReportTemplateFields
    }
  }
  ${ReportTemplateFieldsFragmentDoc}
`;

/**
 * __useGetReportTemplateQuery__
 *
 * To run a query within a React component, call `useGetReportTemplateQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportTemplateQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportTemplateQuery({
 *   variables: {
 *      variant: // value for 'variant'
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useGetReportTemplateQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetReportTemplateQuery,
    GqlGetReportTemplateQueryVariables
  > &
    ({ variables: GqlGetReportTemplateQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetReportTemplateQuery, GqlGetReportTemplateQueryVariables>(
    GetReportTemplateDocument,
    options,
  );
}
export function useGetReportTemplateLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetReportTemplateQuery,
    GqlGetReportTemplateQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetReportTemplateQuery, GqlGetReportTemplateQueryVariables>(
    GetReportTemplateDocument,
    options,
  );
}
export function useGetReportTemplateSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetReportTemplateQuery,
        GqlGetReportTemplateQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetReportTemplateQuery, GqlGetReportTemplateQueryVariables>(
    GetReportTemplateDocument,
    options,
  );
}
export type GetReportTemplateQueryHookResult = ReturnType<typeof useGetReportTemplateQuery>;
export type GetReportTemplateLazyQueryHookResult = ReturnType<typeof useGetReportTemplateLazyQuery>;
export type GetReportTemplateSuspenseQueryHookResult = ReturnType<
  typeof useGetReportTemplateSuspenseQuery
>;
export type GetReportTemplateQueryResult = Apollo.QueryResult<
  GqlGetReportTemplateQuery,
  GqlGetReportTemplateQueryVariables
>;
export const GetReportTemplateStatsDocument = gql`
  query GetReportTemplateStats($variant: ReportVariant!, $version: Int) {
    reportTemplateStats(variant: $variant, version: $version) {
      ...ReportTemplateStatsFields
    }
  }
  ${ReportTemplateStatsFieldsFragmentDoc}
`;

/**
 * __useGetReportTemplateStatsQuery__
 *
 * To run a query within a React component, call `useGetReportTemplateStatsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportTemplateStatsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportTemplateStatsQuery({
 *   variables: {
 *      variant: // value for 'variant'
 *      version: // value for 'version'
 *   },
 * });
 */
export function useGetReportTemplateStatsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetReportTemplateStatsQuery,
    GqlGetReportTemplateStatsQueryVariables
  > &
    ({ variables: GqlGetReportTemplateStatsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetReportTemplateStatsQuery, GqlGetReportTemplateStatsQueryVariables>(
    GetReportTemplateStatsDocument,
    options,
  );
}
export function useGetReportTemplateStatsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetReportTemplateStatsQuery,
    GqlGetReportTemplateStatsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetReportTemplateStatsQuery,
    GqlGetReportTemplateStatsQueryVariables
  >(GetReportTemplateStatsDocument, options);
}
export function useGetReportTemplateStatsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetReportTemplateStatsQuery,
        GqlGetReportTemplateStatsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetReportTemplateStatsQuery,
    GqlGetReportTemplateStatsQueryVariables
  >(GetReportTemplateStatsDocument, options);
}
export type GetReportTemplateStatsQueryHookResult = ReturnType<
  typeof useGetReportTemplateStatsQuery
>;
export type GetReportTemplateStatsLazyQueryHookResult = ReturnType<
  typeof useGetReportTemplateStatsLazyQuery
>;
export type GetReportTemplateStatsSuspenseQueryHookResult = ReturnType<
  typeof useGetReportTemplateStatsSuspenseQuery
>;
export type GetReportTemplateStatsQueryResult = Apollo.QueryResult<
  GqlGetReportTemplateStatsQuery,
  GqlGetReportTemplateStatsQueryVariables
>;
export const GetReportTemplatesDocument = gql`
  query GetReportTemplates(
    $variant: ReportVariant!
    $communityId: ID
    $kind: ReportTemplateKind
    $includeInactive: Boolean
  ) {
    reportTemplates(
      variant: $variant
      communityId: $communityId
      kind: $kind
      includeInactive: $includeInactive
    ) {
      ...ReportTemplateFields
    }
  }
  ${ReportTemplateFieldsFragmentDoc}
`;

/**
 * __useGetReportTemplatesQuery__
 *
 * To run a query within a React component, call `useGetReportTemplatesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportTemplatesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportTemplatesQuery({
 *   variables: {
 *      variant: // value for 'variant'
 *      communityId: // value for 'communityId'
 *      kind: // value for 'kind'
 *      includeInactive: // value for 'includeInactive'
 *   },
 * });
 */
export function useGetReportTemplatesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetReportTemplatesQuery,
    GqlGetReportTemplatesQueryVariables
  > &
    ({ variables: GqlGetReportTemplatesQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetReportTemplatesQuery, GqlGetReportTemplatesQueryVariables>(
    GetReportTemplatesDocument,
    options,
  );
}
export function useGetReportTemplatesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetReportTemplatesQuery,
    GqlGetReportTemplatesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetReportTemplatesQuery, GqlGetReportTemplatesQueryVariables>(
    GetReportTemplatesDocument,
    options,
  );
}
export function useGetReportTemplatesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetReportTemplatesQuery,
        GqlGetReportTemplatesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetReportTemplatesQuery, GqlGetReportTemplatesQueryVariables>(
    GetReportTemplatesDocument,
    options,
  );
}
export type GetReportTemplatesQueryHookResult = ReturnType<typeof useGetReportTemplatesQuery>;
export type GetReportTemplatesLazyQueryHookResult = ReturnType<
  typeof useGetReportTemplatesLazyQuery
>;
export type GetReportTemplatesSuspenseQueryHookResult = ReturnType<
  typeof useGetReportTemplatesSuspenseQuery
>;
export type GetReportTemplatesQueryResult = Apollo.QueryResult<
  GqlGetReportTemplatesQuery,
  GqlGetReportTemplatesQueryVariables
>;
export const GetReportTemplateStatsBreakdownDocument = gql`
  query GetReportTemplateStatsBreakdown(
    $variant: ReportVariant!
    $version: Int
    $kind: ReportTemplateKind
    $includeInactive: Boolean
    $cursor: String
    $first: Int
  ) {
    reportTemplateStatsBreakdown(
      variant: $variant
      version: $version
      kind: $kind
      includeInactive: $includeInactive
      cursor: $cursor
      first: $first
    ) {
      edges {
        cursor
        node {
          ...ReportTemplateStatsBreakdownRowFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
  ${ReportTemplateStatsBreakdownRowFieldsFragmentDoc}
`;

/**
 * __useGetReportTemplateStatsBreakdownQuery__
 *
 * To run a query within a React component, call `useGetReportTemplateStatsBreakdownQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetReportTemplateStatsBreakdownQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetReportTemplateStatsBreakdownQuery({
 *   variables: {
 *      variant: // value for 'variant'
 *      version: // value for 'version'
 *      kind: // value for 'kind'
 *      includeInactive: // value for 'includeInactive'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetReportTemplateStatsBreakdownQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetReportTemplateStatsBreakdownQuery,
    GqlGetReportTemplateStatsBreakdownQueryVariables
  > &
    (
      | { variables: GqlGetReportTemplateStatsBreakdownQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetReportTemplateStatsBreakdownQuery,
    GqlGetReportTemplateStatsBreakdownQueryVariables
  >(GetReportTemplateStatsBreakdownDocument, options);
}
export function useGetReportTemplateStatsBreakdownLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetReportTemplateStatsBreakdownQuery,
    GqlGetReportTemplateStatsBreakdownQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetReportTemplateStatsBreakdownQuery,
    GqlGetReportTemplateStatsBreakdownQueryVariables
  >(GetReportTemplateStatsBreakdownDocument, options);
}
export function useGetReportTemplateStatsBreakdownSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetReportTemplateStatsBreakdownQuery,
        GqlGetReportTemplateStatsBreakdownQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetReportTemplateStatsBreakdownQuery,
    GqlGetReportTemplateStatsBreakdownQueryVariables
  >(GetReportTemplateStatsBreakdownDocument, options);
}
export type GetReportTemplateStatsBreakdownQueryHookResult = ReturnType<
  typeof useGetReportTemplateStatsBreakdownQuery
>;
export type GetReportTemplateStatsBreakdownLazyQueryHookResult = ReturnType<
  typeof useGetReportTemplateStatsBreakdownLazyQuery
>;
export type GetReportTemplateStatsBreakdownSuspenseQueryHookResult = ReturnType<
  typeof useGetReportTemplateStatsBreakdownSuspenseQuery
>;
export type GetReportTemplateStatsBreakdownQueryResult = Apollo.QueryResult<
  GqlGetReportTemplateStatsBreakdownQuery,
  GqlGetReportTemplateStatsBreakdownQueryVariables
>;
export const GetSysAdminDashboardDocument = gql`
  query GetSysAdminDashboard($input: SysAdminDashboardInput) {
    sysAdminDashboard(input: $input) {
      asOf
      platform {
        ...SysAdminPlatformSummaryFields
      }
      communities {
        ...SysAdminCommunityOverviewRowFields
      }
    }
  }
  ${SysAdminPlatformSummaryFieldsFragmentDoc}
  ${SysAdminCommunityOverviewRowFieldsFragmentDoc}
`;

/**
 * __useGetSysAdminDashboardQuery__
 *
 * To run a query within a React component, call `useGetSysAdminDashboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSysAdminDashboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSysAdminDashboardQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSysAdminDashboardQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetSysAdminDashboardQuery,
    GqlGetSysAdminDashboardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetSysAdminDashboardQuery, GqlGetSysAdminDashboardQueryVariables>(
    GetSysAdminDashboardDocument,
    options,
  );
}
export function useGetSysAdminDashboardLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetSysAdminDashboardQuery,
    GqlGetSysAdminDashboardQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetSysAdminDashboardQuery, GqlGetSysAdminDashboardQueryVariables>(
    GetSysAdminDashboardDocument,
    options,
  );
}
export function useGetSysAdminDashboardSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetSysAdminDashboardQuery,
        GqlGetSysAdminDashboardQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetSysAdminDashboardQuery,
    GqlGetSysAdminDashboardQueryVariables
  >(GetSysAdminDashboardDocument, options);
}
export type GetSysAdminDashboardQueryHookResult = ReturnType<typeof useGetSysAdminDashboardQuery>;
export type GetSysAdminDashboardLazyQueryHookResult = ReturnType<
  typeof useGetSysAdminDashboardLazyQuery
>;
export type GetSysAdminDashboardSuspenseQueryHookResult = ReturnType<
  typeof useGetSysAdminDashboardSuspenseQuery
>;
export type GetSysAdminDashboardQueryResult = Apollo.QueryResult<
  GqlGetSysAdminDashboardQuery,
  GqlGetSysAdminDashboardQueryVariables
>;
export const GetSysAdminCommunityDetailDocument = gql`
  query GetSysAdminCommunityDetail($input: SysAdminCommunityDetailInput!) {
    sysAdminCommunityDetail(input: $input) {
      asOf
      communityId
      communityName
      windowMonths
      dormantCount
      alerts {
        ...SysAdminAlertFields
      }
      summary {
        ...SysAdminCommunityDetailSummaryFields
      }
      stages {
        ...SysAdminStageDistributionFields
      }
      monthlyActivityTrend {
        ...SysAdminMonthlyActivityPointFields
      }
      retentionTrend {
        ...SysAdminRetentionTrendPointFields
      }
      cohortRetention {
        ...SysAdminCohortRetentionPointFields
      }
      cohortFunnel {
        ...SysAdminCohortFunnelPointFields
      }
      memberList {
        hasNextPage
        nextCursor
        users {
          ...SysAdminMemberRowFields
        }
      }
    }
  }
  ${SysAdminAlertFieldsFragmentDoc}
  ${SysAdminCommunityDetailSummaryFieldsFragmentDoc}
  ${SysAdminStageDistributionFieldsFragmentDoc}
  ${SysAdminMonthlyActivityPointFieldsFragmentDoc}
  ${SysAdminRetentionTrendPointFieldsFragmentDoc}
  ${SysAdminCohortRetentionPointFieldsFragmentDoc}
  ${SysAdminCohortFunnelPointFieldsFragmentDoc}
  ${SysAdminMemberRowFieldsFragmentDoc}
`;

/**
 * __useGetSysAdminCommunityDetailQuery__
 *
 * To run a query within a React component, call `useGetSysAdminCommunityDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSysAdminCommunityDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSysAdminCommunityDetailQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetSysAdminCommunityDetailQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetSysAdminCommunityDetailQuery,
    GqlGetSysAdminCommunityDetailQueryVariables
  > &
    (
      | { variables: GqlGetSysAdminCommunityDetailQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetSysAdminCommunityDetailQuery,
    GqlGetSysAdminCommunityDetailQueryVariables
  >(GetSysAdminCommunityDetailDocument, options);
}
export function useGetSysAdminCommunityDetailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetSysAdminCommunityDetailQuery,
    GqlGetSysAdminCommunityDetailQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetSysAdminCommunityDetailQuery,
    GqlGetSysAdminCommunityDetailQueryVariables
  >(GetSysAdminCommunityDetailDocument, options);
}
export function useGetSysAdminCommunityDetailSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetSysAdminCommunityDetailQuery,
        GqlGetSysAdminCommunityDetailQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetSysAdminCommunityDetailQuery,
    GqlGetSysAdminCommunityDetailQueryVariables
  >(GetSysAdminCommunityDetailDocument, options);
}
export type GetSysAdminCommunityDetailQueryHookResult = ReturnType<
  typeof useGetSysAdminCommunityDetailQuery
>;
export type GetSysAdminCommunityDetailLazyQueryHookResult = ReturnType<
  typeof useGetSysAdminCommunityDetailLazyQuery
>;
export type GetSysAdminCommunityDetailSuspenseQueryHookResult = ReturnType<
  typeof useGetSysAdminCommunityDetailSuspenseQuery
>;
export type GetSysAdminCommunityDetailQueryResult = Apollo.QueryResult<
  GqlGetSysAdminCommunityDetailQuery,
  GqlGetSysAdminCommunityDetailQueryVariables
>;
export const GetCurrentUserProfileDocument = gql`
  query GetCurrentUserProfile {
    currentUser {
      user {
        ...UserFields
        portfolios {
          ...UserPortfolioFields
        }
        nftInstances {
          totalCount
          edges {
            node {
              id
              instanceId
              name
              imageUrl
              createdAt
              community {
                id
              }
            }
          }
        }
        wallets {
          ...WalletFields
          community {
            id
          }
          tickets {
            id
            status
          }
        }
        nftWallet {
          id
          walletAddress
        }
        didIssuanceRequests {
          ...DidIssuanceRequestFields
        }
        opportunitiesCreatedByMe {
          id
          title
          images
        }
      }
    }
  }
  ${UserFieldsFragmentDoc}
  ${UserPortfolioFieldsFragmentDoc}
  ${WalletFieldsFragmentDoc}
  ${DidIssuanceRequestFieldsFragmentDoc}
`;

/**
 * __useGetCurrentUserProfileQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserProfileQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetCurrentUserProfileQuery,
    GqlGetCurrentUserProfileQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetCurrentUserProfileQuery, GqlGetCurrentUserProfileQueryVariables>(
    GetCurrentUserProfileDocument,
    options,
  );
}
export function useGetCurrentUserProfileLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetCurrentUserProfileQuery,
    GqlGetCurrentUserProfileQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetCurrentUserProfileQuery, GqlGetCurrentUserProfileQueryVariables>(
    GetCurrentUserProfileDocument,
    options,
  );
}
export function useGetCurrentUserProfileSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetCurrentUserProfileQuery,
        GqlGetCurrentUserProfileQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetCurrentUserProfileQuery,
    GqlGetCurrentUserProfileQueryVariables
  >(GetCurrentUserProfileDocument, options);
}
export type GetCurrentUserProfileQueryHookResult = ReturnType<typeof useGetCurrentUserProfileQuery>;
export type GetCurrentUserProfileLazyQueryHookResult = ReturnType<
  typeof useGetCurrentUserProfileLazyQuery
>;
export type GetCurrentUserProfileSuspenseQueryHookResult = ReturnType<
  typeof useGetCurrentUserProfileSuspenseQuery
>;
export type GetCurrentUserProfileQueryResult = Apollo.QueryResult<
  GqlGetCurrentUserProfileQuery,
  GqlGetCurrentUserProfileQueryVariables
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
          preferredLanguage
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
    $portfolioFilter: PortfolioFilterInput
    $portfolioSort: PortfolioSortInput
    $portfolioFirst: Int
    $withWallets: Boolean! = false
    $withOpportunities: Boolean! = false
    $withDidIssuanceRequests: Boolean! = false
    $withNftInstances: Boolean! = false
  ) {
    user(id: $id) {
      ...UserFields
      portfolios(filter: $portfolioFilter, sort: $portfolioSort, first: $portfolioFirst)
        @include(if: $withPortfolios) {
        ...UserPortfolioFields
      }
      nftInstances @include(if: $withNftInstances) {
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
            id
            instanceId
            imageUrl
            name
            createdAt
            community {
              id
            }
          }
        }
      }
      didIssuanceRequests @include(if: $withDidIssuanceRequests) {
        ...DidIssuanceRequestFields
      }
      wallets @include(if: $withWallets) {
        ...WalletFields
        community {
          ...CommunityFields
        }
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
  ${DidIssuanceRequestFieldsFragmentDoc}
  ${WalletFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${TicketFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
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
 *      portfolioFilter: // value for 'portfolioFilter'
 *      portfolioSort: // value for 'portfolioSort'
 *      portfolioFirst: // value for 'portfolioFirst'
 *      withWallets: // value for 'withWallets'
 *      withOpportunities: // value for 'withOpportunities'
 *      withDidIssuanceRequests: // value for 'withDidIssuanceRequests'
 *      withNftInstances: // value for 'withNftInstances'
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
        community {
          ...CommunityFields
        }
        transactions {
          ...TransactionFields
          fromWallet {
            ...WalletFields
            user {
              id
              name
              image
            }
            community {
              ...CommunityFields
            }
          }
          toWallet {
            ...WalletFields
            user {
              id
              name
              image
            }
            community {
              ...CommunityFields
            }
          }
        }
        tickets {
          ...TicketFields
          utility {
            ...UtilityWithOwnerFields
          }
        }
      }
    }
  }
  ${UserFieldsFragmentDoc}
  ${WalletFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${TransactionFieldsFragmentDoc}
  ${TicketFieldsFragmentDoc}
  ${UtilityWithOwnerFieldsFragmentDoc}
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
export const GetCommunityWalletDocument = gql`
  query GetCommunityWallet($communityId: ID!) {
    wallets(filter: { type: COMMUNITY, communityId: $communityId }) {
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
          community {
            ...CommunityFields
          }
        }
      }
    }
  }
  ${WalletFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
`;

/**
 * __useGetCommunityWalletQuery__
 *
 * To run a query within a React component, call `useGetCommunityWalletQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCommunityWalletQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCommunityWalletQuery({
 *   variables: {
 *      communityId: // value for 'communityId'
 *   },
 * });
 */
export function useGetCommunityWalletQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetCommunityWalletQuery,
    GqlGetCommunityWalletQueryVariables
  > &
    ({ variables: GqlGetCommunityWalletQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetCommunityWalletQuery, GqlGetCommunityWalletQueryVariables>(
    GetCommunityWalletDocument,
    options,
  );
}
export function useGetCommunityWalletLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetCommunityWalletQuery,
    GqlGetCommunityWalletQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetCommunityWalletQuery, GqlGetCommunityWalletQueryVariables>(
    GetCommunityWalletDocument,
    options,
  );
}
export function useGetCommunityWalletSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetCommunityWalletQuery,
        GqlGetCommunityWalletQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetCommunityWalletQuery, GqlGetCommunityWalletQueryVariables>(
    GetCommunityWalletDocument,
    options,
  );
}
export type GetCommunityWalletQueryHookResult = ReturnType<typeof useGetCommunityWalletQuery>;
export type GetCommunityWalletLazyQueryHookResult = ReturnType<
  typeof useGetCommunityWalletLazyQuery
>;
export type GetCommunityWalletSuspenseQueryHookResult = ReturnType<
  typeof useGetCommunityWalletSuspenseQuery
>;
export type GetCommunityWalletQueryResult = Apollo.QueryResult<
  GqlGetCommunityWalletQuery,
  GqlGetCommunityWalletQueryVariables
>;
export const GetMemberWalletsDocument = gql`
  query GetMemberWallets(
    $filter: WalletFilterInput
    $first: Int
    $cursor: String
    $withDidIssuanceRequests: Boolean! = false
  ) {
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
          id
          type
          currentPointView {
            currentPoint
          }
          user {
            id
            name
            image
            didIssuanceRequests @include(if: $withDidIssuanceRequests) {
              status
              didValue
            }
          }
          community {
            id
            name
            image
          }
        }
      }
    }
  }
`;

/**
 * __useGetMemberWalletsQuery__
 *
 * To run a query within a React component, call `useGetMemberWalletsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMemberWalletsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMemberWalletsQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      withDidIssuanceRequests: // value for 'withDidIssuanceRequests'
 *   },
 * });
 */
export function useGetMemberWalletsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetMemberWalletsQuery,
    GqlGetMemberWalletsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetMemberWalletsQuery, GqlGetMemberWalletsQueryVariables>(
    GetMemberWalletsDocument,
    options,
  );
}
export function useGetMemberWalletsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetMemberWalletsQuery,
    GqlGetMemberWalletsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetMemberWalletsQuery, GqlGetMemberWalletsQueryVariables>(
    GetMemberWalletsDocument,
    options,
  );
}
export function useGetMemberWalletsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetMemberWalletsQuery, GqlGetMemberWalletsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetMemberWalletsQuery, GqlGetMemberWalletsQueryVariables>(
    GetMemberWalletsDocument,
    options,
  );
}
export type GetMemberWalletsQueryHookResult = ReturnType<typeof useGetMemberWalletsQuery>;
export type GetMemberWalletsLazyQueryHookResult = ReturnType<typeof useGetMemberWalletsLazyQuery>;
export type GetMemberWalletsSuspenseQueryHookResult = ReturnType<
  typeof useGetMemberWalletsSuspenseQuery
>;
export type GetMemberWalletsQueryResult = Apollo.QueryResult<
  GqlGetMemberWalletsQuery,
  GqlGetMemberWalletsQueryVariables
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
          relatedUsers {
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
      relatedUsers {
        ...UserFields
        opportunitiesCreatedByMe {
          ...OpportunityFields
          place {
            ...PlaceFields
          }
        }
      }
      authors {
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
          relatedUsers {
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
export const GetDidIssuanceRequestsDocument = gql`
  query GetDidIssuanceRequests($userIds: [ID!]!) {
    users(filter: { ids: $userIds }) {
      edges {
        node {
          id
          didIssuanceRequests {
            ...DidIssuanceRequestFields
          }
        }
      }
    }
  }
  ${DidIssuanceRequestFieldsFragmentDoc}
`;

/**
 * __useGetDidIssuanceRequestsQuery__
 *
 * To run a query within a React component, call `useGetDidIssuanceRequestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDidIssuanceRequestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDidIssuanceRequestsQuery({
 *   variables: {
 *      userIds: // value for 'userIds'
 *   },
 * });
 */
export function useGetDidIssuanceRequestsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetDidIssuanceRequestsQuery,
    GqlGetDidIssuanceRequestsQueryVariables
  > &
    ({ variables: GqlGetDidIssuanceRequestsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetDidIssuanceRequestsQuery, GqlGetDidIssuanceRequestsQueryVariables>(
    GetDidIssuanceRequestsDocument,
    options,
  );
}
export function useGetDidIssuanceRequestsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetDidIssuanceRequestsQuery,
    GqlGetDidIssuanceRequestsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetDidIssuanceRequestsQuery,
    GqlGetDidIssuanceRequestsQueryVariables
  >(GetDidIssuanceRequestsDocument, options);
}
export function useGetDidIssuanceRequestsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetDidIssuanceRequestsQuery,
        GqlGetDidIssuanceRequestsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetDidIssuanceRequestsQuery,
    GqlGetDidIssuanceRequestsQueryVariables
  >(GetDidIssuanceRequestsDocument, options);
}
export type GetDidIssuanceRequestsQueryHookResult = ReturnType<
  typeof useGetDidIssuanceRequestsQuery
>;
export type GetDidIssuanceRequestsLazyQueryHookResult = ReturnType<
  typeof useGetDidIssuanceRequestsLazyQuery
>;
export type GetDidIssuanceRequestsSuspenseQueryHookResult = ReturnType<
  typeof useGetDidIssuanceRequestsSuspenseQuery
>;
export type GetDidIssuanceRequestsQueryResult = Apollo.QueryResult<
  GqlGetDidIssuanceRequestsQuery,
  GqlGetDidIssuanceRequestsQueryVariables
>;
export const EvaluationBulkCreateDocument = gql`
  mutation EvaluationBulkCreate(
    $input: EvaluationBulkCreateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    evaluationBulkCreate(input: $input, permission: $permission) {
      ... on EvaluationBulkCreateSuccess {
        evaluations {
          ...EvaluationFields
        }
      }
    }
  }
  ${EvaluationFieldsFragmentDoc}
`;
export type GqlEvaluationBulkCreateMutationFn = Apollo.MutationFunction<
  GqlEvaluationBulkCreateMutation,
  GqlEvaluationBulkCreateMutationVariables
>;

/**
 * __useEvaluationBulkCreateMutation__
 *
 * To run a mutation, you first call `useEvaluationBulkCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEvaluationBulkCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [evaluationBulkCreateMutation, { data, loading, error }] = useEvaluationBulkCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useEvaluationBulkCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlEvaluationBulkCreateMutation,
    GqlEvaluationBulkCreateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlEvaluationBulkCreateMutation,
    GqlEvaluationBulkCreateMutationVariables
  >(EvaluationBulkCreateDocument, options);
}
export type EvaluationBulkCreateMutationHookResult = ReturnType<
  typeof useEvaluationBulkCreateMutation
>;
export type EvaluationBulkCreateMutationResult =
  Apollo.MutationResult<GqlEvaluationBulkCreateMutation>;
export type EvaluationBulkCreateMutationOptions = Apollo.BaseMutationOptions<
  GqlEvaluationBulkCreateMutation,
  GqlEvaluationBulkCreateMutationVariables
>;
export const GetEvaluationsDocument = gql`
  query GetEvaluations(
    $filter: EvaluationFilterInput
    $first: Int
    $withDidIssuanceRequests: Boolean! = false
  ) {
    evaluations(filter: $filter, first: $first) {
      edges {
        node {
          id
          status
          createdAt
          vcIssuanceRequest {
            id
            status
            requestedAt
            completedAt
            user {
              id
              name
            }
          }
          participation {
            user {
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                ...DidIssuanceRequestFields
              }
            }
            opportunitySlot {
              id
              startsAt
              endsAt
              capacity
              opportunity {
                id
                title
                description
                community {
                  id
                }
                createdByUser {
                  id
                  name
                  didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                    ...DidIssuanceRequestFields
                  }
                }
              }
            }
          }
        }
      }
      totalCount
    }
  }
  ${DidIssuanceRequestFieldsFragmentDoc}
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
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      withDidIssuanceRequests: // value for 'withDidIssuanceRequests'
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
      vcIssuanceRequest {
        id
        status
        requestedAt
        completedAt
        user {
          id
          name
        }
      }
      participation {
        opportunitySlot {
          id
          startsAt
          endsAt
          capacity
          opportunity {
            id
            title
            description
            createdByUser {
              id
              name
            }
          }
        }
      }
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
export const CreateOpportunityDocument = gql`
  mutation CreateOpportunity(
    $input: OpportunityCreateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    opportunityCreate(input: $input, permission: $permission) {
      ... on OpportunityCreateSuccess {
        opportunity {
          id
          title
          category
          description
          body
          publishStatus
          images
          requireApproval
          feeRequired
          pointsToEarn
          pointsRequired
          createdAt
          updatedAt
          createdByUser {
            id
            name
          }
          place {
            id
            name
          }
          slots {
            id
            startsAt
            endsAt
            capacity
            hostingStatus
          }
        }
      }
    }
  }
`;
export type GqlCreateOpportunityMutationFn = Apollo.MutationFunction<
  GqlCreateOpportunityMutation,
  GqlCreateOpportunityMutationVariables
>;

/**
 * __useCreateOpportunityMutation__
 *
 * To run a mutation, you first call `useCreateOpportunityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateOpportunityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createOpportunityMutation, { data, loading, error }] = useCreateOpportunityMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useCreateOpportunityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlCreateOpportunityMutation,
    GqlCreateOpportunityMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlCreateOpportunityMutation, GqlCreateOpportunityMutationVariables>(
    CreateOpportunityDocument,
    options,
  );
}
export type CreateOpportunityMutationHookResult = ReturnType<typeof useCreateOpportunityMutation>;
export type CreateOpportunityMutationResult = Apollo.MutationResult<GqlCreateOpportunityMutation>;
export type CreateOpportunityMutationOptions = Apollo.BaseMutationOptions<
  GqlCreateOpportunityMutation,
  GqlCreateOpportunityMutationVariables
>;
export const UpdateOpportunityContentDocument = gql`
  mutation UpdateOpportunityContent(
    $id: ID!
    $input: OpportunityUpdateContentInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    opportunityUpdateContent(id: $id, input: $input, permission: $permission) {
      ... on OpportunityUpdateContentSuccess {
        opportunity {
          id
          title
          category
          description
          body
          publishStatus
          images
          requireApproval
          feeRequired
          pointsToEarn
          pointsRequired
          updatedAt
          place {
            id
            name
          }
          createdByUser {
            id
            name
          }
        }
      }
    }
  }
`;
export type GqlUpdateOpportunityContentMutationFn = Apollo.MutationFunction<
  GqlUpdateOpportunityContentMutation,
  GqlUpdateOpportunityContentMutationVariables
>;

/**
 * __useUpdateOpportunityContentMutation__
 *
 * To run a mutation, you first call `useUpdateOpportunityContentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOpportunityContentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOpportunityContentMutation, { data, loading, error }] = useUpdateOpportunityContentMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useUpdateOpportunityContentMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlUpdateOpportunityContentMutation,
    GqlUpdateOpportunityContentMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlUpdateOpportunityContentMutation,
    GqlUpdateOpportunityContentMutationVariables
  >(UpdateOpportunityContentDocument, options);
}
export type UpdateOpportunityContentMutationHookResult = ReturnType<
  typeof useUpdateOpportunityContentMutation
>;
export type UpdateOpportunityContentMutationResult =
  Apollo.MutationResult<GqlUpdateOpportunityContentMutation>;
export type UpdateOpportunityContentMutationOptions = Apollo.BaseMutationOptions<
  GqlUpdateOpportunityContentMutation,
  GqlUpdateOpportunityContentMutationVariables
>;
export const UpdateOpportunitySlotsBulkDocument = gql`
  mutation UpdateOpportunitySlotsBulk(
    $input: OpportunitySlotsBulkUpdateInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    opportunitySlotsBulkUpdate(input: $input, permission: $permission) {
      ... on OpportunitySlotsBulkUpdateSuccess {
        slots {
          id
          startsAt
          endsAt
          capacity
          hostingStatus
          remainingCapacity
        }
      }
    }
  }
`;
export type GqlUpdateOpportunitySlotsBulkMutationFn = Apollo.MutationFunction<
  GqlUpdateOpportunitySlotsBulkMutation,
  GqlUpdateOpportunitySlotsBulkMutationVariables
>;

/**
 * __useUpdateOpportunitySlotsBulkMutation__
 *
 * To run a mutation, you first call `useUpdateOpportunitySlotsBulkMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOpportunitySlotsBulkMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOpportunitySlotsBulkMutation, { data, loading, error }] = useUpdateOpportunitySlotsBulkMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useUpdateOpportunitySlotsBulkMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlUpdateOpportunitySlotsBulkMutation,
    GqlUpdateOpportunitySlotsBulkMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlUpdateOpportunitySlotsBulkMutation,
    GqlUpdateOpportunitySlotsBulkMutationVariables
  >(UpdateOpportunitySlotsBulkDocument, options);
}
export type UpdateOpportunitySlotsBulkMutationHookResult = ReturnType<
  typeof useUpdateOpportunitySlotsBulkMutation
>;
export type UpdateOpportunitySlotsBulkMutationResult =
  Apollo.MutationResult<GqlUpdateOpportunitySlotsBulkMutation>;
export type UpdateOpportunitySlotsBulkMutationOptions = Apollo.BaseMutationOptions<
  GqlUpdateOpportunitySlotsBulkMutation,
  GqlUpdateOpportunitySlotsBulkMutationVariables
>;
export const SetPublishStatusDocument = gql`
  mutation SetPublishStatus(
    $id: ID!
    $input: OpportunitySetPublishStatusInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    opportunitySetPublishStatus(id: $id, input: $input, permission: $permission) {
      ... on OpportunitySetPublishStatusSuccess {
        opportunity {
          id
          publishStatus
          updatedAt
        }
      }
    }
  }
`;
export type GqlSetPublishStatusMutationFn = Apollo.MutationFunction<
  GqlSetPublishStatusMutation,
  GqlSetPublishStatusMutationVariables
>;

/**
 * __useSetPublishStatusMutation__
 *
 * To run a mutation, you first call `useSetPublishStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetPublishStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setPublishStatusMutation, { data, loading, error }] = useSetPublishStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useSetPublishStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlSetPublishStatusMutation,
    GqlSetPublishStatusMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlSetPublishStatusMutation, GqlSetPublishStatusMutationVariables>(
    SetPublishStatusDocument,
    options,
  );
}
export type SetPublishStatusMutationHookResult = ReturnType<typeof useSetPublishStatusMutation>;
export type SetPublishStatusMutationResult = Apollo.MutationResult<GqlSetPublishStatusMutation>;
export type SetPublishStatusMutationOptions = Apollo.BaseMutationOptions<
  GqlSetPublishStatusMutation,
  GqlSetPublishStatusMutationVariables
>;
export const SetOpportunitySlotHostingStatusDocument = gql`
  mutation SetOpportunitySlotHostingStatus(
    $id: ID!
    $input: OpportunitySlotSetHostingStatusInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    opportunitySlotSetHostingStatus(id: $id, input: $input, permission: $permission) {
      ... on OpportunitySlotSetHostingStatusSuccess {
        slot {
          id
          startsAt
          endsAt
          capacity
          hostingStatus
          remainingCapacity
        }
      }
    }
  }
`;
export type GqlSetOpportunitySlotHostingStatusMutationFn = Apollo.MutationFunction<
  GqlSetOpportunitySlotHostingStatusMutation,
  GqlSetOpportunitySlotHostingStatusMutationVariables
>;

/**
 * __useSetOpportunitySlotHostingStatusMutation__
 *
 * To run a mutation, you first call `useSetOpportunitySlotHostingStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetOpportunitySlotHostingStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setOpportunitySlotHostingStatusMutation, { data, loading, error }] = useSetOpportunitySlotHostingStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useSetOpportunitySlotHostingStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlSetOpportunitySlotHostingStatusMutation,
    GqlSetOpportunitySlotHostingStatusMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlSetOpportunitySlotHostingStatusMutation,
    GqlSetOpportunitySlotHostingStatusMutationVariables
  >(SetOpportunitySlotHostingStatusDocument, options);
}
export type SetOpportunitySlotHostingStatusMutationHookResult = ReturnType<
  typeof useSetOpportunitySlotHostingStatusMutation
>;
export type SetOpportunitySlotHostingStatusMutationResult =
  Apollo.MutationResult<GqlSetOpportunitySlotHostingStatusMutation>;
export type SetOpportunitySlotHostingStatusMutationOptions = Apollo.BaseMutationOptions<
  GqlSetOpportunitySlotHostingStatusMutation,
  GqlSetOpportunitySlotHostingStatusMutationVariables
>;
export const DeleteOpportunityDocument = gql`
  mutation DeleteOpportunity($id: ID!, $permission: CheckOpportunityPermissionInput!) {
    opportunityDelete(id: $id, permission: $permission) {
      ... on OpportunityDeleteSuccess {
        opportunityId
      }
    }
  }
`;
export type GqlDeleteOpportunityMutationFn = Apollo.MutationFunction<
  GqlDeleteOpportunityMutation,
  GqlDeleteOpportunityMutationVariables
>;

/**
 * __useDeleteOpportunityMutation__
 *
 * To run a mutation, you first call `useDeleteOpportunityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOpportunityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOpportunityMutation, { data, loading, error }] = useDeleteOpportunityMutation({
 *   variables: {
 *      id: // value for 'id'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useDeleteOpportunityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlDeleteOpportunityMutation,
    GqlDeleteOpportunityMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlDeleteOpportunityMutation, GqlDeleteOpportunityMutationVariables>(
    DeleteOpportunityDocument,
    options,
  );
}
export type DeleteOpportunityMutationHookResult = ReturnType<typeof useDeleteOpportunityMutation>;
export type DeleteOpportunityMutationResult = Apollo.MutationResult<GqlDeleteOpportunityMutation>;
export type DeleteOpportunityMutationOptions = Apollo.BaseMutationOptions<
  GqlDeleteOpportunityMutation,
  GqlDeleteOpportunityMutationVariables
>;
export const GetAdminOpportunitiesDocument = gql`
  query GetAdminOpportunities(
    $filter: OpportunityFilterInput
    $sort: OpportunitySortInput
    $first: Int
    $cursor: String
  ) {
    opportunities(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
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
          title
          description
          publishStatus
          category
          images
          requireApproval
          createdAt
          updatedAt
          createdByUser {
            id
            name
          }
        }
      }
    }
  }
`;

/**
 * __useGetAdminOpportunitiesQuery__
 *
 * To run a query within a React component, call `useGetAdminOpportunitiesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAdminOpportunitiesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAdminOpportunitiesQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useGetAdminOpportunitiesQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetAdminOpportunitiesQuery,
    GqlGetAdminOpportunitiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetAdminOpportunitiesQuery, GqlGetAdminOpportunitiesQueryVariables>(
    GetAdminOpportunitiesDocument,
    options,
  );
}
export function useGetAdminOpportunitiesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetAdminOpportunitiesQuery,
    GqlGetAdminOpportunitiesQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetAdminOpportunitiesQuery, GqlGetAdminOpportunitiesQueryVariables>(
    GetAdminOpportunitiesDocument,
    options,
  );
}
export function useGetAdminOpportunitiesSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetAdminOpportunitiesQuery,
        GqlGetAdminOpportunitiesQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetAdminOpportunitiesQuery,
    GqlGetAdminOpportunitiesQueryVariables
  >(GetAdminOpportunitiesDocument, options);
}
export type GetAdminOpportunitiesQueryHookResult = ReturnType<typeof useGetAdminOpportunitiesQuery>;
export type GetAdminOpportunitiesLazyQueryHookResult = ReturnType<
  typeof useGetAdminOpportunitiesLazyQuery
>;
export type GetAdminOpportunitiesSuspenseQueryHookResult = ReturnType<
  typeof useGetAdminOpportunitiesSuspenseQuery
>;
export type GetAdminOpportunitiesQueryResult = Apollo.QueryResult<
  GqlGetAdminOpportunitiesQuery,
  GqlGetAdminOpportunitiesQueryVariables
>;
export const GetOpportunitiesDocument = gql`
  query GetOpportunities(
    $filter: OpportunityFilterInput
    $sort: OpportunitySortInput
    $first: Int
    $cursor: String
    $includeSlot: Boolean! = false
    $slotFilter: OpportunitySlotFilterInput
    $slotSort: OpportunitySlotSortInput
  ) {
    opportunities(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
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
          title
          category
          images
          isReservableWithTicket
          feeRequired
          pointsToEarn
          pointsRequired
          place {
            id
            name
          }
          slots(filter: $slotFilter, sort: $slotSort) @include(if: $includeSlot) {
            id
            startsAt
            endsAt
            capacity
            remainingCapacity
            hostingStatus
          }
        }
      }
    }
  }
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
 *      sort: // value for 'sort'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      includeSlot: // value for 'includeSlot'
 *      slotFilter: // value for 'slotFilter'
 *      slotSort: // value for 'slotSort'
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
  query GetOpportunity(
    $id: ID!
    $permission: CheckCommunityPermissionInput!
    $slotFilter: OpportunitySlotFilterInput
    $slotSort: OpportunitySlotSortInput
  ) {
    opportunity(id: $id, permission: $permission) {
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
      pointsRequired
      earliestReservableAt
      requiredUtilities {
        id
        pointsRequired
        publishStatus
      }
      community {
        id
        name
        image
      }
      place {
        id
        name
        address
        latitude
        longitude
        city {
          state {
            code
          }
        }
      }
      slots(filter: $slotFilter, sort: $slotSort) {
        id
        startsAt
        endsAt
        capacity
        remainingCapacity
        hostingStatus
      }
      articles {
        id
        category
        title
        thumbnail
        introduction
        publishedAt
      }
      createdByUser {
        id
        name
        image
        bio
        articlesAboutMe {
          id
          category
          title
          thumbnail
          introduction
          publishedAt
        }
      }
    }
  }
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
 *      slotFilter: // value for 'slotFilter'
 *      slotSort: // value for 'slotSort'
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
export const OpportunitySlotSetHostingStatusDocument = gql`
  mutation OpportunitySlotSetHostingStatus(
    $id: ID!
    $input: OpportunitySlotSetHostingStatusInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    opportunitySlotSetHostingStatus(id: $id, input: $input, permission: $permission) {
      ... on OpportunitySlotSetHostingStatusSuccess {
        slot {
          ...OpportunitySlotFields
        }
      }
    }
  }
  ${OpportunitySlotFieldsFragmentDoc}
`;
export type GqlOpportunitySlotSetHostingStatusMutationFn = Apollo.MutationFunction<
  GqlOpportunitySlotSetHostingStatusMutation,
  GqlOpportunitySlotSetHostingStatusMutationVariables
>;

/**
 * __useOpportunitySlotSetHostingStatusMutation__
 *
 * To run a mutation, you first call `useOpportunitySlotSetHostingStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOpportunitySlotSetHostingStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [opportunitySlotSetHostingStatusMutation, { data, loading, error }] = useOpportunitySlotSetHostingStatusMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useOpportunitySlotSetHostingStatusMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlOpportunitySlotSetHostingStatusMutation,
    GqlOpportunitySlotSetHostingStatusMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlOpportunitySlotSetHostingStatusMutation,
    GqlOpportunitySlotSetHostingStatusMutationVariables
  >(OpportunitySlotSetHostingStatusDocument, options);
}
export type OpportunitySlotSetHostingStatusMutationHookResult = ReturnType<
  typeof useOpportunitySlotSetHostingStatusMutation
>;
export type OpportunitySlotSetHostingStatusMutationResult =
  Apollo.MutationResult<GqlOpportunitySlotSetHostingStatusMutation>;
export type OpportunitySlotSetHostingStatusMutationOptions = Apollo.BaseMutationOptions<
  GqlOpportunitySlotSetHostingStatusMutation,
  GqlOpportunitySlotSetHostingStatusMutationVariables
>;
export const GetOpportunitySlotsDocument = gql`
  query GetOpportunitySlots(
    $filter: OpportunitySlotFilterInput
    $sort: OpportunitySlotSortInput
    $cursor: String
    $first: Int
  ) {
    opportunitySlots(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
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
          isFullyEvaluated
          numParticipants
          numEvaluated
          opportunity {
            ...OpportunityFields
          }
          reservations {
            ...ReservationFields
            participations {
              ...ParticipationFields
              evaluation {
                id
                status
              }
            }
          }
        }
      }
    }
  }
  ${OpportunityFieldsFragmentDoc}
  ${ReservationFieldsFragmentDoc}
  ${ParticipationFieldsFragmentDoc}
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
 *      sort: // value for 'sort'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
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
export const GetOpportunitySlotWithParticipationsDocument = gql`
  query GetOpportunitySlotWithParticipations($id: ID!) {
    opportunitySlot(id: $id) {
      id
      hostingStatus
      startsAt
      endsAt
      capacity
      remainingCapacity
      isFullyEvaluated
      numParticipants
      numEvaluated
      opportunity {
        ...OpportunityFields
        community {
          ...CommunityFields
        }
      }
      reservations {
        ...ReservationFields
        participations {
          ...ParticipationFields
          user {
            ...UserFields
          }
          evaluation {
            id
            status
          }
        }
      }
    }
  }
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${ReservationFieldsFragmentDoc}
  ${ParticipationFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
`;

/**
 * __useGetOpportunitySlotWithParticipationsQuery__
 *
 * To run a query within a React component, call `useGetOpportunitySlotWithParticipationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpportunitySlotWithParticipationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpportunitySlotWithParticipationsQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetOpportunitySlotWithParticipationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetOpportunitySlotWithParticipationsQuery,
    GqlGetOpportunitySlotWithParticipationsQueryVariables
  > &
    (
      | { variables: GqlGetOpportunitySlotWithParticipationsQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetOpportunitySlotWithParticipationsQuery,
    GqlGetOpportunitySlotWithParticipationsQueryVariables
  >(GetOpportunitySlotWithParticipationsDocument, options);
}
export function useGetOpportunitySlotWithParticipationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetOpportunitySlotWithParticipationsQuery,
    GqlGetOpportunitySlotWithParticipationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetOpportunitySlotWithParticipationsQuery,
    GqlGetOpportunitySlotWithParticipationsQueryVariables
  >(GetOpportunitySlotWithParticipationsDocument, options);
}
export function useGetOpportunitySlotWithParticipationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetOpportunitySlotWithParticipationsQuery,
        GqlGetOpportunitySlotWithParticipationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetOpportunitySlotWithParticipationsQuery,
    GqlGetOpportunitySlotWithParticipationsQueryVariables
  >(GetOpportunitySlotWithParticipationsDocument, options);
}
export type GetOpportunitySlotWithParticipationsQueryHookResult = ReturnType<
  typeof useGetOpportunitySlotWithParticipationsQuery
>;
export type GetOpportunitySlotWithParticipationsLazyQueryHookResult = ReturnType<
  typeof useGetOpportunitySlotWithParticipationsLazyQuery
>;
export type GetOpportunitySlotWithParticipationsSuspenseQueryHookResult = ReturnType<
  typeof useGetOpportunitySlotWithParticipationsSuspenseQuery
>;
export type GetOpportunitySlotWithParticipationsQueryResult = Apollo.QueryResult<
  GqlGetOpportunitySlotWithParticipationsQuery,
  GqlGetOpportunitySlotWithParticipationsQueryVariables
>;
export const GetSlotReservationsDocument = gql`
  query GetSlotReservations($slotId: ID!) {
    opportunitySlot(id: $slotId) {
      id
      reservations {
        id
        status
      }
    }
  }
`;

/**
 * __useGetSlotReservationsQuery__
 *
 * To run a query within a React component, call `useGetSlotReservationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSlotReservationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSlotReservationsQuery({
 *   variables: {
 *      slotId: // value for 'slotId'
 *   },
 * });
 */
export function useGetSlotReservationsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetSlotReservationsQuery,
    GqlGetSlotReservationsQueryVariables
  > &
    ({ variables: GqlGetSlotReservationsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetSlotReservationsQuery, GqlGetSlotReservationsQueryVariables>(
    GetSlotReservationsDocument,
    options,
  );
}
export function useGetSlotReservationsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetSlotReservationsQuery,
    GqlGetSlotReservationsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetSlotReservationsQuery, GqlGetSlotReservationsQueryVariables>(
    GetSlotReservationsDocument,
    options,
  );
}
export function useGetSlotReservationsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetSlotReservationsQuery,
        GqlGetSlotReservationsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetSlotReservationsQuery, GqlGetSlotReservationsQueryVariables>(
    GetSlotReservationsDocument,
    options,
  );
}
export type GetSlotReservationsQueryHookResult = ReturnType<typeof useGetSlotReservationsQuery>;
export type GetSlotReservationsLazyQueryHookResult = ReturnType<
  typeof useGetSlotReservationsLazyQuery
>;
export type GetSlotReservationsSuspenseQueryHookResult = ReturnType<
  typeof useGetSlotReservationsSuspenseQuery
>;
export type GetSlotReservationsQueryResult = Apollo.QueryResult<
  GqlGetSlotReservationsQuery,
  GqlGetSlotReservationsQueryVariables
>;
export const ParticipationBulkCreateDocument = gql`
  mutation ParticipationBulkCreate(
    $input: ParticipationBulkCreateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    participationBulkCreate(input: $input, permission: $permission) {
      ... on ParticipationBulkCreateSuccess {
        participations {
          ...ParticipationFields
        }
      }
    }
  }
  ${ParticipationFieldsFragmentDoc}
`;
export type GqlParticipationBulkCreateMutationFn = Apollo.MutationFunction<
  GqlParticipationBulkCreateMutation,
  GqlParticipationBulkCreateMutationVariables
>;

/**
 * __useParticipationBulkCreateMutation__
 *
 * To run a mutation, you first call `useParticipationBulkCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useParticipationBulkCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [participationBulkCreateMutation, { data, loading, error }] = useParticipationBulkCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useParticipationBulkCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlParticipationBulkCreateMutation,
    GqlParticipationBulkCreateMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlParticipationBulkCreateMutation,
    GqlParticipationBulkCreateMutationVariables
  >(ParticipationBulkCreateDocument, options);
}
export type ParticipationBulkCreateMutationHookResult = ReturnType<
  typeof useParticipationBulkCreateMutation
>;
export type ParticipationBulkCreateMutationResult =
  Apollo.MutationResult<GqlParticipationBulkCreateMutation>;
export type ParticipationBulkCreateMutationOptions = Apollo.BaseMutationOptions<
  GqlParticipationBulkCreateMutation,
  GqlParticipationBulkCreateMutationVariables
>;
export const GetParticipationsDocument = gql`
  query GetParticipations($filter: ParticipationFilterInput, $first: Int) {
    participations(filter: $filter, first: $first) {
      edges {
        node {
          id
          reason
          user {
            id
          }
          reservation {
            opportunitySlot {
              id
              reservations {
                createdByUser {
                  id
                }
              }
            }
          }
          opportunitySlot {
            id
            reservations {
              createdByUser {
                id
              }
            }
          }
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
 *      filter: // value for 'filter'
 *      first: // value for 'first'
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
  query GetParticipation($id: ID!, $withDidIssuanceRequests: Boolean! = false) {
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
      opportunitySlot {
        ...OpportunitySlotFields
        opportunity {
          ...OpportunityFields
          community {
            ...CommunityFields
          }
          createdByUser {
            ...UserFields
            didIssuanceRequests @include(if: $withDidIssuanceRequests) {
              ...DidIssuanceRequestFields
            }
          }
          place {
            ...PlaceFields
          }
        }
      }
      evaluation {
        id
        participation {
          user {
            didIssuanceRequests @include(if: $withDidIssuanceRequests) {
              ...DidIssuanceRequestFields
            }
          }
        }
        status
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
  ${DidIssuanceRequestFieldsFragmentDoc}
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
 *      withDidIssuanceRequests: // value for 'withDidIssuanceRequests'
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
          participations {
            ...ParticipationFields
          }
        }
      }
    }
  }
  ${ReservationFieldsFragmentDoc}
  ${ParticipationFieldsFragmentDoc}
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
export const ReservationAcceptDocument = gql`
  mutation ReservationAccept($id: ID!, $permission: CheckOpportunityPermissionInput!) {
    reservationAccept(id: $id, permission: $permission) {
      ... on ReservationSetStatusSuccess {
        reservation {
          id
          status
        }
      }
    }
  }
`;
export type GqlReservationAcceptMutationFn = Apollo.MutationFunction<
  GqlReservationAcceptMutation,
  GqlReservationAcceptMutationVariables
>;

/**
 * __useReservationAcceptMutation__
 *
 * To run a mutation, you first call `useReservationAcceptMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReservationAcceptMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reservationAcceptMutation, { data, loading, error }] = useReservationAcceptMutation({
 *   variables: {
 *      id: // value for 'id'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useReservationAcceptMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlReservationAcceptMutation,
    GqlReservationAcceptMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlReservationAcceptMutation, GqlReservationAcceptMutationVariables>(
    ReservationAcceptDocument,
    options,
  );
}
export type ReservationAcceptMutationHookResult = ReturnType<typeof useReservationAcceptMutation>;
export type ReservationAcceptMutationResult = Apollo.MutationResult<GqlReservationAcceptMutation>;
export type ReservationAcceptMutationOptions = Apollo.BaseMutationOptions<
  GqlReservationAcceptMutation,
  GqlReservationAcceptMutationVariables
>;
export const RejectReservationDocument = gql`
  mutation RejectReservation(
    $id: ID!
    $input: ReservationRejectInput!
    $permission: CheckOpportunityPermissionInput!
  ) {
    reservationReject(id: $id, input: $input, permission: $permission) {
      ... on ReservationSetStatusSuccess {
        reservation {
          id
          status
          comment
        }
      }
    }
  }
`;
export type GqlRejectReservationMutationFn = Apollo.MutationFunction<
  GqlRejectReservationMutation,
  GqlRejectReservationMutationVariables
>;

/**
 * __useRejectReservationMutation__
 *
 * To run a mutation, you first call `useRejectReservationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectReservationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectReservationMutation, { data, loading, error }] = useRejectReservationMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useRejectReservationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlRejectReservationMutation,
    GqlRejectReservationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlRejectReservationMutation, GqlRejectReservationMutationVariables>(
    RejectReservationDocument,
    options,
  );
}
export type RejectReservationMutationHookResult = ReturnType<typeof useRejectReservationMutation>;
export type RejectReservationMutationResult = Apollo.MutationResult<GqlRejectReservationMutation>;
export type RejectReservationMutationOptions = Apollo.BaseMutationOptions<
  GqlRejectReservationMutation,
  GqlRejectReservationMutationVariables
>;
export const GetReservationsDocument = gql`
  query GetReservations(
    $cursor: String
    $sort: ReservationSortInput
    $first: Int
    $filter: ReservationFilterInput
  ) {
    reservations(cursor: $cursor, sort: $sort, first: $first, filter: $filter) {
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
          ...ReservationFields
          createdAt
          createdByUser {
            ...UserFields
          }
          opportunitySlot {
            id
            hostingStatus
            startsAt
            endsAt
            opportunity {
              id
              title
              category
              description
              publishStatus
              requireApproval
            }
          }
          participations {
            id
            status
            reason
            user {
              id
              name
            }
            evaluation {
              id
              status
            }
          }
        }
      }
    }
  }
  ${ReservationFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
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
 *      cursor: // value for 'cursor'
 *      sort: // value for 'sort'
 *      first: // value for 'first'
 *      filter: // value for 'filter'
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
  query GetReservation($id: ID!, $includeHostArticle: Boolean! = false) {
    reservation(id: $id) {
      ...ReservationFields
      createdByUser {
        ...UserFields
      }
      opportunitySlot {
        isFullyEvaluated
        numParticipants
        numEvaluated
        ...OpportunitySlotFields
        opportunity {
          ...OpportunityFields
          slots {
            isFullyEvaluated
            numParticipants
            numEvaluated
            ...OpportunitySlotFields
          }
          community {
            ...CommunityFields
          }
          createdByUser {
            ...UserFields
            articlesAboutMe @include(if: $includeHostArticle) {
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
        user {
          ...UserFields
        }
        evaluation {
          ...EvaluationFields
        }
        ticketStatusHistories {
          id
          reason
          status
          ticket {
            id
            reason
            status
          }
        }
      }
    }
  }
  ${ReservationFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${OpportunitySlotFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
  ${CommunityFieldsFragmentDoc}
  ${ArticleFieldsFragmentDoc}
  ${PlaceFieldsFragmentDoc}
  ${ParticipationFieldsFragmentDoc}
  ${EvaluationFieldsFragmentDoc}
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
 *      includeHostArticle: // value for 'includeHostArticle'
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
export const GetVcIssuanceRequestByEvaluationDocument = gql`
  query GetVcIssuanceRequestByEvaluation($evaluationId: ID!) {
    vcIssuanceRequests(filter: { evaluationId: $evaluationId }) {
      edges {
        node {
          id
          completedAt
          status
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetVcIssuanceRequestByEvaluationQuery__
 *
 * To run a query within a React component, call `useGetVcIssuanceRequestByEvaluationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVcIssuanceRequestByEvaluationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVcIssuanceRequestByEvaluationQuery({
 *   variables: {
 *      evaluationId: // value for 'evaluationId'
 *   },
 * });
 */
export function useGetVcIssuanceRequestByEvaluationQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetVcIssuanceRequestByEvaluationQuery,
    GqlGetVcIssuanceRequestByEvaluationQueryVariables
  > &
    (
      | { variables: GqlGetVcIssuanceRequestByEvaluationQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetVcIssuanceRequestByEvaluationQuery,
    GqlGetVcIssuanceRequestByEvaluationQueryVariables
  >(GetVcIssuanceRequestByEvaluationDocument, options);
}
export function useGetVcIssuanceRequestByEvaluationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetVcIssuanceRequestByEvaluationQuery,
    GqlGetVcIssuanceRequestByEvaluationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetVcIssuanceRequestByEvaluationQuery,
    GqlGetVcIssuanceRequestByEvaluationQueryVariables
  >(GetVcIssuanceRequestByEvaluationDocument, options);
}
export function useGetVcIssuanceRequestByEvaluationSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetVcIssuanceRequestByEvaluationQuery,
        GqlGetVcIssuanceRequestByEvaluationQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetVcIssuanceRequestByEvaluationQuery,
    GqlGetVcIssuanceRequestByEvaluationQueryVariables
  >(GetVcIssuanceRequestByEvaluationDocument, options);
}
export type GetVcIssuanceRequestByEvaluationQueryHookResult = ReturnType<
  typeof useGetVcIssuanceRequestByEvaluationQuery
>;
export type GetVcIssuanceRequestByEvaluationLazyQueryHookResult = ReturnType<
  typeof useGetVcIssuanceRequestByEvaluationLazyQuery
>;
export type GetVcIssuanceRequestByEvaluationSuspenseQueryHookResult = ReturnType<
  typeof useGetVcIssuanceRequestByEvaluationSuspenseQuery
>;
export type GetVcIssuanceRequestByEvaluationQueryResult = Apollo.QueryResult<
  GqlGetVcIssuanceRequestByEvaluationQuery,
  GqlGetVcIssuanceRequestByEvaluationQueryVariables
>;
export const GetVcIssuanceRequestsByUserDocument = gql`
  query GetVcIssuanceRequestsByUser($userIds: [ID!]!) {
    vcIssuanceRequests(filter: { userIds: $userIds }) {
      edges {
        node {
          id
          status
          completedAt
          createdAt
          evaluation {
            id
            status
            participation {
              id
              opportunitySlot {
                id
              }
            }
          }
          user {
            id
          }
        }
      }
      totalCount
    }
  }
`;

/**
 * __useGetVcIssuanceRequestsByUserQuery__
 *
 * To run a query within a React component, call `useGetVcIssuanceRequestsByUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVcIssuanceRequestsByUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVcIssuanceRequestsByUserQuery({
 *   variables: {
 *      userIds: // value for 'userIds'
 *   },
 * });
 */
export function useGetVcIssuanceRequestsByUserQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetVcIssuanceRequestsByUserQuery,
    GqlGetVcIssuanceRequestsByUserQueryVariables
  > &
    (
      | { variables: GqlGetVcIssuanceRequestsByUserQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GqlGetVcIssuanceRequestsByUserQuery,
    GqlGetVcIssuanceRequestsByUserQueryVariables
  >(GetVcIssuanceRequestsByUserDocument, options);
}
export function useGetVcIssuanceRequestsByUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetVcIssuanceRequestsByUserQuery,
    GqlGetVcIssuanceRequestsByUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GqlGetVcIssuanceRequestsByUserQuery,
    GqlGetVcIssuanceRequestsByUserQueryVariables
  >(GetVcIssuanceRequestsByUserDocument, options);
}
export function useGetVcIssuanceRequestsByUserSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetVcIssuanceRequestsByUserQuery,
        GqlGetVcIssuanceRequestsByUserQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetVcIssuanceRequestsByUserQuery,
    GqlGetVcIssuanceRequestsByUserQueryVariables
  >(GetVcIssuanceRequestsByUserDocument, options);
}
export type GetVcIssuanceRequestsByUserQueryHookResult = ReturnType<
  typeof useGetVcIssuanceRequestsByUserQuery
>;
export type GetVcIssuanceRequestsByUserLazyQueryHookResult = ReturnType<
  typeof useGetVcIssuanceRequestsByUserLazyQuery
>;
export type GetVcIssuanceRequestsByUserSuspenseQueryHookResult = ReturnType<
  typeof useGetVcIssuanceRequestsByUserSuspenseQuery
>;
export type GetVcIssuanceRequestsByUserQueryResult = Apollo.QueryResult<
  GqlGetVcIssuanceRequestsByUserQuery,
  GqlGetVcIssuanceRequestsByUserQueryVariables
>;
export const PlaceCreateDocument = gql`
  mutation PlaceCreate($input: PlaceCreateInput!, $permission: CheckCommunityPermissionInput!) {
    placeCreate(input: $input, permission: $permission) {
      ... on PlaceCreateSuccess {
        place {
          id
          name
          address
          latitude
          longitude
          googlePlaceId
          isManual
          mapLocation
          image
          city {
            code
            name
            state {
              code
              countryCode
              name
            }
          }
          community {
            id
          }
          createdAt
          updatedAt
        }
      }
    }
  }
`;
export type GqlPlaceCreateMutationFn = Apollo.MutationFunction<
  GqlPlaceCreateMutation,
  GqlPlaceCreateMutationVariables
>;

/**
 * __usePlaceCreateMutation__
 *
 * To run a mutation, you first call `usePlaceCreateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaceCreateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [placeCreateMutation, { data, loading, error }] = usePlaceCreateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function usePlaceCreateMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlPlaceCreateMutation, GqlPlaceCreateMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlPlaceCreateMutation, GqlPlaceCreateMutationVariables>(
    PlaceCreateDocument,
    options,
  );
}
export type PlaceCreateMutationHookResult = ReturnType<typeof usePlaceCreateMutation>;
export type PlaceCreateMutationResult = Apollo.MutationResult<GqlPlaceCreateMutation>;
export type PlaceCreateMutationOptions = Apollo.BaseMutationOptions<
  GqlPlaceCreateMutation,
  GqlPlaceCreateMutationVariables
>;
export const PlaceUpdateDocument = gql`
  mutation PlaceUpdate(
    $id: ID!
    $input: PlaceUpdateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    placeUpdate(id: $id, input: $input, permission: $permission) {
      ... on PlaceUpdateSuccess {
        place {
          id
          name
          address
          latitude
          longitude
          googlePlaceId
          isManual
          mapLocation
          image
          city {
            code
            name
            state {
              code
              countryCode
              name
            }
          }
          updatedAt
        }
      }
    }
  }
`;
export type GqlPlaceUpdateMutationFn = Apollo.MutationFunction<
  GqlPlaceUpdateMutation,
  GqlPlaceUpdateMutationVariables
>;

/**
 * __usePlaceUpdateMutation__
 *
 * To run a mutation, you first call `usePlaceUpdateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaceUpdateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [placeUpdateMutation, { data, loading, error }] = usePlaceUpdateMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function usePlaceUpdateMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlPlaceUpdateMutation, GqlPlaceUpdateMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlPlaceUpdateMutation, GqlPlaceUpdateMutationVariables>(
    PlaceUpdateDocument,
    options,
  );
}
export type PlaceUpdateMutationHookResult = ReturnType<typeof usePlaceUpdateMutation>;
export type PlaceUpdateMutationResult = Apollo.MutationResult<GqlPlaceUpdateMutation>;
export type PlaceUpdateMutationOptions = Apollo.BaseMutationOptions<
  GqlPlaceUpdateMutation,
  GqlPlaceUpdateMutationVariables
>;
export const PlaceDeleteDocument = gql`
  mutation PlaceDelete($id: ID!, $permission: CheckCommunityPermissionInput!) {
    placeDelete(id: $id, permission: $permission) {
      ... on PlaceDeleteSuccess {
        id
      }
    }
  }
`;
export type GqlPlaceDeleteMutationFn = Apollo.MutationFunction<
  GqlPlaceDeleteMutation,
  GqlPlaceDeleteMutationVariables
>;

/**
 * __usePlaceDeleteMutation__
 *
 * To run a mutation, you first call `usePlaceDeleteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaceDeleteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [placeDeleteMutation, { data, loading, error }] = usePlaceDeleteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function usePlaceDeleteMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlPlaceDeleteMutation, GqlPlaceDeleteMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlPlaceDeleteMutation, GqlPlaceDeleteMutationVariables>(
    PlaceDeleteDocument,
    options,
  );
}
export type PlaceDeleteMutationHookResult = ReturnType<typeof usePlaceDeleteMutation>;
export type PlaceDeleteMutationResult = Apollo.MutationResult<GqlPlaceDeleteMutation>;
export type PlaceDeleteMutationOptions = Apollo.BaseMutationOptions<
  GqlPlaceDeleteMutation,
  GqlPlaceDeleteMutationVariables
>;
export const GetPlacesDocument = gql`
  query GetPlaces(
    $filter: PlaceFilterInput
    $first: Int
    $cursor: String
    $sort: PlaceSortInput
    $IsCard: Boolean! = false
  ) {
    places(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
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
          ...PlaceFields
          accumulatedParticipants @include(if: $IsCard)
          currentPublicOpportunityCount @include(if: $IsCard)
          opportunities {
            id
            images
            articles @include(if: $IsCard) {
              ...ArticleFields
              relatedUsers {
                ...UserFields
              }
            }
            createdByUser {
              image
              articlesAboutMe @include(if: $IsCard) {
                title
                introduction
                thumbnail
              }
            }
          }
        }
      }
    }
  }
  ${PlaceFieldsFragmentDoc}
  ${ArticleFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
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
 *      filter: // value for 'filter'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      sort: // value for 'sort'
 *      IsCard: // value for 'IsCard'
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
export const GetPlaceDocument = gql`
  query GetPlace($id: ID!) {
    place(id: $id) {
      ...PlaceFields
      opportunities {
        ...OpportunityFields
        place {
          ...PlaceFields
        }
        createdByUser {
          ...UserFields
          articlesAboutMe {
            ...ArticleFields
          }
        }
        articles {
          ...ArticleFields
          relatedUsers {
            ...UserFields
          }
        }
      }
    }
  }
  ${PlaceFieldsFragmentDoc}
  ${OpportunityFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
  ${ArticleFieldsFragmentDoc}
`;

/**
 * __useGetPlaceQuery__
 *
 * To run a query within a React component, call `useGetPlaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaceQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetPlaceQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetPlaceQuery, GqlGetPlaceQueryVariables> &
    ({ variables: GqlGetPlaceQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetPlaceQuery, GqlGetPlaceQueryVariables>(GetPlaceDocument, options);
}
export function useGetPlaceLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetPlaceQuery, GqlGetPlaceQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetPlaceQuery, GqlGetPlaceQueryVariables>(
    GetPlaceDocument,
    options,
  );
}
export function useGetPlaceSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetPlaceQuery, GqlGetPlaceQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetPlaceQuery, GqlGetPlaceQueryVariables>(
    GetPlaceDocument,
    options,
  );
}
export type GetPlaceQueryHookResult = ReturnType<typeof useGetPlaceQuery>;
export type GetPlaceLazyQueryHookResult = ReturnType<typeof useGetPlaceLazyQuery>;
export type GetPlaceSuspenseQueryHookResult = ReturnType<typeof useGetPlaceSuspenseQuery>;
export type GetPlaceQueryResult = Apollo.QueryResult<GqlGetPlaceQuery, GqlGetPlaceQueryVariables>;
export const TicketIssueDocument = gql`
  mutation ticketIssue($input: TicketIssueInput!, $permission: CheckCommunityPermissionInput!) {
    ticketIssue(input: $input, permission: $permission) {
      ... on TicketIssueSuccess {
        issue {
          id
          qtyToBeIssued
          claimLink {
            ...TicketClaimLinkFields
          }
          utility {
            ...UtilityFields
          }
        }
      }
    }
  }
  ${TicketClaimLinkFieldsFragmentDoc}
  ${UtilityFieldsFragmentDoc}
`;
export type GqlTicketIssueMutationFn = Apollo.MutationFunction<
  GqlTicketIssueMutation,
  GqlTicketIssueMutationVariables
>;

/**
 * __useTicketIssueMutation__
 *
 * To run a mutation, you first call `useTicketIssueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTicketIssueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [ticketIssueMutation, { data, loading, error }] = useTicketIssueMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useTicketIssueMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlTicketIssueMutation, GqlTicketIssueMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlTicketIssueMutation, GqlTicketIssueMutationVariables>(
    TicketIssueDocument,
    options,
  );
}
export type TicketIssueMutationHookResult = ReturnType<typeof useTicketIssueMutation>;
export type TicketIssueMutationResult = Apollo.MutationResult<GqlTicketIssueMutation>;
export type TicketIssueMutationOptions = Apollo.BaseMutationOptions<
  GqlTicketIssueMutation,
  GqlTicketIssueMutationVariables
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
  query GetTickets(
    $filter: TicketFilterInput
    $sort: TicketSortInput
    $cursor: String
    $first: Int
  ) {
    tickets(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
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
          ...TicketFields
          claimLink {
            ...TicketClaimLinkFields
            issuer {
              id
              qtyToBeIssued
              owner {
                ...UserFields
              }
            }
          }
        }
      }
    }
  }
  ${TicketFieldsFragmentDoc}
  ${TicketClaimLinkFieldsFragmentDoc}
  ${UserFieldsFragmentDoc}
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
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
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
      createdAt
      claimedAt
      issuer {
        owner {
          id
          name
          image
        }
        utility {
          name
          description
        }
        qtyToBeIssued
      }
      tickets {
        wallet {
          user {
            id
            name
          }
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
export const TicketClaimLinksDocument = gql`
  query TicketClaimLinks(
    $filter: TicketClaimLinkFilterInput
    $sort: TicketClaimLinkSortInput
    $cursor: String
    $first: Int
  ) {
    ticketClaimLinks(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
      edges {
        node {
          id
          status
          qty
          claimedAt
          createdAt
          issuer {
            id
            owner {
              id
              name
              image
            }
          }
          tickets {
            status
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

/**
 * __useTicketClaimLinksQuery__
 *
 * To run a query within a React component, call `useTicketClaimLinksQuery` and pass it any options that fit your needs.
 * When your component renders, `useTicketClaimLinksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTicketClaimLinksQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useTicketClaimLinksQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlTicketClaimLinksQuery,
    GqlTicketClaimLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlTicketClaimLinksQuery, GqlTicketClaimLinksQueryVariables>(
    TicketClaimLinksDocument,
    options,
  );
}
export function useTicketClaimLinksLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlTicketClaimLinksQuery,
    GqlTicketClaimLinksQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlTicketClaimLinksQuery, GqlTicketClaimLinksQueryVariables>(
    TicketClaimLinksDocument,
    options,
  );
}
export function useTicketClaimLinksSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlTicketClaimLinksQuery, GqlTicketClaimLinksQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlTicketClaimLinksQuery, GqlTicketClaimLinksQueryVariables>(
    TicketClaimLinksDocument,
    options,
  );
}
export type TicketClaimLinksQueryHookResult = ReturnType<typeof useTicketClaimLinksQuery>;
export type TicketClaimLinksLazyQueryHookResult = ReturnType<typeof useTicketClaimLinksLazyQuery>;
export type TicketClaimLinksSuspenseQueryHookResult = ReturnType<
  typeof useTicketClaimLinksSuspenseQuery
>;
export type TicketClaimLinksQueryResult = Apollo.QueryResult<
  GqlTicketClaimLinksQuery,
  GqlTicketClaimLinksQueryVariables
>;
export const GetTicketIssuersDocument = gql`
  query GetTicketIssuers(
    $filter: TicketIssuerFilterInput
    $sort: TicketIssuerSortInput
    $cursor: String
    $first: Int
  ) {
    ticketIssuers(filter: $filter, sort: $sort, cursor: $cursor, first: $first) {
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
          qtyToBeIssued
          createdAt
          utility {
            id
            name
          }
          claimLink {
            ...TicketClaimLinkFields
          }
          owner {
            id
            name
            image
          }
        }
      }
    }
  }
  ${TicketClaimLinkFieldsFragmentDoc}
`;

/**
 * __useGetTicketIssuersQuery__
 *
 * To run a query within a React component, call `useGetTicketIssuersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTicketIssuersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTicketIssuersQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetTicketIssuersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GqlGetTicketIssuersQuery,
    GqlGetTicketIssuersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetTicketIssuersQuery, GqlGetTicketIssuersQueryVariables>(
    GetTicketIssuersDocument,
    options,
  );
}
export function useGetTicketIssuersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetTicketIssuersQuery,
    GqlGetTicketIssuersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetTicketIssuersQuery, GqlGetTicketIssuersQueryVariables>(
    GetTicketIssuersDocument,
    options,
  );
}
export function useGetTicketIssuersSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetTicketIssuersQuery, GqlGetTicketIssuersQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetTicketIssuersQuery, GqlGetTicketIssuersQueryVariables>(
    GetTicketIssuersDocument,
    options,
  );
}
export type GetTicketIssuersQueryHookResult = ReturnType<typeof useGetTicketIssuersQuery>;
export type GetTicketIssuersLazyQueryHookResult = ReturnType<typeof useGetTicketIssuersLazyQuery>;
export type GetTicketIssuersSuspenseQueryHookResult = ReturnType<
  typeof useGetTicketIssuersSuspenseQuery
>;
export type GetTicketIssuersQueryResult = Apollo.QueryResult<
  GqlGetTicketIssuersQuery,
  GqlGetTicketIssuersQueryVariables
>;
export const CreateUtilityDocument = gql`
  mutation CreateUtility($input: UtilityCreateInput!, $permission: CheckCommunityPermissionInput!) {
    utilityCreate(input: $input, permission: $permission) {
      ... on UtilityCreateSuccess {
        utility {
          ...UtilityFields
        }
      }
    }
  }
  ${UtilityFieldsFragmentDoc}
`;
export type GqlCreateUtilityMutationFn = Apollo.MutationFunction<
  GqlCreateUtilityMutation,
  GqlCreateUtilityMutationVariables
>;

/**
 * __useCreateUtilityMutation__
 *
 * To run a mutation, you first call `useCreateUtilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUtilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUtilityMutation, { data, loading, error }] = useCreateUtilityMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useCreateUtilityMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlCreateUtilityMutation,
    GqlCreateUtilityMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlCreateUtilityMutation, GqlCreateUtilityMutationVariables>(
    CreateUtilityDocument,
    options,
  );
}
export type CreateUtilityMutationHookResult = ReturnType<typeof useCreateUtilityMutation>;
export type CreateUtilityMutationResult = Apollo.MutationResult<GqlCreateUtilityMutation>;
export type CreateUtilityMutationOptions = Apollo.BaseMutationOptions<
  GqlCreateUtilityMutation,
  GqlCreateUtilityMutationVariables
>;
export const GetUtilitiesDocument = gql`
  query GetUtilities($filter: UtilityFilterInput, $sort: UtilitySortInput, $first: Int) {
    utilities(filter: $filter, sort: $sort, first: $first) {
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
          name
          description
          pointsRequired
          requiredForOpportunities {
            id
            title
            description
            images
            place {
              id
              name
              address
              latitude
              longitude
            }
            feeRequired
            category
            publishStatus
            requireApproval
          }
        }
      }
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
 *      filter: // value for 'filter'
 *      sort: // value for 'sort'
 *      first: // value for 'first'
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
export const PointIssueDocument = gql`
  mutation pointIssue(
    $input: TransactionIssueCommunityPointInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    transactionIssueCommunityPoint(input: $input, permission: $permission) {
      ... on TransactionIssueCommunityPointSuccess {
        transaction {
          ...TransactionFields
        }
      }
    }
  }
  ${TransactionFieldsFragmentDoc}
`;
export type GqlPointIssueMutationFn = Apollo.MutationFunction<
  GqlPointIssueMutation,
  GqlPointIssueMutationVariables
>;

/**
 * __usePointIssueMutation__
 *
 * To run a mutation, you first call `usePointIssueMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePointIssueMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pointIssueMutation, { data, loading, error }] = usePointIssueMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function usePointIssueMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlPointIssueMutation, GqlPointIssueMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlPointIssueMutation, GqlPointIssueMutationVariables>(
    PointIssueDocument,
    options,
  );
}
export type PointIssueMutationHookResult = ReturnType<typeof usePointIssueMutation>;
export type PointIssueMutationResult = Apollo.MutationResult<GqlPointIssueMutation>;
export type PointIssueMutationOptions = Apollo.BaseMutationOptions<
  GqlPointIssueMutation,
  GqlPointIssueMutationVariables
>;
export const PointGrantDocument = gql`
  mutation pointGrant(
    $input: TransactionGrantCommunityPointInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    transactionGrantCommunityPoint(input: $input, permission: $permission) {
      ... on TransactionGrantCommunityPointSuccess {
        transaction {
          ...TransactionFields
        }
      }
    }
  }
  ${TransactionFieldsFragmentDoc}
`;
export type GqlPointGrantMutationFn = Apollo.MutationFunction<
  GqlPointGrantMutation,
  GqlPointGrantMutationVariables
>;

/**
 * __usePointGrantMutation__
 *
 * To run a mutation, you first call `usePointGrantMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePointGrantMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pointGrantMutation, { data, loading, error }] = usePointGrantMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function usePointGrantMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlPointGrantMutation, GqlPointGrantMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlPointGrantMutation, GqlPointGrantMutationVariables>(
    PointGrantDocument,
    options,
  );
}
export type PointGrantMutationHookResult = ReturnType<typeof usePointGrantMutation>;
export type PointGrantMutationResult = Apollo.MutationResult<GqlPointGrantMutation>;
export type PointGrantMutationOptions = Apollo.BaseMutationOptions<
  GqlPointGrantMutation,
  GqlPointGrantMutationVariables
>;
export const PointDonateDocument = gql`
  mutation pointDonate(
    $input: TransactionDonateSelfPointInput!
    $permission: CheckIsSelfPermissionInput!
  ) {
    transactionDonateSelfPoint(input: $input, permission: $permission) {
      ... on TransactionDonateSelfPointSuccess {
        transaction {
          ...TransactionFields
        }
      }
    }
  }
  ${TransactionFieldsFragmentDoc}
`;
export type GqlPointDonateMutationFn = Apollo.MutationFunction<
  GqlPointDonateMutation,
  GqlPointDonateMutationVariables
>;

/**
 * __usePointDonateMutation__
 *
 * To run a mutation, you first call `usePointDonateMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePointDonateMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [pointDonateMutation, { data, loading, error }] = usePointDonateMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function usePointDonateMutation(
  baseOptions?: Apollo.MutationHookOptions<GqlPointDonateMutation, GqlPointDonateMutationVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlPointDonateMutation, GqlPointDonateMutationVariables>(
    PointDonateDocument,
    options,
  );
}
export type PointDonateMutationHookResult = ReturnType<typeof usePointDonateMutation>;
export type PointDonateMutationResult = Apollo.MutationResult<GqlPointDonateMutation>;
export type PointDonateMutationOptions = Apollo.BaseMutationOptions<
  GqlPointDonateMutation,
  GqlPointDonateMutationVariables
>;
export const TransactionUpdateMetadataDocument = gql`
  mutation TransactionUpdateMetadata(
    $id: ID!
    $input: TransactionUpdateMetadataInput!
    $permission: CheckIsSelfPermissionInput
    $communityPermission: CheckCommunityPermissionInput
  ) {
    transactionUpdateMetadata(
      id: $id
      input: $input
      permission: $permission
      communityPermission: $communityPermission
    ) {
      ... on TransactionUpdateMetadataSuccess {
        transaction {
          id
          comment
          images
        }
      }
    }
  }
`;
export type GqlTransactionUpdateMetadataMutationFn = Apollo.MutationFunction<
  GqlTransactionUpdateMetadataMutation,
  GqlTransactionUpdateMetadataMutationVariables
>;

/**
 * __useTransactionUpdateMetadataMutation__
 *
 * To run a mutation, you first call `useTransactionUpdateMetadataMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTransactionUpdateMetadataMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [transactionUpdateMetadataMutation, { data, loading, error }] = useTransactionUpdateMetadataMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *      communityPermission: // value for 'communityPermission'
 *   },
 * });
 */
export function useTransactionUpdateMetadataMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlTransactionUpdateMetadataMutation,
    GqlTransactionUpdateMetadataMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    GqlTransactionUpdateMetadataMutation,
    GqlTransactionUpdateMetadataMutationVariables
  >(TransactionUpdateMetadataDocument, options);
}
export type TransactionUpdateMetadataMutationHookResult = ReturnType<
  typeof useTransactionUpdateMetadataMutation
>;
export type TransactionUpdateMetadataMutationResult =
  Apollo.MutationResult<GqlTransactionUpdateMetadataMutation>;
export type TransactionUpdateMetadataMutationOptions = Apollo.BaseMutationOptions<
  GqlTransactionUpdateMetadataMutation,
  GqlTransactionUpdateMetadataMutationVariables
>;
export const GetTransactionsDocument = gql`
  query getTransactions(
    $filter: TransactionFilterInput
    $sort: TransactionSortInput
    $first: Int
    $cursor: String
    $withDidIssuanceRequests: Boolean = false
  ) {
    transactions(filter: $filter, sort: $sort, first: $first, cursor: $cursor) {
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
            id
            type
            user {
              id
              name
              image
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                status
                didValue
              }
            }
            community {
              id
              name
              image
            }
          }
          toWallet {
            id
            type
            user {
              id
              name
              image
              didIssuanceRequests @include(if: $withDidIssuanceRequests) {
                status
                didValue
              }
            }
            community {
              id
              name
              image
            }
          }
        }
      }
    }
  }
  ${TransactionFieldsFragmentDoc}
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
 *      sort: // value for 'sort'
 *      first: // value for 'first'
 *      cursor: // value for 'cursor'
 *      withDidIssuanceRequests: // value for 'withDidIssuanceRequests'
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
export const GetTransactionDetailDocument = gql`
  query GetTransactionDetail($id: ID!) {
    transaction(id: $id) {
      ...TransactionFields
      chain {
        depth
        steps {
          id
          points
          reason
          createdAt
          from {
            __typename
            id
            name
            image
            bio
          }
          to {
            __typename
            id
            name
            image
            bio
          }
        }
      }
      fromWallet {
        id
        type
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
      }
      toWallet {
        id
        type
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
      }
    }
  }
  ${TransactionFieldsFragmentDoc}
`;

/**
 * __useGetTransactionDetailQuery__
 *
 * To run a query within a React component, call `useGetTransactionDetailQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionDetailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionDetailQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTransactionDetailQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlGetTransactionDetailQuery,
    GqlGetTransactionDetailQueryVariables
  > &
    ({ variables: GqlGetTransactionDetailQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetTransactionDetailQuery, GqlGetTransactionDetailQueryVariables>(
    GetTransactionDetailDocument,
    options,
  );
}
export function useGetTransactionDetailLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlGetTransactionDetailQuery,
    GqlGetTransactionDetailQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetTransactionDetailQuery, GqlGetTransactionDetailQueryVariables>(
    GetTransactionDetailDocument,
    options,
  );
}
export function useGetTransactionDetailSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlGetTransactionDetailQuery,
        GqlGetTransactionDetailQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GqlGetTransactionDetailQuery,
    GqlGetTransactionDetailQueryVariables
  >(GetTransactionDetailDocument, options);
}
export type GetTransactionDetailQueryHookResult = ReturnType<typeof useGetTransactionDetailQuery>;
export type GetTransactionDetailLazyQueryHookResult = ReturnType<
  typeof useGetTransactionDetailLazyQuery
>;
export type GetTransactionDetailSuspenseQueryHookResult = ReturnType<
  typeof useGetTransactionDetailSuspenseQuery
>;
export type GetTransactionDetailQueryResult = Apollo.QueryResult<
  GqlGetTransactionDetailQuery,
  GqlGetTransactionDetailQueryVariables
>;
export const VerifyTransactionsDocument = gql`
  query VerifyTransactions($txIds: [ID!]!) {
    verifyTransactions(txIds: $txIds) {
      txId
      status
      transactionHash
      rootHash
      label
    }
  }
`;

/**
 * __useVerifyTransactionsQuery__
 *
 * To run a query within a React component, call `useVerifyTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVerifyTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVerifyTransactionsQuery({
 *   variables: {
 *      txIds: // value for 'txIds'
 *   },
 * });
 */
export function useVerifyTransactionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GqlVerifyTransactionsQuery,
    GqlVerifyTransactionsQueryVariables
  > &
    ({ variables: GqlVerifyTransactionsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlVerifyTransactionsQuery, GqlVerifyTransactionsQueryVariables>(
    VerifyTransactionsDocument,
    options,
  );
}
export function useVerifyTransactionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GqlVerifyTransactionsQuery,
    GqlVerifyTransactionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlVerifyTransactionsQuery, GqlVerifyTransactionsQueryVariables>(
    VerifyTransactionsDocument,
    options,
  );
}
export function useVerifyTransactionsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GqlVerifyTransactionsQuery,
        GqlVerifyTransactionsQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlVerifyTransactionsQuery, GqlVerifyTransactionsQueryVariables>(
    VerifyTransactionsDocument,
    options,
  );
}
export type VerifyTransactionsQueryHookResult = ReturnType<typeof useVerifyTransactionsQuery>;
export type VerifyTransactionsLazyQueryHookResult = ReturnType<
  typeof useVerifyTransactionsLazyQuery
>;
export type VerifyTransactionsSuspenseQueryHookResult = ReturnType<
  typeof useVerifyTransactionsSuspenseQuery
>;
export type VerifyTransactionsQueryResult = Apollo.QueryResult<
  GqlVerifyTransactionsQuery,
  GqlVerifyTransactionsQueryVariables
>;
export const CreateVoteTopicDocument = gql`
  mutation CreateVoteTopic(
    $input: VoteTopicCreateInput!
    $permission: CheckCommunityPermissionInput!
  ) {
    voteTopicCreate(input: $input, permission: $permission) {
      ... on VoteTopicCreateSuccess {
        voteTopic {
          ...VoteTopicFields
        }
      }
    }
  }
  ${VoteTopicFieldsFragmentDoc}
`;
export type GqlCreateVoteTopicMutationFn = Apollo.MutationFunction<
  GqlCreateVoteTopicMutation,
  GqlCreateVoteTopicMutationVariables
>;

/**
 * __useCreateVoteTopicMutation__
 *
 * To run a mutation, you first call `useCreateVoteTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateVoteTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createVoteTopicMutation, { data, loading, error }] = useCreateVoteTopicMutation({
 *   variables: {
 *      input: // value for 'input'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useCreateVoteTopicMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlCreateVoteTopicMutation,
    GqlCreateVoteTopicMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlCreateVoteTopicMutation, GqlCreateVoteTopicMutationVariables>(
    CreateVoteTopicDocument,
    options,
  );
}
export type CreateVoteTopicMutationHookResult = ReturnType<typeof useCreateVoteTopicMutation>;
export type CreateVoteTopicMutationResult = Apollo.MutationResult<GqlCreateVoteTopicMutation>;
export type CreateVoteTopicMutationOptions = Apollo.BaseMutationOptions<
  GqlCreateVoteTopicMutation,
  GqlCreateVoteTopicMutationVariables
>;
export const DeleteVoteTopicDocument = gql`
  mutation DeleteVoteTopic($id: ID!, $permission: CheckCommunityPermissionInput!) {
    voteTopicDelete(id: $id, permission: $permission) {
      ... on VoteTopicDeleteSuccess {
        voteTopicId
      }
    }
  }
`;
export type GqlDeleteVoteTopicMutationFn = Apollo.MutationFunction<
  GqlDeleteVoteTopicMutation,
  GqlDeleteVoteTopicMutationVariables
>;

/**
 * __useDeleteVoteTopicMutation__
 *
 * To run a mutation, you first call `useDeleteVoteTopicMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVoteTopicMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVoteTopicMutation, { data, loading, error }] = useDeleteVoteTopicMutation({
 *   variables: {
 *      id: // value for 'id'
 *      permission: // value for 'permission'
 *   },
 * });
 */
export function useDeleteVoteTopicMutation(
  baseOptions?: Apollo.MutationHookOptions<
    GqlDeleteVoteTopicMutation,
    GqlDeleteVoteTopicMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<GqlDeleteVoteTopicMutation, GqlDeleteVoteTopicMutationVariables>(
    DeleteVoteTopicDocument,
    options,
  );
}
export type DeleteVoteTopicMutationHookResult = ReturnType<typeof useDeleteVoteTopicMutation>;
export type DeleteVoteTopicMutationResult = Apollo.MutationResult<GqlDeleteVoteTopicMutation>;
export type DeleteVoteTopicMutationOptions = Apollo.BaseMutationOptions<
  GqlDeleteVoteTopicMutation,
  GqlDeleteVoteTopicMutationVariables
>;
export const GetVoteTopicsDocument = gql`
  query GetVoteTopics($communityId: ID!, $cursor: String, $first: Int) {
    voteTopics(communityId: $communityId, cursor: $cursor, first: $first) {
      edges {
        cursor
        node {
          ...VoteTopicListItemFields
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${VoteTopicListItemFieldsFragmentDoc}
`;

/**
 * __useGetVoteTopicsQuery__
 *
 * To run a query within a React component, call `useGetVoteTopicsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVoteTopicsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVoteTopicsQuery({
 *   variables: {
 *      communityId: // value for 'communityId'
 *      cursor: // value for 'cursor'
 *      first: // value for 'first'
 *   },
 * });
 */
export function useGetVoteTopicsQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetVoteTopicsQuery, GqlGetVoteTopicsQueryVariables> &
    ({ variables: GqlGetVoteTopicsQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetVoteTopicsQuery, GqlGetVoteTopicsQueryVariables>(
    GetVoteTopicsDocument,
    options,
  );
}
export function useGetVoteTopicsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetVoteTopicsQuery, GqlGetVoteTopicsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetVoteTopicsQuery, GqlGetVoteTopicsQueryVariables>(
    GetVoteTopicsDocument,
    options,
  );
}
export function useGetVoteTopicsSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetVoteTopicsQuery, GqlGetVoteTopicsQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetVoteTopicsQuery, GqlGetVoteTopicsQueryVariables>(
    GetVoteTopicsDocument,
    options,
  );
}
export type GetVoteTopicsQueryHookResult = ReturnType<typeof useGetVoteTopicsQuery>;
export type GetVoteTopicsLazyQueryHookResult = ReturnType<typeof useGetVoteTopicsLazyQuery>;
export type GetVoteTopicsSuspenseQueryHookResult = ReturnType<typeof useGetVoteTopicsSuspenseQuery>;
export type GetVoteTopicsQueryResult = Apollo.QueryResult<
  GqlGetVoteTopicsQuery,
  GqlGetVoteTopicsQueryVariables
>;
export const GetVoteTopicDocument = gql`
  query GetVoteTopic($id: ID!) {
    voteTopic(id: $id) {
      ...VoteTopicFields
    }
  }
  ${VoteTopicFieldsFragmentDoc}
`;

/**
 * __useGetVoteTopicQuery__
 *
 * To run a query within a React component, call `useGetVoteTopicQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetVoteTopicQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetVoteTopicQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetVoteTopicQuery(
  baseOptions: Apollo.QueryHookOptions<GqlGetVoteTopicQuery, GqlGetVoteTopicQueryVariables> &
    ({ variables: GqlGetVoteTopicQueryVariables; skip?: boolean } | { skip: boolean }),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GqlGetVoteTopicQuery, GqlGetVoteTopicQueryVariables>(
    GetVoteTopicDocument,
    options,
  );
}
export function useGetVoteTopicLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<GqlGetVoteTopicQuery, GqlGetVoteTopicQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GqlGetVoteTopicQuery, GqlGetVoteTopicQueryVariables>(
    GetVoteTopicDocument,
    options,
  );
}
export function useGetVoteTopicSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<GqlGetVoteTopicQuery, GqlGetVoteTopicQueryVariables>,
) {
  const options =
    baseOptions === Apollo.skipToken ? baseOptions : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<GqlGetVoteTopicQuery, GqlGetVoteTopicQueryVariables>(
    GetVoteTopicDocument,
    options,
  );
}
export type GetVoteTopicQueryHookResult = ReturnType<typeof useGetVoteTopicQuery>;
export type GetVoteTopicLazyQueryHookResult = ReturnType<typeof useGetVoteTopicLazyQuery>;
export type GetVoteTopicSuspenseQueryHookResult = ReturnType<typeof useGetVoteTopicSuspenseQuery>;
export type GetVoteTopicQueryResult = Apollo.QueryResult<
  GqlGetVoteTopicQuery,
  GqlGetVoteTopicQueryVariables
>;
