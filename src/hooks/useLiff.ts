"use client";

import { useContext } from "react";
import { LiffContext } from "@/contexts/LiffContext";

export const useLiff = () => {
  const value = useContext(LiffContext);

  if (!value) {
    throw new Error("useLiffContext must be used within a LiffProvider");
  }

  return value;
};
