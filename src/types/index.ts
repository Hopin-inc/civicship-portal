import { User } from "@/gql/graphql";
import { Required } from "utility-types";

export type AuthInfo = {
  uid?: string;
  providerIds?: string[];
  user?: Required<Partial<User>, "id" | "lastName" | "firstName"> | null;
};
