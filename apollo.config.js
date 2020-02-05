module.exports = {
  client: {
    service: {
      name: 'planning-poker',
      localSchemaFile: './src/server/schema.graphql'
    },
    includes: ['./src/web/**/*.ts', './src/web/**/*.tsx'],
    excludes: ['**/node_modules', '**/__generated__'],
    tagName: 'gql'
  }
};
