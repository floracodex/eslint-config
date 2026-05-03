# @floracodex/eslint-config

Shared ESLint flat-config presets for [Flora Codex](https://floracodex.com) TypeScript projects.

> This package exists to keep Flora Codex's projects on a single, consistent ESLint configuration. It is published publicly so our consumers can install it from npm. It is not a community-facing project — issues, feature requests, and PRs are not actively triaged from outside contributors.

## Presets

Four presets, exported as separate subpaths so consumers only pull in the dependencies they need.

| Preset | Subpath | For |
|---|---|---|
| `lib` | `@floracodex/eslint-config/lib` | Standalone TypeScript libraries (Node ≥20, no framework) — strict rules |
| `backend` | `@floracodex/eslint-config/backend` | Backend service applications — lax rules, `*.spec.ts` overrides, jest globals, CommonJS |
| `frontend` | `@floracodex/eslint-config/frontend` | Frontend apps and libs — browser + jasmine globals, HTML template rules |
| `functions` | `@floracodex/eslint-config/functions` | Cloud function runtimes (Node 20) — node + jest globals, CommonJS, default-export friendly |

The `lib` preset is intentionally stricter than the application presets (severity = `error` on safety rules; the app presets downgrade them to `warn` to accommodate codebases that aren't fully strict-typed yet).

## Install

```sh
npm install --save-dev @floracodex/eslint-config eslint
```

ESLint itself is a peer dependency. Plugin dependencies (`typescript-eslint`, `@stylistic/eslint-plugin`, `globals`, `@eslint/js`, `angular-eslint`) ship as transitive dependencies — consumers do not need to install them directly.

## Usage

### lib

```js
// eslint.config.mjs
import {createConfig} from '@floracodex/eslint-config/lib';

export default createConfig({
    rootDir: import.meta.dirname,
    tsconfigs: ['./tsconfig.json', './tsconfig.test.json']
});
```

### backend

```js
import {createConfig} from '@floracodex/eslint-config/backend';

export default createConfig({
    rootDir: import.meta.dirname
});
```

### frontend

```js
import {createConfig} from '@floracodex/eslint-config/frontend';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    ...createConfig({rootDir: import.meta.dirname}),
    {
        files: ['**/*.ts'],
        rules: {
            '@angular-eslint/component-selector': ['warn', {type: 'element', prefix: 'fc', style: 'kebab-case'}],
            '@angular-eslint/directive-selector': ['warn', {type: 'attribute', prefix: 'fc', style: 'camelCase'}]
        }
    }
);
```

The frontend preset deliberately does **not** enforce a component selector prefix — projects set their own.

### functions

```js
import {createConfig} from '@floracodex/eslint-config/functions';

export default createConfig({
    rootDir: import.meta.dirname
});
```

## Factory options

```ts
interface CreateConfigOptions {
    rootDir: string;          // pass import.meta.dirname
    tsconfigs?: string[];     // explicit `parserOptions.project` paths; falls back to projectService when omitted
    ignores?: string[];       // appended to the preset's defaults
}
```

## Overrides

Each preset returns a flat-config array. Spread it and append your own blocks:

```js
import {createConfig} from '@floracodex/eslint-config/backend';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    ...createConfig({rootDir: import.meta.dirname}),
    {
        files: ['scripts/**'],
        rules: {'no-console': 'off'}
    }
);
```

## Versioning

- **major** — rule semantic change (a previously passing codebase may now fail)
- **minor** — new rules, plugin upgrades that are non-semantic
- **patch** — bugfixes, doc-only

Plugin versions are pinned internally; consumers pick up upgrades via `npm update`.

## Build before lint

The package's own `eslint.config.mjs` imports `createConfig` from `./dist/lib.js` — ESLint cannot load the config until `dist/` has been built. Run `npm run build` before `npm run lint` in this repo. The config file itself is not linted (it is in the default ignore list); the constraint is purely about ESLint being able to resolve the runtime import.

## License

MIT — Copyright Flora Codex, LLC.
