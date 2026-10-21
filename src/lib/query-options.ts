import { queryOptions } from "@tanstack/react-query"
import { fetchProductById, fetchProducts } from "@/lib/api"

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (params: { page: number; limit: number; search: string }) =>
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, "detail"] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
}

export function productsQueryOptions(params: {
  page: number
  limit: number
  search: string
}) {
  return queryOptions({
    queryKey: productKeys.list(params),
    queryFn: () =>
      fetchProducts({
        page: params.page,
        limit: params.limit,
        search: params.search.trim() || undefined,
      }),
    staleTime: 1000 * 60 * 5,
    placeholderData: (previous) => previous,
  })
}

export function productDetailQueryOptions(id: number) {
  return queryOptions({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    staleTime: 1000 * 60 * 5,
  })
}
