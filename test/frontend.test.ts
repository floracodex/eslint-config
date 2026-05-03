import {describe, expect, it} from 'vitest';
import {createConfig} from '../src/frontend.js';
import {serializeConfig} from './snapshot-helper.js';

describe('frontend preset', () => {
    it('matches snapshot', () => {
        const config = createConfig({rootDir: '/fake/root'});
        expect(serializeConfig(config)).toMatchSnapshot();
    });

    it('includes an HTML template block', () => {
        const config = createConfig({rootDir: '/fake/root'});
        const htmlBlock = serializeConfig(config).find(
            (b) => Array.isArray(b.files) && (b.files as string[]).includes('**/*.html')
        );
        expect(htmlBlock).toBeDefined();
    });

    it('does not bake in an fc- selector prefix', () => {
        const config = createConfig({rootDir: '/fake/root'});
        const allRules = serializeConfig(config).flatMap((b) => Object.keys(b.rules ?? {}));
        expect(allRules).not.toContain('@angular-eslint/component-selector');
        expect(allRules).not.toContain('@angular-eslint/directive-selector');
    });
});
