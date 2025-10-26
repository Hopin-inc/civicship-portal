import { redirect } from "next/navigation";
import { metadata } from "./metadata";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { logger } from "@/lib/logging";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  logger.info("[/users/me/layout] Server layout rendering", {
    component: "MyPageLayout",
    timestamp: new Date().toISOString(),
  });

  const gqlUser = await fetchPrivateUserServer();

  logger.info("[/users/me/layout] User fetch result", {
    component: "MyPageLayout",
    hasUser: !!gqlUser,
    userId: gqlUser?.id?.slice(-6),
  });

  if (!gqlUser) {
    logger.warn("[/users/me/layout] No user found, redirecting to /login", {
      component: "MyPageLayout",
    });
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
