"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";
import { AuthState } from "@/contexts/AuthProvider";

interface UseAutoLoginProps {
  environment: AuthEnvironment;
  state: AuthState;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
}

export const useAutoLogin = ({ environment, state, liffService, setState, refetchUser }: UseAutoLoginProps) => {
  const attemptedRef = useRef(false);
  const stateRef = useRef(state);
  const liffServiceRef = useRef(liffService);
  const setStateRef = useRef(setState);
  const refetchUserRef = useRef(refetchUser);
  
  stateRef.current = state;
  liffServiceRef.current = liffService;
  setStateRef.current = setState;
  refetchUserRef.current = refetchUser;

  useEffect(() => {
    console.log("[Debug] 🔁 useEffect(handleAutoLogin) fired");

    if (environment !== AuthEnvironment.LIFF || attemptedRef.current) {
      return;
    }

    const checkAndPerformAutoLogin = () => {
      const currentState = stateRef.current;
      
      if (
        currentState.authenticationState !== "unauthenticated" ||
        currentState.isAuthenticating
      ) {
        return;
      }

      const handleAutoLogin = async () => {
        attemptedRef.current = true;
        
        const liffState = liffServiceRef.current.getState();
        if (!liffState.isInitialized || !liffState.isLoggedIn) return;

        const timestamp = new Date().toISOString();
        console.log(`🔍 [${timestamp}] Auto-logging in via LIFF`);

        setStateRef.current((prev) => ({ ...prev, isAuthenticating: true }));
        try {
          const success = await liffServiceRef.current.signInWithLiffToken();
          if (success) {
            await refetchUserRef.current();
          }
        } catch (error) {
          console.error("Auto-login with LIFF failed:", error);
        } finally {
          setStateRef.current((prev) => ({ ...prev, isAuthenticating: false }));
        }
      };

      handleAutoLogin();
    };

    const interval = setInterval(checkAndPerformAutoLogin, 3000);
    checkAndPerformAutoLogin();

    return () => {
      clearInterval(interval);
    };
  }, [environment]);

  useEffect(() => {
    if (state.authenticationState !== "unauthenticated") {
      attemptedRef.current = false;
    }
  }, [state.authenticationState]);
};
