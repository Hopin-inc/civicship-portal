import { User } from "@/gql/graphql";
import { Required } from "utility-types";

export type CurrentUser = {
  uid: string;
  providerIds: string[];
  displayName: string | null;
  user: Required<Partial<User>, "id" | "lastName" | "firstName"> | null;
};
