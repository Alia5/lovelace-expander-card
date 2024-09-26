import eslint from '@eslint/js';
import svelteEslint from 'eslint-plugin-svelte';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tsEslint from 'typescript-eslint';
import eslintArrowPlugin from 'eslint-plugin-prefer-arrow';
import noNullPlugin from 'eslint-plugin-no-null';

// const commonTsRules = {
//    '@typescript-eslint/no-floating-promises': 'error',
//    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
// }

const commonRules = {
    'indent': ['error', 4],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/array-type': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/no-inferrable-types': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    '@typescript-eslint/prefer-namespace-keyword': 'error',
    'no-inner-declarations': 'off', // we have es6blocked scoped functions.
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',

    'object-curly-spacing': ['error', 'always'],
    '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
            accessibility: 'explicit'
        }
    ],
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    '@typescript-eslint/naming-convention': [
        'off',
        {
            selector: 'default',
            format: ['camelCase']
        },
        {
            selector: ['variable'],
            format: ['camelCase', 'UPPER_CASE']
        },
        {
            selector: 'parameter',
            format: ['camelCase'],
            leadingUnderscore: 'allow'
        },
        {
            selector: ['memberLike'],
            format: ['camelCase'],
            leadingUnderscore: 'allow'
        },
        {
            selector: ['memberLike', 'property'],
            modifiers: ['static'],
            format: ['PascalCase']
        },
        {
            selector: 'typeLike',
            format: ['PascalCase']
        },
        {
            selector: ['variable', 'memberLike', 'default', 'property'],
            modifiers: ['readonly'],
            format: ['UPPER_CASE']
        },
        {
            selector: ['variable', 'memberLike', 'default', 'property'],
            modifiers: ['static', 'readonly'],
            format: ['UPPER_CASE']
        }
    ], 'no-console': 'warn', // cli app only
    'no-return-await': 'error',
    'arrow-body-style': 'error',
    'arrow-parens': [
        'error',
        'always'
    ],
    'camelcase': ['warn', { ignoreImports: true }],
    'comma-dangle': [
        'error',
        {
            objects: 'never',
            arrays: 'never',
            functions: 'never'
        }
    ],
    'prefer-arrow/prefer-arrow-functions': 'error',
    'prefer-arrow-callback': 'error',
    'prefer-const': 'error',
    'quote-props': [
        'error',
        'consistent-as-needed'
    ],
    'no-var': 'error',
    'new-parens': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-debugger': 'error',
    'no-empty': 'error',
    'no-eval': 'error',
    'no-multiple-empty-lines': 'warn',
    'no-new-wrappers': 'error',
    'no-redeclare': 'error',
    'no-shadow': [
        'error',
        {
            hoist: 'all'
        }
    ],
    'no-null/no-null': 'error',
    'no-throw-literal': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-underscore-dangle': 'error',
    'no-unsafe-finally': 'error',
    'no-unused-labels': 'error',
    'spaced-comment': 'error',
    'use-isnan': 'error',
    'svelte/valid-compile': 'off',
    'max-lines': [
        'error',
        {
            max: 400,
            skipBlankLines: true,
            skipComments: true
        }
    ],
    'max-len': [
        'warn',
        {
            code: 160
        }
    ],
    'dot-notation': 'error',
    'eqeqeq': 'error',
    'eol-last': 'error',
    'linebreak-style': ['error', 'unix'],
    'block-spacing': ['error', 'always'],
    'tsdoc/syntax': 'off'
};

export default [
    eslint.configs.recommended,
    ...tsEslint.configs.recommended,
    ...svelteEslint.configs['flat/recommended'],
    {
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelteParser,
            parserOptions: {
                parser: tsEslint.parser
            },
            globals: {
                ...globals.browser
            }
        },
        rules: {
            ...commonRules
        }
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: tsEslint.parser
        }
    },
    {
        plugins: {
            '@typescript-eslint': tsEslint.plugin,
            'prefer-arrow': eslintArrowPlugin,
            'no-null': noNullPlugin
        },
        rules: {
            ...commonRules
        // ...commonTsRules
        }
    },
    {
        ignores: [
            '**/.svelte-kit',
            '**/.vercel',
            '**/.yarn',
            '**/build',
            '**/node_modules',
            '**/package',
            'public/**',
            'rollup.config.mjs'
        ]
    }
];
