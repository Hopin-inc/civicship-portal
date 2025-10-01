import { create } from "zustand";
import { AuthState, AuthStore, PhoneAuthState } from "@/types/auth";
import { detectEnvironment } from "@/lib/auth/environment-detector";

const initialAuthState: AuthState = {
  firebaseUser: null,
  currentUser: null,
  authenticationState: "loading",
  environment: detectEnvironment(),
  isAuthenticating: false,
};

const initialPhoneAuthState: PhoneAuthState = {
  isVerifying: false,
  isVerified: false,
  phoneNumber: null,
  phoneUid: null,
  verificationId: null,
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  state: initialAuthState,
  phoneAuth: initialPhoneAuthState,
  setState: (partial) =>
    set((s) => ({
      state: { ...s.state, ...partial },
    })),
  setPhoneAuth: (partial) =>
    set((s) => ({
      phoneAuth: { ...s.phoneAuth, ...partial },
    })),
  reset: () =>
    set({
      state: initialAuthState,
      phoneAuth: initialPhoneAuthState,
    }),
}));
