import { SignUpForm } from "@/app/sign-up/components/SignUpForm";
import { SignUpHeader } from "@/app/sign-up/components/SignUpHeader";

const RegisterAccount: React.FC = async () => {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <SignUpHeader />
        <SignUpForm />
      </div>
    </main>
  );
};

export default RegisterAccount;
