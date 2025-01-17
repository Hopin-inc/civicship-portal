"use client";

import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

const CurrentUserInfo: React.FC = () => {
  const { currentUser } = useFirebaseAuth();
  const { user } = currentUser ?? {};

  if (user) {
    return (
      <p>
        ログイン中: `{user.name}`
      </p>
    );
  }
};

export default CurrentUserInfo;
