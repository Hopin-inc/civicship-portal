"use client";

import { Button } from "@/app/components/ui/button";
import { signInWithLine } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { displayName } from "@/utils";
import { Suspense } from "react";
import { useLoading } from "@/hooks/useLoading";

const LineLoginButton: React.FC = () => {
  const { currentUser } = useFirebaseAuth();
  const { setIsLoading } = useLoading();
  const isLoggedIn = !!currentUser;
  const isLoggedInWithLine = currentUser?.providerIds.includes("oidc.line");
  const user = currentUser?.user;

  const signIn = async () => {
    setIsLoading(true);
    await signInWithLine();
    setIsLoading(false);
  }

  return (
    <Suspense fallback={<p>loading</p>}>
      <Button onClick={signIn} disabled={isLoggedIn} className="mt-2">
        {isLoggedIn && isLoggedInWithLine
          ? `LINEでログイン済み: ${displayName(user)}`
          : isLoggedIn
            ? "他サービスでログイン済み"
            : "LINEでログイン"}
      </Button>
    </Suspense>
  );
};

export default LineLoginButton;
