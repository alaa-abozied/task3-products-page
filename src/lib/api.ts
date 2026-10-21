const BASE_URL = "https://dummyjson.com"

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  sku: string
  thumbnail: string
  images: string[]
  reviews?: { id: number; rating: number; comment: string }[]
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  })

  if (!response.ok) {
    throw new ApiError(
      `Request failed with status ${response.status}. Please try again.`,
      response.status,
    )
  }

  return (await response.json()) as T
}

export interface ProductQueryParams {
  page: number
  limit: number
  search?: string
}

export async function fetchProducts({
  page,
  limit,
  search,
}: ProductQueryParams): Promise<ProductsResponse> {
  const skip = (page - 1) * limit
  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) })

  if (search) {
    params.set("q", search)
  }

  const endpoint = search
    ? `/products/search?${params.toString()}`
    : `/products?${params.toString()}`

  return request<ProductsResponse>(endpoint)
}

export async function fetchProductById(id: number): Promise<Product> {
  return request<Product>(`/products/${id}`)
}
