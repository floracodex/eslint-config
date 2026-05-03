import type tseslint from 'typescript-eslint';

export type ConfigArray = ReturnType<typeof tseslint.config>;

export interface CreateConfigOptions {
    rootDir: string;
    tsconfigs?: string[];
    ignores?: string[];
}
