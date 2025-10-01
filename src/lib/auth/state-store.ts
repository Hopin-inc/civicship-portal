"use client";

import { useSyncExternalStore } from "react";

export type AuthStateV2 = {
  authenticationState:
    | "loading"
    | "unauthenticated"
    | "line_authenticated"
    | "phone_authenticated"
    | "user_registered";
  isAuthenticating: boolean;
  firebaseUser: any | null;
  currentUser: any | null;
  environment: "web" | "liff";
};

const initialState: AuthStateV2 = {
  authenticationState: "loading",
  isAuthenticating: false,
  firebaseUser: null,
  currentUser: null,
  environment: "web",
};

let globalState: AuthStateV2 = { ...initialState };
const listeners = new Set<() => void>();

const emitChange = () => {
  for (const listener of listeners) listener();
};

export function setGlobalAuthState(newState: Partial<AuthStateV2>) {
  globalState = { ...globalState, ...newState };
  emitChange();
}

export function resetGlobalAuthState() {
  globalState = { ...initialState };
  emitChange();
}

export function getGlobalAuthState() {
  return globalState;
}

export function useAuthStore() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => globalState,
    () => initialState // SSR fallback
  );
}
