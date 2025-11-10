import { create } from "zustand";
import { AuthState, AuthStore, LiffState, PhoneAuthState } from "@/types/auth";
import { detectEnvironment } from "@/lib/auth/core/environment-detector";

const initialAuthState: AuthState = {
  firebaseUser: null,
  currentUser: null,
  authenticationState: "loading",
  environment: detectEnvironment(),
  isAuthenticating: false,
  isAuthInProgress: false,
  lineTokens: {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  },
};

const initialPhoneAuthState: PhoneAuthState = {
  isVerifying: false,
  isVerified: false,
  refreshToken: null,
  phoneNumber: null,
  phoneUid: null,
  verificationId: null,
  error: null,
  phoneTokens: {
    accessToken: null,
    refreshToken: null,
    expiresAt: null,
  },
};

const initialLiffAuthState: LiffState = {
  isInitialized: false,
  isLiffProcessing: false,
  isLoggedIn: false,
  profile: {
    userId: null,
    displayName: null,
    pictureUrl: null,
  },
  error: null,
};

export const useAuthStore = create<AuthStore>((set) => ({
  state: initialAuthState,
  phoneAuth: initialPhoneAuthState,
  liffAuth: initialLiffAuthState,

  setState: (partial) =>
    set((s) => ({
      state: { ...s.state, ...partial },
    })),
  setPhoneAuth: (partial) =>
    set((s) => ({
      phoneAuth: { ...s.phoneAuth, ...partial },
    })),
  setLiffAuth: (partial) =>
    set((s) => ({
      liffAuth: { ...s.liffAuth, ...partial },
    })),

  reset: () =>
    set({
      state: initialAuthState,
      phoneAuth: initialPhoneAuthState,
      liffAuth: initialLiffAuthState,
    }),
}));
