import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { User } from 'firebase/auth';
import { GqlCurrentUserPayload } from '@/types/graphql';
import { AuthEnvironment } from '@/lib/auth/environment-detector';
import { TokenManager, AuthTokens, PhoneAuthTokens } from '@/lib/auth/token-manager';
import { LiffService } from '@/lib/auth/liff-service';
import { PhoneAuthService } from '@/lib/auth/phone-auth-service';
import { lineAuth } from '@/lib/auth/firebase-config';
import { apolloClient } from '@/lib/apollo';
import { GET_CURRENT_USER } from '@/graphql/account/identity/query';
import { logger } from '@/lib/logging';

export type AuthenticationState =
  | "unauthenticated"
  | "line_authenticated" 
  | "line_token_expired"
  | "phone_authenticated"
  | "phone_token_expired"
  | "user_registered"
  | "loading";

interface AuthState {
  authenticationState: AuthenticationState;
  firebaseUser: User | null;
  currentUser: GqlCurrentUserPayload["user"] | null;
  environment: AuthEnvironment;
  isAuthenticating: boolean;
  
  liffService: LiffService | null;
  phoneAuthService: PhoneAuthService | null;
  
  initialize: () => Promise<void>;
  setState: (state: AuthenticationState) => void;
  setFirebaseUser: (user: User | null) => void;
  setCurrentUser: (user: GqlCurrentUserPayload["user"] | null) => void;
  setIsAuthenticating: (isAuthenticating: boolean) => void;
  setEnvironment: (environment: AuthEnvironment) => void;
  setServices: (liffService: LiffService | null, phoneAuthService: PhoneAuthService | null) => void;
  
  loginWithLiff: (redirectPath?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  startPhoneVerification: (phoneNumber: string) => Promise<string | null>;
  verifyPhoneCode: (verificationCode: string) => Promise<boolean>;
  createUser: (name: string, prefecture: any, phoneUid: string | null) => Promise<User | null>;
  
  checkTokenExpiration: () => Promise<void>;
  renewTokens: () => Promise<void>;
  checkUserRegistration: () => Promise<boolean>;
  syncFirebaseTokens: (user: User) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  subscribeWithSelector((set, get) => ({
    authenticationState: "loading",
    firebaseUser: null,
    currentUser: null,
    environment: "regular_browser" as AuthEnvironment,
    isAuthenticating: false,
    liffService: null,
    phoneAuthService: null,

    setState: (state: AuthenticationState) => {
      set({ authenticationState: state });
      logger.debug("Auth state changed", { 
        newState: state,
        component: "AuthStore" 
      });
    },

    setFirebaseUser: (user: User | null) => {
      set({ firebaseUser: user });
      if (user) {
        setTimeout(() => {
          get().syncFirebaseTokens(user);
        }, 0);
      } else {
        TokenManager.clearLineTokens();
      }
    },

    setCurrentUser: (user: GqlCurrentUserPayload["user"] | null) => {
      set({ currentUser: user });
    },

    setIsAuthenticating: (isAuthenticating: boolean) => {
      set({ isAuthenticating });
    },

    setEnvironment: (environment: AuthEnvironment) => {
      set({ environment });
    },

    setServices: (liffService: LiffService | null, phoneAuthService: PhoneAuthService | null) => {
      set({ liffService, phoneAuthService });
    },

    initialize: async () => {
      const startTime = performance.now();
      logger.debug("Auth initialization started", {
        component: "AuthStore",
        timestamp: new Date().toISOString(),
      });

      try {
        get().setState("loading");
        get().setIsAuthenticating(true);

        const lineTokens = TokenManager.getLineTokens();
        const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());

        if (!hasValidLineToken) {
          get().setState("unauthenticated");
          const endTime = performance.now();
          logger.debug("Auth initialization completed (no valid line token)", {
            component: "AuthStore",
            duration: `${(endTime - startTime).toFixed(2)}ms`,
          });
          return;
        }

        const isUserRegistered = await get().checkUserRegistration();
        if (isUserRegistered) {
          get().setState("user_registered");
          const endTime = performance.now();
          logger.debug("Auth initialization completed (user registered)", {
            component: "AuthStore",
            duration: `${(endTime - startTime).toFixed(2)}ms`,
          });
          return;
        }

        const phoneTokens = TokenManager.getPhoneTokens();
        const hasValidPhoneToken = phoneTokens.accessToken && !(await TokenManager.isPhoneTokenExpired());

        if (hasValidPhoneToken) {
          get().setState("phone_authenticated");
        } else {
          get().setState("line_authenticated");
        }

        const endTime = performance.now();
        logger.debug("Auth initialization completed", {
          component: "AuthStore",
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          finalState: get().authenticationState,
        });
      } catch (error) {
        const endTime = performance.now();
        logger.error("Auth initialization failed", {
          component: "AuthStore",
          duration: `${(endTime - startTime).toFixed(2)}ms`,
          error: error instanceof Error ? error.message : String(error),
        });
        get().setState("unauthenticated");
      } finally {
        get().setIsAuthenticating(false);
      }
    },

    checkUserRegistration: async (): Promise<boolean> => {
      try {
        if (!lineAuth.currentUser) return false;

        const accessToken = await lineAuth.currentUser.getIdToken();
        const { data } = await apolloClient.query({
          query: GET_CURRENT_USER,
          fetchPolicy: "network-only",
          context: {
            headers: {
              Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
          },
        });

        const isRegistered = data?.currentUser?.user != null;
        if (isRegistered) {
          get().setCurrentUser(data.currentUser.user);
        }
        return isRegistered;
      } catch (error) {
        logger.info("Failed to check user registration", {
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStore",
        });
        return false;
      }
    },

    syncFirebaseTokens: async (user: User) => {
      try {
        const idToken = await user.getIdToken();
        const refreshToken = user.refreshToken;
        const tokenResult = await user.getIdTokenResult();
        const expirationTime = new Date(tokenResult.expirationTime).getTime();

        TokenManager.saveLineTokens({
          accessToken: idToken,
          refreshToken: refreshToken,
          expiresAt: expirationTime,
        });
      } catch (error) {
        logger.info("Failed to sync Firebase tokens", {
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStore",
        });
      }
    },

    loginWithLiff: async (redirectPath?: string): Promise<boolean> => {
      const { liffService } = get();
      if (!liffService) return false;

      get().setIsAuthenticating(true);

      try {
        await liffService.initialize();
        const loggedIn = await liffService.login(redirectPath as any);
        if (!loggedIn) return false;

        const success = await liffService.signInWithLiffToken();
        if (success) {
          await get().checkUserRegistration();
        }
        return success;
      } catch (error) {
        logger.info("LIFF login failed", {
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStore",
        });
        return false;
      } finally {
        get().setIsAuthenticating(false);
      }
    },

    logout: async () => {
      const { liffService, phoneAuthService } = get();
      
      try {
        liffService?.logout();
        await lineAuth.signOut();
        phoneAuthService?.reset();
        TokenManager.clearAllTokens();

        set({
          firebaseUser: null,
          currentUser: null,
          authenticationState: "unauthenticated",
        });
      } catch (error) {
        logger.warn("Logout process failed", {
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStore",
        });
      }
    },

    startPhoneVerification: async (phoneNumber: string): Promise<string | null> => {
      const { phoneAuthService } = get();
      return phoneAuthService ? await phoneAuthService.startPhoneVerification(phoneNumber) : null;
    },

    verifyPhoneCode: async (verificationCode: string): Promise<boolean> => {
      const { phoneAuthService } = get();
      if (!phoneAuthService) return false;

      const success = await phoneAuthService.verifyPhoneCode(verificationCode);
      if (success) {
        get().setState("phone_authenticated");
      }
      return success;
    },

    createUser: async (name: string, prefecture: any, phoneUid: string | null): Promise<User | null> => {
      try {
        const lineTokens = TokenManager.getLineTokens();
        const phoneTokens = TokenManager.getPhoneTokens();

        if (!lineTokens.accessToken || !phoneUid) {
          throw new Error("Required tokens or phone UID missing");
        }

        get().setState("user_registered");
        await get().checkUserRegistration();
        
        return lineAuth.currentUser;
      } catch (error) {
        logger.error("Failed to create user", {
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStore",
        });
        return null;
      }
    },

    checkTokenExpiration: async () => {
      const lineExpired = await TokenManager.isLineTokenExpired();
      const phoneExpired = await TokenManager.isPhoneTokenExpired();
      
      const currentState = get().authenticationState;
      
      if (lineExpired && (currentState === "line_authenticated" || currentState === "user_registered")) {
        get().setState("line_token_expired");
      }
      
      if (phoneExpired && currentState === "phone_authenticated") {
        get().setState("phone_token_expired");
      }
    },

    renewTokens: async () => {
      try {
        const currentState = get().authenticationState;
        
        if (currentState === "line_token_expired") {
          const renewed = await TokenManager.renewLineToken();
          if (renewed) {
            const isUserRegistered = await get().checkUserRegistration();
            if (isUserRegistered) {
              get().setState("user_registered");
            } else {
              get().setState("line_authenticated");
            }
          } else {
            get().setState("unauthenticated");
          }
        }
        
        if (currentState === "phone_token_expired") {
          const renewed = await TokenManager.renewPhoneToken();
          if (renewed) {
            get().setState("phone_authenticated");
          } else {
            const lineTokens = TokenManager.getLineTokens();
            const hasValidLineToken = lineTokens.accessToken && !(await TokenManager.isLineTokenExpired());
            if (hasValidLineToken) {
              get().setState("line_authenticated");
            } else {
              get().setState("unauthenticated");
            }
          }
        }
      } catch (error) {
        logger.error("Token renewal failed", {
          error: error instanceof Error ? error.message : String(error),
          component: "AuthStore",
        });
      }
    },
  }))
);
