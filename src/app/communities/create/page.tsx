"use client";

import { useRouter } from "next/navigation";
import { CommunityFormEditor } from "./features/editor/components/CommunityFormEditor";
import { CommunityEditorLayout } from "./features/editor/components/CommunityEditorLayout";

export default function CreateCommunityPage() {
  const router = useRouter();

  return (
    <CommunityEditorLayout>
      <CommunityFormEditor onSuccess={(id) => router.push(`/community/${id}/admin`)} />
    </CommunityEditorLayout>
  );
}
