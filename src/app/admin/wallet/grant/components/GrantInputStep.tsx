"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { HeaderConfig } from "@/contexts/HeaderContext";

const PRESET_AMOUNTS = [100000, 300000, 500000, 1000000];

interface Props {
  user: GqlUser;
  isLoading: boolean;
  onBack: () => void;
  onSubmit: (amount: number) => void;
}

function GrantInputStep({ user, isLoading, onBack, onSubmit }: Props) {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: "ポイントを支給する",
      showLogo: false,
      showBackButton: false,
      // backTo: "/admin/wallet/grant",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const [amount, setAmount] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState<string>("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const formatWithComma = (value: string | number) => {
    const num = typeof value === "number" ? value : Number(value.replace(/,/g, ""));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat().format(num);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");
    const num = Number(raw);
    if (isNaN(num)) {
      setAmount(null);
      setDisplayValue("");
    } else {
      setAmount(num);
      setDisplayValue(formatWithComma(raw));
    }
  };

  const handlePresetClick = (value: number) => {
    setAmount(value);
    setDisplayValue(formatWithComma(value));
  };

  const formatAsManUnit = (value: number) => `+${value / 10000}万pt`;

  return (
    <>
      <main className="pb-32 min-h-screen flex items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-6 max-w-xl w-full">
          <div className="flex items-center gap-3 w-full">
            <Image
              src={user.image ?? PLACEHOLDER_IMAGE}
              alt={user.name ?? "要確認"}
              width={40}
              height={40}
              className="rounded-full object-cover border"
              style={{ aspectRatio: "1 / 1" }}
            />
            <div className="flex flex-col">
              <span className="text-muted-foreground text-sm">支給する相手</span>
              <span className="text-base font-medium">{user.name}</span>
            </div>
          </div>

          <Input
            type="text"
            placeholder="7,500,000"
            value={displayValue}
            onChange={handleInputChange}
            inputMode="numeric"
            className="text-5xl text-center py-6 h-20 border-0 border-b-2 border-input focus:outline-none focus:ring-0 shadow-none"
          />

          <div className="w-full">
            <div className="flex gap-x-3 overflow-x-auto scrollbar-none pb-1">
              {PRESET_AMOUNTS.map((value) => (
                <Button
                  key={value}
                  variant={amount === value ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => handlePresetClick(value)}
                  className="min-w-[100px] flex-shrink-0"
                >
                  {formatAsManUnit(value)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="fixed bottom-[120px] left-0 right-0 z-50 bg-background max-w-mobile-l w-full px-4 py-4 mx-auto">
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => amount && amount > 0 && onSubmit(amount)}
            disabled={!amount || amount <= 0 || isLoading}
            className="w-full"
          >
            支給
          </Button>
          <Button variant="text" size={"sm"} onClick={onBack} className="w-full">
            支給先を選び直す
          </Button>
        </div>
      </footer>
    </>
  );
}

export default GrantInputStep;
