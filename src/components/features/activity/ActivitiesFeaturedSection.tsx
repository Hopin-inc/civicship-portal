'use client';

import React from 'react';
import { OpportunityCardProps } from '../opportunity/OpportunityCard';
import FeaturedSection from './FeaturedSection';

interface ActivitiesFeaturedSectionProps {
  opportunities: OpportunityCardProps[];
}

const ActivitiesFeaturedSection: React.FC<ActivitiesFeaturedSectionProps> = ({ 
  opportunities 
}) => {
  return (
    <FeaturedSection opportunities={opportunities} />
  );
};

export default ActivitiesFeaturedSection;
