"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import LoginModal from "@/app/_components/elements/LoginModal";
import { useAuth } from "@/contexts/AuthContext";
import { displayName } from "@/utils";

const Header: React.FC = () => {
  const { user } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.refresh(); // ページを更新してログアウト状態を反映
  };

  useEffect(() => {
    // ログイン状態が変更されたときにコンポーネントを再レンダリング
  }, [user])

  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-50 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:opacity-80 transition-opacity">
          civicship
        </Link>
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
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  );
};

export default Header;
