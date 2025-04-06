"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, CurrentPrefecture, IdentityPlatform } from "@/gql/graphql";
import { User as AuthUser } from "@firebase/auth";
import { Required } from "utility-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useQuery, useMutation } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/queries/identity";
import { USER_SIGN_UP } from "@/graphql/mutations/identity";
import { auth, signInWithLiffToken } from "@/lib/firebase";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";
import { useLiff } from "./LiffContext";

type UserInfo = {
  uid: string | null;
  user: Required<Partial<User>, "id" | "name"> | null;
};

type AuthContextType = UserInfo & {
  login: (userInfo: UserInfo | null) => void;
  logout: () => Promise<void>;
  loginWithLiff: () => Promise<void>;
  isAuthenticating: boolean;
  createUser: (name: string, currentPrefecture: CurrentPrefecture) => Promise<Required<Partial<User>, "id" | "name"> | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies();
  const { liff, isLiffLoggedIn, liffAccessToken, liffLogin, liffLogout } = useLiff();

  const { refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "no-cache",
  });

  const [ready] = useState(() => deferred());
  const [uid, setUid] = useState<UserInfo["uid"]>(null);
  const [user, setUser] = useState<UserInfo["user"]>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [userSignUpMutation] = useMutation(USER_SIGN_UP);

  const loginWithLiff = async () => {
    if (!liff) {
      return;
    }

    try {
      await liffLogin();
    } catch (error) {
      console.error("LIFF login failed:", error);
      toast.error("LINEログインに失敗しました");
    }
  };

  const handleAuthenticateWithLiffToken = async (accessToken: string): Promise<boolean> => {
    setIsAuthenticating(true);
    
    try {
      const success = await signInWithLiffToken(accessToken);
      if (!success) {
        toast.error("認証に失敗しました");
      }
      return success;
    } catch (error) {
      toast.error("認証に失敗しました");
      return false;
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    const attemptAuthWithLiffToken = async () => {
      if (liffAccessToken && isLiffLoggedIn && !uid) {
        console.log("すでにLIFFログインしている場合はIDトークンでFirebase認証を試みる");
        await handleAuthenticateWithLiffToken(liffAccessToken);
      }
    };
    
    attemptAuthWithLiffToken();
  }, [liffAccessToken, isLiffLoggedIn, uid]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: AuthUser | null) => {
      ready.resolve();
      
      if (user) {
        const next = searchParams.get("next");
        const idToken = await user.getIdToken();
        cookies.set("access_token", idToken);

        const { data } = await refetch();
        const fetchedUser = data.currentUser?.user ?? null;
        console.log("fetchedUser", fetchedUser);
        if (fetchedUser) {
          login({ 
            uid: user.uid, 
            user: {
              id: fetchedUser.id,
              name: fetchedUser.name
            }
          });
          toast.success("ログインしました！");
          if (next) {
            router.push(next);
          }
        } else {
          router.push("/sign-up");
        }
      } else {
        login(null);
        cookies.remove("access_token");
      }
    });
    
    return () => unsubscribe();
  }, [auth, ready]);

  const login = (userInfo: UserInfo | null) => {
    setUid(userInfo?.uid ?? null);
    setUser(userInfo?.user ?? null);
  };

  const logout = async () => {
    setIsAuthenticating(true);
    
    try {
      await auth.signOut();
      
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

  const createUser = async (name: string, currentPrefecture: CurrentPrefecture): Promise<Required<Partial<User>, "id" | "name"> | null> => {
    try {
      const { data } = await userSignUpMutation({
        variables: {
          input: {
            name,
            currentPrefecture
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
    <AuthContext.Provider value={{ 
      uid, 
      user, 
      login, 
      logout, 
      loginWithLiff,
      isAuthenticating,
      createUser
    }}>
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