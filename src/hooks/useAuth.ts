import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { detectEnvironment } from '@/lib/auth/environment-detector';
import { LiffService } from '@/lib/auth/liff-service';
import { PhoneAuthService } from '@/lib/auth/phone-auth-service';
import { lineAuth } from '@/lib/auth/firebase-config';

export const useAuth = () => {
  const store = useAuthStore();

  useEffect(() => {
    const environment = detectEnvironment();
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID || "";
    const liffService = LiffService.getInstance(liffId);
    const phoneAuthService = PhoneAuthService.getInstance();

    store.setEnvironment(environment);
    store.setServices(liffService, phoneAuthService);

    store.initialize();

    const unsubscribe = lineAuth.onAuthStateChanged(async (user) => {
      store.setFirebaseUser(user);
      
      if (user) {
        const currentState = store.authenticationState;
        if (currentState === "loading" || currentState === "unauthenticated") {
          store.setState("line_authenticated");
        }
      } else {
        if (store.authenticationState !== "loading") {
          store.setState("unauthenticated");
        }
      }
    });

    return () => unsubscribe();
  }, [store]);

  useEffect(() => {
    const interval = setInterval(() => {
      store.checkTokenExpiration();
    }, 60000);

    return () => clearInterval(interval);
  }, [store]);

  return store;
};
