import globals from 'globals';
import {createBaseConfig} from './internal/base.js';
import type {ConfigArray, CreateConfigOptions} from './internal/types.js';

export type {ConfigArray, CreateConfigOptions};

export function createConfig(options: CreateConfigOptions): ConfigArray {
    return createBaseConfig({
        rootDir: options.rootDir,
        ...(options.tsconfigs ? {tsconfigs: options.tsconfigs} : {}),
        ...(options.ignores ? {ignores: options.ignores} : {}),
        globals: {...globals.node, ...globals.jest},
        sourceType: 'commonjs',
        severity: 'warn',
        parameterLeadingUnderscore: 'forbid',
        includeRestrictedExports: false
    });
}
