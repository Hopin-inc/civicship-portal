import { GqlUser } from "@/types/graphql";

export type AppAuthInfo = {
  uid?: string;
  providerIds?: string[];
  user?: GqlUser | null;
};