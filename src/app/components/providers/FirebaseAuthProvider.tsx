"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { CurrentUser } from "@/types";
import { auth } from "@/lib/firebase";
import { FirebaseAuthContext } from "@/contexts/FirebaseAuthContext";
import { User } from "@firebase/auth";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";

const FirebaseAuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const cookies = useCookies();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      console.log("user", user);
      if (user) {
        const idToken = await user.getIdToken();
        console.log("uid", user.uid);
        setCurrentUser({
          uid: user.uid,
          providerIds: user.providerData.map(e => e.providerId),
          displayName: user.displayName,
        });
        cookies.set("access_token", idToken);
        router.replace("/");
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseAuthContext.Provider value={{ currentUser }}>
      {!loading ? children : <p>Loading...</p>}
    </FirebaseAuthContext.Provider>
  );
};
export default FirebaseAuthProvider;
