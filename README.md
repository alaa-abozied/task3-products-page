# Task 3 — Products Page (React Query + shadcn/ui + Tailwind)

A responsive Products page built with React 18, TypeScript, Vite, TanStack React Query,
shadcn/ui-style components and Tailwind CSS v4, backed by the DummyJSON API.

## Features

- **Products listing** — `GET /products?limit=12&skip=…`, rendered in a responsive
  `1 / 2 / 3` column grid using the shadcn/ui `Card` component.
- **Server state via React Query** — all fetching goes through `useQuery`; no
  `fetch` + `useEffect` and no server data duplicated into `useState`.
- **Product details** — `/products/:id` fetches the product by id with its own
  query key, so it is cached independently from the list.
- **Search** — debounced input; when a keyword is present the request goes to
  `/products/search?q=…`, otherwise `/products`.
- **Pagination** — server-side pagination via `limit`/`skip`; page state lives in
  the URL (`?page=2&q=phone`) so it is shareable and cache-friendly.
- **States** — skeleton loading state, user-friendly error state with retry, and
  an empty-search-results state.

## Structure

```
src/
  components/
    ProductCard.tsx        # shadcn Card based product card
    Pagination.tsx         # pagination controls
    ui/card.tsx            # shadcn/ui Card
    ui/button.tsx          # shadcn/ui Button
    ui/input.tsx           # shadcn/ui Input
  lib/
    api.ts                 # clean API layer (fetchProducts / fetchProductById)
    query-options.ts       # query keys + queryOptions factories
    utils.ts               # cn() helper
  pages/
    ProductsPage.tsx       # listing, search, pagination
    ProductDetailsPage.tsx # details page
  main.tsx                 # QueryClientProvider + Router
  App.tsx                  # routes
```

## React Query notes

- Query keys are factory-generated in `src/lib/query-options.ts` and change with
  `page`, `limit` and `search`.
- `staleTime` is 5 minutes, so navigating back to a previously visited page or
  product serves from cache instantly.
- `placeholderData: previous` keeps the previous page visible while the next
  page loads, giving a smooth pagination experience.
- `isPending` is used for the initial loading state, `isFetching` for the
  subtle "refreshing" opacity, and `isError` for the error state.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173/products
npm run build    # type-check + production build
npm run lint     # eslint
```

## Stack

- React 18 + TypeScript + Vite
- TanStack React Query v5
- React Router v6
- Tailwind CSS v4 (`@tailwindcss/vite`)
- shadcn/ui component patterns (Card, Button, Input)
- lucide-react icons
