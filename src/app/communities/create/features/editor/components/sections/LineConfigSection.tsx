"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { CommunityFormData, ValidationErrors } from "../../types/form";
import { useLineVerify } from "../../hooks/useLineVerify";

interface LineConfigSectionProps {
  formData: CommunityFormData;
  onChange: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors?: ValidationErrors;
  onClearError?: (field: keyof ValidationErrors) => void;
}

export function LineConfigSection({ formData, onChange, errors, onClearError }: LineConfigSectionProps) {
  const { state, verify } = useLineVerify();

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">LINE設定</span>
        <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
          必須
        </span>
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">Access Token</span>
        <Input
          value={formData.lineAccessToken}
          onChange={(e) => {
            onChange("lineAccessToken", e.target.value);
            if (errors?.lineAccessToken) onClearError?.("lineAccessToken");
          }}
          placeholder="Channel Access Token"
          className={`placeholder:text-sm ${errors?.lineAccessToken ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors?.lineAccessToken && (
          <p className="text-xs text-destructive px-1">{errors.lineAccessToken}</p>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">Channel ID</span>
        <Input
          value={formData.lineChannelId}
          onChange={(e) => {
            onChange("lineChannelId", e.target.value);
            if (errors?.lineChannelId) onClearError?.("lineChannelId");
          }}
          placeholder="Channel ID"
          className={`placeholder:text-sm ${errors?.lineChannelId ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors?.lineChannelId && (
          <p className="text-xs text-destructive px-1">{errors.lineChannelId}</p>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">Channel Secret</span>
        <Input
          value={formData.lineChannelSecret}
          onChange={(e) => {
            onChange("lineChannelSecret", e.target.value);
            if (errors?.lineChannelSecret) onClearError?.("lineChannelSecret");
          }}
          placeholder="Channel Secret"
          type="password"
          className={`placeholder:text-sm ${errors?.lineChannelSecret ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors?.lineChannelSecret && (
          <p className="text-xs text-destructive px-1">{errors.lineChannelSecret}</p>
        )}
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">LIFF ID</span>
        <Input
          value={formData.lineLiffId}
          onChange={(e) => {
            onChange("lineLiffId", e.target.value);
            if (errors?.lineLiffId) onClearError?.("lineLiffId");
          }}
          placeholder="LIFF App ID"
          className={`placeholder:text-sm ${errors?.lineLiffId ? "border-destructive focus-visible:ring-destructive" : ""}`}
        />
        {errors?.lineLiffId && (
          <p className="text-xs text-destructive px-1">{errors.lineLiffId}</p>
        )}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={state.status === "loading"}
          onClick={() => verify(formData.lineAccessToken)}
        >
          {state.status === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "接続確認"
          )}
        </Button>

        {state.status === "success" && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="h-4 w-4" />
            {state.botName} に接続できました
          </span>
        )}
        {state.status === "error" && (
          <span className="flex items-center gap-1 text-sm text-destructive">
            <XCircle className="h-4 w-4" />
            {state.message}
          </span>
        )}
      </div>
    </section>
  );
}
