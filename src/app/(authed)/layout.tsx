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

  if (!lineAuthenticated || !user) {
    redirect(`/login${nextParam}`);
  }

  if (!phoneAuthenticated) {
    redirect(`/sign-up/phone-verification${nextParam}`);
  }

  return <>{children}</>;
}
