import type {ConfigArray} from '../src/internal/types.js';

interface SerializedBlock {
    name?: string;
    files?: unknown;
    ignores?: unknown;
    languageOptions?: {
        sourceType?: unknown;
        parserOptions?: Record<string, unknown>;
        globals?: string[];
    };
    plugins?: string[];
    rules?: Record<string, unknown>;
}

interface RawBlock {
    name?: unknown;
    files?: unknown;
    ignores?: unknown;
    languageOptions?: {
        sourceType?: unknown;
        parserOptions?: Record<string, unknown>;
        globals?: Record<string, unknown>;
    };
    plugins?: Record<string, unknown>;
    rules?: Record<string, unknown>;
}

export function serializeConfig(config: ConfigArray): SerializedBlock[] {
    return (config as unknown as RawBlock[]).map((block) => {
        const out: SerializedBlock = {};
        if (typeof block.name === 'string') {
            out.name = block.name;
        }
        if (block.files !== undefined) {
            out.files = block.files;
        }
        if (block.ignores !== undefined) {
            out.ignores = block.ignores;
        }

        if (block.languageOptions) {
            const lo: NonNullable<SerializedBlock['languageOptions']> = {};
            if (block.languageOptions.sourceType !== undefined) {
                lo.sourceType = block.languageOptions.sourceType;
            }
            if (block.languageOptions.parserOptions) {
                const cleaned: Record<string, unknown> = {};
                for (const [k, v] of Object.entries(block.languageOptions.parserOptions)) {
                    cleaned[k] = k === 'tsconfigRootDir' ? '<rootDir>' : v;
                }
                lo.parserOptions = cleaned;
            }
            if (block.languageOptions.globals) {
                lo.globals = Object.keys(block.languageOptions.globals).sort();
            }
            out.languageOptions = lo;
        }

        if (block.plugins) {
            out.plugins = Object.keys(block.plugins).sort();
        }

        if (block.rules) {
            const sorted: Record<string, unknown> = {};
            for (const key of Object.keys(block.rules).sort()) {
                sorted[key] = block.rules[key];
            }
            out.rules = sorted;
        }

        return out;
    });
}
