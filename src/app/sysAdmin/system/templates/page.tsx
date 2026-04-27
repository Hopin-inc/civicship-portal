"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function SysAdminSystemTemplatesPage() {
  const headerConfig = useMemo(
    () => ({
      title: "テンプレート",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="max-w-xl mx-auto mt-8 space-y-6 px-4">
      <p className="text-body-sm text-muted-foreground">
        準備中: variant 一覧をここに表示します
      </p>
    </div>
  );
}
