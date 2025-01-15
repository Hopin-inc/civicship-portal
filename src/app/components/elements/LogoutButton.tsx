"use client";

import { Button } from "@/app/components/ui/button";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { auth } from "@/lib/firebase";
import { useCookies } from "next-client-cookies";
import { toast } from "sonner";

const LogoutButton: React.FC = () => {
  const cookies = useCookies();
  const { currentUser } = useFirebaseAuth();
  const isLoggedIn = !!currentUser;

  const logout = async () => {
    await auth.signOut();
    cookies.remove("access_token");
    toast.success("ログアウト!");
  };

  return (
    <Button onClick={logout} disabled={!isLoggedIn} className="mt-2">
      ログアウト
    </Button>
  );
};

export default LogoutButton;
