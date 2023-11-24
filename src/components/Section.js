import cn from 'clsx'
import { forwardRef } from 'react'

const Section = forwardRef(
  (
    {
      as: Component = 'section',
      grid = false,
      noGutter,
      noBottomMargin,
      className,
      width = 'w-auto',
      ...rest
    },
    ref
  ) => {
    let classes = cn(
      width,
      !noBottomMargin && 'mb-16 md:mb-20',
      grid && gridClasses
    )
    classes = cn(classes, !noGutter && 'px-4 md:px-6 mx-auto')

    return <Component ref={ref} className={cn(classes, className)} {...rest} />
  }
)

export const gridClasses = 'grid grid-cols-12 gap-4 md:gap-6'

export default Section
