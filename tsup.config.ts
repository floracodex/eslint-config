import {defineConfig} from 'tsup';

export default defineConfig({
    entry: [
        'src/lib.ts',
        'src/service.ts',
        'src/angular.ts',
        'src/functions.ts'
    ],
    format: ['esm'],
    dts: true,
    clean: true,
    target: 'es2022',
    sourcemap: true,
    splitting: true
});
