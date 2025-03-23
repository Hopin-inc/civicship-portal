"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ログイン</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center mt-4">
          <Button
            onClick={handleLogin}
            disabled={isLoading || isAuthenticating}
            className="bg-[#06C755] hover:bg-[#05B74B] text-white"
          >
            {isLoading || isAuthenticating ? "ログイン中..." : "LINEでログイン"}
          </Button>
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
