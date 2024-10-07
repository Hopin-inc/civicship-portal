"use client";

import { Button } from "@/app/components/ui/button";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { auth } from "@/lib/firebase";
import { useCookies } from "next-client-cookies";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { DELETE_USER } from "@/graphql/mutations/identity";
import { toast } from "sonner";

const AccountDeleteButton: React.FC = () => {
  const cookies=  useCookies();
  const { currentUser } = useFirebaseAuth();
  const isLoggedIn = !!currentUser;
  const [loading, setLoading] = useState<boolean>(false);
  const [deleteUser] = useMutation(DELETE_USER, {
    fetchPolicy: "no-cache",
  })

  const deleteAccount = async () => {
    setLoading(true);
    try {
      await deleteUser();
      await auth.signOut();
      cookies.remove("access_token");
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      toast.success("アカウント削除完了!");
    }
  };

  return (
    <Button onClick={deleteAccount} disabled={!isLoggedIn || loading} className="mt-2">
      アカウント削除
    </Button>
  );
};

export default AccountDeleteButton;
