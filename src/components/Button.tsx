// shadcnをベースに作成
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva('inline-flex items-center rounded', {
  variants: {
    variant: {
      blue: 'bg-primary text-white',
      outline: 'bg-white text-black',
      sepia: 'bg-primary text-white invert sepia filter',
    },
    size: { 
      md: 'px-3 py-1.5',
      sm: 'px-3 py-1.5 text-xs',
      icon: 'h-9 w-9',
    },
  },
  defaultVariants: {
    variant: 'blue',
    size: 'md',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
