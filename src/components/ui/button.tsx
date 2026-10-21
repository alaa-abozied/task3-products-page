import * as React from "react"
import { cn } from "@/lib/utils"
import { buttonVariants, type ButtonVariants } from "@/components/ui/button-variants"

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & ButtonVariants) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button }
