import { redirect } from "next/navigation";
import { metadata } from "./metadata";
import { fetchPrivateUserServer } from "@/app/users/data";
import { presenterPortfolio } from "@/app/users/presenters";
import { UserProfileProvider } from "@/app/users/contexts/UserProfileContext";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const gqlUser = await fetchPrivateUserServer();

  if (!gqlUser) {
    redirect('/login');
  }

  const portfolios = (gqlUser.portfolios ?? []).map(presenterPortfolio);

  return (
    <UserProfileProvider
      value={{
        userId: gqlUser.id,
        isOwner: true,
        gqlUser,
        portfolios,
      }}
    >
      {children}
    </UserProfileProvider>
  );
}
