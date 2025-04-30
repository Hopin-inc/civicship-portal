"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/app/components/ui/sheet";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithLiff, isAuthenticating } = useAuth();

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await loginWithLiff();
      setIsLoading(false);
      onClose();
    } catch (err) {
      setError("ログインに失敗しました");
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="h-[400px] rounded-t-[20px] px-6">
        <div className="flex flex-col items-center pt-8">
          <div className="mb-8">
            <Image
              src="/neo88-logo.jpg"
              alt="NEO88"
              width={120}
              height={40}
              priority
            />
          </div>
          <p className="text-center mb-6">
            予約を続けるには、<br />
            LINEアカウントでログインしてください
          </p>
          <Button
            onClick={handleLogin}
            disabled={isLoading || isAuthenticating}
            className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-xl h-12 flex items-center justify-center gap-2"
          >
            <Image
              src="/images/line-icon.png"
              alt="LINE"
              width={24}
              height={24}
              priority
            />
            {isLoading || isAuthenticating ? "ログイン中..." : "LINEでログイン"}
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
          <p className="text-sm text-gray-500 mt-4">
            ログインすることで、
            <Link href="/terms" className="underline">
              利用規約
            </Link>
            と
            <Link href="/privacy" className="underline">
              プライバシーポリシー
            </Link>
            に同意したことになります。
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginModal;
