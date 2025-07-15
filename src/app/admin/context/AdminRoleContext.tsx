"use client";

import { createContext, useContext } from "react";
import { GqlRole } from "@/types/graphql";

export const AdminRoleContext = createContext<GqlRole | null>(null);

export const useAdminRole = () => {
  const role = useContext(AdminRoleContext);
  if (!role) {
    throw new Error("useAdminRole must be used within AdminRoleContext.Provider");
  }
  return role;
};
