"use client";

import { useLiff } from "@/hooks/useLiff";
import { Button } from "@/app/components/ui/button";
import { signInWithLine } from "@/lib/firebase";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const LineLoginButton: React.FC = () => {
  const { liffState } = useLiff();
  const { currentUser } = useFirebaseAuth();
  const isLoggedIn = liffState?.isLoggedIn() || !!currentUser;

  const redirect = async () => {
    await signInWithLine();
  };

  return (
    <Button onClick={redirect} disabled={isLoggedIn} className="mt-2">
      {isLoggedIn ? `ログイン済み: ${ currentUser?.displayName }` : "ログイン"}
    </Button>
  );
};

export default LineLoginButton;
