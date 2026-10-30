const js = require('@eslint/js')
const globals = require('globals')
const { defineConfig, globalIgnores } = require('eslint/config')

module.exports = defineConfig([
  globalIgnores(['node_modules']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
  {
    // Jest-globaler (describe, test, expect ...) i testfilerna
    files: ['tests/**/*.js'],
    languageOptions: {
      globals: globals.jest,
    },
  },
])
