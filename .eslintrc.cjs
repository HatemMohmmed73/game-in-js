module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        
        // Node.js globals
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        
        // Testing globals
        jest: 'readonly',
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        
        // Console is allowed in all environments
        console: 'readonly'
      }
    },
    rules: {
      // Basic rules that work for most Node.js projects
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-undef': 'warn',
      'semi': ['error', 'always']
    }
  },
  // Special configuration for test files
  {
    files: ['**/__tests__/**/*.js', '**/*.test.js'],
    env: {
      'jest/globals': true
    },
    rules: {
      'no-undef': 'off' // Let Jest handle undefined variables in tests
    }
  }
];
