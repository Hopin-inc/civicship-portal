"use client";

import { useState } from "react";
import OpportunityList from "./OpportunityList";
import DateWizard from "./DateWizard";
import UserSelector from "./UserSelector";

export default function OpportunitySelector() {
  const [step, setStep] = useState(1);

  if (step === 1) {
    return <OpportunityList setStep={setStep} />;
  }
  if (step === 2) {
    return <DateWizard setStep={setStep} />;
  }
  if (step === 3) {
    return <UserSelector />;
  }
  return null;
}