# FoodConnect Web Monorepo

FoodConnect web surfaces use plain npm workspaces:

- `npm install` installs all workspace dependencies.
- `npm run dev:seller`, `npm run dev:admin`, or `npm run dev:b2b` starts one app.
- `npm run typecheck`, `npm run lint`, and `npm run build` run workspace checks.

The existing `customer-app` and `web` starter remain outside this new `apps/*` and `packages/*` structure.
