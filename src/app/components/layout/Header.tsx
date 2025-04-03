"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, ArrowLeft, ChevronLeft } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import LoginModal from "@/app/components/elements/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { useHeader } from "@/contexts/HeaderContext";
import { displayName } from "@/utils";
import { cn } from "@/lib/utils";
import SearchBox from "../search/SearchBox";

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const { user } = useAuth();
  const { config } = useHeader();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await auth.signOut();
    router.refresh();
  };

  const shouldShowBackButton = config.showBackButton && pathname !== '/';

  return (
    <header className="border-b border-border bg-background fixed w-full z-50">
      <div className="max-w-lg mx-auto px-4 h-16 flex justify-between items-center">
        <div className="flex-1 flex items-center">
          {shouldShowBackButton && (
            <button
              onClick={() => router.back()}
              className="mr-4 hover:text-foreground/80 transition-colors"
              aria-label="戻る"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}
          {config.showLogo && (
            <Link href="/" className="flex items-center space-x-2">
              <Image src="images/neo88-logo.jpg" alt="NEO88" width={88} height={80} />
            </Link>
          )}
          {config.showSearchForm && (
            <div className="flex-1 ml-4">
              <SearchBox
                location={config.searchParams?.location}
                from={config.searchParams?.from}
                to={config.searchParams?.to}
                guests={config.searchParams?.guests}
              />
            </div>
          )}
          {config.title && !config.showSearchForm && (
            <h1 className={cn(
              "text-lg font-bold text-secondary-foreground",
              config.showLogo ? "ml-4" : "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            )}>
              {config.title}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {config.action}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-2 hover:bg-accent rounded-full transition-colors"
                >
                  <Avatar>
                    <AvatarImage src={user?.image ?? ""} alt={displayName(user)} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/users/me">プロフィール</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  ログアウト
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => setIsLoginModalOpen(true)}>ログイン</Button>
          )}
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;
