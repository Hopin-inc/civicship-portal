/**
 * Count GraphQL lexical tokens per Apollo Armor semantics.
 *
 * Uses graphql-js's Lexer to tokenize the document source so the count
 * matches what the server sees (identifiers, punctuators, literals, etc.),
 * rather than summing identifier character lengths.
 */
const { Source, Lexer, TokenKind } = require('graphql');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Limit the number of GraphQL tokens in a document (Apollo Armor parity)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxTokens: { type: 'number', minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const { maxTokens = 15000 } = options;

    return {
      Document(node) {
        const sourceCode = context.getSourceCode();
        const text = typeof sourceCode.getText === 'function'
          ? sourceCode.getText(node)
          : null;
        if (!text) return;

        let count = 0;
        try {
          const lexer = new Lexer(new Source(text));
          let token = lexer.advance();
          while (token.kind !== TokenKind.EOF) {
            count++;
            token = lexer.advance();
          }
        } catch {
          return;
        }

        if (count > maxTokens) {
          context.report({
            node,
            message: `Document has ${count} tokens, exceeding maximum ${maxTokens}`,
          });
        }
      },
    };
  },
};
