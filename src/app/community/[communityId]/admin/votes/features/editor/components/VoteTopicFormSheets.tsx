"use client";

import { VoteGateSheet } from "./sheets/VoteGateSheet";
import { VotePowerPolicySheet } from "./sheets/VotePowerPolicySheet";
import { NftTokenOption } from "../hooks/useNftTokens";

interface VoteTopicFormSheetsProps {
  gateOpen: boolean;
  onGateOpenChange: (open: boolean) => void;
  powerPolicyOpen: boolean;
  onPowerPolicyOpenChange: (open: boolean) => void;
  nftTokens: NftTokenOption[];
  nftTokensLoading: boolean;
}

export function VoteTopicFormSheets({
  gateOpen,
  onGateOpenChange,
  powerPolicyOpen,
  onPowerPolicyOpenChange,
  nftTokens,
  nftTokensLoading,
}: VoteTopicFormSheetsProps) {
  return (
    <>
      <VoteGateSheet
        open={gateOpen}
        onOpenChange={onGateOpenChange}
        nftTokens={nftTokens}
        nftTokensLoading={nftTokensLoading}
      />
      <VotePowerPolicySheet
        open={powerPolicyOpen}
        onOpenChange={onPowerPolicyOpenChange}
        nftTokens={nftTokens}
        nftTokensLoading={nftTokensLoading}
      />
    </>
  );
}
