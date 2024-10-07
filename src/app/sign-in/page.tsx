import LineLoginButton from "@/app/sign-in/LineLoginButton";
import FacebookLoginButton from "@/app/sign-in/FacebookLoginButton";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const SignIn: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <Link href="/" className="inline-flex">
        <ChevronLeft />
        トップに戻る
      </Link>
      <h1>ログイン</h1>
      <div className="flex gap-2">
        <LineLoginButton />
        <FacebookLoginButton />
      </div>
    </main>
  );
};

export default SignIn;
