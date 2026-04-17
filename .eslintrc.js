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
        "local-rules/apollo-armor/check": ["error"],
      },
    },
  ],
  extends: ["plugin:storybook/recommended"],
};
