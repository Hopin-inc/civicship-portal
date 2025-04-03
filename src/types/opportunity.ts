export type OpportunityNode = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  place: {
    id: string;
    name: string;
    address: string;
    city: {
      name: string;
      state: {
        name: string;
      };
    };
  } | null;
  slots: {
    edges: Array<{
      node: {
        id: string;
        startsAt: string;
        endsAt: string;
        capacity: number;
      };
    }>;
  };
  feeRequired: number;
  pointsToEarn: number;
};

export type OpportunityEdge = {
  node: OpportunityNode;
};

export type OpportunityConnection = {
  edges: OpportunityEdge[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
  totalCount?: number;
};

export type GetOpportunitiesData = {
  upcoming: OpportunityConnection;
  featured: OpportunityConnection;
  all: OpportunityConnection;
}; 