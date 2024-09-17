"use client";

import { useLiff } from "@/hooks/useLiff";
import { Button } from "@/app/components/ui/button";
import { signInWithLine } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const LineLoginButton: React.FC = () => {
  const { liffState } = useLiff();
  const { currentUser } = useFirebaseAuth();
  const isLoggedIn = liffState?.isLoggedIn() || !!currentUser;
  const isLoggedInWithLine = currentUser?.providerIds.includes("oidc.line");

  const redirect = async () => {
    await signInWithLine();
  };

  return (
    <Button onClick={redirect} disabled={isLoggedIn} className="mt-2">
      {isLoggedIn && isLoggedInWithLine ? `LINEでログイン済み: ${ currentUser?.displayName }` : isLoggedIn ? "他サービスでログイン済み" : "LINEでログイン"}
    </Button>
  );
};

export default LineLoginButton;
