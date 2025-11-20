import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getUserServer } from "@/lib/auth/init/getUserServer";
import { headers } from "next/headers";
import { AuthFlowClientWrapper } from "./AuthFlowClientWrapper";

function getSafeNext(next: string | null): string {
  if (!next?.startsWith("/")) return "/";
  if (next.startsWith("/login") || next.startsWith("/sign-up")) return "/";
  return next;
}

export default async function AuthFlowLayout({ children }: { children: ReactNode }) {
  const { user, lineAuthenticated, phoneAuthenticated } = await getUserServer();
  const reqHeaders = await headers();
  
  const pathname = reqHeaders.get("x-pathname") || "/";
  const search = reqHeaders.get("x-search") || "";
  const searchParams = new URLSearchParams(search);
  const next = searchParams.get("next") || searchParams.get("liff.state");
  
  const isLiffCallback = 
    searchParams.has("code") && 
    (searchParams.has("state") || searchParams.has("liff.state")) && 
    searchParams.has("liffClientId");
  
  console.log('[AUTH_FLOW_SSR]', { pathname, search, next, isLiffCallback, user: !!user, line: lineAuthenticated, phone: phoneAuthenticated });
  
  if (isLiffCallback) {
    console.log('[AUTH_FLOW_SSR] LIFF callback detected, skipping SSR redirect');
    return <AuthFlowClientWrapper>{children}</AuthFlowClientWrapper>;
  }
  
  const isLoginPage = pathname === "/login";
  const isSignUpPage = pathname === "/sign-up";
  const isPhoneVerificationPage = pathname === "/sign-up/phone-verification";
  
  if (user && lineAuthenticated && phoneAuthenticated) {
    const safeNext = getSafeNext(next);
    redirect(safeNext);
  } else if (lineAuthenticated && !phoneAuthenticated) {
    if (isLoginPage || isSignUpPage) {
      const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
      redirect(`/sign-up/phone-verification${nextParam}`);
    }
  } else if (lineAuthenticated && phoneAuthenticated && !user) {
    if (isLoginPage || isPhoneVerificationPage) {
      const nextParam = next ? `?next=${encodeURIComponent(next)}` : "";
      redirect(`/sign-up${nextParam}`);
    }
  }
  
  return <AuthFlowClientWrapper>{children}</AuthFlowClientWrapper>;
}
