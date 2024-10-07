"use client";

import { Button } from "@/app/components/ui/button";
import { signInWithLine } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { displayName } from "@/utils";
import { useLoading } from "@/hooks/useLoading";

const SignUpWithLineButton: React.FC = () => {
  const { currentUser } = useFirebaseAuth();
  const { setIsLoading } = useLoading();
  const isLoggedIn = !!currentUser;
  const isLoggedInWithLine = currentUser?.providerIds.includes("oidc.line");
  const user = currentUser?.user;

  const signUp = async () => {
    setIsLoading(true);
    await signInWithLine();
    setIsLoading(false);
  };

  return (
    <Button onClick={signUp} disabled={isLoggedIn} className="mt-2">
      {isLoggedIn && isLoggedInWithLine ? `LINEでログイン済み: ${ displayName(user) }` : isLoggedIn ? "他サービスでログイン済み" : "LINEで新規登録"}
    </Button>
  );
};

export default SignUpWithLineButton;
