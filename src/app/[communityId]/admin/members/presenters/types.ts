import { GqlRole } from "@/types/graphql";

export interface PresentedMember {
  id: string;
  name: string;
  image: string | null;
  roleLabel: string;
  roleValue: GqlRole;
  pointsLabel: string;
}
