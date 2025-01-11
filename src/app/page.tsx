import Link from "next/link";
import LogoutButton from "@/app/components/elements/LogoutButton";
import AccountDeleteButton from "@/app/components/elements/AccountDeleteButton";
import CurrentUserInfo from "@/app/components/elements/CurrentUserInfo";
import { Suspense } from "react";

const Home: React.FC = async () => {
  return (
    <main className="min-h-screen p-24">
      <h1>civicship portal</h1>
      <Suspense>
        <CurrentUserInfo />
      </Suspense>
      <div className="flex gap-2">
        <Suspense>
          <LogoutButton />
          <AccountDeleteButton />
        </Suspense>
      </div>
      <section>
        <h2>認証 / Identity</h2>
        <ul>
          <li>
            <Link href="/sign-in">
              ログイン/新規登録
            </Link>
          </li>
        </ul>
      </section>
      <section>
        <h2>活動 / Activity</h2>
        <ul>
          <li>
            <Link href="/activities">
              一覧
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
};

export default Home;
