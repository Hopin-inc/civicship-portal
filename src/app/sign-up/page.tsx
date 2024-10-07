import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import SignUpWithFacebookButton from "@/app/sign-up/SignUpWithFacebookButton";
import SignUpWithLineButton from "@/app/sign-up/SignUpWithLineButton";

const SignIn: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/" className="inline-flex">
        <ChevronLeft />
        トップに戻る
      </Link>
      <h1>新規登録</h1>
      <div className="flex gap-2">
        <SignUpWithLineButton />
        <SignUpWithFacebookButton />
      </div>
    </main>
  );
};

export default SignIn;
