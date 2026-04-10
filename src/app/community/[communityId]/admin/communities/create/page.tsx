"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { CommunityFormEditor } from "./features/editor/components/CommunityFormEditor";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function CreateCommunityPage() {
  const router = useRouter();

  const headerConfig = useMemo(
    () => ({
      title: "コミュニティを作成",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <CommunityFormEditor onSuccess={(id) => router.push(`/community/${id}/users/me`)} />
  );
}
