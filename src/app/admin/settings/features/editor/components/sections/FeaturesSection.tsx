"use client";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import { FeatureKey } from "../../types/settings";
import { FEATURE_DEFINITIONS } from "../../constants/settings";

interface FeaturesSectionProps {
  features: FeatureKey[];
  onFeatureToggle: (key: FeatureKey, checked: boolean) => void;
  disabled?: boolean;
}

export function FeaturesSection({
  features,
  onFeatureToggle,
  disabled = false,
}: FeaturesSectionProps) {
  return (
    <>
      {FEATURE_DEFINITIONS.map((feature) => (
        <Item key={feature.key} size="sm" variant="outline">
          <ItemContent>
            <ItemTitle className="font-bold">{feature.title}</ItemTitle>
            <ItemDescription className="text-xs">
              {feature.description}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Switch
              checked={feature.disabled ? true : features.includes(feature.key)}
              onCheckedChange={(checked) => onFeatureToggle(feature.key, checked)}
              disabled={disabled || feature.disabled}
            />
          </ItemActions>
        </Item>
      ))}
    </>
  );
}
