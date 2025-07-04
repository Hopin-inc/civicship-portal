"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function CreateOpportunitySheet() {
  const router = useRouter();

  const handleClick = () => {
      router.push("/admin/credentials/issue");
  }

  return (
    <Button onClick={handleClick}>新規発行</Button>
  );
}
