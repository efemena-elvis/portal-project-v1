# AGENTS.md

## Stack

- Vue 3 + TypeScript + Vite 6 + Pinia + Vue Router + Tailwind CSS
- Turborepo monorepo with npm workspaces
- Node >= 18, npm 9.8.1
- **No test framework exists** — do not try to run tests

## Developer commands

```
npm install --legacy-peer-deps   # Required; plain `npm install` will fail
npm run dev                       # Dev server (turbo, all apps)
npm run dev -- --filter=backoffice  # Dev server for backoffice (port 5172)
npm run dev -- --mode staging     # Dev with staging env
npm run build                     # Production build (all apps)
npm run build:staging:backoffice  # Staging build for backoffice
npm run build:prod:backoffice     # Production build for backoffice
npm run check-types               # vue-tsc --noEmit (all packages)
npm run lint                      # eslint over .js .ts .tsx .vue
npm run format                    # prettier --write
```

Or via Makefile: `make dev`, `make build-staging`, `make check-types`, etc.

## Verify order

`check-types` → `lint` → `build`

## Architecture

### Monorepo structure

```
portal-project-v1/
├── apps/
│   └── backoffice/          # Main SPA application
├── packages/
│   ├── assets/              # Static assets (images, SCSS)
│   ├── constants/           # App constants, themes, configs
│   ├── hooks/               # Vue composables
│   ├── models/              # TypeScript interfaces/types
│   └── uikit/               # Shared Vue components
├── turbo.json               # Turborepo pipeline config
└── package.json             # Root workspace config
```

### App (apps/backoffice/)

- Single SPA entry: `apps/backoffice/src/main.ts` mounts to `#app`
- Feature modules live in `apps/backoffice/src/modules/` (auth, aggregators, approvals, compliance, disputes, error, external, fees, global, manage-teams, merchants, overview, payments, transactions) — each exports its own routes
- Routes assembled in `apps/backoffice/src/router/index.ts` by spreading module routes
- `apps/backoffice/src/middlewares/index.ts` — global `beforeEach` guard using `useRouteGuard` from `@packages/hooks`
- Auth token key: `PORTAL_AUTH_TOKEN`; routes use meta flags: `public`, `requiresAuth`, `guest`, `open`
- Global toast alerts via mitt eventBus (events: `triggerToastAlert`, `closeToastAlert`)

## Internal packages (`packages/`)

npm workspaces — resolved via package.json `dependencies`:
| Package | Path | Purpose |
|---|---|---|
| `@packages/uikit` | `packages/uikit/` | Shared Vue components (MetaData, ToastCard, etc.) |
| `@packages/hooks` | `packages/hooks/` | Composables incl. `useRouteGuard` |
| `@packages/models` | `packages/models/` | TypeScript interfaces/types |
| `@packages/constants` | `packages/constants/` | App constants |
| `@packages/assets` | `packages/assets/` | Static assets (images, SCSS) |

Path aliases (in `vite.config.mjs` and `tsconfig.json`):
| Alias | Resolves to |
|---|---|
| `@/*` | `apps/backoffice/src/*` |
| `@packages/*` | `packages/*` |
| `@assets` | `packages/assets/scss` |
| `@images` | `packages/assets/images` |

## CI/CD

- Both GitLab CI (`.gitlab-ci.yml`) and GitHub Actions (`.github/workflows/`) configured
- Deploys to S3 + CloudFront on push to `staging` or `main`
- App: **backoffice** — deploys from `apps/backoffice/dist`
- Build scripts: `build:staging:backoffice`, `build:prod:backoffice`

## Style conventions

- Prettier: single quotes, no semicolons, no trailing commas
- ESLint 7.x (legacy) — do not upgrade without confirming with team
- `<script setup lang="ts">` preferred in SFCs

## Env loading

- Vite `--mode` flag selects `.env.<mode>` file (staging, production)
- Default `.env` points to production API: `https://api.portal.vesicash.com`
