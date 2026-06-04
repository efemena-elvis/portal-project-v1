# AGENTS.md

## Stack

- Vue 3 + TypeScript + Vite 6 + Pinia + Vue Router + Tailwind CSS
- Node >= 18, npm 9.8.1
- **No test framework exists** — do not try to run tests

## Developer commands

```
npm install --legacy-peer-deps   # Required; plain `npm install` will fail
npm run dev                       # Dev server on port 5172 (not default 5173)
npm run dev -- --mode staging     # Dev with staging env
npm run build                     # Production build
npm run build -- --mode staging   # Staging build
npm run check-types               # vue-tsc --noEmit
npm run lint                      # eslint over .js .ts .tsx .vue
npm run format                    # prettier --write
```

Or via Makefile: `make dev`, `make build-staging`, `make check-types`, etc.

## Verify order

`check-types` → `lint` → `build`

## Architecture

- Single SPA entry: `src/main.ts` mounts to `#app`
- Feature modules live in `src/modules/` (auth, balances, compliance, error, external, global, overview, payments, settings) — each exports its own routes
- Routes assembled in `src/router/index.ts` by spreading module routes
- `src/middlewares/index.ts` — global `beforeEach` guard using `useRouteGuard` from `@packages/hooks`
- Auth token key: `MOR_AUTH_TOKEN`; routes use meta flags: `public`, `requiresAuth`, `guest`, `open`
- Global toast alerts via mitt eventBus (events: `triggerToastAlert`, `closeToastAlert`)

## Internal packages (`packages/`)

Not npm workspaces — resolved via TypeScript path aliases:
| Alias | Path | Purpose |
|---|---|---|
| `@/*` | `src/*` | App source |
| `@packages/uikit` | `packages/uikit/src` | Shared Vue components (MetaData, ToastCard, etc.) |
| `@packages/hooks` | `packages/hooks/src` | Composables incl. `useRouteGuard` |
| `@packages/models` | `packages/models/src` | TypeScript interfaces/types |
| `@packages/constants` | `packages/constants/src` | App constants |
| `@packages/assets` | `packages/assets/` | Static assets (images, SCSS) |
| `@assets` | `packages/assets/scss` | Vite alias for SCSS |
| `@images` | `packages/assets/images` | Vite alias for images |

## CI/CD

- Both GitLab CI (`.gitlab-ci.yml`) and GitHub Actions (`.github/workflows/`) configured
- Deploys to S3 + CloudFront on push to `staging` or `main`
- Single portal-backoffice app with standard build scripts

## Style conventions

- Prettier: single quotes, no semicolons, no trailing commas
- ESLint 7.x (legacy) — do not upgrade without confirming with team
- `<script setup lang="ts">` preferred in SFCs

## Env loading

- Vite `--mode` flag selects `.env.<mode>` file (staging, production)
- Default `.env` points to production API: `https://api.mor.vesicash.com`
