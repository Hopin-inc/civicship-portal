"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useCommunityRouter } from "@/hooks/useCommunityRouter";

export default function CreateOpportunitySheet() {
  const router = useCommunityRouter();

  const handleClick = () => {
      router.push("/admin/credentials/issue?step=1");
  }

  return (
    <Button onClick={handleClick}>新規発行</Button>
  );
}
