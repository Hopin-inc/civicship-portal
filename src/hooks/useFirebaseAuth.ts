"use client";

import { useContext } from "react";
import { FirebaseAuthContext } from "@/contexts/FirebaseAuthContext";

export const useFirebaseAuth = () => useContext(FirebaseAuthContext);
