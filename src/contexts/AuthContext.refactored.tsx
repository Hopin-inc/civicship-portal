"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  GqlCurrentPrefecture,
  GqlUser,
  useCurrentUserQuery,
  useUserSignUpMutation,
} from "@/types/graphql";
import { Required } from "utility-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";
import { useLiff } from "./LiffContext";
import { COMMUNITY_ID } from "@/utils";
import { 
  AuthService, 
  AuthState, 
  AuthStateInfo, 
  AuthErrorType,
  AuthUser
} from "@/services/AuthService";
import { getVerifiedPhoneNumber, phoneVerificationState } from "@/lib/firebase";

const authService = new AuthService();

type UserInfo = {
  uid: string | null;
  user:
    | (Required<Partial<GqlUser>, "id" | "name"> & {
        memberships?: any[];
      })
    | null;
};

type AuthContextType = UserInfo & {
  login: (userInfo: UserInfo | null) => void;
  logout: () => Promise<void>;
  loginWithLiff: () => Promise<void>;
  isAuthenticating: boolean;
  createUser: (
    name: string,
    currentPrefecture: GqlCurrentPrefecture,
    phoneUid?: string | null,
  ) => Promise<Required<Partial<GqlUser>, "id" | "name"> | null>;

  phoneNumber: string | null;
  phoneAuth: {
    isVerifying: boolean;
    verificationId: string | null;
    phoneUid: string | null;
    startPhoneVerification: (phoneNumber: string) => Promise<boolean>;
    verifyPhoneCode: (code: string) => Promise<boolean>;
  };
  isPhoneVerified: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies();
  const { liff, isLiffLoggedIn, liffAccessToken, liffLogin, liffLogout } = useLiff();

  const {
    data: currentUserData,
    loading: gqlLoading,
    refetch,
    error: queryError,
  } = useCurrentUserQuery({
    fetchPolicy: "no-cache",
  });

  const [ready] = useState(() => deferred());
  const [uid, setUid] = useState<UserInfo["uid"]>(null);
  const [user, setUser] = useState<UserInfo["user"]>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isExplicitLogin, setIsExplicitLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.subscribeToAuthChanges((state) => {
      if (state.state === AuthState.AUTHENTICATED && state.user) {
        setUid(state.user.uid);
      } else if (state.state === AuthState.UNAUTHENTICATED) {
        setUid(null);
        setUser(null);
      }

      setIsAuthenticating(
        state.state === AuthState.AUTHENTICATING || 
        state.state === AuthState.LOADING_USER ||
        state.state === AuthState.VERIFYING
      );

      setIsPhoneVerified(state.isPhoneVerified);

      if (state.error) {
        const errorMessage = state.error.message || "認証中にエラーが発生しました";
        
        toast.error(errorMessage, {
          action: state.error.type === AuthErrorType.NETWORK_ERROR
            ? {
                label: "再試行",
                onClick: () => window.location.reload(),
              }
            : state.error.type === AuthErrorType.TOKEN_EXPIRED
              ? {
                  label: "再認証",
                  onClick: () => router.push("/login"),
                }
              : undefined,
          duration: 10000, // 10 seconds
        });
      }
    });

    return () => unsubscribe();
  }, [router]);

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
          memberships: fetchedUser.memberships || ([] as any),
        },
      });
    }
  }, [currentUserData, uid, login]);

  const [userSignUpMutation] = useUserSignUpMutation();

  const startPhoneVerification = async (phoneNumber: string): Promise<boolean> => {
    setIsVerifying(true);
    setPhoneNumber(phoneNumber);
    
    try {
      const success = await authService.startPhoneVerification(phoneNumber);
      if (success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to start phone verification:", error);
      toast.error("電話番号認証の開始に失敗しました");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const verifyPhoneCodeLocal = async (code: string): Promise<boolean> => {
    setIsVerifying(true);
    
    try {
      const success = await authService.verifyPhoneCode(code);

      if (success) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsPhoneVerified(true);
        toast.success("電話番号認証が完了しました");
        router.push("/sign-up");
        return true;
      } else {
        toast.error("認証コードの検証に失敗しました");
        return false;
      }
    } catch (error) {
      console.error("Failed to verify phone code:", error);
      toast.error("認証コードの検証に失敗しました");
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const loginWithLiff = async (): Promise<void> => {
    if (!liff) throw new Error("LIFF is not initialized");

    setIsAuthenticating(true);
    setIsExplicitLogin(true);

    console.log("🔐 loginWithLiff started");

    try {
      await liffLogin();

      if (liffAccessToken) {
        await authService.authenticate({
          provider: 'liff',
          accessToken: liffAccessToken
        });
      }

      const phoneVerified = authService.getAuthState().isPhoneVerified;
      setIsPhoneVerified(phoneVerified);

      console.log("✅ LIFF login completed");
      console.log("📱 Phone verification status set");
    } catch (error) {
      console.error("❌ loginWithLiff encountered an error", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
      setIsExplicitLogin(false);

      console.log("🔚 loginWithLiff finished");
    }
  };

  useEffect(() => {
    const handleAuthStateChanged = async (user: AuthUser | null) => {
      ready.resolve();

      if (user) {
        const next = searchParams.get("next");

        try {
          console.log("Attempting to fetch user data...");
          const result = await refetch();

          if (!result.data.currentUser?.user) {
            throw new Error("User data not found after authentication");
          }

          const fetchedUser = result.data.currentUser?.user ?? null;
          if (fetchedUser) {
            login({
              uid: user.uid,
              user: {
                id: fetchedUser.id,
                name: fetchedUser.name,
                memberships: fetchedUser.memberships || ([] as any),
              },
            });

            if (isExplicitLogin) {
              toast.success("ログインしました！");
              setIsExplicitLogin(false);
            }

            if (next) {
              router.push(next);
            }
          } else {
            console.warn("User data fetch failed after all retries, redirecting to sign-up");
            if (isPhoneVerified) {
              router.push("/sign-up");
            } else {
              router.push("/sign-up/phone-verification");
            }
          }
        } catch (error) {
          console.error("Failed to fetch user data after retries:", error);
          if (isPhoneVerified) {
            router.push("/sign-up");
          } else {
            router.push("/sign-up/phone-verification");
          }
        }
      } else {
        login(null);
      }
      
      setAuthLoading(false);
    };

    const unsubscribe = authService.subscribeToAuthChanges((state) => {
      if (state.state === AuthState.AUTHENTICATED && state.user) {
        handleAuthStateChanged(state.user);
      } else if (state.state === AuthState.UNAUTHENTICATED) {
        handleAuthStateChanged(null);
      }
    });

    return () => unsubscribe();
  }, [ready, refetch, router, searchParams, login, isExplicitLogin, isPhoneVerified]);

  useEffect(() => {
    const attemptAuthWithLiffToken = async () => {
      if (liffAccessToken && isLiffLoggedIn && !uid) {
        await authService.authenticate({
          provider: 'liff',
          accessToken: liffAccessToken
        });
      }
    };

    attemptAuthWithLiffToken();
  }, [liffAccessToken, isLiffLoggedIn, uid]);

  const logout = async () => {
    setIsAuthenticating(true);

    try {
      await authService.logout();
      liffLogout();

      const response = await fetch("/api/logout", { method: "POST" });
      if (!response.ok) {
        console.warn("Backend logout failed:", response.status);
      }

      setUser(null);
      setUid(null);

      toast.success("ログアウトしました");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("ログアウトに失敗しました");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const createUser = async (
    name: string,
    currentPrefecture: GqlCurrentPrefecture,
    phoneUid?: string | null,
  ): Promise<Required<Partial<GqlUser>, "id" | "name"> | null> => {
    try {
      const effectivePhoneUid = phoneUid || phoneVerificationState.phoneUid || undefined;
      const phoneNumber = getVerifiedPhoneNumber();
      console.log("Creating user with phone UID:", effectivePhoneUid);
      if (!phoneNumber) {
        throw new Error("No verified phone number found.");
      }

      const { data } = await userSignUpMutation({
        variables: {
          input: {
            name,
            currentPrefecture: currentPrefecture as any, // Type cast to resolve compatibility issue
            communityId: COMMUNITY_ID,
            phoneUid: effectivePhoneUid,
            phoneNumber,
          },
        },
      });

      return data?.userSignUp?.user ?? null;
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error("ユーザー作成に失敗しました");
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
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
          phoneUid: phoneVerificationState.phoneUid,
          startPhoneVerification,
          verifyPhoneCode: verifyPhoneCodeLocal,
        },
        isPhoneVerified,
        loading: authLoading || gqlLoading,
      }}
    >
      {children}
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
