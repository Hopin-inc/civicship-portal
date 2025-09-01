import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { detectEnvironment } from '@/lib/auth/environment-detector';
import { LiffService } from '@/lib/auth/liff-service';
import { PhoneAuthService } from '@/lib/auth/phone-auth-service';
import { lineAuth } from '@/lib/auth/firebase-config';

export const useAuth = () => {
  const store = useAuthStore();
  const initializeRef = useRef(false);
  
  const { 
    setEnvironment, 
    setServices, 
    initialize, 
    setFirebaseUser, 
    setState, 
    authenticationState,
    checkTokenExpiration 
  } = store;

  useEffect(() => {
    if (initializeRef.current) return;
    initializeRef.current = true;

    const environment = detectEnvironment();
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
    const liffService = LiffService.getInstance(liffId);
    const phoneAuthService = PhoneAuthService.getInstance();

    setEnvironment(environment);
    setServices(liffService, phoneAuthService);
    initialize();

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        const currentState = authenticationState;
        if (currentState === "loading" || currentState === "unauthenticated") {
          setState("line_authenticated");
        }
      } else {
        if (authenticationState !== "loading") {
          setState("unauthenticated");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(interval);
  }, [checkTokenExpiration]);

  return store;
};
