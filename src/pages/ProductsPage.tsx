import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router-dom"
import { PackageSearch, Search, TriangleAlert } from "lucide-react"
import { ProductCard } from "@/components/ProductCard"
import { Pagination } from "@/components/Pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { productsQueryOptions } from "@/lib/query-options"

const PAGE_SIZE = 12

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("q") ?? ""
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1)

  const [searchInput, setSearchInput] = useState(search)

  // Debounce the search input so we hit the API endpoint, not every keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput === search) return
      const next = new URLSearchParams(searchParams)
      if (searchInput.trim()) {
        next.set("q", searchInput.trim())
      } else {
        next.delete("q")
      }
      next.delete("page")
      setSearchParams(next, { replace: true })
    }, 400)

    return () => clearTimeout(timeout)
  }, [searchInput, search, searchParams, setSearchParams])

  const query = useQuery(productsQueryOptions({ page, limit: PAGE_SIZE, search }))

  const products = query.data?.products ?? []
  const total = query.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const isInitialLoading = query.isPending
  const isEmpty = !isInitialLoading && !query.isError && products.length === 0

  const goToPage = (nextPage: number) => {
    const next = new URLSearchParams(searchParams)
    if (nextPage <= 1) {
      next.delete("page")
    } else {
      next.set("page", String(nextPage))
    }
    setSearchParams(next)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Products
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Browse {total > 0 ? `${total} ` : ""}products from the DummyJSON
            catalog.
          </p>
        </div>

        <form
          role="search"
          className="relative w-full sm:w-80"
          onSubmit={(event) => event.preventDefault()}
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search products…"
            aria-label="Search products"
            className="pl-9"
          />
        </form>
      </header>

      {isInitialLoading && (
        <div
          role="status"
          aria-live="polite"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: PAGE_SIZE }, (_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900"
            />
          ))}
          <span className="sr-only">Loading products…</span>
        </div>
      )}

      {query.isError && (
        <div
          role="alert"
          className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/40"
        >
          <TriangleAlert className="h-10 w-10 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
              Something went wrong
            </h2>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {query.error instanceof Error
                ? query.error.message
                : "We couldn't load the products. Please try again."}
            </p>
          </div>
          <Button onClick={() => query.refetch()}>Try again</Button>
        </div>
      )}

      {isEmpty && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 px-6 py-16 text-center dark:border-slate-700">
          <PackageSearch className="h-12 w-12 text-slate-400" />
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            No products found
          </h2>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            We couldn&apos;t find anything matching
            {search ? (
              <>
                {" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  &quot;{search}&quot;
                </span>
              </>
            ) : (
              " your search"
            )}
            . Try a different keyword.
          </p>
          {search && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchInput("")
                const next = new URLSearchParams(searchParams)
                next.delete("q")
                next.delete("page")
                setSearchParams(next, { replace: true })
              }}
            >
              Clear search
            </Button>
          )}
        </div>
      )}

      {!isInitialLoading && !query.isError && products.length > 0 && (
        <>
          <div
            className={`grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 ${
              query.isFetching ? "opacity-60" : "opacity-100"
            }`}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />

          <p className="pt-3 text-center text-sm text-slate-500 dark:text-slate-400">
            Showing page {page} of {totalPages}
          </p>
        </>
      )}
    </div>
  )
}
