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

type FieldConfig = {
  key: keyof CommunityFormData;
  errorKey: ValidationErrorField;
  label: string;
  placeholder: string;
  type?: string;
};

const LINE_FIELDS: FieldConfig[] = [
  { key: "lineAccessToken", errorKey: "lineAccessToken", label: "Access Token", placeholder: "Channel Access Token" },
  { key: "lineChannelId", errorKey: "lineChannelId", label: "Channel ID", placeholder: "Messaging API Channel ID" },
  { key: "lineChannelSecret", errorKey: "lineChannelSecret", label: "Channel Secret", placeholder: "Messaging API Channel Secret", type: "password" },
  { key: "lineLiffId", errorKey: "lineLiffId", label: "LIFF ID", placeholder: "LIFF App ID" },
];

function FieldRow({
  field,
  value,
  errorMsg,
  onChange,
  onClearError,
}: {
  field: FieldConfig;
  value: string;
  errorMsg?: string;
  onChange: (key: keyof CommunityFormData, value: string) => void;
  onClearError?: (key: ValidationErrorField) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="text-sm text-muted-foreground px-1">{field.label}</span>
      <Input
        value={value}
        onChange={(e) => {
          onChange(field.key, e.target.value);
          if (errorMsg) onClearError?.(field.errorKey);
        }}
        placeholder={field.placeholder}
        type={field.type}
        className={`placeholder:text-sm ${errorMsg ? "border-destructive focus-visible:ring-destructive" : ""}`}
      />
      {errorMsg && <p className="text-xs text-destructive px-1">{errorMsg}</p>}
    </div>
  );
}

export function LineConfigSection({ formData, onChange, errors, onClearError }: LineConfigSectionProps) {
  const { state, verify } = useLineVerify();

  const handleVerify = () => {
    verify({
      accessToken: formData.lineAccessToken,
      channelId: formData.lineChannelId,
      channelSecret: formData.lineChannelSecret,
      liffId: formData.lineLiffId,
    });
  };

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">LINE設定</span>
        <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
          必須
        </span>
      </div>

      {LINE_FIELDS.map((field) => (
        <FieldRow
          key={field.key as string}
          field={field}
          value={formData[field.key] as string}
          errorMsg={errors?.[field.errorKey]}
          onChange={onChange}
          onClearError={onClearError}
        />
      ))}

      <div className="flex items-center gap-3 pt-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={state.status === "loading"}
          onClick={handleVerify}
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
