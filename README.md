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

ESLint itself is a peer dependency. All other plugin dependencies are bundled — consumers do not need to install them directly.

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

export default createConfig({
    rootDir: import.meta.dirname
});
```

The frontend preset is intentionally minimal beyond TypeScript and template fundamentals. Project-specific rules (e.g. component selector prefixes) belong in the consumer's own config — see [Overrides](#overrides) below.

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

## Self-lint chicken-and-egg

The package self-lints with its own `lib` preset, which means `eslint.config.mjs` imports from `dist/`. Run `npm run build` before `npm run lint` in this repo.

## License

MIT — Copyright Flora Codex, LLC.
