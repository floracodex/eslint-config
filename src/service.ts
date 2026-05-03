import globals from 'globals';
import tseslint from 'typescript-eslint';
import {createBaseConfig} from './internal/base.js';
import type {ConfigArray, CreateConfigOptions} from './internal/types.js';

export type {ConfigArray, CreateConfigOptions};

export function createConfig(options: CreateConfigOptions): ConfigArray {
    const base = createBaseConfig({
        rootDir: options.rootDir,
        ...(options.tsconfigs ? {tsconfigs: options.tsconfigs} : {}),
        ...(options.ignores ? {ignores: options.ignores} : {}),
        globals: {...globals.node, ...globals.jest},
        sourceType: 'commonjs',
        severity: 'warn',
        parameterLeadingUnderscore: 'forbid',
        includeRestrictedExports: true
    });

    return tseslint.config(
        ...base,
        {
            files: ['**/*.spec.ts', '**/*-spec.ts'],
            rules: {
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-unsafe-enum-comparison': 'off',
                '@typescript-eslint/unbound-method': 'off'
            }
        }
    );
}
