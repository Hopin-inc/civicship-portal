import { create } from "zustand";
import { AuthState } from "@/types/auth";
import { detectEnvironment } from "@/lib/auth/environment-detector";

const initialState: AuthState = {
  firebaseUser: null,
  currentUser: null,
  authenticationState: "loading",
  environment: detectEnvironment(),
  isAuthenticating: false,
};

type AuthStore = {
  state: AuthState;
  setState: (partial: Partial<AuthState>) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  state: initialState,
  setState: (partial) =>
    set((s) => ({
      state: { ...s.state, ...partial },
    })),
  reset: () => set({ state: initialState }),
}));
