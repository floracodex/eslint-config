import {describe, expect, it} from 'vitest';
import {createConfig} from '../src/lib.js';
import {serializeConfig} from './snapshot-helper.js';

describe('lib preset', () => {
    it('matches snapshot with explicit tsconfigs', () => {
        const config = createConfig({
            rootDir: '/fake/root',
            tsconfigs: ['./tsconfig.json', './tsconfig.test.json']
        });
        expect(serializeConfig(config)).toMatchSnapshot();
    });

    it('falls back to projectService when tsconfigs omitted', () => {
        const config = createConfig({rootDir: '/fake/root'});
        expect(serializeConfig(config)).toMatchSnapshot();
    });

    it('appends extra ignores', () => {
        const config = createConfig({
            rootDir: '/fake/root',
            tsconfigs: ['./tsconfig.json'],
            ignores: ['custom-ignore/**']
        });
        const ignoreBlock = serializeConfig(config).find((b) => b.ignores);
        expect(ignoreBlock?.ignores).toContain('custom-ignore/**');
    });
});
