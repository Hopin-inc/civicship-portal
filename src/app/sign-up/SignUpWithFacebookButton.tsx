"use client";

import { Button } from "@/app/components/ui/button";
import { signInWithFacebook } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { displayName } from "@/utils";
import { useLoading } from "@/hooks/useLoading";

const SignUpWithFacebookButton: React.FC = () => {
  const { currentUser } = useFirebaseAuth();
  const { setIsLoading } = useLoading();
  const isLoggedIn = !!currentUser;
  const isLoggedInWithFacebook = currentUser?.providerIds.includes("facebook.com");
  const user = currentUser?.user;

  const signIn = async () => {
    setIsLoading(true);
    await signInWithFacebook();
    setIsLoading(false);
  };

  return (
    <Button onClick={signIn} disabled={isLoggedIn} className="mt-2">
      {isLoggedIn && isLoggedInWithFacebook ? `Facebookでログイン済み: ${ displayName(user) }` : isLoggedIn ? "他サービスでログイン済み" : "Facebookで新規登録"}
    </Button>
  );
};

export default SignUpWithFacebookButton;
