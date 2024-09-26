module.exports = [
    {
        ignores: [
            '.DS_Store',
            'node_modules',
            '/build',
            '/.svelte-kit',
            '/package',
            '.env',
            '.env.*',
            '!.env.example',
            'pnpm-lock.yaml',
            'package-lock.json',
            'yarn.lock',
            'public/*',
            '*.cjs'
        ],
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'module',
            globals: {
                browser: true,
                es2017: true,
                node: true
            },
            parser: require('@typescript-eslint/parser'),
            parserOptions: {
                project: './tsconfig.json'
            },
        },
        plugins: {
            svelte: require('eslint-plugin-svelte'),
            '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
            'no-null': require('eslint-plugin-no-null'),
            'prefer-arrow': require('eslint-plugin-prefer-arrow'),
            prettier: require('eslint-plugin-prettier'),
        },
        rules: {
            'indent': ['error', 4],
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/adjacent-overload-signatures': 'error',
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
            '@typescript-eslint/unbound-method': 'warn',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
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
                // {
                //     "selector": ["memberLike"],
                //     "modifiers": ["readonly"],
                //     "format": ["UPPER_CASE"],
                // },
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
            'object-curly-spacing': ['error', 'always'],
            'tsdoc/syntax': 'off'
    
            // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
            // e.g. '@typescript-eslint/explicit-function-return-type': 'off',
        }
    }
];
