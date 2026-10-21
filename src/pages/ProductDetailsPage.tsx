import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, Star, TriangleAlert } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { productDetailQueryOptions } from "@/lib/query-options"

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)

  const query = useQuery({
    ...productDetailQueryOptions(productId),
    enabled: Number.isFinite(productId),
  })

  if (query.isPending) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="mx-auto w-full max-w-4xl px-4 py-10"
      >
        <div className="h-96 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-900" />
        <span className="sr-only">Loading product details…</span>
      </div>
    )
  }

  if (query.isError || !query.data) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10">
        <div
          role="alert"
          className="flex flex-col items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900 dark:bg-red-950/40"
        >
          <TriangleAlert className="h-10 w-10 text-red-500" />
          <div>
            <h1 className="text-lg font-semibold text-red-700 dark:text-red-300">
              We couldn&apos;t load this product
            </h1>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {query.error instanceof Error
                ? query.error.message
                : "The product may no longer exist."}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => query.refetch()}>Try again</Button>
            <Link to="/products" className={buttonVariants({ variant: "outline" })}>
              Back to products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const product = query.data

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link
        to="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" /> Back to products
      </Link>

      <Card className="overflow-hidden">
        <div className="grid gap-8 p-6 md:grid-cols-2">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-72 w-full rounded-lg bg-slate-100 object-contain"
          />

          <div className="flex flex-col gap-4">
            <div>
              <CardHeader className="px-0">
                <CardTitle className="text-2xl text-slate-900 dark:text-slate-50">
                  {product.title}
                </CardTitle>
                <CardDescription className="mt-2">
                  {product.brand} &middot; {product.category} &middot; SKU{" "}
                  {product.sku}
                </CardDescription>
              </CardHeader>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                ${product.price.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
                  -{product.discountPercentage}% off
                </span>
              )}
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {product.description}
            </p>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <dt className="text-slate-500">Rating</dt>
                <dd className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-50">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)}
                </dd>
              </div>
              <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
                <dt className="text-slate-500">Stock</dt>
                <dd className="font-semibold text-slate-900 dark:text-slate-50">
                  {product.stock}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        {product.reviews && product.reviews.length > 0 && (
          <CardContent className="border-t border-slate-100 pt-6 dark:border-slate-800">
            <h2 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">
              Reviews
            </h2>
            <ul className="space-y-3">
              {product.reviews.map((review) => (
                <li
                  key={review.id}
                  className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-900"
                >
                  <div className="mb-1 inline-flex items-center gap-1 font-medium text-slate-900 dark:text-slate-50">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {review.rating}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{review.comment}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        )}

        <CardFooter className="border-t border-slate-100 pt-6 dark:border-slate-800">
          <Button className="w-full sm:w-auto">Add to cart</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
