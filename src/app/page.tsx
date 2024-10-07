import Link from "next/link";
import LogoutButton from "@/app/components/elements/LogoutButton";
import AccountDeleteButton from "@/app/components/elements/AccountDeleteButton";
import CurrentUserInfo from "@/app/components/elements/CurrentUserInfo";

const Home: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <h1>civicship portal</h1>
      <CurrentUserInfo />
      <div className="flex gap-2">
        <LogoutButton />
        <AccountDeleteButton />
      </div>
      <section>
        <h2>認証 / Identity</h2>
        <ul>
          <li>
            <Link href="sign-in">ログイン</Link>
          </li>
          <li>
            <Link href="sign-up">新規登録</Link>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default Home;
