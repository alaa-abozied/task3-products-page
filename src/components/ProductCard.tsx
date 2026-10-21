import { Link } from "react-router-dom"
import { Star } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button-variants"
import type { Product } from "@/lib/api"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
            -{product.discountPercentage}%
          </span>
        )}
      </div>

      <CardHeader>
        <CardTitle className="line-clamp-1 text-base text-slate-900 dark:text-slate-50">
          {product.title}
        </CardTitle>
        <CardDescription className="line-clamp-1">
          {product.brand} &middot; {product.category}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
          ${product.price.toFixed(2)}
        </span>
        <span className="inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {product.rating.toFixed(1)}
        </span>
      </CardContent>

      <CardFooter>
        <Link to={`/products/${product.id}`} className={buttonVariants({ variant: "outline" })}>
          View details
        </Link>
      </CardFooter>
    </Card>
  )
}
