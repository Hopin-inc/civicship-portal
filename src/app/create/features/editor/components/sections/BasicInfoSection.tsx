"use client";

import { Input } from "@/components/ui/input";
import { CommunityFormData, ValidationErrors } from "../../types/form";

interface BasicInfoSectionProps {
  formData: CommunityFormData;
  onChange: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors?: ValidationErrors;
  onClearError?: (field: keyof ValidationErrors) => void;
}

export function BasicInfoSection({
  formData,
  onChange,
  errors,
  onClearError,
}: BasicInfoSectionProps) {
  return (
    <section className="space-y-2">
      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">コミュニティID</span>
        <Input
          value={formData.originalId}
          onChange={(e) => onChange("originalId", e.target.value)}
          placeholder="コミュニティID"
          className="placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-2 px-1">
          <span className="text-sm text-muted-foreground">コミュニティ名</span>
          <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
            必須
          </span>
        </div>
        <Input
          value={formData.name}
          onChange={(e) => {
            onChange("name", e.target.value);
            if (errors?.name) onClearError?.("name");
          }}
          placeholder="コミュニティ名を入力"
          className={`placeholder:text-sm ${errors?.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors?.name && <p className="text-xs text-destructive px-1">{errors.name}</p>}
      </div>
    </section>
  );
}
