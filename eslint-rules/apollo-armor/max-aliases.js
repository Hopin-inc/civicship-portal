module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Limit the number of aliases in GraphQL queries',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxAliases: { type: 'number', minimum: 1 }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {};
    const { maxAliases = 15 } = options;
    
    let aliasCount = 0;
    
    return {
      Field(node) {
        if (node.alias) {
          aliasCount++;
        }
      },
      'Document:exit'(node) {
        if (aliasCount > maxAliases) {
          context.report({
            node,
            message: `Query has ${aliasCount} aliases, exceeding maximum limit of ${maxAliases}`
          });
        }
        aliasCount = 0;
      }
    };
  }
};
