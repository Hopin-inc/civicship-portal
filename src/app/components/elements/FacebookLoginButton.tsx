"use client";

import { Button } from "@/app/components/ui/button";
import { signInWithFacebook } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const FacebookLoginButton: React.FC = () => {
  const { currentUser } = useFirebaseAuth();
  const isLoggedIn = !!currentUser;
  const isLoggedInWithFacebook = currentUser?.providerIds.includes("facebook.com");

  const redirect = async () => {
    await signInWithFacebook();
  };

  return (
    <Button onClick={redirect} disabled={isLoggedIn} className="mt-2">
      {isLoggedIn && isLoggedInWithFacebook ? `Facebookでログイン済み: ${ currentUser?.displayName }` : isLoggedIn ? "他サービスでログイン済み" : "Facebookでログイン"}
    </Button>
  );
};

export default FacebookLoginButton;
