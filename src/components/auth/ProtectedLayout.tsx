import { redirect } from 'next/navigation';
import { getAuthStep } from '@/lib/auth/server-auth';
import { logger } from '@/lib/logging';

interface ProtectedLayoutProps {
  children: React.ReactNode;
  currentPath: string;
}

export default async function ProtectedLayout({ children, currentPath }: ProtectedLayoutProps) {
  const authStep = await getAuthStep();
  
  if (authStep !== "SIGNED_IN") {
    const nextParam = encodeURIComponent(currentPath);
    
    logger.info('Protected route redirect', {
      component: 'ProtectedLayout',
      auth_step: authStep,
      from: currentPath,
      to: getRedirectPath(authStep, nextParam),
      community_id: process.env.NEXT_PUBLIC_COMMUNITY_ID
    });
    
    switch (authStep) {
      case "NEED_LOGIN":
        redirect(`/login?next=${nextParam}`);
      case "NEED_SIGNUP_PHONE":
        redirect(`/sign-up/phone-verification?next=${nextParam}`);
      case "NEED_SIGNUP_PROFILE":
        redirect(`/sign-up?next=${nextParam}`);
    }
  }
  
  return <>{children}</>;
}

function getRedirectPath(authStep: string, nextParam: string): string {
  switch (authStep) {
    case "NEED_LOGIN":
      return `/login?next=${nextParam}`;
    case "NEED_SIGNUP_PHONE":
      return `/sign-up/phone-verification?next=${nextParam}`;
    case "NEED_SIGNUP_PROFILE":
      return `/sign-up?next=${nextParam}`;
    default:
      return '/';
  }
}
