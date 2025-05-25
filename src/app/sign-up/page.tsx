"use client";

import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect } from "react";

const RegisterAccount: React.FC = () => {
  const { isTransitioningToSignup, resetTransitionState } = useAuth();

  useEffect(() => {
    if (isTransitioningToSignup) {
      const timer = setTimeout(() => {
        resetTransitionState();
      }, 1000); // Show loading for 1 second

      return () => clearTimeout(timer);
    }
  }, [isTransitioningToSignup, resetTransitionState]);

  if (isTransitioningToSignup) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpForm />
      </div>
    </main>
  );
};

export default RegisterAccount;
