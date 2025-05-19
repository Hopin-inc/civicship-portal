'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation';

/**
 * Header component for the sign-up page with cancel functionality
 */
const SignUpHeader: React.FC = () => {
  const router = useRouter();
  const cookies = useCookies();

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    await auth.signOut();
    cookies.remove('access_token');
    router.push('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b max-w-mobile-l mx-auto w-full h-16 flex items-center px-4">
      <Link href="/public" onClick={handleCancel} className="absolute left-4 inline-flex items-center text-muted-foreground hover:text-foreground">
        <ChevronLeft className="h-5 w-5 mr-1" />
        戻る
      </Link>
      <h1 className="flex-1 text-center text-lg font-bold truncate">アカウント情報の登録</h1>
    </header>
  );
};

export default SignUpHeader;
