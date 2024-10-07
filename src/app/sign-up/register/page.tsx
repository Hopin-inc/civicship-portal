import SignUpForm from "@/app/sign-up/register/SignUpForm";
import CancelButton from "@/app/sign-up/register/CancelButton";

const RegisterAccount: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <CancelButton />
      <h1>アカウント情報の登録</h1>
      <SignUpForm />
    </main>
  );
};

export default RegisterAccount;
