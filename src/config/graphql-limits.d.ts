export interface GraphQLLimits {
  readonly maxDepth: number;
  readonly maxAliases: number;
  readonly maxDirectives: number;
  readonly maxTokens: number;
  readonly maxCost: number;
  readonly costObjectCost: number;
  readonly costScalarCost: number;
  readonly costDepthCostFactor: number;
}

export const BACKEND_LIMITS: GraphQLLimits;
export const CLIENT_LIMITS: GraphQLLimits;
