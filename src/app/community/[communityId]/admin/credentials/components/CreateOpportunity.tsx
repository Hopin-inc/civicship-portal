"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useAppRouter } from "@/lib/navigation";

export default function CreateOpportunitySheet() {
  const router = useAppRouter();

  const handleClick = () => {
      router.push("/admin/credentials/issue?step=1");
  }

  return (
    <Button onClick={handleClick}>新規発行</Button>
  );
}
