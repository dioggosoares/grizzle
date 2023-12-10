import { InputHTMLAttributes, ReactNode, forwardRef } from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  positionIcon?: 'left' | 'right' | 'both'
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leftIcon,
      rightIcon,
      positionIcon = '',
      error,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="flex w-full flex-col gap-1">
        <div
          className={cn(
            `group relative flex h-10 items-center justify-center gap-2 rounded-md border-0 bg-zinc-300/50
            px-1 transition-colors duration-150 ease-linear`,
            {
              'border-red-500': error,
              'hover:border-red-500': error,
              'focus-within:border-primary': !error,
              'px-3':
                positionIcon === 'left' ||
                positionIcon === 'right' ||
                positionIcon === 'both',
            },
          )}
          {...props}
        >
          <span
            className={cn(`text-primary`, {
              hidden: positionIcon === 'right',
              flex: positionIcon === 'left' || positionIcon === 'both',
              'text-red-500': error,
            })}
          >
            {leftIcon}
          </span>
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-md border-0 bg-transparent text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            ref={ref}
            {...props}
          />
          <span
            className={cn(`text-primary`, {
              hidden: positionIcon === 'left',
              flex: positionIcon === 'right' || positionIcon === 'both',
              'text-red-500': error,
            })}
          >
            {rightIcon}
          </span>
        </div>
        {error && (
          <span className="font-medium text-grizzle-danger-foreground">
            {error}
          </span>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

export { Input }
