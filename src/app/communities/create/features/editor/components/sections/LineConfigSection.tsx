"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { CommunityFormData } from "../../types/form";
import { useLineVerify } from "../../hooks/useLineVerify";

interface LineConfigSectionProps {
  formData: CommunityFormData;
  onChange: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
}

export function LineConfigSection({ formData, onChange }: LineConfigSectionProps) {
  const { state, verify } = useLineVerify();

  return (
    <section className="space-y-2">
      <p className="text-sm text-muted-foreground px-1">LINE設定（任意）</p>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">Access Token</span>
        <Input
          value={formData.lineAccessToken}
          onChange={(e) => onChange("lineAccessToken", e.target.value)}
          placeholder="Channel Access Token"
          className="placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">Channel ID</span>
        <Input
          value={formData.lineChannelId}
          onChange={(e) => onChange("lineChannelId", e.target.value)}
          placeholder="Channel ID"
          className="placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">Channel Secret</span>
        <Input
          value={formData.lineChannelSecret}
          onChange={(e) => onChange("lineChannelSecret", e.target.value)}
          placeholder="Channel Secret"
          type="password"
          className="placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">LIFF Base URL</span>
        <Input
          value={formData.lineLiffBaseUrl}
          onChange={(e) => onChange("lineLiffBaseUrl", e.target.value)}
          placeholder="https://liff.line.me/..."
          type="url"
          className="placeholder:text-sm"
        />
      </div>

      <div className="space-y-1">
        <span className="text-sm text-muted-foreground px-1">LIFF ID</span>
        <Input
          value={formData.lineLiffId}
          onChange={(e) => onChange("lineLiffId", e.target.value)}
          placeholder="LIFF App ID"
          className="placeholder:text-sm"
        />
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
