"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { GqlUser, GqlCurrentPrefecture, useCurrentUserQuery, useUserSignUpMutation } from "@/types/graphql";
import { User as AuthUser } from "@firebase/auth";
import { Required } from "utility-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import {
  auth,
  phoneVerificationState,
} from "@/lib/firebase/firebase";
import { isPhoneVerified as checkPhoneVerified } from "@/contexts/auth/phone/utils";
import { setCookies, removeCookies } from "@/contexts/auth/cookie";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";
import { useLiff } from "./LiffContext";
import { COMMUNITY_ID } from "@/utils";
import usePhoneAuth from "@/contexts/auth/phone/usePhoneAuth";
import useLiffAuth from "@/contexts/auth/liff/useLiffAuth";
import useUserManagement from "@/contexts/auth/user/useUserManagement";

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
  createUser: (name: string, currentPrefecture: GqlCurrentPrefecture, phoneUid?: string | null) => Promise<Required<Partial<GqlUser>, "id" | "name"> | null>;

  phoneNumber: string | null;
  phoneAuth: {
    isVerifying: boolean;
    verificationId: string | null;
    phoneUid: string | null;
    startPhoneVerification: (phoneNumber: string) => Promise<boolean>;
    verifyPhoneCode: (code: string) => Promise<boolean>;
  };
  isPhoneVerified: boolean;
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

  const login = useCallback((userInfo: UserInfo | null) => {
    setUid(userInfo?.uid ?? null);
    setUser(userInfo?.user ?? null);
  }, []);

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

  useEffect(() => {
    const attemptAuthWithLiffToken = async () => {
      if (liffAccessToken && isLiffLoggedIn && !uid) {
        await handleAuthenticateWithLiffToken(liffAccessToken);
      }
    };

    attemptAuthWithLiffToken();
  }, [liffAccessToken, isLiffLoggedIn, uid, handleAuthenticateWithLiffToken]);

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
        }
      );
    };

    window.addEventListener('auth:token-expired', handleTokenExpired);
    window.addEventListener('auth:error', handleAuthError);
    window.addEventListener('auth:token-refresh-failed', handleAuthError);

    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
      window.removeEventListener('auth:error', handleAuthError);
      window.removeEventListener('auth:token-refresh-failed', handleAuthError);
    };
  }, [router]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: AuthUser | null) => {
      ready.resolve();

      if (user) {
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
        } catch (error) {
          console.error("Failed to get token expiration time:", error);
          cookies.set("access_token", idToken);
          if (user.refreshToken) {
            cookies.set("refresh_token", user.refreshToken);
          }
        }

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
            toast.success("ログインしました！");
            setIsExplicitLogin(false); // フラグをリセットして再表示を防止
          }

          if (next) {
            router.push(next);
          }
        } else {
          if (isPhoneVerified || checkPhoneVerified()) {
            router.push("/sign-up");
          } else {
            router.push("/sign-up/phone-verification");
          }
        }
      } else {
        login(null);
        cookies.remove("access_token");
        cookies.remove("refresh_token");
        cookies.remove("token_expires_at");
        cookies.remove("phone_auth_token");
        cookies.remove("phone_refresh_token");
      }
    });

    return () => unsubscribe();
  }, [ready, cookies, refetch, router, searchParams, login, isExplicitLogin, isPhoneVerified, setIsExplicitLogin]);

  return (
    <AuthContext.Provider value={ {
      uid,
      user,
      login,
      logout,
      loginWithLiff,
      isAuthenticating,
      createUser,

      phoneNumber,
      phoneAuth: {
        isVerifying,
        verificationId,
        phoneUid,
        startPhoneVerification,
        verifyPhoneCode: verifyPhoneCodeLocal,
      },
      isPhoneVerified,
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
