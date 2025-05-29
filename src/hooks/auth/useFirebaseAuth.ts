"use client";

import { useEffect } from "react";
import { User } from "firebase/auth";
import { lineAuth } from "@/lib/auth/firebase-config";
import { AuthService } from "@/lib/auth/auth-service";

export const useFirebaseAuth = (
  isAuthenticating: boolean,
  onFirebaseUserChange: (user: User | null) => void,
  onAuthStateChange: (state: string) => void
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
