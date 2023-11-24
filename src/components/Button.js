import cn from 'clsx'
import { forwardRef } from 'react'

const Button = forwardRef(
  (
    {
      as: Component = 'button',
      className,
      withBorder = false,
      withTransition = true,
      withHover = true,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'flex items-center bg-transparent uppercase px-2 py-2',
          withHover && 'hover:text-white hover:bg-black',
          withBorder && 'border border-current hover:border-black border-solid',
          withTransition && 'transition-colors ease-in-out',
          'disabled:opacity-30 disabled:hover:!bg-white disabled:hover:!text-black',
          className
        )}
        {...props}
      />
    )
  }
)

export default Button
