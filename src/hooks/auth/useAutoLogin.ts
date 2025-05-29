"use client";

import { useEffect } from "react";
import { LiffService } from "@/lib/auth/liff-service";
import { AuthEnvironment } from "@/lib/auth/environment-detector";

export const useAutoLogin = (
  authenticationState: string,
  isAuthenticating: boolean,
  environment: AuthEnvironment,
  liffService: LiffService,
  setIsAuthenticating: (value: boolean) => void,
  refetchUser: () => Promise<any>
) => {
  useEffect(() => {
    const hookTimestamp = new Date().toISOString();
    console.log(`🔄 [${hookTimestamp}] useAutoLogin hook initialized, authState=${authenticationState}, isAuthenticating=${isAuthenticating}, environment=${environment}`);
    
    const handleAutoLogin = async () => {
      const fnTimestamp = new Date().toISOString();
      console.log(`👀 [${fnTimestamp}] handleAutoLogin started! authState=${authenticationState}, isAuthenticating=${isAuthenticating}, environment=${environment}`);
      
      if (environment !== AuthEnvironment.LIFF) {
        console.log(`🔄 [${fnTimestamp}] Early return: environment is not LIFF (${environment})`);
        return;
      }
      
      if (authenticationState !== "unauthenticated") {
        console.log(`🔄 [${fnTimestamp}] Early return: authState is ${authenticationState}, not 'unauthenticated'`);
        return;
      }
      
      if (isAuthenticating) {
        console.log(`🔄 [${fnTimestamp}] Early return: isAuthenticating is already true`);
        return;
      }
      
      console.log(`👀 [${fnTimestamp}] handleAutoLogin continue condition met!`);

      const liffState = liffService.getState();
      if (!liffState.isInitialized || !liffState.isLoggedIn) {
        console.log(`🔄 [${fnTimestamp}] Early return: LIFF not initialized (${liffState.isInitialized}) or not logged in (${liffState.isLoggedIn})`);
        return;
      }

      console.log(`🔍 [${fnTimestamp}] Auto-logging in via LIFF`);

      console.log(`🔄 [${fnTimestamp}] About to set isAuthenticating=true`);
      setIsAuthenticating(true);
      console.log(`🔍 [${fnTimestamp}] Starting auto-login processing - blocking other auth initialization`);
      
      try {
        const success = await liffService.signInWithLiffToken();
        console.log(`🔄 [${fnTimestamp}] signInWithLiffToken result: ${success}`);
        
        if (success) {
          console.log(`🔄 [${fnTimestamp}] Auto-login successful - refreshing user data`);
          await refetchUser();
        } else {
          console.log(`🔄 [${fnTimestamp}] Auto-login failed - no success from signInWithLiffToken`);
        }
      } catch (error) {
        console.error(`🔄 [${fnTimestamp}] Auto-login failed with error:`, error);
      } finally {
        console.log(`🔄 [${fnTimestamp}] Setting isAuthenticating=false`);
        setIsAuthenticating(false);
      }
    };

    handleAutoLogin();
  }, [environment, authenticationState, isAuthenticating, liffService, refetchUser, setIsAuthenticating]);
};
