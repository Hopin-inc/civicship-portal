"use client";

import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { displayName } from "@/utils";

const CurrentUserInfo: React.FC = () => {
  const { currentUser } = useFirebaseAuth();
  const { user } = currentUser ?? {};

  if (user) {
    return (
      <p>
        ログイン中: {displayName(user)}
      </p>
    );
  }
};

export default CurrentUserInfo;
