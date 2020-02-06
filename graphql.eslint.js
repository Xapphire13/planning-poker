const fs = require('fs');

module.exports = {
  plugins: ['graphql'],
  rules: {
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaString: fs.readFileSync('./src/server/schema.graphql', 'utf8')
      }
    ]
  }
};
