import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { headers } from "next/headers";

export default async function AuthedLayout({ children }: { children: ReactNode }) {
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();
  const reqHeaders = await headers();

  const pathname = reqHeaders.get("x-pathname") || "/";
  const search = reqHeaders.get("x-search") || "";

  const currentUrl = search ? `${pathname}${search}` : pathname;
  const nextParam = `?next=${encodeURIComponent(currentUrl)}`;

  console.log('[AUTHED]', 'pathname:', pathname, '| search:', search, '| currentUrl:', currentUrl, '| user:', !!user, '| line:', lineAuthenticated, '| phone:', phoneAuthenticated);

  if (!lineAuthenticated || !user) {
    console.log('[AUTHED] → /login' + nextParam);
    redirect(`/login${nextParam}`);
  }

  if (!phoneAuthenticated) {
    console.log('[AUTHED] → /sign-up/phone-verification' + nextParam);
    redirect(`/sign-up/phone-verification${nextParam}`);
  }

  return <>{children}</>;
}
