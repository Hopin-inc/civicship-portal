"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { GqlUser, GqlCurrentPrefecture, useCurrentUserQuery, useUserSignUpMutation } from "@/types/graphql";
import { User as AuthUser } from "@firebase/auth";
import { Required } from "utility-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { auth } from "@/lib/firebase/firebase";
import { setCookies, removeCookies } from "@/contexts/auth/cookie";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";
import { useLiff } from "./LiffContext";
import { COMMUNITY_ID } from "@/utils";
import usePhoneAuth from "@/contexts/auth/phone/usePhoneAuth";
import useLiffAuth from "@/contexts/auth/liff/useLiffAuth";
import useUserManagement from "@/contexts/auth/user/useUserManagement";

type AuthState = {
  phoneVerified: boolean;
  lineAuthenticated: boolean;
  loading: boolean;
  error: string | null;
};

type UserInfo = {
  uid: string | null;
  user: Required<Partial<GqlUser>, "id" | "name"> & {
    memberships?: any[];
  } | null;
};

type AuthContextType = UserInfo & {
  login: (userInfo: UserInfo | null) => void;
  logout: () => Promise<void>;
  loginWithLiff: () => Promise<void>;
  isAuthenticating: boolean;
  createUser: (name: string, currentPrefecture: GqlCurrentPrefecture, phoneUid?: string | null, uid?: string | null) => Promise<Required<Partial<GqlUser>, "id" | "name"> | null>;

  phoneNumber: string | null;
  phoneAuth: {
    isVerifying: boolean;
    verificationId: string | null;
    phoneUid: string | null;
    startPhoneVerification: (phoneNumber: string, uid?: string | null) => Promise<boolean>;
    verifyPhoneCode: (code: string) => Promise<boolean>;
  };
  isPhoneVerified: boolean;
  isLineAuthenticated: boolean;
  authState: AuthState;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies();
  const { liff, isLiffLoggedIn, liffAccessToken, liffLogin, liffLogout } = useLiff();

  const { data: currentUserData, loading: queryLoading, refetch } = useCurrentUserQuery({
    fetchPolicy: "no-cache",
  });

  const [ready] = useState(() => deferred());
  const [uid, setUid] = useState<UserInfo["uid"]>(null);
  const [user, setUser] = useState<UserInfo["user"]>(null);
  
  const [authState, setAuthState] = useState<AuthState>({
    phoneVerified: false,
    lineAuthenticated: false,
    loading: false,
    error: null
  });
  
  const [userSignUpMutation] = useUserSignUpMutation();

  const {
    phoneNumber,
    isVerifying,
    verificationId,
    isPhoneVerified,
    phoneUid,
    startPhoneVerification,
    verifyPhoneCode: verifyPhoneCodeLocal,
    setIsPhoneVerified
  } = usePhoneAuth();

  const {
    isAuthenticating: isLiffAuthenticating,
    isExplicitLogin,
    loginWithLiff,
    handleAuthenticateWithLiffToken,
    setIsExplicitLogin
  } = useLiffAuth(liff, liffLogin);

  const {
    createUser,
    logout,
    isAuthenticating: isUserAuthenticating
  } = useUserManagement(userSignUpMutation, setUser, setUid, liffLogout);

  const isAuthenticating = isLiffAuthenticating || isUserAuthenticating;

  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prevState => ({
      ...prevState,
      ...updates
    }));
    
    if (updates.phoneVerified !== undefined && 
        isPhoneVerified !== updates.phoneVerified && 
        setIsPhoneVerified) {
      console.log("Updating phone verification state:", updates.phoneVerified);
      setIsPhoneVerified(updates.phoneVerified);
    }
  }, [isPhoneVerified, setIsPhoneVerified]);

  const login = useCallback((userInfo: UserInfo | null) => {
    setUid(userInfo?.uid ?? null);
    setUser(userInfo?.user ?? null);
    
    updateAuthState({ 
      lineAuthenticated: !!userInfo?.uid,
      loading: false
    });
  }, [updateAuthState]);

  useEffect(() => {
    if (currentUserData?.currentUser?.user && uid) {
      const fetchedUser = currentUserData.currentUser.user;
      login({
        uid,
        user: {
          id: fetchedUser.id,
          name: fetchedUser.name,
          memberships: fetchedUser.memberships || [] as any,
        },
      });
    }
  }, [currentUserData, uid, login]);

  const [liffAuthFailed, setLiffAuthFailed] = useState(false);

  const prevLiffAccessToken = useRef<string | null>(null);

  const attemptAuthWithLiffToken = useCallback(async () => {
    if (liffAccessToken && 
        isLiffLoggedIn && 
        !uid && 
        !liffAuthFailed && 
        !authState.error) {
      
      const failedTokenKey = `failed_liff_token:${liffAccessToken}`;
      if (typeof window !== "undefined" && localStorage.getItem(failedTokenKey)) {
        console.log("Skipping authentication with previously failed token (from localStorage)");
        return;
      }
      
      if (liffAccessToken === prevLiffAccessToken.current) {
        console.log("Skipping authentication with already attempted token");
        return;
      }
      
      prevLiffAccessToken.current = liffAccessToken;
      
      console.log("Attempting to authenticate with LIFF token");
      updateAuthState({ loading: true });
      try {
        const success = await handleAuthenticateWithLiffToken(liffAccessToken);
        if (success) {
          console.log("LIFF authentication successful");
          updateAuthState({ 
            lineAuthenticated: true,
            loading: false,
            error: null
          });
          setLiffAuthFailed(false);
        } else {
          console.log("LIFF authentication failed but no error thrown");
          setLiffAuthFailed(true);
          updateAuthState({ 
            loading: false,
            error: "LINE認証に失敗しました"
          });
        }
      } catch (error) {
        console.error("LIFF authentication failed with error:", error);
        setLiffAuthFailed(true);
        updateAuthState({ 
          loading: false,
          error: "LINE認証に失敗しました"
        });
      }
    }
  }, [liffAccessToken, isLiffLoggedIn, uid, liffAuthFailed, authState.error, handleAuthenticateWithLiffToken, updateAuthState]);

  useEffect(() => {
    attemptAuthWithLiffToken();
  }, [attemptAuthWithLiffToken]);

  useEffect(() => {
    const handleTokenExpired = (event: Event) => {
      const customEvent = event as CustomEvent;
      console.log("Token expired event detected:", customEvent.detail);

      toast.error(
        "認証の有効期限が切れました。再認証が必要です。",
        {
          action: {
            label: "再認証",
            onClick: () => router.push("/sign-up/phone-verification")
          },
          duration: 10000, // 10 seconds
          id: "auth-token-expired" // Add unique ID
        }
      );
    };

    const handleAuthError = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { errorType, errorMessage } = customEvent.detail;

      console.log("Auth error event detected:", customEvent.detail);

      toast.error(
        errorMessage,
        {
          action: errorType === 'network' ? {
            label: "再試行",
            onClick: () => window.location.reload()
          } : (errorType === 'expired' || errorType === 'auth' || errorType === 'reauth') ? {
            label: "再認証",
            onClick: () => router.push("/login")
          } : undefined,
          duration: 10000, // 10 seconds
          id: `auth-error-${errorType}` // Add unique ID based on error type
        }
      );
    };
    
    const handleAuthWarning = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { warningType, warningMessage } = customEvent.detail;

      console.log("Auth warning event detected:", customEvent.detail);

      toast.warning(
        warningMessage,
        {
          duration: 8000, // 8 seconds
          id: `auth-warning-${warningType}` // Add unique ID to prevent duplicate toasts
        }
      );
      
      if (warningType === 'quota-exceeded') {
        console.log("Quota exceeded warning, but continuing authentication flow");
        if (!authState.lineAuthenticated) {
          updateAuthState({ 
            lineAuthenticated: true,
            loading: false,
            error: null
          });
        }
      }
    };

    window.addEventListener('auth:token-expired', handleTokenExpired);
    window.addEventListener('auth:error', handleAuthError);
    window.addEventListener('auth:token-refresh-failed', handleAuthError);
    window.addEventListener('auth:warning', handleAuthWarning);

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
      window.removeEventListener('auth:error', handleAuthError);
      window.removeEventListener('auth:token-refresh-failed', handleAuthError);
      window.removeEventListener('auth:warning', handleAuthWarning);
    };
  }, [router, updateAuthState]);

  useEffect(() => {
    const isLineAuthenticated = !!uid;
    if (isLineAuthenticated !== authState.lineAuthenticated) {
      console.log("Synchronizing LINE authentication state:", {
        current: isLineAuthenticated,
        central: authState.lineAuthenticated
      });
      updateAuthState({ lineAuthenticated: isLineAuthenticated });
    }
  }, [uid, authState.lineAuthenticated, updateAuthState]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: AuthUser | null) => {
      ready.resolve();

      if (user) {
        updateAuthState({ loading: true });
        const next = searchParams.get("next");
        const idToken = await user.getIdToken();
        
        try {
          const tokenResult = await user.getIdTokenResult();
          setCookies(
            cookies,
            idToken,
            user.refreshToken,
            new Date(tokenResult.expirationTime)
          );
          
          console.log("LINE tokens stored in cookies");
          updateAuthState({ lineAuthenticated: true });
        } catch (error) {
          console.error("Failed to get token expiration time:", error);
          cookies.set("access_token", idToken);
          if (user.refreshToken) {
            cookies.set("refresh_token", user.refreshToken);
          }
          
          updateAuthState({ lineAuthenticated: true });
        }

        try {
          const { data } = await refetch();
          const fetchedUser = data.currentUser?.user ?? null;
          if (fetchedUser) {
            login({
              uid: user.uid,
              user: {
                id: fetchedUser.id,
                name: fetchedUser.name,
                memberships: fetchedUser.memberships || [] as any,
              },
            });

            if (isExplicitLogin) {
              toast.success("ログインしました！", {
                id: "login-success"
              });
              setIsExplicitLogin(false); // フラグをリセットして再表示を防止
            }

            if (next) {
              router.push(next);
            }
          } else {
            console.log("User authenticated but no user record found");
            
            updateAuthState({ 
              lineAuthenticated: true,
              loading: false
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          updateAuthState({ 
            loading: false,
            error: "ユーザー情報の取得に失敗しました"
          });
          
          toast.error("ユーザー情報の取得に失敗しました", {
            action: {
              label: "再試行",
              onClick: () => window.location.reload()
            },
            duration: 10000,
            id: "user-fetch-error"
          });
        } finally {
          updateAuthState({ loading: false });
        }
      } else {
        login(null);
        removeCookies(cookies);
        removeCookies(cookies, "phone");
        updateAuthState({
          phoneVerified: false,
          lineAuthenticated: false,
          loading: false,
          error: null
        });
      }
    });

    return () => unsubscribe();
  }, [ready, cookies, refetch, router, searchParams, login, isExplicitLogin, authState.phoneVerified, setIsExplicitLogin, updateAuthState]);

  const verifyPhoneCode = async (code: string): Promise<boolean> => {
    updateAuthState({ loading: true });
    try {
      const success = await verifyPhoneCodeLocal(code);
      if (success) {
        updateAuthState({ 
          phoneVerified: true,
          loading: false,
          error: null
        });
        return true;
      } else {
        updateAuthState({ 
          loading: false,
          error: "認証コードの検証に失敗しました"
        });
        return false;
      }
    } catch (error) {
      console.error("Phone verification failed:", error);
      updateAuthState({ 
        loading: false,
        error: "認証コードの検証中にエラーが発生しました"
      });
      return false;
    }
  };
  
  const loginWithLiffWrapper = async (): Promise<void> => {
    updateAuthState({ loading: true });
    try {
      await loginWithLiff();
      if (liffAccessToken && isLiffLoggedIn) {
        updateAuthState({ 
          lineAuthenticated: true,
          loading: false,
          error: null
        });
      } else {
        updateAuthState({ 
          loading: false,
          error: "LINE認証に失敗しました"
        });
      }
    } catch (error) {
      console.error("LIFF login failed:", error);
      updateAuthState({ 
        loading: false,
        error: "LINE認証に失敗しました"
      });
    }
  };

  return (
    <AuthContext.Provider value={ {
      uid,
      user,
      login,
      logout,
      loginWithLiff: loginWithLiffWrapper,
      isAuthenticating: isAuthenticating || authState.loading,
      createUser: (name, currentPrefecture, phoneUid) => createUser(name, currentPrefecture, phoneUid, uid),

      phoneNumber,
      phoneAuth: {
        isVerifying,
        verificationId,
        phoneUid,
        startPhoneVerification,
        verifyPhoneCode,
      },
      isPhoneVerified: authState.phoneVerified,
      isLineAuthenticated: authState.lineAuthenticated,
      authState,
    } }>
      { children }
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
