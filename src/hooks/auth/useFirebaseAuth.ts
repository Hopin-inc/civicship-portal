"use client";

import { useEffect } from "react";
import { User } from "firebase/auth";
import { lineAuth } from "@/lib/auth/firebase-config";
import { AuthService } from "@/lib/auth/auth-service";
import { AuthenticationState } from "@/lib/auth/auth-state-store";

export const useFirebaseAuth = (
  isAuthenticating: boolean,
  onFirebaseUserChange: (user: User | null) => void,
  onAuthStateChange: (stateOrUpdater: AuthenticationState | ((prev: AuthenticationState) => AuthenticationState)) => void
) => {
  const authService = AuthService.getInstance();

  useEffect(() => {
    const unsubscribe = lineAuth.onAuthStateChanged((user) => {
      onFirebaseUserChange(user);

      if (user) {
        onAuthStateChange(prev =>
          prev === "loading" ? "line_authenticated" : prev
        );
      } else {
        onAuthStateChange("unauthenticated");
      }

      if (!isAuthenticating) {
        authService.handleLineAuthStateChange(!!user);
      }
    });

    return () => unsubscribe();
  }, [isAuthenticating, authService, onFirebaseUserChange, onAuthStateChange]);
};
