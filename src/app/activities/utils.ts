type Opportunity = {
  communityId: string;
  id: string;
};

export const buildOpportunityQuery = (opportunity: Opportunity): string => {
  const params = new URLSearchParams({
    community_id: opportunity.communityId,
    opportunity_id: opportunity.id,
  });
  return params.toString();
};
