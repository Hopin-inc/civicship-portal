export default {
  schema: './graphql.schema.json',
  documents: 'src/**/*.{ts,tsx}',
  extensions: {
    codegen: {
      generates: {
        './src/types/graphql.tsx': {
          plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo']
        }
      }
    }
  }
};
