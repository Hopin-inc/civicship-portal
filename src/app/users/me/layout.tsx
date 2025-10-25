import { redirect } from "next/navigation";
import { metadata } from "./metadata";
import { fetchPrivateUserServer } from "@/app/users/features/shared/api/fetchPrivateUserServer";
import { mapGqlPortfolio } from "@/app/users/features/shared/mappers";
import { UserProfileProvider } from "@/app/users/features/shared/contexts/UserProfileContext";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const gqlUser = await fetchPrivateUserServer();

  if (!gqlUser) {
    redirect("/login");
  }

  const portfolios = (gqlUser.portfolios ?? []).map(mapGqlPortfolio);

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
