"use client";

import { useRouter } from "next/navigation";
import { OpportunityForm } from "../[id]/components/OpportunityForm";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";

const defaultValues = {
  category: GqlOpportunityCategory.Activity,
  title: "",
  summary: "",
  description: "",
  capacity: 10,
  pricePerPerson: 0,
  pointPerPerson: 0,
  placeId: null,
  hostUserId: "",
  requireHostApproval: false,
  slots: [],
  images: [],
  publishStatus: GqlPublishStatus.Private,
};

export default function CreateOpportunityPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">新規募集作成</h1>
        <p className="text-muted-foreground mt-2">
          新しい募集を作成します。必須項目を入力してください。
        </p>
      </div>

      <OpportunityForm
        mode="create"
        initialValues={defaultValues}
        onSuccess={(id) => {
          if (id) {
            router.push(`/admin/opportunities/${id}`);
          } else {
            router.push("/admin/opportunities");
          }
        }}
      />
    </div>
  );
}
