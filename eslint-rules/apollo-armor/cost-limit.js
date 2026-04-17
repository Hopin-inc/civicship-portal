/**
 * Estimate a GraphQL operation's cost with proper depth weighting and
 * same-document fragment expansion.
 *
 * Cost per field = (objectCost | scalarCost) * depthCostFactor^depth
 * An operation's total cost sums every resolved selection.
 *
 * Limitations:
 * - ESLint lints one virtual document at a time. FragmentSpread references
 *   whose FragmentDefinition lives in another file cannot be resolved and
 *   are skipped. The backend Apollo Armor check is the source of truth.
 * - Schema-unaware: we cannot tell whether a selection resolves to a list,
 *   so list multipliers are not applied.
 */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Limit GraphQL operation cost (depth-weighted, fragment-aware within a document)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          maxCost: { type: 'number', minimum: 1 },
          objectCost: { type: 'number', minimum: 0 },
          scalarCost: { type: 'number', minimum: 0 },
          depthCostFactor: { type: 'number', minimum: 1 },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] || {};
    const {
      maxCost = 5000,
      objectCost = 2,
      scalarCost = 1,
      depthCostFactor = 1.5,
    } = options;

    const fragments = new Map();

    const hasSelections = (node) =>
      node.selectionSet && node.selectionSet.selections.length > 0;

    const costOfSelections = (selections, depth, visited) => {
      let cost = 0;
      for (const sel of selections) {
        if (sel.kind === 'Field') {
          const isObject = hasSelections(sel);
          const unit = isObject ? objectCost : scalarCost;
          cost += unit * Math.pow(depthCostFactor, depth);
          if (isObject) {
            cost += costOfSelections(sel.selectionSet.selections, depth + 1, visited);
          }
        } else if (sel.kind === 'InlineFragment') {
          if (hasSelections(sel)) {
            cost += costOfSelections(sel.selectionSet.selections, depth, visited);
          }
        } else if (sel.kind === 'FragmentSpread') {
          const name = sel.name.value;
          if (visited.has(name)) continue;
          const def = fragments.get(name);
          if (!def) continue;
          const nextVisited = new Set(visited);
          nextVisited.add(name);
          cost += costOfSelections(def.selectionSet.selections, depth, nextVisited);
        }
      }
      return cost;
    };

    return {
      FragmentDefinition(node) {
        fragments.set(node.name.value, node);
      },
      'Document:exit'(doc) {
        for (const def of doc.definitions) {
          if (def.kind !== 'OperationDefinition') continue;
          const cost = costOfSelections(def.selectionSet.selections, 0, new Set());
          if (cost > maxCost) {
            context.report({
              node: def,
              message: `Operation "${def.name ? def.name.value : '(anonymous)'}" estimated cost ${Math.round(cost)} exceeds maximum ${maxCost}`,
            });
          }
        }
        fragments.clear();
      },
    };
  },
};
