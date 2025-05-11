export type CommunityId ={
  communityId: string;
}

export type Membership = {
  id?: string;
  community?: {
    id: string;
    name?: string;
  };
  role?: string;
  status?: string;
}

export type CurrentUser = {
  id: string;
  name: string;
  memberships: Membership[];
}
