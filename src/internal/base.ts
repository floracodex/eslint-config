import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import type {ConfigArray} from './types.js';

type Globals = Record<string, boolean | 'readonly' | 'writable' | 'off'>;

export interface BaseOptions {
    rootDir: string;
    tsconfigs?: string[];
    ignores?: string[];
    globals: Globals;
    sourceType?: 'module' | 'commonjs' | 'script';
    severity: 'error' | 'warn';
    parameterLeadingUnderscore: 'allow' | 'forbid';
    includeRestrictedExports: boolean;
}

const DEFAULT_IGNORES = ['eslint.config.mjs', 'dist/**', 'node_modules/**', 'coverage/**', '*.config.ts'];

export const SPEC_FILE_OVERRIDE_RULES = {
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-call': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-return': 'off',
    '@typescript-eslint/no-unsafe-enum-comparison': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/require-await': 'off'
} as const;

export function createBaseConfig(opts: BaseOptions): ConfigArray {
    const {
        rootDir,
        tsconfigs,
        ignores = [],
        globals,
        sourceType,
        severity,
        parameterLeadingUnderscore,
        includeRestrictedExports
    } = opts;

    const parserOptions = tsconfigs
        ? {project: tsconfigs, tsconfigRootDir: rootDir}
        : {projectService: true, tsconfigRootDir: rootDir};

    const isLax = severity === 'warn';

    return tseslint.config(
        {ignores: [...DEFAULT_IGNORES, ...ignores]},

        eslint.configs.recommended,
        ...tseslint.configs.recommendedTypeChecked,

        {
            languageOptions: {
                globals,
                ...(sourceType ? {sourceType} : {}),
                parserOptions
            }
        },

        {
            plugins: {'@stylistic': stylistic},
            rules: {
                '@stylistic/indent': ['warn', 4, {SwitchCase: 1}],
                '@stylistic/quotes': ['warn', 'single', {avoidEscape: true}],
                '@stylistic/semi': ['warn', 'always'],
                '@stylistic/comma-dangle': ['error', 'never'],
                '@stylistic/brace-style': ['warn', '1tbs', {allowSingleLine: true}],
                '@stylistic/arrow-parens': ['warn', 'always'],
                '@stylistic/comma-spacing': 'warn',
                '@stylistic/key-spacing': 'warn',
                '@stylistic/keyword-spacing': 'warn',
                '@stylistic/space-before-blocks': 'warn',
                '@stylistic/space-infix-ops': 'warn',
                '@stylistic/object-curly-spacing': ['warn', 'never'],
                '@stylistic/array-bracket-spacing': ['warn', 'never'],
                '@stylistic/space-before-function-paren': ['warn', {
                    anonymous: 'always',
                    named: 'never',
                    asyncArrow: 'always'
                }],
                '@stylistic/type-annotation-spacing': 'warn',
                '@stylistic/block-spacing': 'warn',
                '@stylistic/no-multiple-empty-lines': ['warn', {max: 2, maxEOF: 1, maxBOF: 0}],
                '@stylistic/eol-last': ['warn', 'always'],
                '@stylistic/no-trailing-spaces': 'warn',
                '@stylistic/member-delimiter-style': ['warn', {
                    multiline: {delimiter: 'semi', requireLast: true},
                    singleline: {delimiter: 'semi', requireLast: false}
                }]
            }
        },

        {
            rules: {
                '@typescript-eslint/no-explicit-any': isLax ? 'off' : 'error',

                '@typescript-eslint/no-floating-promises': severity,
                '@typescript-eslint/no-unsafe-argument': severity,
                '@typescript-eslint/no-unsafe-assignment': severity,
                '@typescript-eslint/no-unsafe-member-access': severity,
                '@typescript-eslint/no-unsafe-return': severity,
                '@typescript-eslint/no-unsafe-call': severity,

                ...(sourceType === 'commonjs' ? {
                    '@typescript-eslint/no-require-imports': 'off'
                } : {}),

                ...(isLax ? {
                    '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
                    '@typescript-eslint/unbound-method': 'warn',
                    '@typescript-eslint/no-redundant-type-constituents': 'warn',
                    '@typescript-eslint/no-base-to-string': 'warn',
                    '@typescript-eslint/restrict-template-expressions': 'warn',
                    '@typescript-eslint/no-misused-promises': 'warn',
                    '@typescript-eslint/no-unused-expressions': 'warn',
                    '@typescript-eslint/await-thenable': 'warn',
                    '@typescript-eslint/no-empty-object-type': 'warn',
                    '@typescript-eslint/explicit-function-return-type': 'off',
                    '@typescript-eslint/no-empty-function': 'off'
                } : {}),

                '@typescript-eslint/consistent-type-imports': [severity, {
                    prefer: 'type-imports',
                    fixStyle: 'inline-type-imports',
                    disallowTypeAnnotations: false
                }],

                '@typescript-eslint/no-unused-vars': severity,

                '@typescript-eslint/naming-convention': ['warn',
                    {selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'], leadingUnderscore: 'forbid'},
                    {selector: 'function', format: ['camelCase']},
                    {selector: 'typeLike', format: ['PascalCase']},
                    {selector: 'enumMember', format: ['PascalCase']},
                    {selector: 'classMethod', format: ['camelCase'], leadingUnderscore: 'forbid'},
                    {selector: 'classProperty', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'forbid'},
                    {selector: 'objectLiteralProperty', format: null},
                    {selector: 'parameter', format: ['camelCase'], leadingUnderscore: parameterLeadingUnderscore}
                ],

                '@typescript-eslint/require-await': severity
            }
        },

        {
            rules: {
                'eqeqeq': ['error', 'always', {null: 'ignore'}],
                'prefer-const': 'warn',
                'no-var': 'error',
                'curly': ['warn', 'all'],
                'no-console': severity,
                'no-duplicate-imports': 'warn',
                'prefer-template': 'warn',
                'no-throw-literal': 'off',
                '@typescript-eslint/only-throw-error': severity,
                'prefer-rest-params': 'warn',
                'prefer-spread': 'warn',
                'no-useless-constructor': 'off',
                '@typescript-eslint/no-useless-constructor': 'warn',
                ...(includeRestrictedExports ? {
                    'no-restricted-exports': ['warn', {
                        restrictDefaultExports: {
                            direct: true,
                            named: true,
                            defaultFrom: true,
                            namedFrom: true,
                            namespaceFrom: true
                        }
                    }]
                } : {})
            }
        }
    );
}
