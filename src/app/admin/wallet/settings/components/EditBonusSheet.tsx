"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ItemGroup,
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item";
import { GqlCommunitySignupBonusConfig } from "@/types/graphql";
import { gql, useMutation } from "@apollo/client";
import { toast } from "react-toastify";

const UPDATE_SIGNUP_BONUS_CONFIG = gql`
  mutation UpdateSignupBonusConfig($input: UpdateSignupBonusConfigInput!) {
    updateSignupBonusConfig(input: $input) {
      bonusPoint
      isEnabled
      message
    }
  }
`;

interface EditBonusSheetProps {
  currentConfig?: GqlCommunitySignupBonusConfig | null;
  onSave: () => void;
}

export default function EditBonusSheet({ currentConfig, onSave }: EditBonusSheetProps) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(currentConfig?.isEnabled ?? false);
  const [bonusPoint, setBonusPoint] = useState(String(currentConfig?.bonusPoint ?? 0));
  const [message, setMessage] = useState(currentConfig?.message ?? "");

  const [updateConfig, { loading }] = useMutation(UPDATE_SIGNUP_BONUS_CONFIG);

  const handleSave = async () => {
    try {
      await updateConfig({
        variables: {
          input: {
            isEnabled,
            bonusPoint: Number(bonusPoint),
            message,
          },
        },
      });
      toast.success(t("adminWallet.settings.signupBonus.form.success"));
      onSave();
      setOpen(false);
    } catch (e) {
      toast.error(t("adminWallet.grant.errorGeneric"));
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          {t("adminWallet.settings.signupBonus.edit")}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-w-md mx-auto p-6 max-h-[80vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("adminWallet.settings.signupBonus.form.title")}</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6 pb-10">
          <ItemGroup className="border rounded-lg">
            <Item size="sm">
              <ItemContent>
                <ItemTitle>{t("adminWallet.settings.signupBonus.form.enabledLabel")}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
              </ItemActions>
            </Item>
          </ItemGroup>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground px-2">
              {t("adminWallet.settings.signupBonus.form.pointsLabel")}
            </Label>
            <div className="flex items-center gap-2 bg-muted/50 p-4 rounded-xl">
              <Input
                type="number"
                value={bonusPoint}
                onChange={(e) => setBonusPoint(e.target.value)}
                min={0}
                className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto"
              />
              <span className="font-bold">pt</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground px-2">
              {t("adminWallet.settings.signupBonus.form.messageLabel")}
            </Label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] rounded-xl bg-muted/50 border-none resize-none focus-visible:ring-0"
            />
          </div>

          <Button
            className="w-full h-12 rounded-full text-lg font-bold"
            onClick={handleSave}
            disabled={loading}
          >
            {t("adminWallet.settings.signupBonus.form.submit")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
