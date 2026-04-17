const { CLIENT_LIMITS } = require("./src/config/graphql-limits");

module.exports = {
  root: true,
  parserOptions: {
    sourceType: "module",
  },
  ignorePatterns: ["**/*.d.ts"],
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      processor: "@graphql-eslint/graphql",
      extends: [
        "next/core-web-vitals",
        "plugin:import/warnings",
        "prettier",
      ],
    },
    {
      files: ["**/*.graphql"],
      parser: "@graphql-eslint/eslint-plugin",
      plugins: ["@graphql-eslint", "local-rules"],
      rules: {
        "@graphql-eslint/selection-set-depth": [
          "error",
          { maxDepth: CLIENT_LIMITS.maxDepth },
        ],
        "local-rules/apollo-armor/cost-limit": [
          "error",
          {
            maxCost: CLIENT_LIMITS.maxCost,
            objectCost: CLIENT_LIMITS.costObjectCost,
            scalarCost: CLIENT_LIMITS.costScalarCost,
            depthCostFactor: CLIENT_LIMITS.costDepthCostFactor,
          },
        ],
        "local-rules/apollo-armor/max-aliases": [
          "error",
          { maxAliases: CLIENT_LIMITS.maxAliases },
        ],
        "local-rules/apollo-armor/max-directives": [
          "error",
          { maxDirectives: CLIENT_LIMITS.maxDirectives },
        ],
        "local-rules/apollo-armor/max-tokens": [
          "error",
          { maxTokens: CLIENT_LIMITS.maxTokens },
        ],
      },
    },
  ],
  extends: ["plugin:storybook/recommended"],
};
