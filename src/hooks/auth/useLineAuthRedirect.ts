"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";

export const useLineAuthRedirect = (
  authenticationState: string,
  isAuthenticating: boolean,
  environment: AuthEnvironment,
  liffService: LiffService,
  setIsAuthenticating: (value: boolean) => void,
  refetchUser: () => Promise<any>
) => {
  const searchParams = useSearchParams();
  const hasProcessedRedirect = useRef(false);

  useEffect(() => {
    const hookTimestamp = new Date().toISOString();
    console.log(`🔄 [${hookTimestamp}] useLineAuthRedirect hook initialized, authState=${authenticationState}, isAuthenticating=${isAuthenticating}`);
    
    const handleLineAuthRedirect = async () => {
      const fnTimestamp = new Date().toISOString();
      console.log(`👀 [${fnTimestamp}] handleLineAuthRedirect started! authState=${authenticationState}, isAuthenticating=${isAuthenticating}`);
      
      if (typeof window === "undefined") {
        console.log(`🔄 [${fnTimestamp}] Early return: window is undefined`);
        return;
      }
      
      if (isAuthenticating) {
        console.log(`🔄 [${fnTimestamp}] Early return: isAuthenticating is already true`);
        return;
      }
      
      if (hasProcessedRedirect.current) {
        console.log(`🔄 [${fnTimestamp}] Early return: hasProcessedRedirect is already true`);
        return;
      }

      const isReturnFromLineAuth = searchParams.has("code") && searchParams.has("state") && searchParams.has("liffClientId");
      if (!isReturnFromLineAuth) {
        console.log(`🔄 [${fnTimestamp}] Early return: not a LINE auth redirect`);
        return;
      }
      
      console.log(`👀 [${fnTimestamp}] handleLineAuthRedirect continue condition met!`);

      if (authenticationState !== "unauthenticated" && authenticationState !== "loading") {
        console.log(`🔄 [${fnTimestamp}] Early return: authState is ${authenticationState}, not 'unauthenticated' or 'loading'`);
        return;
      }

      hasProcessedRedirect.current = true;
      console.log(`🔄 [${fnTimestamp}] Set hasProcessedRedirect to true`);

      console.log(`🔍 [${fnTimestamp}] Detected LINE authentication redirect`);
      console.log(`🔍 [${fnTimestamp}] Current state:`, {
        authenticationState,
        isAuthenticating,
        environment,
        windowHref: window.location.href,
        urlParams: {
          hasCode: searchParams.has("code"),
          hasState: searchParams.has("state"),
          hasLiffClientId: searchParams.has("liffClientId")
        }
      });

      console.log(`🔄 [${fnTimestamp}] About to set isAuthenticating=true`);
      setIsAuthenticating(true);
      console.log(`🔍 [${fnTimestamp}] Starting LINE authentication processing - blocking other auth initialization`);

      try {
        const liffSuccess = await liffService.initialize();
        if (liffSuccess) {
          console.log(`👀 [${fnTimestamp}] handleLineAuthRedirect liffSuccess!`);
          const liffState = liffService.getState();
          console.log(`🔍 [${fnTimestamp}] LIFF state after initialization:`, {
            isInitialized: liffState.isInitialized,
            isLoggedIn: liffState.isLoggedIn,
            userId: liffState.profile?.userId || "none",
            accessToken: liffService.getAccessToken() ? "present" : "missing"
          });

          if (liffState.isLoggedIn) {
            const success = await liffService.signInWithLiffToken();
            console.log(`🔍 [${fnTimestamp}] signInWithLiffToken result:`, success);

            if (success) {
              console.log(`🔍 [${fnTimestamp}] LINE authentication successful - refreshing user data`);
              await refetchUser();
            } else {
              console.error(`🔍 [${fnTimestamp}] Failed to complete LINE authentication with LIFF token`);
            }
          } else {
            console.log(`🔍 [${fnTimestamp}] LIFF not logged in after initialization`);
          }
        } else {
          console.error(`🔍 [${fnTimestamp}] LIFF initialization failed during redirect completion`);
        }
      } catch (error) {
        console.error(`🔍 [${fnTimestamp}] Error during LINE authentication completion:`, error);
      } finally {
        setIsAuthenticating(false);
      }
    };

    handleLineAuthRedirect();
  }, [authenticationState, isAuthenticating, environment, liffService, refetchUser, setIsAuthenticating, searchParams]);
};
