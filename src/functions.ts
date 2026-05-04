import globals from 'globals';
import tseslint from 'typescript-eslint';
import {createBaseConfig, SPEC_FILE_OVERRIDE_RULES} from './internal/base.js';
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
        includeRestrictedExports: false
    });

    return tseslint.config(
        ...base,
        {
            files: ['**/*.spec.ts', '**/*-spec.ts'],
            rules: {...SPEC_FILE_OVERRIDE_RULES}
        }
    );
}
