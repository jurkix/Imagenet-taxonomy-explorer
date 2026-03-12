# ImageNet Taxonomy Explorer

Browse and search the ImageNet 2011 Fall Release taxonomy (~61K synset nodes). Parses XML into linear `(path, size)` tuples, stores them in PostgreSQL, and displays them as a lazy-loading tree with search.

## Setup

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:generate
npm run db:migrate
npm run seed
npm run dev
```

App: `http://localhost:5173` | API: `http://localhost:3000`

## Architecture

```
api/              Vercel serverless functions (tree/roots, tree/children, search)
lib/              Shared types, Prisma client, tree builder algorithm (+ tests)
seed/             XML parser + DB seeder (+ tests)
src/              React frontend (Vite + Tailwind CSS 4 + daisyUI)
  ├── api/        Fetch client + React Query hooks
  └── components/ TreeView, SearchBar, SearchResults, DetailModal, ...
e2e/              Playwright end-to-end tests
prisma/           Schema + migrations (includes pg_trgm GIN index)
```

## Linear-to-Tree Algorithm

**`lib/treeBuilder.ts`** reconstructs the tree from DB rows in a single pass using the `parentPath` column for direct parent lookups:

```
for each row (ordered by depth):
  create node, store in Map<path, node>
  if parentPath exists → look up parent in Map, attach as child
  else → this is root
```

**Time: O(n)** — one pass over n rows, each with an O(1) Map lookup.
**Space: O(n)** — Map storing n nodes.

Rows are read ordered by `depth`, guaranteeing parents are processed before children. No sorting, no string splitting — the algorithm directly leverages the denormalized `parentPath` column.

> **Note:** The UI loads the tree lazily by level (via `/api/tree/children`), so `buildTree` is not called at runtime. It exists as the assignment-required reconstruction algorithm, with unit tests in `lib/treeBuilder.test.ts`.

## Design Decisions

**Lazy loading** — Tree loads children on-demand via `parentPath` index. React Query caches responses so re-expanding is instant.

**Virtualization** — Both tree and search results use TanStack Virtual. Only visible rows render.

**Infinite scroll** — Search is paginated server-side (50/page). `useInfiniteQuery` fetches next pages as user scrolls near the bottom.

**Denormalized DB columns** (`parentPath`, `depth`, `name`) — Data is write-once, read-many. Pre-computing avoids runtime string splitting and enables indexed lookups.

**pg_trgm for search** — Trigram GIN index enables fast `ILIKE '%...%'` substring matching. Partial matches ("phyto" finds "phytoplankton") are more useful for taxonomy names than full-text word-boundary search.

**daisyUI** — Tailwind CSS plugin providing component classes (modal, alert, badge, btn, skeleton, stats) without extra runtime. Keeps styling consistent and markup readable.

**UI states** — Search shows distinct states for loading (spinner), error (alert + retry), empty results, stale results (dimmed + spinner overlay while new query loads), and infinite scroll loading. Tree nodes show loading spinners and error icons per-node during lazy expansion.

**Accessibility** — Tree uses ARIA tree pattern (`role="tree"`, `treeitem`, `aria-expanded`, `aria-level`). Modal uses native `<dialog>` with focus trap and backdrop close. All interactive elements are native `<button>` elements.

## Testing

```bash
npm run test        # Unit tests (Vitest) — tree builder, XML parser
npm run test:e2e    # E2E tests (Playwright) — tree, search, modal, error states
```

## API

| Endpoint                                  | Description                       |
| ----------------------------------------- | --------------------------------- |
| `GET /api/tree/roots`                     | Root nodes                        |
| `GET /api/tree/children?parentPath=...`   | Children of a node (lazy loading) |
| `GET /api/search?q=...&limit=50&offset=0` | Paginated search (pg_trgm)        |
