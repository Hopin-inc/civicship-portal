import { redirect } from "next/navigation";
import { metadata } from "./metadata";
import { fetchPrivateUserServer } from "@/app/users/features/shared/server";
import { mapGqlPortfolio, UserProfileProvider } from "@/app/users/features/shared";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";

export { metadata };

export default async function MyPageLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session");
  logger.info("[/users/me/layout] SSR Cookie Check", {
    hasSession: !!sessionCookie,
    sessionSuffix: sessionCookie?.value?.slice(-8),
    component: "MyPageLayout",
  });

  const gqlUser = await fetchPrivateUserServer();

  logger.info("[/users/me/layout] SSR User Fetch Result", {
    hasUser: !!gqlUser,
    userId: gqlUser?.id?.slice(-6),
    component: "MyPageLayout",
  });

  if (!gqlUser) {
    logger.warn("[/users/me/layout] SSR Redirecting to /login", {
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
