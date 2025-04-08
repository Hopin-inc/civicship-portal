"use client";

import Link from 'next/link';
import { Search, Globe, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from "@/contexts/AuthContext";

const BottomBar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide BottomBar on search and reservation pages except complete page
  if (
    pathname === '/search' || 
    (pathname.startsWith('/reservation') && !pathname.includes('/complete')) ||
    pathname.startsWith('/activities/') ||
    pathname.startsWith('/participations/')
  ) {
    return null;
  }

  const getLinkStyle = (path: string) => {
    return `flex flex-col items-center ${pathname === path ? 'text-blue-500' : 'text-gray-600'} hover:text-blue-500`;
  };

  const myPagePath = user?.id ? `/users/${user.id}` : '/mypage';

  return (
    <div className="max-w-lg mx-auto fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          <Link href="/activities" className={getLinkStyle('/explore')}>
            <Search size={24} />
            <span className="text-xs mt-1">見つける</span>
          </Link>
          <Link href="/" className={getLinkStyle('/')}>
            <Globe size={24} />
            <span className="text-xs mt-1">探す</span>
          </Link>
          <Link href={myPagePath} className={getLinkStyle(myPagePath)}>
            <User size={24} />
            <span className="text-xs mt-1">マイページ</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomBar; 