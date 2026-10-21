import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

function getVisiblePages(page: number, totalPages: number): number[] {
  const pages = new Set<number>([1, totalPages, page])
  for (const offset of [-1, 1]) {
    const candidate = page + offset
    if (candidate > 0 && candidate <= totalPages) pages.add(candidate)
  }
  return [...pages].sort((a, b) => a - b)
}

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 pt-4"
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getVisiblePages(page, totalPages).map((pageNumber) => (
        <Button
          key={pageNumber}
          variant={pageNumber === page ? "default" : "outline"}
          size="icon"
          aria-current={pageNumber === page ? "page" : undefined}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  )
}
