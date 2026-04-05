"use client";

import { Input } from "@/components/ui/input";
import { CommunityFormData } from "../../types/form";

interface MetaSectionProps {
  formData: CommunityFormData;
  onChange: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
}

export function MetaSection({ formData, onChange }: MetaSectionProps) {
  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">設立日</span>
        <Input
          type="date"
          value={formData.establishedAt}
          onChange={(e) => onChange("establishedAt", e.target.value)}
          className="placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">外部システムID</span>
        <Input
          value={formData.originalId}
          onChange={(e) => onChange("originalId", e.target.value)}
          placeholder="originalId"
          className="placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">作成者ユーザーID</span>
        <Input
          value={formData.createdBy}
          onChange={(e) => onChange("createdBy", e.target.value)}
          placeholder="ユーザーID"
          className="placeholder:text-sm"
        />
      </div>
    </section>
  );
}
