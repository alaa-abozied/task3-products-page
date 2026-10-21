# Architecture Notes — Task 3 Products Page

## Data flow

```
UI (ProductsPage / ProductDetailsPage)
        │  useQuery(queryOptions({ ... }))
        ▼
query-options.ts  →  queryKey = ["products","list",{page,limit,search}]
        │
        ▼
api.ts  →  fetch("https://dummyjson.com/products/search?q=…&limit=…&skip=…")
```

No component calls `fetch` directly and no API payload is mirrored into
`useState`. The only local state in the UI is:

- `searchInput` — the raw text typed in the search box (client-only input state).
- URL search params (`q`, `page`) — the *intent* of the request, not the response.

## Why the query key matters

`productKeys.list({ page, limit, search })` produces a distinct cache entry per
combination, so:

- typing a new keyword fetches `/products/search?q=…` and caches it.
- changing the page reuses the same query with a different `skip`.
- going back to a previously visited page/product is served instantly from cache
  (`staleTime` = 5 minutes).

`productKeys.detail(id)` is a separate key, so opening a product never
invalidates the list.

## Loading vs. fetching vs. error

| Flag | Meaning | UI |
|---|---|---|
| `isPending` | no data yet (first load) | skeleton cards |
| `isFetching` | refetching in background | grid dimmed (`opacity-60`) |
| `isError` | request failed | error panel + "Try again" |
| `products.length === 0` | valid empty response | empty-search state |

`placeholderData: (previous) => previous` keeps the previous page visible
while the next one loads, so pagination feels instant.

## Pagination

The API's `limit`/`skip` are used directly — products are never downloaded in
full and sliced locally. `skip = (page - 1) * limit`.

## Search

The search box is debounced (400 ms) and only then does the URL `q` param
change, which in turn changes the query key and triggers the API search
endpoint. Clearing the search removes `q` and the app falls back to
`/products`.
