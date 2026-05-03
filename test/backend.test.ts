import {describe, expect, it} from 'vitest';
import {createConfig} from '../src/backend.js';
import {serializeConfig} from './snapshot-helper.js';

describe('backend preset', () => {
    it('matches snapshot', () => {
        const config = createConfig({rootDir: '/fake/root'});
        expect(serializeConfig(config)).toMatchSnapshot();
    });

    it('includes a *.spec.ts override block', () => {
        const config = createConfig({rootDir: '/fake/root'});
        const specBlock = serializeConfig(config).find(
            (b) => Array.isArray(b.files) && (b.files as string[]).includes('**/*.spec.ts')
        );
        expect(specBlock).toBeDefined();
        expect(specBlock?.rules).toHaveProperty('@typescript-eslint/no-unsafe-call', 'off');
    });
});
