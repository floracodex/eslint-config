import {describe, expect, it} from 'vitest';
import {createConfig} from '../src/functions.js';
import {serializeConfig} from './snapshot-helper.js';

describe('functions preset', () => {
    it('matches snapshot', () => {
        const config = createConfig({rootDir: '/fake/root'});
        expect(serializeConfig(config)).toMatchSnapshot();
    });

    it('omits no-restricted-exports', () => {
        const config = createConfig({rootDir: '/fake/root'});
        const allRules = serializeConfig(config).flatMap((b) => Object.keys(b.rules ?? {}));
        expect(allRules).not.toContain('no-restricted-exports');
    });
});
