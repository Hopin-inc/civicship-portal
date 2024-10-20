"use client";

import { useContext } from "react";
import { FirebaseAuthContext } from "@/contexts/FirebaseAuthContext";

export const useFirebaseAuth = () => {
  if (typeof window === "undefined") {
    throw new Error("POSTPONE: useFirebaseAuth is client only");
  }
  const { ready, currentUser } = useContext(FirebaseAuthContext);
  ready.use();
  return { currentUser };
};
