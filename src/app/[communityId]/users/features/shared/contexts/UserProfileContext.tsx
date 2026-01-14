"use client";

import { createContext, ReactNode, useContext } from "react";
import { GqlUser } from "@/types/graphql";
import { AppPortfolio } from "@/app/[communityId]/users/features/shared/types";

export interface UserProfileContextValue {
  userId?: string;
  isOwner: boolean;
  gqlUser: GqlUser | null;
  portfolios: AppPortfolio[];
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export interface UserProfileProviderProps {
  children: ReactNode;
  value: UserProfileContextValue;
}

export function UserProfileProvider({ children, value }: UserProfileProviderProps) {
  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export function useUserProfileContext() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfileContext must be used within UserProfileProvider");
  }
  return context;
}
