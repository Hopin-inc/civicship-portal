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
export const SignUpHeader: React.FC = () => {
  const router = useRouter();
  const cookies = useCookies();

  const handleCancel = async (e: React.MouseEvent) => {
    e.preventDefault();
    await auth.signOut();
    cookies.remove('access_token');
    router.push('/');
  };

  return (
    <header className="mb-8">
      <Link href="/" onClick={handleCancel} className="inline-flex items-center text-gray-600 hover:text-gray-900">
        <ChevronLeft className="h-5 w-5 mr-1" />
        トップに戻る
      </Link>
      <h1 className="text-2xl font-bold tracking-tight mt-6">アカウント情報の登録</h1>
    </header>
  );
};

export default SignUpHeader;
