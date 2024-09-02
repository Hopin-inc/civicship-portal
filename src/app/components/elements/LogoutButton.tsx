"use client";

import { useLiff } from "@/hooks/useLiff";
import { Button } from "@/app/components/ui/button";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { auth } from "@/lib/firebase";
import { useCookies } from "next-client-cookies";

const LogoutButton: React.FC = () => {
  const cookies=  useCookies();
  const { liffState } = useLiff();
  const { currentUser } = useFirebaseAuth();
  const isLoggedIn = liffState?.isLoggedIn() || !!currentUser;

  const logout = async () => {
    await auth.signOut();
    cookies.remove("access_token");
  };

  return (
    <Button onClick={logout} disabled={!isLoggedIn} className="mt-2">
      ログアウト
    </Button>
  );
};

export default LogoutButton;
