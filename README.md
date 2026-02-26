# ImageNet Taxonomy Explorer

Full-stack app for browsing and searching the ImageNet 2011 Fall Release taxonomy (~61K synset nodes). Parses XML into linear `(string, number)` tuples, stores them in PostgreSQL, and displays them as a lazy-loading tree with search.

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

## My Approach

I started by defining the tech stack and project structure. I chose React 19 with TypeScript and Vite 6 for a fast, type-safe frontend. Tailwind CSS 4 for styling (utility-first, no custom CSS files to maintain). Prisma with PostgreSQL for the database layer (type-safe queries and easy migrations).

For the specific challenges of this project: TanStack Virtual to handle rendering 60K+ tree nodes without performance issues, React Query v5 for lazy-loading with built-in caching, and Storybook for isolated component development.

I used AI for routine scaffolding (boilerplate, configs, initial component wiring) and then rewrote everything to match my standards: UI design, code patterns, architecture decisions. I also used AI to challenge my choices through code review.

Unit tests cover the core logic (XML parsing, tree reconstruction algorithm) using Vitest.

## Architecture

```
api/              Vercel serverless functions (tree/roots, tree/children, search)
lib/              Shared logic: types, Prisma client, tree reconstruction algorithm (+ tests)
seed/             XML source, parser + DB seeder (+ tests)
src/              React frontend (Vite + Tailwind CSS 4)
  ├── api/        Fetch client + React Query hooks
  ├── components/ TreeView, Search, Layout, common (Modal, ErrorBoundary)
  └── hooks/      useDebounce, useSearchState, useTreeExpansion
prisma/           Schema + migrations (includes pg_trgm GIN index)
```

## Linear-to-Tree Algorithm

**`lib/treeBuilder.ts`** reconstructs the tree from flat `(path, size)` tuples:

1. Sort by depth (ascending) so parents exist in Map before children
2. For each tuple: split path, find parent via `Map<path, TreeNode>`, attach as child

**Time: O(n \* m)** where n = 61K tuples, m = avg depth (~5). Map lookup is O(1). With bounded depth (max 13), effectively **O(n)**.

**Space: O(n \* m)** for Map entries + output tree.

## Design Decisions

**Lazy loading** - Tree loads children on-demand. React Query caches responses so re-expanding is instant.

**Virtualization** - Both tree and search results use TanStack Virtual. Only visible rows are rendered.

**Infinite scroll in search** - Results are paginated server-side (50/page). `useInfiniteQuery` fetches next pages as user scrolls near the bottom. Combined with virtualization, this handles thousands of results smoothly.

**Denormalized DB columns** (`parentPath`, `depth`, `name`) - Data is write-once (seeded from XML), read-many. Pre-computing these avoids runtime string splitting on every query.

**pg_trgm for search** - Trigram index enables fast `ILIKE '%...%'` substring matching. Partial matches ("phyto" finds "phytoplankton") are more useful for taxonomy names than full-text word-boundary search.

**React.memo on TreeNodeRow** - Prevents re-rendering all visible rows when a single node is toggled.

**Accessibility** - Tree uses ARIA tree pattern (`role="tree"`, `treeitem`, `aria-expanded`, `aria-level`). Modal has `aria-modal` with focus restoration and Escape to close. All interactive elements are keyboard-navigable via native `<button>` elements.

## What I'm Most Proud Of

The tree expansion system. A `Set<string>` of expanded paths drives `useQueries` to subscribe to all open nodes simultaneously. React Query handles caching and deduplication. The tree flattens into a virtual list via `useMemo` on every toggle, and only visible rows hit the DOM.

## API

| Endpoint                                  | Description                       |
| ----------------------------------------- | --------------------------------- |
| `GET /api/tree/roots`                     | Root nodes                        |
| `GET /api/tree/children?parentPath=...`   | Children of a node (lazy loading) |
| `GET /api/search?q=...&limit=50&offset=0` | Paginated search (pg_trgm)        |
