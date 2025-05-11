export type CommunityId ={
  communityId: string;
}

export type Membership = {
  id?: string;
  communityId?: string;
  role?: string;
  status?: string;
}

export type CurrentUser = {
  id: string;
  name: string;
  memberships: Membership[];
}
