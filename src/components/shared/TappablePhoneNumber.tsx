"use client";

import React from "react";
import { displayPhoneNumber } from "@/utils";

interface TappablePhoneNumberProps {
  phoneNumber: string;
  label?: string;
  className?: string;
}

/**
 * A component that renders a phone number as a tappable link
 * that opens the phone dialer when clicked.
 */
const TappablePhoneNumber: React.FC<TappablePhoneNumberProps> = ({
  phoneNumber,
  label,
  className = "text-body-md text-primary",
}) => {
  const formattedPhoneNumber = displayPhoneNumber(phoneNumber);
  
  const telLinkPhoneNumber = phoneNumber.replace(/\s+/g, "").replace(/[()-]/g, "");
  
  return (
    <a href={`tel:${telLinkPhoneNumber}`} className={className}>
      {formattedPhoneNumber}
      {label && <span className="text-caption text-body-sm ml-2">（{label}）</span>}
    </a>
  );
};

export default TappablePhoneNumber;
