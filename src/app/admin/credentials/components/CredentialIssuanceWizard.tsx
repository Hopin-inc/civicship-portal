"use client";

import { useState } from "react";
import OpportunityList from "./opportunity/OpportunityList";
import TimeSlotSelector from "./selectDate/TimeSlotSelector";
import CredentialRecipientSelector from "./selectUser/CredentialRecipientSelector";

export default function CredentialIssuanceWizard() {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return <OpportunityList setStep={setStep} />;
  }
  if (step === 2) {
    return <TimeSlotSelector setStep={setStep} />;
  }
  if (step === 3) {
    return <CredentialRecipientSelector setStep={setStep} />;
  }
  return null;
}