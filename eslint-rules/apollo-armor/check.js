/**
 * Enforce Apollo Armor limits with full backend parity.
 *
 * Uses @escape.tech/graphql-armor-* ValidationRules directly (same packages
 * and same code the backend runs). Schema and sibling operations are
 * resolved from graphql.config.yml via @graphql-eslint's parserServices,
 * so cross-file fragments are expanded the same way the server sees them.
 */
const { parse, validate, Kind, Source, Lexer, TokenKind } = require("graphql");
const { costLimitRule } = require("@escape.tech/graphql-armor-cost-limit");
const { maxDepthRule } = require("@escape.tech/graphql-armor-max-depth");
const { maxAliasesRule } = require("@escape.tech/graphql-armor-max-aliases");
const { maxDirectivesRule } = require("@escape.tech/graphql-armor-max-directives");
const { CLIENT_LIMITS } = require("../../src/config/graphql-limits");

function getServices(context) {
  return (
    (context.sourceCode && context.sourceCode.parserServices) ||
    context.parserServices ||
    {}
  );
}

function countTokens(text) {
  let c = 0;
  try {
    const lexer = new Lexer(new Source(text));
    let t = lexer.advance();
    while (t.kind !== TokenKind.EOF) {
      c++;
      t = lexer.advance();
    }
  } catch {
    /* ignore */
  }
  return c;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforce Apollo Armor limits (depth/cost/aliases/directives/tokens) via the same ValidationRules the backend runs",
    },
    schema: [
      {
        type: "object",
        additionalProperties: false,
        properties: {
          maxDepth: { type: "number", minimum: 1 },
          maxCost: { type: "number", minimum: 1 },
          maxAliases: { type: "number", minimum: 0 },
          maxDirectives: { type: "number", minimum: 0 },
          maxTokens: { type: "number", minimum: 1 },
          objectCost: { type: "number", minimum: 0 },
          scalarCost: { type: "number", minimum: 0 },
          depthCostFactor: { type: "number", minimum: 1 },
        },
      },
    ],
  },
  create(context) {
    const opts = context.options[0] || {};
    const limits = {
      maxDepth: opts.maxDepth ?? CLIENT_LIMITS.maxDepth,
      maxCost: opts.maxCost ?? CLIENT_LIMITS.maxCost,
      maxAliases: opts.maxAliases ?? CLIENT_LIMITS.maxAliases,
      maxDirectives: opts.maxDirectives ?? CLIENT_LIMITS.maxDirectives,
      maxTokens: opts.maxTokens ?? CLIENT_LIMITS.maxTokens,
      objectCost: opts.objectCost ?? CLIENT_LIMITS.costObjectCost,
      scalarCost: opts.scalarCost ?? CLIENT_LIMITS.costScalarCost,
      depthCostFactor: opts.depthCostFactor ?? CLIENT_LIMITS.costDepthCostFactor,
    };

    const services = getServices(context);
    const schema = services.schema;
    const siblings = services.siblingOperations;

    if (!schema) {
      // Without a schema the armor ValidationRules cannot run. Surface this
      // as a lint error rather than silently passing, so a misconfigured
      // graphql.config.yml / missing graphql.schema.json can't disable the
      // security check unnoticed.
      let reported = false;
      return {
        "Document:exit"(node) {
          if (reported) return;
          reported = true;
          context.report({
            node,
            message:
              "Apollo Armor check skipped: GraphQL schema not available. Ensure graphql.config.yml points to an existing graphql.schema.json.",
          });
        },
      };
    }

    return {
      "Document:exit"(docNode) {
        // Re-parse from source to guarantee a raw graphql-js AST
        // (ESLint may pass an ESTree-converted node that validate() rejects).
        const text = context.getSourceCode().getText(docNode);
        let doc;
        try {
          doc = parse(text);
        } catch {
          return;
        }

        // Enrich with sibling fragments so that cross-file fragment spreads
        // resolve during validation (matches the server's view of the request).
        const localFragmentNames = new Set(
          doc.definitions
            .filter((d) => d.kind === Kind.FRAGMENT_DEFINITION)
            .map((d) => d.name.value),
        );
        const extraFragments =
          siblings && siblings.available
            ? siblings
                .getFragments()
                .map((s) => s.document)
                .filter((f) => !localFragmentNames.has(f.name.value))
            : [];
        const enrichedDoc = {
          kind: Kind.DOCUMENT,
          definitions: [...doc.definitions, ...extraFragments],
        };

        const messages = [];
        const reportFor = (tag) => (_ctx, err) =>
          messages.push(`[${tag}] ${err.message}`);

        const rules = [
          costLimitRule({
            maxCost: limits.maxCost,
            objectCost: limits.objectCost,
            scalarCost: limits.scalarCost,
            depthCostFactor: limits.depthCostFactor,
            propagateOnRejection: false,
            onReject: [reportFor("cost")],
          }),
          maxDepthRule({
            n: limits.maxDepth,
            propagateOnRejection: false,
            onReject: [reportFor("depth")],
          }),
          maxAliasesRule({
            n: limits.maxAliases,
            propagateOnRejection: false,
            onReject: [reportFor("aliases")],
          }),
          maxDirectivesRule({
            n: limits.maxDirectives,
            propagateOnRejection: false,
            onReject: [reportFor("directives")],
          }),
        ];

        try {
          validate(schema, enrichedDoc, rules);
        } catch (e) {
          messages.push(`[validate] ${e.message}`);
        }

        const tokenCount = countTokens(text);
        if (tokenCount > limits.maxTokens) {
          messages.push(
            `[tokens] Query has ${tokenCount} tokens, exceeding maximum ${limits.maxTokens}`,
          );
        }

        for (const msg of messages) {
          context.report({ node: docNode, message: msg });
        }
      },
    };
  },
};
