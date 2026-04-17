/**
 * GraphQL operation limits shared between build-time (ESLint) and runtime.
 *
 * BACKEND_LIMITS mirrors the values configured in civicship-api
 * (src/presentation/graphql/plugins/armor.ts). Frontend-enforced limits
 * (CLIENT_LIMITS) are derived with a safety buffer so build-time failures
 * surface before real requests hit the server limit.
 *
 * Authored as CommonJS so .eslintrc.js can require() this module directly;
 * TypeScript consumers still import it transparently via allowJs.
 */

const BACKEND_LIMITS = Object.freeze({
  maxDepth: 12,
  maxAliases: 15,
  maxDirectives: 50,
  maxTokens: 1000,
  maxCost: 7500,
  costObjectCost: 2,
  costScalarCost: 1,
  costDepthCostFactor: 1.5,
});

const FRONTEND_BUFFER = 0.8;

const withBuffer = (value) => Math.floor(value * FRONTEND_BUFFER);

const CLIENT_LIMITS = Object.freeze({
  maxDepth: withBuffer(BACKEND_LIMITS.maxDepth),
  maxAliases: withBuffer(BACKEND_LIMITS.maxAliases),
  maxDirectives: withBuffer(BACKEND_LIMITS.maxDirectives),
  maxTokens: withBuffer(BACKEND_LIMITS.maxTokens),
  maxCost: withBuffer(BACKEND_LIMITS.maxCost),
  costObjectCost: BACKEND_LIMITS.costObjectCost,
  costScalarCost: BACKEND_LIMITS.costScalarCost,
  costDepthCostFactor: BACKEND_LIMITS.costDepthCostFactor,
});

module.exports = {
  BACKEND_LIMITS,
  CLIENT_LIMITS,
  FRONTEND_BUFFER,
};
