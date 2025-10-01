"use client";

import { useState, useCallback } from "react";

export interface AuthStateV2 {
  authenticationState: "loading" | "unauthenticated" | "line_authenticated" | "phone_authenticated" | "user_registered";
  isAuthenticating: boolean;
  firebaseUser: any | null;
  currentUser: any | null;
  environment: "web" | "liff";
}

const initialState: AuthStateV2 = {
  authenticationState: "loading",
  isAuthenticating: false,
  firebaseUser: null,
  currentUser: null,
  environment: "web",
};

let globalState: AuthStateV2 = { ...initialState };
const listeners: Set<(state: AuthStateV2) => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener(globalState));
};

export const setGlobalAuthState = (newState: Partial<AuthStateV2>) => {
  globalState = { ...globalState, ...newState };
  notifyListeners();
};

export const resetGlobalAuthState = () => {
  globalState = { ...initialState };
  notifyListeners();
};

export const getGlobalAuthState = () => globalState;

export const useAuthStore = () => {
  const [state, setState] = useState<AuthStateV2>(globalState);

  const setAuthState = useCallback((newState: Partial<AuthStateV2>) => {
    setGlobalAuthState(newState);
  }, []);

  const reset = useCallback(() => {
    resetGlobalAuthState();
  }, []);

  useState(() => {
    const listener = (newState: AuthStateV2) => setState(newState);
    listeners.add(listener);
    return () => listeners.delete(listener);
  });

  return {
    ...state,
    setAuthState,
    reset,
  };
};
