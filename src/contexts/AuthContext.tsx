"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/gql/graphql";
import { User as AuthUser } from "@firebase/auth";
import { Required } from "utility-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/queries/identity";
import { auth, signInWithLiffToken } from "@/lib/firebase";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";
import { useLiff } from "./LiffContext";

type UserInfo = {
  uid: string | null;
  user: Required<Partial<User>, "id" | "lastName" | "firstName"> | null;
};

type AuthContextType = UserInfo & {
  login: (userInfo: UserInfo | null) => void;
  logout: () => Promise<void>;
  loginWithLiff: () => Promise<void>;
  isAuthenticating: boolean;
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

  const loginWithLiff = async () => {
    if (!liff) {
      return;
    }

    try {
      // console.log("すでにLIFFログインしている場合はIDトークンでFirebase認証を試みる");
      // if (isLiffLoggedIn && liffAccessToken) {
      //   return authenticateWithLiffToken(liffAccessToken);
      // }
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
        login({ uid: user.uid, user: fetchedUser });

        // if (fetchedUser) {
        //   toast.success("ログインしました！");
        //   if (next) {
        //     router.push(next);
        //   }
        // } else {
        //   router.push("/sign-up");
        // }
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

  return (
    <AuthContext.Provider value={{ 
      uid, 
      user, 
      login, 
      logout, 
      loginWithLiff,
      isAuthenticating
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