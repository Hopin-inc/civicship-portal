"use client";

import { useCallback, useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
  nextPath?: string;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, nextPath }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loginWithLiff, isAuthenticating } = useAuth();
  const authRedirectService = AuthRedirectService.getInstance();

  const handleLogin = async () => {
    if (!agreedTerms || !agreedPrivacy) {
      setError("すべての同意が必要です");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const redirectPath = authRedirectService.getPostLineAuthRedirectPath(nextPath ?? null);
      await loginWithLiff(redirectPath);
      setIsLoading(false);
      onClose();
    } catch (err) {
      setError("ログインに失敗しました");
      setIsLoading(false);
    }
  };

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) onClose();
    },
    [onClose],
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[400px] rounded-t-[20px] px-6 max-w-mobile-l mx-auto w-full"
      >
        <div className="flex flex-col items-center pt-8">
          <div className="mb-8">
            <Image src="/images/neo88-logo.jpg" alt="NEO88" width={120} height={40} priority />
          </div>
          <p className="text-center font-bold mb-6">
            予約を続けるには
            <br />
            LINEでログインしてください
          </p>
          <div className="space-y-3 mb-10">
            <div className="flex items-start space-x-4">
              <Checkbox
                id="agree-terms"
                checked={agreedTerms}
                onCheckedChange={(checked) => setAgreedTerms(!!checked)}
                className="w-5 h-5"
              />
              <Label htmlFor="agree-terms" className="text-sm text-muted-foreground">
                <Link href="/terms" className="underline">
                  利用規約
                </Link>
                に同意する
              </Label>
            </div>

            <div className="flex items-start space-x-4">
              <Checkbox
                id="agree-privacy"
                className="w-5 h-5"
                checked={agreedPrivacy}
                onCheckedChange={(checked) => setAgreedPrivacy(!!checked)}
              />
              <Label htmlFor="agree-privacy" className="text-sm text-muted-foreground">
                <Link href="/privacy" className="underline">
                  プライバシーポリシー
                </Link>
                に同意する
              </Label>
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={isLoading || isAuthenticating || !agreedTerms || !agreedPrivacy}
            className="w-full bg-[#06C755] hover:bg-[#05B74B] text-white rounded-xl h-12 flex items-center justify-center gap-2"
          >
            <Image src="/images/line-icon.png" alt="LINE" width={24} height={24} priority />
            {isLoading || isAuthenticating ? "ログイン中..." : "LINEでログイン"}
          </Button>
          {error && <p className="text-sm text-red-500 mb-4 text-center">{error}</p>}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LoginModal;
