module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Limit the approximate number of tokens in GraphQL queries',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxTokens: { type: 'number', minimum: 1 }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {};
    const { maxTokens = 15000 } = options;
    
    let tokenCount = 0;
    
    return {
      Field(node) {
        tokenCount += node.name.value.length;
        if (node.alias) {
          tokenCount += node.alias.value.length;
        }
      },
      Argument(node) {
        tokenCount += node.name.value.length;
        if (node.value && node.value.value) {
          tokenCount += String(node.value.value).length;
        }
      },
      Directive(node) {
        tokenCount += node.name.value.length;
      },
      'Document:exit'(node) {
        if (tokenCount > maxTokens) {
          context.report({
            node,
            message: `Query has approximately ${tokenCount} tokens, exceeding maximum limit of ${maxTokens}`
          });
        }
        tokenCount = 0;
      }
    };
  }
};
