// @ts-check
import {createConfig} from './dist/lib.js';

export default createConfig({
    rootDir: import.meta.dirname,
    tsconfigs: ['./tsconfig.json', './tsconfig.test.json']
});
