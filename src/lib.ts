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
        globals: {...globals.node},
        sourceType: 'module',
        severity: 'error',
        parameterLeadingUnderscore: 'forbid',
        includeRestrictedExports: true
    });

    return tseslint.config(
        ...base,
        {
            files: ['test/**/*.ts'],
            rules: {
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/require-await': 'off',
                'no-console': 'off'
            }
        }
    );
}
