export interface PresentedMember {
  id: string;
  name: string;
  image: string | null;
  headline: string;
  bio: string | null;
  joinedAt: string;
  role: string;
}

export interface GroupedMembers {
  yearMonth: string;
  displayLabel: string;
  members: PresentedMember[];
}
