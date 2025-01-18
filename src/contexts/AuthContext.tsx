"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/gql/graphql";
import { User as AuthUser } from "@firebase/auth";
import { Required } from "utility-types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/queries/identity";
import { auth } from "@/lib/firebase";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";

type UserInfo = {
  uid: string | null;
  user: Required<Partial<User>, "id" | "lastName" | "firstName"> | null;
};

type AuthContextType = UserInfo & {
  login: (userInfo: UserInfo | null) => void;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies();

  const { refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "no-cache",
  });

  const [ready] = useState(() => deferred());
  const [uid, setUid] = useState<UserInfo["uid"]>(null);
  const [user, setUser] = useState<UserInfo["user"]>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: AuthUser | null) => {
      ready.resolve();
      if (user) {
        const next = searchParams.get("next");
        const idToken = await user.getIdToken();
        cookies.set("access_token", idToken);

        const { data } = await refetch();
        const fetchedUser = data.currentUser?.user ?? null;
        login({ uid: user.uid, user: fetchedUser });

        if (fetchedUser) {
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
    try {
      const response = await fetch("/api/logout", { method: "POST" });
      if (response.ok) {
        setUser(null);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ uid, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
