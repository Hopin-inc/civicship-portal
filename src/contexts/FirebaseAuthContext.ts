import { createContext } from "react";
import { CurrentUser } from "@/types";

type AuthContextState = {
  currentUser: CurrentUser | null | undefined;
};

export const FirebaseAuthContext = createContext<AuthContextState>({
  currentUser: undefined,
});
