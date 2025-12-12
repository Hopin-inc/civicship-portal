"use client";

import { useRouter } from "next/navigation";
import { OpportunityForm } from "../[id]/components/OpportunityForm";
import { GqlOpportunityCategory, GqlPublishStatus } from "@/types/graphql";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

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

  const headerConfig = useMemo(
    () => ({
      title: "募集作成",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  return (
    <div className="container mx-auto py-8">
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
