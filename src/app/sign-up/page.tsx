import { SignUpForm } from "@/components/features/signup/SignUpForm";
import { SignUpHeader } from "@/components/features/signup/SignUpHeader";

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
