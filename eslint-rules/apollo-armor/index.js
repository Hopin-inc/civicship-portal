module.exports = {
  rules: {
    'cost-limit': require('./cost-limit'),
    'max-aliases': require('./max-aliases'),
    'max-directives': require('./max-directives'),
    'max-tokens': require('./max-tokens')
  }
};
