import angular from 'angular-eslint';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import {createBaseConfig, SPEC_FILE_OVERRIDE_RULES} from './internal/base.js';
import type {ConfigArray, CreateConfigOptions} from './internal/types.js';

export type {ConfigArray, CreateConfigOptions};

export function createConfig(options: CreateConfigOptions): ConfigArray {
    const base = createBaseConfig({
        rootDir: options.rootDir,
        ...(options.tsconfigs ? {tsconfigs: options.tsconfigs} : {}),
        ignores: ['.angular/**', ...(options.ignores ?? [])],
        globals: {...globals.browser, ...globals.jasmine},
        severity: 'warn',
        parameterLeadingUnderscore: 'forbid',
        includeRestrictedExports: true,
        tsFiles: ['**/*.ts']
    });

    return tseslint.config(
        ...base,
        {
            files: ['**/*.ts'],
            extends: [...angular.configs.tsRecommended],
            rules: {
                '@angular-eslint/no-empty-lifecycle-method': 'warn',
                '@angular-eslint/prefer-inject': 'warn',
                '@angular-eslint/no-output-on-prefix': 'warn',
                '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
                '@typescript-eslint/ban-ts-comment': 'warn'
            }
        },
        {
            files: ['**/*.html'],
            extends: [
                ...angular.configs.templateRecommended,
                ...angular.configs.templateAccessibility
            ],
            rules: {
                '@angular-eslint/template/alt-text': 'warn',
                '@angular-eslint/template/interactive-supports-focus': 'warn',
                '@angular-eslint/template/click-events-have-key-events': 'warn'
            }
        },
        {
            files: ['**/*.spec.ts', '**/*-spec.ts'],
            rules: {...SPEC_FILE_OVERRIDE_RULES}
        }
    );
}
