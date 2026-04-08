"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { CommunityFormData, ValidationErrors, ValidationErrorField } from "../../types/form";
import { useLineVerify } from "../../hooks/useLineVerify";

interface LineConfigSectionProps {
  formData: CommunityFormData;
  onChange: <K extends keyof CommunityFormData>(field: K, value: CommunityFormData[K]) => void;
  errors?: ValidationErrors;
  onClearError?: (field: keyof ValidationErrors) => void;
}

type LineFieldKey = Extract<
  keyof CommunityFormData,
  "lineAccessToken" | "lineChannelId" | "lineChannelSecret" | "lineLiffId"
>;

const LINE_FIELDS: { key: LineFieldKey; label: string; placeholder: string; type?: string }[] = [
  { key: "lineAccessToken", label: "Access Token", placeholder: "Channel Access Token" },
  { key: "lineChannelId", label: "Channel ID", placeholder: "Channel ID" },
  { key: "lineChannelSecret", label: "Channel Secret", placeholder: "Channel Secret", type: "password" },
  { key: "lineLiffId", label: "LIFF ID", placeholder: "LIFF App ID" },
];

const ERROR_FIELD_MAP: Partial<Record<LineFieldKey, ValidationErrorField>> = {
  lineAccessToken: "lineAccessToken",
  lineChannelId: "lineChannelId",
  lineChannelSecret: "lineChannelSecret",
  lineLiffId: "lineLiffId",
};

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

      {LINE_FIELDS.map(({ key, label, placeholder, type }) => {
        const errorKey = ERROR_FIELD_MAP[key];
        const errorMsg = errorKey ? errors?.[errorKey] : undefined;
        return (
          <div key={key} className="space-y-1">
            <span className="text-sm text-muted-foreground px-1">{label}</span>
            <Input
              value={formData[key] as string}
              onChange={(e) => {
                onChange(key, e.target.value);
                if (errorKey && errorMsg) onClearError?.(errorKey);
              }}
              placeholder={placeholder}
              type={type}
              className={`placeholder:text-sm ${errorMsg ? "border-destructive focus-visible:ring-destructive" : ""}`}
            />
            {errorMsg && <p className="text-xs text-destructive px-1">{errorMsg}</p>}
          </div>
        );
      })}

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
