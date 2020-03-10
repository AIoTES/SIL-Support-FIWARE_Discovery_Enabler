module.exports = {
    parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
    extends: [
        'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
        sourceType: 'module',  // Allows for the use of imports
    },
    rules: {
        'max-len': ['error', {
            'code': 120,
            'ignoreUrls': true,
            'ignoreRegExpLiterals': true,
        }],
        'quotes': ['error', 'single'],
        'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 1 }],
        'no-trailing-spaces': ['warn', {}],
        'lines-between-class-members': ['error', 'always'],
        'eol-last': ['error', 'always'],
        'comma-dangle': ['error', {
            'arrays': 'only-multiline',
            'objects': 'only-multiline',
            'imports': 'never',
            'exports': 'never',
            'functions': 'only-multiline'
        }],
        'array-callback-return': 'error',
        'curly': 'error',
        'no-empty-function': 'error',
        'brace-style': ['error', '1tbs', { 'allowSingleLine': true }],
        'comma-spacing': 'error',
        'multiline-comment-style': ['error', 'starred-block'],
        'sort-imports': ['warn', { 'ignoreCase': true, 'ignoreDeclarationSort': true }]
    },
};