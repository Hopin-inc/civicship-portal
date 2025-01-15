"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { CurrentUser } from "@/types";
import { auth } from "@/lib/firebase";
import { FirebaseAuthContext } from "@/contexts/FirebaseAuthContext";
import { User } from "@firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "@/graphql/queries/identity";
import { toast } from "sonner";
import { deferred } from "@/utils/defer";

const FirebaseAuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const cookies = useCookies();

  const [ready] = useState(() => deferred());
  const [currentUser, setCurrentUser] = useState<CurrentUser | null | undefined>(undefined);

  const { refetch } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      ready.resolve();
      if (user) {
        const next = searchParams.get("next");
        const idToken = await user.getIdToken();
        cookies.set("access_token", idToken);

        const { data } = await refetch();
        const fetchedUser = data.currentUser?.user ?? null;

        setCurrentUser({
          uid: user.uid,
          providerIds: user.providerData.map((e) => e.providerId),
          displayName: user.displayName,
          user: fetchedUser,
        });

        if (fetchedUser) {
          toast.success("ログインしました！");
          if (next) {
            router.push(next);
          } else {
            router.push("/");
          }
        } else {
          router.push("/sign-up");
        }
      } else {
        setCurrentUser(null);
        cookies.remove("access_token");
      }
    });
    return () => unsubscribe();
  }, [auth, ready]);

  return (
    <FirebaseAuthContext.Provider value={{ ready, currentUser }}>
      {children}
    </FirebaseAuthContext.Provider>
  );
};
export default FirebaseAuthProvider;
