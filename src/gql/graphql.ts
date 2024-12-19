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

export type Activities = {
  __typename?: "Activities";
  data: Array<Activity>;
  total: Scalars["Int"]["output"];
};

export type ActivitiesConnection = {
  __typename?: "ActivitiesConnection";
  edges?: Maybe<Array<Maybe<ActivityEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Activity = {
  __typename?: "Activity";
  application?: Maybe<Application>;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  endsAt: Scalars["Datetime"]["output"];
  event?: Maybe<Event>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  isPublic: Scalars["Boolean"]["output"];
  issue?: Maybe<Issue>;
  organization?: Maybe<Organization>;
  remark?: Maybe<Scalars["String"]["output"]>;
  startsAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type ActivityAddEventInput = {
  eventId: Scalars["String"]["input"];
};

export type ActivityAddUserInput = {
  userId: Scalars["String"]["input"];
};

export type ActivityCreateInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt: Scalars["Datetime"]["input"];
  eventId: Scalars["String"]["input"];
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  remark?: InputMaybe<Scalars["String"]["input"]>;
  startsAt: Scalars["Datetime"]["input"];
  userId: Scalars["String"]["input"];
};

export type ActivityCreatePayload =
  | ActivityCreateSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ActivityCreateSuccess = {
  __typename?: "ActivityCreateSuccess";
  activity?: Maybe<Activity>;
};

export type ActivityDeletePayload =
  | ActivityDeleteSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ActivityDeleteSuccess = {
  __typename?: "ActivityDeleteSuccess";
  activityId: Scalars["ID"]["output"];
};

export type ActivityEdge = Edge & {
  __typename?: "ActivityEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Activity>;
};

export type ActivityFilterInput = {
  eventId?: InputMaybe<Scalars["String"]["input"]>;
  isPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  userId?: InputMaybe<Scalars["String"]["input"]>;
};

export type ActivityRemoveEventInput = {
  eventId: Scalars["String"]["input"];
};

export type ActivityRemoveUserInput = {
  userId: Scalars["String"]["input"];
};

export type ActivitySortInput = {
  createdAt?: InputMaybe<SortDirection>;
  startsAt?: InputMaybe<SortDirection>;
};

export type ActivitySwitchPrivacyInput = {
  isPublic: Scalars["Boolean"]["input"];
};

export type ActivitySwitchPrivacyPayload =
  | ActivitySwitchPrivacySuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ActivitySwitchPrivacySuccess = {
  __typename?: "ActivitySwitchPrivacySuccess";
  activity: Activity;
};

export type ActivityUpdateContentInput = {
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt: Scalars["Datetime"]["input"];
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  remark?: InputMaybe<Scalars["String"]["input"]>;
  startsAt: Scalars["Datetime"]["input"];
};

export type ActivityUpdateContentPayload =
  | ActivityUpdateContentSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ActivityUpdateContentSuccess = {
  __typename?: "ActivityUpdateContentSuccess";
  activity: Activity;
};

export type ActivityUpdateEventPayload =
  | ActivityUpdateEventSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ActivityUpdateEventSuccess = {
  __typename?: "ActivityUpdateEventSuccess";
  activity: Activity;
  event: Event;
};

export type ActivityUpdateUserPayload =
  | ActivityUpdateUserSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ActivityUpdateUserSuccess = {
  __typename?: "ActivityUpdateUserSuccess";
  activity: Activity;
  user: User;
};

export type Agenda = {
  __typename?: "Agenda";
  code: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

export type Application = {
  __typename?: "Application";
  activity?: Maybe<Activity>;
  approvals?: Maybe<Array<ApplicationConfirmation>>;
  comment?: Maybe<Scalars["String"]["output"]>;
  createdAt: Scalars["Datetime"]["output"];
  event?: Maybe<Event>;
  id: Scalars["ID"]["output"];
  isPublic: Scalars["Boolean"]["output"];
  submittedAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type ApplicationAddConfirmationInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  confirmerId: Scalars["String"]["input"];
  isApproved: Scalars["Boolean"]["input"];
};

export type ApplicationAddConfirmationPayload =
  | ApplicationAddConfirmationSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationAddConfirmationSuccess = {
  __typename?: "ApplicationAddConfirmationSuccess";
  application: Application;
};

export type ApplicationApprovalInput = {
  applicationConfirmationId: Scalars["String"]["input"];
};

export type ApplicationConfirmation = {
  __typename?: "ApplicationConfirmation";
  application?: Maybe<Application>;
  comment?: Maybe<Scalars["String"]["output"]>;
  confirmedBy?: Maybe<User>;
  createdAt: Scalars["Datetime"]["output"];
  id: Scalars["ID"]["output"];
  isApproved: Scalars["Boolean"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type ApplicationCreateInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
  eventId?: InputMaybe<Scalars["String"]["input"]>;
  submittedAt: Scalars["Datetime"]["input"];
  userId: Scalars["String"]["input"];
};

export type ApplicationCreatePayload =
  | ApplicationCreateSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationCreateSuccess = {
  __typename?: "ApplicationCreateSuccess";
  application: Application;
};

export type ApplicationDeleteConfirmationInput = {
  applicationConfirmationId: Scalars["String"]["input"];
};

export type ApplicationDeleteConfirmationPayload =
  | ApplicationDeleteConfirmationSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationDeleteConfirmationSuccess = {
  __typename?: "ApplicationDeleteConfirmationSuccess";
  applicationConfirmationId: Scalars["String"]["output"];
  applicationId: Scalars["ID"]["output"];
};

export type ApplicationDeletePayload =
  | ApplicationDeleteSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationDeleteSuccess = {
  __typename?: "ApplicationDeleteSuccess";
  applicationId: Scalars["ID"]["output"];
};

export type ApplicationEdge = Edge & {
  __typename?: "ApplicationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Application>;
};

export type ApplicationFilterInput = {
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type ApplicationRefusalInput = {
  applicationConfirmationId: Scalars["String"]["input"];
};

export type ApplicationSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type ApplicationSwitchIsApprovedPayload =
  | ApplicationSwitchIsApprovedSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationSwitchIsApprovedSuccess = {
  __typename?: "ApplicationSwitchIsApprovedSuccess";
  application: Application;
};

export type ApplicationSwitchPrivacyPayload =
  | ApplicationSwitchPrivacySuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationSwitchPrivacySuccess = {
  __typename?: "ApplicationSwitchPrivacySuccess";
  application: Application;
};

export type ApplicationUpdateCommentInput = {
  comment?: InputMaybe<Scalars["String"]["input"]>;
};

export type ApplicationUpdateCommentPayload =
  | ApplicationUpdateCommentSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationUpdateCommentSuccess = {
  __typename?: "ApplicationUpdateCommentSuccess";
  application: Application;
};

export type ApplicationUpdateConfirmationCommentInput = {
  applicationConfirmationId: Scalars["String"]["input"];
  comment?: InputMaybe<Scalars["String"]["input"]>;
};

export type ApplicationUpdateConfirmationCommentPayload =
  | ApplicationUpdateConfirmationCommentSuccess
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError;

export type ApplicationUpdateConfirmationCommentSuccess = {
  __typename?: "ApplicationUpdateConfirmationCommentSuccess";
  application: Application;
};

export type ApplicationsConnection = {
  __typename?: "ApplicationsConnection";
  edges?: Maybe<Array<Maybe<ApplicationEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
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

export type Comment = {
  __typename?: "Comment";
  content: Scalars["String"]["output"];
  createdAt: Scalars["Datetime"]["output"];
  event?: Maybe<Event>;
  id: Scalars["ID"]["output"];
  postedAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type CommentAddEventInput = {
  content: Scalars["String"]["input"];
  eventId: Scalars["String"]["input"];
  postedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  userId: Scalars["String"]["input"];
};

export type CommentAddEventPayload =
  | AuthError
  | CommentAddEventSuccess
  | ComplexQueryError
  | InvalidInputValueError;

export type CommentAddEventSuccess = {
  __typename?: "CommentAddEventSuccess";
  comment: Comment;
};

export type CommentDeletePayload =
  | AuthError
  | CommentDeleteSuccess
  | ComplexQueryError
  | InvalidInputValueError;

export type CommentDeleteSuccess = {
  __typename?: "CommentDeleteSuccess";
  commentId: Scalars["String"]["output"];
};

export type CommentUpdateContentInput = {
  content?: InputMaybe<Scalars["String"]["input"]>;
};

export type CommentUpdateContentPayload =
  | AuthError
  | CommentUpdateContentSuccess
  | ComplexQueryError
  | InvalidInputValueError;

export type CommentUpdateContentSuccess = {
  __typename?: "CommentUpdateContentSuccess";
  comment: Comment;
};

export type Comments = {
  __typename?: "Comments";
  data: Array<Comment>;
  total: Scalars["Int"]["output"];
};

export type CommonError = AuthError | ComplexQueryError | InvalidInputValueError;

export type ComplexQueryError = Error & {
  __typename?: "ComplexQueryError";
  message: Scalars["String"]["output"];
  statusCode: Scalars["Int"]["output"];
};

export type CreateUserInput = {
  agendaIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  groupIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  image?: InputMaybe<ImageInput>;
  isPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
  lastName: Scalars["String"]["input"];
  middleName?: InputMaybe<Scalars["String"]["input"]>;
  organizationIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  skillsetIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type CurrentUserPayload = {
  __typename?: "CurrentUserPayload";
  user?: Maybe<User>;
};

export type Edge = {
  cursor: Scalars["String"]["output"];
};

export enum EntityPosition {
  Prefix = "PREFIX",
  Suffix = "SUFFIX",
}

export type Error = {
  message: Scalars["String"]["output"];
  statusCode: Scalars["Int"]["output"];
};

export type Event = {
  __typename?: "Event";
  activities?: Maybe<Activities>;
  agendas?: Maybe<Array<Agenda>>;
  cities?: Maybe<Array<City>>;
  comments?: Maybe<Comments>;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  endsAt: Scalars["Datetime"]["output"];
  groups?: Maybe<Array<Group>>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  isPublic: Scalars["Boolean"]["output"];
  likes?: Maybe<Likes>;
  organizations?: Maybe<Array<Organization>>;
  plannedEndsAt?: Maybe<Scalars["Datetime"]["output"]>;
  plannedStartsAt?: Maybe<Scalars["Datetime"]["output"]>;
  skillsets?: Maybe<Array<Skillset>>;
  startsAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type EventAddGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type EventAddOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type EventDeletePayload =
  | AuthError
  | ComplexQueryError
  | EventDeleteSuccess
  | InvalidInputValueError;

export type EventDeleteSuccess = {
  __typename?: "EventDeleteSuccess";
  eventId: Scalars["ID"]["output"];
};

export type EventEdge = Edge & {
  __typename?: "EventEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Event>;
};

export type EventFilterInput = {
  agendaId?: InputMaybe<Scalars["Int"]["input"]>;
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type EventPlanInput = {
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt: Scalars["Datetime"]["input"];
  groupIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
  organizationIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  plannedEndsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  plannedStartsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  skillsets?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  startsAt: Scalars["Datetime"]["input"];
};

export type EventPlanPayload =
  | AuthError
  | ComplexQueryError
  | EventPlanSuccess
  | InvalidInputValueError;

export type EventPlanSuccess = {
  __typename?: "EventPlanSuccess";
  event?: Maybe<Event>;
};

export type EventRemoveGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type EventRemoveOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type EventSortInput = {
  startsAt?: InputMaybe<SortDirection>;
};

export type EventUpdateContentInput = {
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  endsAt: Scalars["Datetime"]["input"];
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  isPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
  plannedEndsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  plannedStartsAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  skillsets?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  startsAt: Scalars["Datetime"]["input"];
};

export type EventUpdateContentPayload =
  | AuthError
  | ComplexQueryError
  | EventUpdateContentSuccess
  | InvalidInputValueError;

export type EventUpdateContentSuccess = {
  __typename?: "EventUpdateContentSuccess";
  event: Event;
};

export type EventUpdateGroupPayload =
  | AuthError
  | ComplexQueryError
  | EventUpdateGroupSuccess
  | InvalidInputValueError;

export type EventUpdateGroupSuccess = {
  __typename?: "EventUpdateGroupSuccess";
  event: Event;
  group: Group;
};

export type EventUpdateOrganizationPayload =
  | AuthError
  | ComplexQueryError
  | EventUpdateOrganizationSuccess
  | InvalidInputValueError;

export type EventUpdateOrganizationSuccess = {
  __typename?: "EventUpdateOrganizationSuccess";
  event: Event;
  organization: Organization;
};

export type EventUpdatePrivacyPayload =
  | AuthError
  | ComplexQueryError
  | EventUpdatePrivacySuccess
  | InvalidInputValueError;

export type EventUpdatePrivacySuccess = {
  __typename?: "EventUpdatePrivacySuccess";
  event: Event;
};

export type EventsConnection = {
  __typename?: "EventsConnection";
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Field = {
  __typename?: "Field";
  message?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
};

export type Group = {
  __typename?: "Group";
  agendas?: Maybe<Array<Agenda>>;
  bio?: Maybe<Scalars["String"]["output"]>;
  children?: Maybe<Array<Group>>;
  cities?: Maybe<Array<City>>;
  createdAt: Scalars["Datetime"]["output"];
  events?: Maybe<Array<Event>>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  organization?: Maybe<Organization>;
  parent?: Maybe<Group>;
  targets?: Maybe<Array<Target>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  users?: Maybe<Array<User>>;
};

export type GroupAddChildInput = {
  childId: Scalars["String"]["input"];
};

export type GroupAddEventInput = {
  eventId: Scalars["String"]["input"];
};

export type GroupAddParentInput = {
  parentId: Scalars["String"]["input"];
};

export type GroupAddTargetInput = {
  targetId: Scalars["String"]["input"];
};

export type GroupAddUserInput = {
  userId: Scalars["String"]["input"];
};

export type GroupChangeOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type GroupChangeOrganizationPayload =
  | AuthError
  | ComplexQueryError
  | GroupChangeOrganizationSuccess
  | InvalidInputValueError;

export type GroupChangeOrganizationSuccess = {
  __typename?: "GroupChangeOrganizationSuccess";
  group: Group;
  organization: Organization;
};

export type GroupCreateInput = {
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  childrenIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  organizationId?: InputMaybe<Scalars["String"]["input"]>;
  parentId?: InputMaybe<Scalars["String"]["input"]>;
  userIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type GroupCreatePayload =
  | AuthError
  | ComplexQueryError
  | GroupCreateSuccess
  | InvalidInputValueError;

export type GroupCreateSuccess = {
  __typename?: "GroupCreateSuccess";
  group?: Maybe<Group>;
};

export type GroupDeletePayload =
  | AuthError
  | ComplexQueryError
  | GroupDeleteSuccess
  | InvalidInputValueError;

export type GroupDeleteSuccess = {
  __typename?: "GroupDeleteSuccess";
  groupId: Scalars["ID"]["output"];
};

export type GroupEdge = Edge & {
  __typename?: "GroupEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Group>;
};

export type GroupFilterInput = {
  agendaId?: InputMaybe<Scalars["Int"]["input"]>;
  isPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  organizationId?: InputMaybe<Scalars["String"]["input"]>;
};

export type GroupRemoveChildInput = {
  childId: Scalars["String"]["input"];
};

export type GroupRemoveEventInput = {
  eventId: Scalars["String"]["input"];
};

export type GroupRemoveParentInput = {
  parentId: Scalars["String"]["input"];
};

export type GroupRemoveTargetInput = {
  targetId: Scalars["String"]["input"];
};

export type GroupRemoveUserInput = {
  userId: Scalars["String"]["input"];
};

export type GroupSortInput = {
  createdAt?: InputMaybe<SortDirection>;
  updatedAt?: InputMaybe<SortDirection>;
};

export type GroupUpdateChildPayload =
  | AuthError
  | ComplexQueryError
  | GroupUpdateChildSuccess
  | InvalidInputValueError;

export type GroupUpdateChildSuccess = {
  __typename?: "GroupUpdateChildSuccess";
  child: Group;
  group: Group;
};

export type GroupUpdateContentInput = {
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
};

export type GroupUpdateContentPayload =
  | AuthError
  | ComplexQueryError
  | GroupUpdateContentSuccess
  | InvalidInputValueError;

export type GroupUpdateContentSuccess = {
  __typename?: "GroupUpdateContentSuccess";
  group: Group;
};

export type GroupUpdateEventPayload =
  | AuthError
  | ComplexQueryError
  | GroupUpdateEventSuccess
  | InvalidInputValueError;

export type GroupUpdateEventSuccess = {
  __typename?: "GroupUpdateEventSuccess";
  event: Event;
  group: Group;
};

export type GroupUpdateParentPayload =
  | AuthError
  | ComplexQueryError
  | GroupUpdateParentSuccess
  | InvalidInputValueError;

export type GroupUpdateParentSuccess = {
  __typename?: "GroupUpdateParentSuccess";
  group: Group;
  parent: Group;
};

export type GroupUpdateTargetPayload =
  | AuthError
  | ComplexQueryError
  | GroupUpdateTargetSuccess
  | InvalidInputValueError;

export type GroupUpdateTargetSuccess = {
  __typename?: "GroupUpdateTargetSuccess";
  group: Group;
  target: Target;
};

export type GroupUpdateUserPayload =
  | AuthError
  | ComplexQueryError
  | GroupUpdateUserSuccess
  | InvalidInputValueError;

export type GroupUpdateUserSuccess = {
  __typename?: "GroupUpdateUserSuccess";
  group: Group;
  user: User;
};

export type GroupsConnection = {
  __typename?: "GroupsConnection";
  edges?: Maybe<Array<Maybe<GroupEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum IdentityPlatform {
  Facebook = "FACEBOOK",
  Line = "LINE",
}

export type ImageInput = {
  base64: Scalars["String"]["input"];
};

export type Index = {
  __typename?: "Index";
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
  valueType: ValueType;
};

export type InvalidInputValueError = Error & {
  __typename?: "InvalidInputValueError";
  fields?: Maybe<Array<Field>>;
  message: Scalars["String"]["output"];
  statusCode: Scalars["Int"]["output"];
};

export type Issue = {
  __typename?: "Issue";
  activities?: Maybe<Activities>;
  cities?: Maybe<Array<City>>;
  comments?: Maybe<Comments>;
  createdAt: Scalars["Datetime"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  groups?: Maybe<Array<Group>>;
  id: Scalars["ID"]["output"];
  images?: Maybe<Array<Scalars["String"]["output"]>>;
  isPublic: Scalars["Boolean"]["output"];
  issueCategories?: Maybe<Array<IssueCategory>>;
  likes?: Maybe<Likes>;
  organizations?: Maybe<Array<Organization>>;
  skillsets?: Maybe<Array<Skillset>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type IssueAddCategoryInput = {
  categoryId: Scalars["Int"]["input"];
};

export type IssueAddCityInput = {
  cityId: Scalars["String"]["input"];
};

export type IssueAddGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type IssueAddOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type IssueAddSkillsetInput = {
  skillsetId: Scalars["Int"]["input"];
};

export type IssueCategory = {
  __typename?: "IssueCategory";
  code: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

export type IssueCreateInput = {
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  groupIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  issueCategoryIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  organizationIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  skillsetIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type IssueCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueCreateSuccess;

export type IssueCreateSuccess = {
  __typename?: "IssueCreateSuccess";
  issue: Issue;
};

export type IssueDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueDeleteSuccess;

export type IssueDeleteSuccess = {
  __typename?: "IssueDeleteSuccess";
  issueId: Scalars["String"]["output"];
};

export type IssueEdge = Edge & {
  __typename?: "IssueEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Issue>;
};

export type IssueFilterInput = {
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type IssuePrivacyInput = {
  isPublic: Scalars["Boolean"]["input"];
};

export type IssueRemoveCategoryInput = {
  categoryId: Scalars["Int"]["input"];
};

export type IssueRemoveCityInput = {
  cityId: Scalars["String"]["input"];
};

export type IssueRemoveGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type IssueRemoveOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type IssueRemoveSkillsetInput = {
  skillsetId: Scalars["Int"]["input"];
};

export type IssueSortInput = {
  createdAt?: InputMaybe<SortDirection>;
};

export type IssueUpdateCategoryPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueUpdateCategorySuccess;

export type IssueUpdateCategorySuccess = {
  __typename?: "IssueUpdateCategorySuccess";
  issue: Issue;
  issueCategory: IssueCategory;
};

export type IssueUpdateCityPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueUpdateCitySuccess;

export type IssueUpdateCitySuccess = {
  __typename?: "IssueUpdateCitySuccess";
  city: City;
  issue: Issue;
};

export type IssueUpdateContentInput = {
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  images?: InputMaybe<Array<Scalars["String"]["input"]>>;
  issueCategoryIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  skillsetIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
};

export type IssueUpdateContentPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueUpdateContentSuccess;

export type IssueUpdateContentSuccess = {
  __typename?: "IssueUpdateContentSuccess";
  issue: Issue;
};

export type IssueUpdateGroupPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueUpdateGroupSuccess;

export type IssueUpdateGroupSuccess = {
  __typename?: "IssueUpdateGroupSuccess";
  group: Group;
  issue: Issue;
};

export type IssueUpdateOrganizationPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueUpdateOrganizationSuccess;

export type IssueUpdateOrganizationSuccess = {
  __typename?: "IssueUpdateOrganizationSuccess";
  issue: Issue;
  organization: Organization;
};

export type IssueUpdatePrivacyPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueUpdatePrivacySuccess;

export type IssueUpdatePrivacySuccess = {
  __typename?: "IssueUpdatePrivacySuccess";
  issue: Issue;
};

export type IssueUpdateSkillsetPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | IssueUpdateSkillsetSuccess;

export type IssueUpdateSkillsetSuccess = {
  __typename?: "IssueUpdateSkillsetSuccess";
  issue: Issue;
  skillset: Skillset;
};

export type IssuesConnection = {
  __typename?: "IssuesConnection";
  edges?: Maybe<Array<Maybe<IssueEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type Like = {
  __typename?: "Like";
  createdAt: Scalars["Datetime"]["output"];
  event?: Maybe<Event>;
  postedAt: Scalars["Datetime"]["output"];
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  user?: Maybe<User>;
};

export type LikeAddEventInput = {
  eventId: Scalars["String"]["input"];
  postedAt: Scalars["Datetime"]["input"];
  userId: Scalars["String"]["input"];
};

export type LikeAddEventPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | LikeAddEventSuccess;

export type LikeAddEventSuccess = {
  __typename?: "LikeAddEventSuccess";
  like: Like;
};

export type LikeDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | LikeDeleteSuccess;

export type LikeDeleteSuccess = {
  __typename?: "LikeDeleteSuccess";
  likeId: Scalars["String"]["output"];
};

export type Likes = {
  __typename?: "Likes";
  data: Array<Like>;
  total: Scalars["Int"]["output"];
};

export type Mutation = {
  __typename?: "Mutation";
  activityAddEvent?: Maybe<ActivityUpdateEventPayload>;
  activityAddUser?: Maybe<ActivityUpdateUserPayload>;
  activityCreate?: Maybe<ActivityCreatePayload>;
  activityDelete?: Maybe<ActivityDeletePayload>;
  activityPublish?: Maybe<ActivitySwitchPrivacyPayload>;
  activityRemoveEvent?: Maybe<ActivityUpdateEventPayload>;
  activityRemoveUser?: Maybe<ActivityUpdateUserPayload>;
  activityUnpublish?: Maybe<ActivitySwitchPrivacyPayload>;
  activityUpdateContent?: Maybe<ActivityUpdateContentPayload>;
  applicationAddConfirmation?: Maybe<ApplicationAddConfirmationPayload>;
  applicationApprove?: Maybe<ApplicationSwitchIsApprovedPayload>;
  applicationCreate?: Maybe<ApplicationCreatePayload>;
  applicationDelete?: Maybe<ApplicationDeletePayload>;
  applicationDeleteConfirmation?: Maybe<ApplicationDeleteConfirmationPayload>;
  applicationPublish?: Maybe<ApplicationSwitchPrivacyPayload>;
  applicationRefuse?: Maybe<ApplicationSwitchIsApprovedPayload>;
  applicationUnpublish?: Maybe<ApplicationSwitchPrivacyPayload>;
  applicationUpdateComment?: Maybe<ApplicationUpdateCommentPayload>;
  applicationUpdateConfirmation?: Maybe<ApplicationAddConfirmationPayload>;
  applicationUpdateConfirmationComment?: Maybe<ApplicationUpdateConfirmationCommentPayload>;
  commentAddEvent?: Maybe<CommentAddEventPayload>;
  commentDelete?: Maybe<CommentDeletePayload>;
  commentUpdateContent?: Maybe<CommentUpdateContentPayload>;
  createUser?: Maybe<CurrentUserPayload>;
  deleteUser?: Maybe<CurrentUserPayload>;
  eventAddGroup?: Maybe<EventUpdateGroupPayload>;
  eventAddOrganization?: Maybe<EventUpdateOrganizationPayload>;
  eventDelete?: Maybe<EventDeletePayload>;
  eventPlan?: Maybe<EventPlanPayload>;
  eventPublish?: Maybe<EventUpdatePrivacyPayload>;
  eventRemoveGroup?: Maybe<EventUpdateGroupPayload>;
  eventRemoveOrganization?: Maybe<EventUpdateOrganizationPayload>;
  eventUnpublish?: Maybe<EventUpdatePrivacyPayload>;
  eventUpdateContent?: Maybe<EventUpdateContentPayload>;
  groupAddChild?: Maybe<GroupUpdateChildPayload>;
  groupAddEvent?: Maybe<GroupUpdateEventPayload>;
  groupAddParent?: Maybe<GroupUpdateParentPayload>;
  groupAddTarget?: Maybe<GroupUpdateTargetPayload>;
  groupAddUser?: Maybe<GroupUpdateUserPayload>;
  groupChangeOrganization?: Maybe<GroupChangeOrganizationPayload>;
  groupCreate?: Maybe<GroupCreatePayload>;
  groupDelete?: Maybe<GroupDeletePayload>;
  groupRemoveChild?: Maybe<GroupUpdateChildPayload>;
  groupRemoveEvent?: Maybe<GroupUpdateEventPayload>;
  groupRemoveParent?: Maybe<GroupUpdateParentPayload>;
  groupRemoveTarget?: Maybe<GroupUpdateTargetPayload>;
  groupRemoveUser?: Maybe<GroupUpdateUserPayload>;
  groupUpdateContent?: Maybe<GroupUpdateContentPayload>;
  issueAddCategory?: Maybe<IssueUpdateCategoryPayload>;
  issueAddCity?: Maybe<IssueUpdateCityPayload>;
  issueAddGroup?: Maybe<IssueUpdateGroupPayload>;
  issueAddOrganization?: Maybe<IssueUpdateOrganizationPayload>;
  issueAddSkillset?: Maybe<IssueUpdateSkillsetPayload>;
  issueCreate?: Maybe<IssueCreatePayload>;
  issueDelete?: Maybe<IssueDeletePayload>;
  issuePublish?: Maybe<IssueUpdatePrivacyPayload>;
  issueRemoveCategory?: Maybe<IssueUpdateCategoryPayload>;
  issueRemoveCity?: Maybe<IssueUpdateCityPayload>;
  issueRemoveGroup?: Maybe<IssueUpdateGroupPayload>;
  issueRemoveOrganization?: Maybe<IssueUpdateOrganizationPayload>;
  issueRemoveSkillset?: Maybe<IssueUpdateSkillsetPayload>;
  issueUnpublish?: Maybe<IssueUpdatePrivacyPayload>;
  issueUpdateContent?: Maybe<IssueUpdateContentPayload>;
  likeAddEvent?: Maybe<LikeAddEventPayload>;
  likeDelete?: Maybe<LikeDeletePayload>;
  mutationEcho: Scalars["String"]["output"];
  organizationAddGroup?: Maybe<OrganizationUpdateGroupPayload>;
  organizationAddTarget?: Maybe<OrganizationUpdateTargetPayload>;
  organizationAddUser?: Maybe<OrganizationUpdateUserPayload>;
  organizationCreate?: Maybe<OrganizationCreatePayload>;
  organizationDelete?: Maybe<OrganizationDeletePayload>;
  organizationPublish?: Maybe<OrganizationSwitchPrivacyPayload>;
  organizationRemoveGroup?: Maybe<OrganizationUpdateGroupPayload>;
  organizationRemoveTarget?: Maybe<OrganizationUpdateTargetPayload>;
  organizationRemoveUser?: Maybe<OrganizationUpdateUserPayload>;
  organizationUnpublish?: Maybe<OrganizationSwitchPrivacyPayload>;
  organizationUpdateContent?: Maybe<OrganizationUpdateContentPayload>;
  organizationUpdateDefault?: Maybe<OrganizationUpdateDefaultPayload>;
  targetAddGroup?: Maybe<TargetUpdateGroupPayload>;
  targetAddOrganization?: Maybe<TargetUpdateOrganizationPayload>;
  targetCreate?: Maybe<TargetCreatePayload>;
  targetDelete?: Maybe<TargetDeletePayload>;
  targetRemoveGroup?: Maybe<TargetUpdateGroupPayload>;
  targetRemoveOrganization?: Maybe<TargetUpdateOrganizationPayload>;
  targetUpdateContent?: Maybe<TargetUpdateContentPayload>;
  targetUpdateIndex?: Maybe<TargetUpdateIndexPayload>;
  userAddActivity?: Maybe<UserUpdateActivityPayload>;
  userAddGroup?: Maybe<UserUpdateGroupPayload>;
  userAddOrganization?: Maybe<UserUpdateOrganizationPayload>;
  userCreate?: Maybe<UserCreatePayload>;
  userDelete?: Maybe<UserDeletePayload>;
  userPublish?: Maybe<UserSwitchPrivacyPayload>;
  userRemoveActivity?: Maybe<UserUpdateActivityPayload>;
  userRemoveGroup?: Maybe<UserUpdateGroupPayload>;
  userRemoveOrganization?: Maybe<UserUpdateOrganizationPayload>;
  userUnpublish?: Maybe<UserSwitchPrivacyPayload>;
  userUpdateContent?: Maybe<UserUpdateContentPayload>;
};

export type MutationActivityAddEventArgs = {
  id: Scalars["ID"]["input"];
  input: ActivityAddEventInput;
};

export type MutationActivityAddUserArgs = {
  id: Scalars["ID"]["input"];
  input: ActivityAddUserInput;
};

export type MutationActivityCreateArgs = {
  input: ActivityCreateInput;
};

export type MutationActivityDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationActivityPublishArgs = {
  id: Scalars["ID"]["input"];
  input: ActivitySwitchPrivacyInput;
};

export type MutationActivityRemoveEventArgs = {
  id: Scalars["ID"]["input"];
  input: ActivityRemoveEventInput;
};

export type MutationActivityRemoveUserArgs = {
  id: Scalars["ID"]["input"];
  input: ActivityRemoveUserInput;
};

export type MutationActivityUnpublishArgs = {
  id: Scalars["ID"]["input"];
  input: ActivitySwitchPrivacyInput;
};

export type MutationActivityUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: ActivityUpdateContentInput;
};

export type MutationApplicationAddConfirmationArgs = {
  id: Scalars["ID"]["input"];
  input: ApplicationAddConfirmationInput;
};

export type MutationApplicationApproveArgs = {
  id: Scalars["ID"]["input"];
  input: ApplicationApprovalInput;
};

export type MutationApplicationCreateArgs = {
  input: ApplicationCreateInput;
};

export type MutationApplicationDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationApplicationDeleteConfirmationArgs = {
  id: Scalars["ID"]["input"];
  input: ApplicationDeleteConfirmationInput;
};

export type MutationApplicationPublishArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationApplicationRefuseArgs = {
  id: Scalars["ID"]["input"];
  input: ApplicationRefusalInput;
};

export type MutationApplicationUnpublishArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationApplicationUpdateCommentArgs = {
  id: Scalars["ID"]["input"];
  input: ApplicationUpdateCommentInput;
};

export type MutationApplicationUpdateConfirmationArgs = {
  id: Scalars["ID"]["input"];
  input: ApplicationAddConfirmationInput;
};

export type MutationApplicationUpdateConfirmationCommentArgs = {
  id: Scalars["ID"]["input"];
  input: ApplicationUpdateConfirmationCommentInput;
};

export type MutationCommentAddEventArgs = {
  input: CommentAddEventInput;
};

export type MutationCommentDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationCommentUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: CommentUpdateContentInput;
};

export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

export type MutationEventAddGroupArgs = {
  id: Scalars["ID"]["input"];
  input: EventAddGroupInput;
};

export type MutationEventAddOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: EventAddOrganizationInput;
};

export type MutationEventDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationEventPlanArgs = {
  input: EventPlanInput;
};

export type MutationEventPublishArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationEventRemoveGroupArgs = {
  id: Scalars["ID"]["input"];
  input: EventRemoveGroupInput;
};

export type MutationEventRemoveOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: EventRemoveOrganizationInput;
};

export type MutationEventUnpublishArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationEventUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: EventUpdateContentInput;
};

export type MutationGroupAddChildArgs = {
  id: Scalars["ID"]["input"];
  input: GroupAddChildInput;
};

export type MutationGroupAddEventArgs = {
  id: Scalars["ID"]["input"];
  input: GroupAddEventInput;
};

export type MutationGroupAddParentArgs = {
  id: Scalars["ID"]["input"];
  input: GroupAddParentInput;
};

export type MutationGroupAddTargetArgs = {
  id: Scalars["ID"]["input"];
  input: GroupAddTargetInput;
};

export type MutationGroupAddUserArgs = {
  id: Scalars["ID"]["input"];
  input: GroupAddUserInput;
};

export type MutationGroupChangeOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: GroupChangeOrganizationInput;
};

export type MutationGroupCreateArgs = {
  input: GroupCreateInput;
};

export type MutationGroupDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationGroupRemoveChildArgs = {
  id: Scalars["ID"]["input"];
  input: GroupRemoveChildInput;
};

export type MutationGroupRemoveEventArgs = {
  id: Scalars["ID"]["input"];
  input: GroupRemoveEventInput;
};

export type MutationGroupRemoveParentArgs = {
  id: Scalars["ID"]["input"];
  input: GroupRemoveParentInput;
};

export type MutationGroupRemoveTargetArgs = {
  id: Scalars["ID"]["input"];
  input: GroupRemoveTargetInput;
};

export type MutationGroupRemoveUserArgs = {
  id: Scalars["ID"]["input"];
  input: GroupRemoveUserInput;
};

export type MutationGroupUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: GroupUpdateContentInput;
};

export type MutationIssueAddCategoryArgs = {
  id: Scalars["ID"]["input"];
  input: IssueAddCategoryInput;
};

export type MutationIssueAddCityArgs = {
  id: Scalars["ID"]["input"];
  input: IssueAddCityInput;
};

export type MutationIssueAddGroupArgs = {
  id: Scalars["ID"]["input"];
  input: IssueAddGroupInput;
};

export type MutationIssueAddOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: IssueAddOrganizationInput;
};

export type MutationIssueAddSkillsetArgs = {
  id: Scalars["ID"]["input"];
  input: IssueAddSkillsetInput;
};

export type MutationIssueCreateArgs = {
  input: IssueCreateInput;
};

export type MutationIssueDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationIssuePublishArgs = {
  id: Scalars["ID"]["input"];
  input: IssuePrivacyInput;
};

export type MutationIssueRemoveCategoryArgs = {
  id: Scalars["ID"]["input"];
  input: IssueRemoveCategoryInput;
};

export type MutationIssueRemoveCityArgs = {
  id: Scalars["ID"]["input"];
  input: IssueRemoveCityInput;
};

export type MutationIssueRemoveGroupArgs = {
  id: Scalars["ID"]["input"];
  input: IssueRemoveGroupInput;
};

export type MutationIssueRemoveOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: IssueRemoveOrganizationInput;
};

export type MutationIssueRemoveSkillsetArgs = {
  id: Scalars["ID"]["input"];
  input: IssueRemoveSkillsetInput;
};

export type MutationIssueUnpublishArgs = {
  id: Scalars["ID"]["input"];
  input: IssuePrivacyInput;
};

export type MutationIssueUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: IssueUpdateContentInput;
};

export type MutationLikeAddEventArgs = {
  input: LikeAddEventInput;
};

export type MutationLikeDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOrganizationAddGroupArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationAddGroupInput;
};

export type MutationOrganizationAddTargetArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationAddTargetInput;
};

export type MutationOrganizationAddUserArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationAddUserInput;
};

export type MutationOrganizationCreateArgs = {
  input: OrganizationCreateInput;
};

export type MutationOrganizationDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOrganizationPublishArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOrganizationRemoveGroupArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationRemoveGroupInput;
};

export type MutationOrganizationRemoveTargetArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationRemoveTargetInput;
};

export type MutationOrganizationRemoveUserArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationRemoveUserInput;
};

export type MutationOrganizationUnpublishArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationOrganizationUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationUpdateContentInput;
};

export type MutationOrganizationUpdateDefaultArgs = {
  id: Scalars["ID"]["input"];
  input: OrganizationUpdateDefaultInput;
};

export type MutationTargetAddGroupArgs = {
  id: Scalars["ID"]["input"];
  input: TargetAddGroupInput;
};

export type MutationTargetAddOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: TargetAddOrganizationInput;
};

export type MutationTargetCreateArgs = {
  input: TargetCreateInput;
};

export type MutationTargetDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationTargetRemoveGroupArgs = {
  id: Scalars["ID"]["input"];
  input: TargetRemoveGroupInput;
};

export type MutationTargetRemoveOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: TargetRemoveOrganizationInput;
};

export type MutationTargetUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: TargetUpdateContentInput;
};

export type MutationTargetUpdateIndexArgs = {
  id: Scalars["ID"]["input"];
  input: TargetUpdateIndexInput;
};

export type MutationUserAddActivityArgs = {
  id: Scalars["ID"]["input"];
  input: UserAddActivityInput;
};

export type MutationUserAddGroupArgs = {
  id: Scalars["ID"]["input"];
  input: UserAddGroupInput;
};

export type MutationUserAddOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: UserAddOrganizationInput;
};

export type MutationUserCreateArgs = {
  input: UserCreateInput;
};

export type MutationUserDeleteArgs = {
  id: Scalars["ID"]["input"];
};

export type MutationUserPublishArgs = {
  id: Scalars["ID"]["input"];
  input: UserSwitchPrivacyInput;
};

export type MutationUserRemoveActivityArgs = {
  id: Scalars["ID"]["input"];
  input: UserRemoveActivityInput;
};

export type MutationUserRemoveGroupArgs = {
  id: Scalars["ID"]["input"];
  input: UserRemoveGroupInput;
};

export type MutationUserRemoveOrganizationArgs = {
  id: Scalars["ID"]["input"];
  input: UserRemoveOrganizationInput;
};

export type MutationUserUnpublishArgs = {
  id: Scalars["ID"]["input"];
  input: UserSwitchPrivacyInput;
};

export type MutationUserUpdateContentArgs = {
  id: Scalars["ID"]["input"];
  input: UserUpdateContentInput;
};

export type Organization = {
  __typename?: "Organization";
  address1: Scalars["String"]["output"];
  address2?: Maybe<Scalars["String"]["output"]>;
  agendas?: Maybe<Array<Agenda>>;
  bio?: Maybe<Scalars["String"]["output"]>;
  cities?: Maybe<Array<City>>;
  city: City;
  createdAt: Scalars["Datetime"]["output"];
  entity?: Maybe<Scalars["String"]["output"]>;
  entityPosition?: Maybe<EntityPosition>;
  establishedAt?: Maybe<Scalars["Datetime"]["output"]>;
  events?: Maybe<Array<Event>>;
  groups?: Maybe<Array<Group>>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  isPublic: Scalars["Boolean"]["output"];
  name: Scalars["String"]["output"];
  state: State;
  targets?: Maybe<Array<Target>>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  users?: Maybe<Array<User>>;
  website?: Maybe<Scalars["String"]["output"]>;
  zipcode: Scalars["String"]["output"];
};

export type OrganizationAddGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type OrganizationAddTargetInput = {
  targetId: Scalars["String"]["input"];
};

export type OrganizationAddUserInput = {
  userId: Scalars["String"]["input"];
};

export type OrganizationCreateInput = {
  address1: Scalars["String"]["input"];
  address2?: InputMaybe<Scalars["String"]["input"]>;
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCode: Scalars["String"]["input"];
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  entity?: InputMaybe<Scalars["String"]["input"]>;
  entityPosition?: InputMaybe<EntityPosition>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  name: Scalars["String"]["input"];
  stateCode: Scalars["String"]["input"];
  stateCountryCode: Scalars["String"]["input"];
  userIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  website?: InputMaybe<Scalars["String"]["input"]>;
  zipcode: Scalars["String"]["input"];
};

export type OrganizationCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationCreateSuccess;

export type OrganizationCreateSuccess = {
  __typename?: "OrganizationCreateSuccess";
  organization?: Maybe<Organization>;
};

export type OrganizationDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationDeleteSuccess;

export type OrganizationDeleteSuccess = {
  __typename?: "OrganizationDeleteSuccess";
  organizationId: Scalars["ID"]["output"];
};

export type OrganizationEdge = Edge & {
  __typename?: "OrganizationEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Organization>;
};

export type OrganizationFilterInput = {
  agendaId?: InputMaybe<Scalars["Int"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type OrganizationRemoveGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type OrganizationRemoveTargetInput = {
  targetId: Scalars["String"]["input"];
};

export type OrganizationRemoveUserInput = {
  userId: Scalars["String"]["input"];
};

export type OrganizationSortInput = {
  updatedAt?: InputMaybe<SortDirection>;
};

export type OrganizationSwitchPrivacyPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationSwitchPrivacySuccess;

export type OrganizationSwitchPrivacySuccess = {
  __typename?: "OrganizationSwitchPrivacySuccess";
  organization: Organization;
};

export type OrganizationUpdateContentInput = {
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  website?: InputMaybe<Scalars["String"]["input"]>;
};

export type OrganizationUpdateContentPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationUpdateContentSuccess;

export type OrganizationUpdateContentSuccess = {
  __typename?: "OrganizationUpdateContentSuccess";
  organization: Organization;
};

export type OrganizationUpdateDefaultInput = {
  address1: Scalars["String"]["input"];
  address2?: InputMaybe<Scalars["String"]["input"]>;
  cityCode: Scalars["String"]["input"];
  entity?: InputMaybe<Scalars["String"]["input"]>;
  entityPosition?: InputMaybe<EntityPosition>;
  establishedAt?: InputMaybe<Scalars["Datetime"]["input"]>;
  name: Scalars["String"]["input"];
  stateCode: Scalars["String"]["input"];
  stateCountryCode: Scalars["String"]["input"];
  zipcode: Scalars["String"]["input"];
};

export type OrganizationUpdateDefaultPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationUpdateDefaultSuccess;

export type OrganizationUpdateDefaultSuccess = {
  __typename?: "OrganizationUpdateDefaultSuccess";
  organization: Organization;
};

export type OrganizationUpdateGroupPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationUpdateGroupSuccess;

export type OrganizationUpdateGroupSuccess = {
  __typename?: "OrganizationUpdateGroupSuccess";
  group: Group;
  organization: Organization;
};

export type OrganizationUpdateTargetPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationUpdateTargetSuccess;

export type OrganizationUpdateTargetSuccess = {
  __typename?: "OrganizationUpdateTargetSuccess";
  organization: Organization;
  target: Target;
};

export type OrganizationUpdateUserPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | OrganizationUpdateUserSuccess;

export type OrganizationUpdateUserSuccess = {
  __typename?: "OrganizationUpdateUserSuccess";
  organization: Organization;
  user: User;
};

export type Organizations = {
  __typename?: "Organizations";
  data: Array<Organization>;
  total: Scalars["Int"]["output"];
};

export type OrganizationsConnection = {
  __typename?: "OrganizationsConnection";
  edges?: Maybe<Array<Maybe<OrganizationEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
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

export type Query = {
  __typename?: "Query";
  activities: ActivitiesConnection;
  activity?: Maybe<Activity>;
  agendas: Array<Agenda>;
  application?: Maybe<Application>;
  applications: ApplicationsConnection;
  cities: Array<City>;
  currentUser?: Maybe<CurrentUserPayload>;
  echo: Scalars["String"]["output"];
  event?: Maybe<Event>;
  events: EventsConnection;
  group?: Maybe<Group>;
  groups: GroupsConnection;
  issue?: Maybe<Issue>;
  issues: IssuesConnection;
  organization?: Maybe<Organization>;
  organizations: OrganizationsConnection;
  states: Array<State>;
  target?: Maybe<Target>;
  targets: TargetsConnection;
  user?: Maybe<User>;
  users: UsersConnection;
};

export type QueryActivitiesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ActivityFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ActivitySortInput>;
};

export type QueryActivityArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryApplicationArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryApplicationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<ApplicationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<ApplicationSortInput>;
};

export type QueryCitiesArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryEventArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryEventsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<EventFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<EventSortInput>;
};

export type QueryGroupArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryGroupsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<GroupFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<GroupSortInput>;
};

export type QueryIssueArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryIssuesArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<IssueFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<IssueSortInput>;
};

export type QueryOrganizationArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryOrganizationsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<OrganizationFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<OrganizationSortInput>;
};

export type QueryStatesArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
};

export type QueryTargetArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryTargetsArgs = {
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  filter?: InputMaybe<TargetFilterInput>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
  sort?: InputMaybe<TargetSortInput>;
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

export enum Role {
  Manager = "MANAGER",
  Member = "MEMBER",
  Owner = "OWNER",
}

export type Skillset = {
  __typename?: "Skillset";
  code: Scalars["String"]["output"];
  description?: Maybe<Scalars["String"]["output"]>;
  id: Scalars["Int"]["output"];
  name: Scalars["String"]["output"];
};

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

export type Target = {
  __typename?: "Target";
  createdAt: Scalars["Datetime"]["output"];
  group?: Maybe<Group>;
  id: Scalars["ID"]["output"];
  index?: Maybe<Index>;
  name: Scalars["String"]["output"];
  organization?: Maybe<Organization>;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
  validFrom: Scalars["Datetime"]["output"];
  validTo: Scalars["Datetime"]["output"];
  value: Scalars["Float"]["output"];
};

export type TargetAddGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type TargetAddOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type TargetCreateInput = {
  groupId: Scalars["String"]["input"];
  indexId: Scalars["Int"]["input"];
  name: Scalars["String"]["input"];
  organizationId: Scalars["String"]["input"];
  validFrom: Scalars["Datetime"]["input"];
  validTo: Scalars["Datetime"]["input"];
  value: Scalars["Float"]["input"];
};

export type TargetCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TargetCreateSuccess;

export type TargetCreateSuccess = {
  __typename?: "TargetCreateSuccess";
  target?: Maybe<Target>;
};

export type TargetDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TargetDeleteSuccess;

export type TargetDeleteSuccess = {
  __typename?: "TargetDeleteSuccess";
  targetId: Scalars["ID"]["output"];
};

export type TargetEdge = Edge & {
  __typename?: "TargetEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<Target>;
};

export type TargetFilterInput = {
  keyword?: InputMaybe<Scalars["String"]["input"]>;
  organizationId?: InputMaybe<Scalars["String"]["input"]>;
};

export type TargetRemoveGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type TargetRemoveOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type TargetSortInput = {
  updatedAt?: InputMaybe<SortDirection>;
};

export type TargetUpdateContentInput = {
  name: Scalars["String"]["input"];
  validFrom: Scalars["Datetime"]["input"];
  validTo: Scalars["Datetime"]["input"];
  value: Scalars["Float"]["input"];
};

export type TargetUpdateContentPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TargetUpdateContentSuccess;

export type TargetUpdateContentSuccess = {
  __typename?: "TargetUpdateContentSuccess";
  target?: Maybe<Target>;
};

export type TargetUpdateGroupPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TargetUpdateGroupSuccess;

export type TargetUpdateGroupSuccess = {
  __typename?: "TargetUpdateGroupSuccess";
  group: Group;
  target: Target;
};

export type TargetUpdateIndexInput = {
  indexId: Scalars["Int"]["input"];
};

export type TargetUpdateIndexPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TargetUpdateIndexSuccess;

export type TargetUpdateIndexSuccess = {
  __typename?: "TargetUpdateIndexSuccess";
  index: Index;
  target: Target;
};

export type TargetUpdateOrganizationPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | TargetUpdateOrganizationSuccess;

export type TargetUpdateOrganizationSuccess = {
  __typename?: "TargetUpdateOrganizationSuccess";
  organization: Organization;
  target: Target;
};

export type TargetsConnection = {
  __typename?: "TargetsConnection";
  edges?: Maybe<Array<Maybe<TargetEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export type User = {
  __typename?: "User";
  activities?: Maybe<Array<Activity>>;
  agendas?: Maybe<Array<Agenda>>;
  bio?: Maybe<Scalars["String"]["output"]>;
  cities?: Maybe<Array<City>>;
  comments?: Maybe<Array<Comment>>;
  createdAt: Scalars["Datetime"]["output"];
  email?: Maybe<Scalars["String"]["output"]>;
  firstName: Scalars["String"]["output"];
  groups?: Maybe<Array<Group>>;
  id: Scalars["ID"]["output"];
  image?: Maybe<Scalars["String"]["output"]>;
  isPublic: Scalars["Boolean"]["output"];
  lastName: Scalars["String"]["output"];
  likes?: Maybe<Array<Like>>;
  middleName?: Maybe<Scalars["String"]["output"]>;
  organizations?: Maybe<Array<Organization>>;
  sysRole: SysRole;
  updatedAt?: Maybe<Scalars["Datetime"]["output"]>;
};

export type UserAddActivityInput = {
  activityId: Scalars["String"]["input"];
};

export type UserAddGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type UserAddOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type UserCreateInput = {
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  groupIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
  image?: InputMaybe<Scalars["String"]["input"]>;
  lastName: Scalars["String"]["input"];
  middleName?: InputMaybe<Scalars["String"]["input"]>;
  organizationIds?: InputMaybe<Array<Scalars["String"]["input"]>>;
};

export type UserCreatePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserCreateSuccess;

export type UserCreateSuccess = {
  __typename?: "UserCreateSuccess";
  user?: Maybe<User>;
};

export type UserDeletePayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserDeleteSuccess;

export type UserDeleteSuccess = {
  __typename?: "UserDeleteSuccess";
  userId: Scalars["ID"]["output"];
};

export type UserEdge = Edge & {
  __typename?: "UserEdge";
  cursor: Scalars["String"]["output"];
  node?: Maybe<User>;
};

export type UserFilterInput = {
  agendaId?: InputMaybe<Scalars["Int"]["input"]>;
  cityCode?: InputMaybe<Scalars["String"]["input"]>;
  isPublic?: InputMaybe<Scalars["Boolean"]["input"]>;
  keyword?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserRemoveActivityInput = {
  activityId: Scalars["String"]["input"];
};

export type UserRemoveGroupInput = {
  groupId: Scalars["String"]["input"];
};

export type UserRemoveOrganizationInput = {
  organizationId: Scalars["String"]["input"];
};

export type UserSortInput = {
  updatedAt?: InputMaybe<SortDirection>;
};

export type UserSwitchPrivacyInput = {
  isPublic: Scalars["Boolean"]["input"];
};

export type UserSwitchPrivacyPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserSwitchPrivacySuccess;

export type UserSwitchPrivacySuccess = {
  __typename?: "UserSwitchPrivacySuccess";
  user: User;
};

export type UserUpdateActivityPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserUpdateActivitySuccess;

export type UserUpdateActivitySuccess = {
  __typename?: "UserUpdateActivitySuccess";
  activity: Activity;
  user?: Maybe<User>;
};

export type UserUpdateContentInput = {
  agendaIds?: InputMaybe<Array<Scalars["Int"]["input"]>>;
  bio?: InputMaybe<Scalars["String"]["input"]>;
  cityCodes?: InputMaybe<Array<Scalars["String"]["input"]>>;
  email?: InputMaybe<Scalars["String"]["input"]>;
  firstName: Scalars["String"]["input"];
  image?: InputMaybe<Scalars["String"]["input"]>;
  lastName: Scalars["String"]["input"];
  middleName?: InputMaybe<Scalars["String"]["input"]>;
};

export type UserUpdateContentPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserUpdateContentSuccess;

export type UserUpdateContentSuccess = {
  __typename?: "UserUpdateContentSuccess";
  user?: Maybe<User>;
};

export type UserUpdateGroupPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserUpdateGroupSuccess;

export type UserUpdateGroupSuccess = {
  __typename?: "UserUpdateGroupSuccess";
  group: Group;
  user: User;
};

export type UserUpdateOrganizationPayload =
  | AuthError
  | ComplexQueryError
  | InvalidInputValueError
  | UserUpdateOrganizationSuccess;

export type UserUpdateOrganizationSuccess = {
  __typename?: "UserUpdateOrganizationSuccess";
  organization: Organization;
  user: User;
};

export type UsersConnection = {
  __typename?: "UsersConnection";
  edges?: Maybe<Array<Maybe<UserEdge>>>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"]["output"];
};

export enum ValueType {
  Float = "FLOAT",
  Int = "INT",
}

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;

export type CreateUserMutation = {
  __typename?: "Mutation";
  createUser?: {
    __typename?: "CurrentUserPayload";
    user?: { __typename?: "User"; id: string } | null;
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

export type CurrentUserQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "CurrentUserPayload";
    user?: {
      __typename?: "User";
      id: string;
      lastName: string;
      middleName?: string | null;
      firstName: string;
    } | null;
  } | null;
};

export type OrganizationsQueryVariables = Exact<{
  filter?: InputMaybe<OrganizationFilterInput>;
  sort?: InputMaybe<OrganizationSortInput>;
  cursor?: InputMaybe<Scalars["String"]["input"]>;
  first?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type OrganizationsQuery = {
  __typename?: "Query";
  organizations: {
    __typename?: "OrganizationsConnection";
    edges?: Array<{
      __typename?: "OrganizationEdge";
      node?: {
        __typename?: "Organization";
        id: string;
        name: string;
        city: { __typename?: "City"; name: string; state: { __typename?: "State"; name: string } };
        users?: Array<{
          __typename?: "User";
          id: string;
          firstName: string;
          middleName?: string | null;
          lastName: string;
        }> | null;
      } | null;
    } | null> | null;
    pageInfo: { __typename?: "PageInfo"; endCursor?: string | null; hasNextPage: boolean };
  };
};

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
                      { kind: "Field", name: { kind: "Name", value: "lastName" } },
                      { kind: "Field", name: { kind: "Name", value: "middleName" } },
                      { kind: "Field", name: { kind: "Name", value: "firstName" } },
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
export const OrganizationsDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "organizations" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filter" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OrganizationFilterInput" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "sort" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "OrganizationSortInput" } },
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
            name: { kind: "Name", value: "organizations" },
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
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "users" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  { kind: "Field", name: { kind: "Name", value: "firstName" } },
                                  { kind: "Field", name: { kind: "Name", value: "middleName" } },
                                  { kind: "Field", name: { kind: "Name", value: "lastName" } },
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
} as unknown as DocumentNode<OrganizationsQuery, OrganizationsQueryVariables>;
