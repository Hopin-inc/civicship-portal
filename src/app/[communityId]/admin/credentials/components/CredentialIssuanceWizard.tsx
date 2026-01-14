"use client";

import OpportunityList from "./opportunity/OpportunityList";
import TimeSlotSelector from "./selectDate/TimeSlotSelector";
import CredentialRecipientSelector from "./selectUser/CredentialRecipientSelector";
import { useSearchParams, useRouter } from "next/navigation";
import { GqlMembershipsConnection } from "@/types/graphql";

export const STEPS = {
  SELECT_OPPORTUNITY: 1,
  SELECT_TIME_SLOT: 2,
  SELECT_CREDENTIAL_RECIPIENT: 3,
};

interface CredentialIssuanceWizardProps {
  initialConnection: GqlMembershipsConnection | null;
}

export default function CredentialIssuanceWizard({
  initialConnection,
}: CredentialIssuanceWizardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const stepParam = Number(searchParams.get("step") ?? "1");

  const goToStep = (nextStep: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", String(nextStep));
    router.push(`?${params.toString()}`);
  };

  if (stepParam === STEPS.SELECT_OPPORTUNITY) {
    return <OpportunityList setStep={goToStep} />;
  }
  if (stepParam === STEPS.SELECT_TIME_SLOT) {
    return <TimeSlotSelector setStep={goToStep} />;
  }
  if (stepParam === STEPS.SELECT_CREDENTIAL_RECIPIENT) {
    return <CredentialRecipientSelector setStep={goToStep} initialConnection={initialConnection} />;
  }

  return null;
}
