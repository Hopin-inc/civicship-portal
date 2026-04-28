"use client";

import { ReactNode, useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

interface CommunityEditorLayoutProps {
  children: ReactNode;
}

// sysAdmin/layout.tsx の global Header (HeaderProvider 経由) を流用するため、
// 以前ここで持っていた fixed <header> は撤去。タイトル / 戻るボタンは
// useHeaderConfig で global Header に注入する。
export function CommunityEditorLayout({ children }: CommunityEditorLayoutProps) {
  const headerConfig = useMemo(
    () => ({
      title: "コミュニティを作成",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return <div className="px-6">{children}</div>;
}
