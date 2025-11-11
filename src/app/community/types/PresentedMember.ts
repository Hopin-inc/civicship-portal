export interface PresentedMember {
  id: string;
  name: string;
  image: string | null;
  headline: string;
  bio: string | null;
  joinedAt: Date;
  role: string;
}

export interface GroupedMembers {
  yearMonth: string;
  displayLabel: string;
  members: PresentedMember[];
}
