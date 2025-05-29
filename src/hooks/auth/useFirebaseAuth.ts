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
    const timestamp = new Date().toISOString();
    console.log(`🔄 [${timestamp}] useFirebaseAuth hook initialized, isAuthenticating=${isAuthenticating}`);
    
    const unsubscribe = lineAuth.onAuthStateChanged((user) => {
      const callbackTimestamp = new Date().toISOString();
      console.log(`👀 [${callbackTimestamp}] lineAuth.onAuthStateChanged callback triggered, user=${user?.uid || 'null'}, isAuthenticating=${isAuthenticating}`);
      onFirebaseUserChange(user);

      if (user) {
        console.log(`🔄 [${callbackTimestamp}] Setting auth state to line_authenticated if currently loading`);
        onAuthStateChange(prev =>
          prev === "loading" ? "line_authenticated" : prev
        );
      } else {
        console.log(`🔄 [${callbackTimestamp}] Setting auth state to unauthenticated, isAuthenticating=${isAuthenticating}`);
        onAuthStateChange("unauthenticated");
      }

      if (!isAuthenticating) {
        console.log(`🔄 [${callbackTimestamp}] Calling authService.handleLineAuthStateChange(${!!user})`);
        authService.handleLineAuthStateChange(!!user);
      } else {
        console.log(`🔄 [${callbackTimestamp}] Skipping authService.handleLineAuthStateChange because isAuthenticating=true`);
      }
      console.log(`🔄 [${callbackTimestamp}] lineAuth.onAuthStateChanged callback completed`);
    });

    return () => {
      console.log(`🔄 [${new Date().toISOString()}] useFirebaseAuth hook cleanup`);
      unsubscribe();
    };
  }, [isAuthenticating, authService, onFirebaseUserChange, onAuthStateChange]);
};
