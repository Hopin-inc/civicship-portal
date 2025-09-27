import { redirect } from 'next/navigation';
import { getAuthStep } from '@/lib/auth/server-auth';
import { validateNextParam } from '@/lib/auth/next-param-utils';
import { logger } from '@/lib/logging';
import LoginClient from './LoginClient';

interface LoginPageProps {
  searchParams: { next?: string; 'liff.state'?: string };
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const authStep = await getAuthStep();
  const nextPath = validateNextParam(searchParams.next || searchParams['liff.state'] || null);
  
  if (authStep === "SIGNED_IN") {
    logger.info('Login page redirect for signed in user', {
      component: 'LoginPage',
      auth_step: authStep,
      from: '/login',
      to: nextPath,
      community_id: process.env.NEXT_PUBLIC_COMMUNITY_ID
    });
    redirect(nextPath);
  }
  
  return <LoginClient nextPath={nextPath} />;
}
