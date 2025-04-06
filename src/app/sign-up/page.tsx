import { SignUpForm } from "@/app/sign-up/SignUpForm";
import CancelButton from "@/app/sign-up/CancelButton";

const RegisterAccount: React.FC = async () => {
  return (
    <main className="min-h-screen p-8">
      <SignUpForm />
    </main>
  );
};

export default RegisterAccount;
