module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Limit the number of directives in GraphQL queries',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxDirectives: { type: 'number', minimum: 1 }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {};
    const { maxDirectives = 50 } = options;
    
    let directiveCount = 0;
    
    return {
      Directive(node) {
        directiveCount++;
      },
      'Document:exit'(node) {
        if (directiveCount > maxDirectives) {
          context.report({
            node,
            message: `Query has ${directiveCount} directives, exceeding maximum limit of ${maxDirectives}`
          });
        }
        directiveCount = 0;
      }
    };
  }
};
