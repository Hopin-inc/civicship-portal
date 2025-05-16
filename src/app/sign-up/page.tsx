import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import React from "react";

const RegisterAccount: React.FC = async () => {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpForm />
      </div>
    </main>
  );
};

export default RegisterAccount;
