module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Limit GraphQL query cost to prevent DoS attacks (simplified estimation)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxCost: { type: 'number', minimum: 1 },
          objectCost: { type: 'number', minimum: 1 },
          scalarCost: { type: 'number', minimum: 1 },
          depthCostFactor: { type: 'number', minimum: 1 }
        },
        additionalProperties: false
      }
    ]
  },
  create(context) {
    const options = context.options[0] || {};
    const { maxCost = 5000, objectCost = 2, scalarCost = 1, depthCostFactor = 1.5 } = options;
    
    let estimatedCost = 0;
    let fieldCount = 0;
    
    return {
      Field(node) {
        fieldCount++;
        if (node.selectionSet && node.selectionSet.selections.length > 0) {
          estimatedCost += objectCost;
        } else {
          estimatedCost += scalarCost;
        }
      },
      'Document:exit'(node) {
        const finalCost = estimatedCost * Math.pow(depthCostFactor, Math.log(fieldCount + 1));
        
        if (finalCost > maxCost) {
          context.report({
            node,
            message: `Query estimated cost ${Math.round(finalCost)} exceeds maximum cost limit of ${maxCost} (simplified estimation without schema)`
          });
        }
        estimatedCost = 0;
        fieldCount = 0;
      }
    };
  }
};
