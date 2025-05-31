"use client";

import { useEffect, useRef } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthState } from "@/contexts/AuthProvider";

interface UseLineAuthProcessingProps {
  shouldProcessRedirect: boolean;
  liffService: LiffService;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  refetchUser: () => Promise<any>;
}

export const useLineAuthProcessing = ({ shouldProcessRedirect, liffService, setState, refetchUser }: UseLineAuthProcessingProps) => {
  const processedRef = useRef(false);
  const liffServiceRef = useRef(liffService);
  const setStateRef = useRef(setState);
  const refetchUserRef = useRef(refetchUser);
  
  liffServiceRef.current = liffService;
  setStateRef.current = setState;
  refetchUserRef.current = refetchUser;

  useEffect(() => {
    console.log("[Debug] 🔥 useLineAuthProcessing fired.");
    
    if (!shouldProcessRedirect || processedRef.current) return;

    const handleLineAuthRedirect = async () => {
      processedRef.current = true;
      setStateRef.current((prev) => ({ ...prev, isAuthenticating: true }));

      try {
        const initialized = await liffServiceRef.current.initialize();
        if (!initialized) {
          console.error("LIFF init failed");
          return;
        }

        const { isLoggedIn, profile } = liffServiceRef.current.getState();
        console.log("LIFF State:", {
          isInitialized: true,
          isLoggedIn,
          userId: profile?.userId || "none",
        });

        if (!isLoggedIn) {
          console.log("User not logged in via LIFF");
          return;
        }

        const success = await liffServiceRef.current.signInWithLiffToken();
        if (!success) {
          console.error("signInWithLiffToken failed");
          return;
        }

        console.log("LINE auth successful. Refetching user...");
        await refetchUserRef.current();
      } catch (err) {
        console.error("Error during LINE auth:", err);
      } finally {
        setStateRef.current((prev) => ({ ...prev, isAuthenticating: false }));
      }
    };

    handleLineAuthRedirect();
  }, [shouldProcessRedirect]);

  useEffect(() => {
    if (!shouldProcessRedirect) {
      processedRef.current = false;
    }
  }, [shouldProcessRedirect]);
};
