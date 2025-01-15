import { createContext } from "react";
import { CurrentUser } from "@/types";
import { Deferred } from "@/utils/defer";

type AuthContextState = {
  ready: Deferred;
  currentUser: CurrentUser | null | undefined;
};

export const FirebaseAuthContext = createContext<AuthContextState>(undefined as never);
