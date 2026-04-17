/**
 * GraphQL operation limits shared between build-time (ESLint) and runtime.
 *
 * CLIENT_LIMITS: soft limits enforced by build-time lint and the
 *   `pnpm lint:graphql:report` measurement command. Set to the current
 *   observed max per metric with a small headroom, so existing operations
 *   pass while surprise regressions fail at lint.
 *
 * BACKEND_LIMITS: hard limits enforced at runtime by civicship-api Apollo
 *   Armor. Kept ~20% above CLIENT_LIMITS so real requests have operational
 *   headroom without losing build-time protection.
 *
 * Measurement engine: @escape.tech/graphql-armor-* ValidationRules (exact
 * parity with backend). Review usage with `pnpm lint:graphql:report`.
 *
 * Authored as CommonJS so .eslintrc.js can require() this module directly;
 * TypeScript consumers still import it transparently via allowJs.
 */

// Client (build-time) limits. Freeze at current observed max per metric so
// further increases require an intentional review rather than silent drift.
const CLIENT_LIMITS = Object.freeze({
  maxDepth: 11, // current max: 11 (GetCurrentUserProfile, GetEvaluations) — freeze
  maxAliases: 3, // current max: 0 — detection threshold for accidental alias use
  maxDirectives: 7, // current max: 5 (GetUserFlexible) — +40%
  maxTokens: 400, // current max: 320 (GetUserFlexible) — +25%
  maxCost: 2500, // current max: 1769 (GetArticle, armor with list multiplier) — +41%
  costObjectCost: 2,
  costScalarCost: 1,
  costDepthCostFactor: 1.5,
});

// Backend (runtime) limits = CLIENT × 1.2 (rounded). Kept above client so
// build-time lint fails first; runtime is a safety net.
const BACKEND_LIMITS = Object.freeze({
  maxDepth: 13,
  maxAliases: 4,
  maxDirectives: 9,
  maxTokens: 480,
  maxCost: 3000,
  costObjectCost: 2,
  costScalarCost: 1,
  costDepthCostFactor: 1.5,
});

module.exports = {
  BACKEND_LIMITS,
  CLIENT_LIMITS,
};
