"use client";

import { useEffect, useState, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";

interface UseLineAuthRedirectDetectionProps {
  state: AuthState;
  liffService: LiffService;
}

export const useLineAuthRedirectDetection = ({ state, liffService }: UseLineAuthRedirectDetectionProps) => {
  const [shouldProcessRedirect, setShouldProcessRedirect] = useState(false);
  const stateRef = useRef(state);
  const liffServiceRef = useRef(liffService);
  const lastCheckRef = useRef<string>("");
  
  stateRef.current = state;
  liffServiceRef.current = liffService;

  useEffect(() => {
    const checkRedirectConditions = () => {
      const currentState = stateRef.current;
      const currentLiffService = liffServiceRef.current;
      
      const stateKey = `${currentState.authenticationState}-${currentState.isAuthenticating}`;
      if (lastCheckRef.current === stateKey) {
        return;
      }
      lastCheckRef.current = stateKey;

      if (typeof window === "undefined") {
        setShouldProcessRedirect(false);
        return;
      }

      if (currentState.isAuthenticating) {
        console.log("[Debug] Skipping: already authenticating");
        setShouldProcessRedirect(false);
        return;
      }

      if (
        currentState.authenticationState !== "unauthenticated" &&
        currentState.authenticationState !== "loading"
      ) {
        console.log("[Debug] Skipping: already authenticated or in progress");
        setShouldProcessRedirect(false);
        return;
      }

      const { isInitialized, isLoggedIn } = currentLiffService.getState();

      if (isInitialized && !isLoggedIn) {
        console.log("[Debug] LIFF initialized but user not logged in - skipping redirect logic");
        setShouldProcessRedirect(false);
        return;
      }

      const timestamp = new Date().toISOString();
      console.log(`🔍 [${timestamp}] Detected LINE authentication redirect`);
      console.log(`🔍 [${timestamp}] Current state:`, {
        authenticationState: currentState.authenticationState,
        isAuthenticating: currentState.isAuthenticating,
        windowHref: window.location.href,
      });

      setShouldProcessRedirect(true);
    };

    checkRedirectConditions();
    
    const interval = setInterval(checkRedirectConditions, 2000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return { shouldProcessRedirect };
};
