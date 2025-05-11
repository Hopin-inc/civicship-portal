'use client';

import React from 'react';
import FeaturedSection from "@/components/features/activity/FeaturedSection";
import { ActivityCard } from "@/types/opportunity";

interface ActivitiesFeaturedSectionProps {
  opportunities: ActivityCard[];
}

const ActivitiesFeaturedSection: React.FC<ActivitiesFeaturedSectionProps> = ({ 
  opportunities 
}) => {
  return (
    <FeaturedSection opportunities={opportunities} />
  );
};

export default ActivitiesFeaturedSection;
