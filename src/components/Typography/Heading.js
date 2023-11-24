import cn from 'clsx'
import { forwardRef } from 'react'

// Need to do it like this so the tailwind build can find them and not exclude them from the product build of the css
const styles = {
  h0:
    'text-[4.25rem] md:text-[12rem] tracking-[-0.05em] leading-[0.8] font-bold',
  h1:
    'text-[2.5rem] md:text-[4.5rem] tracking-[-0.03em] leading-[0.9] font-bold',
  h2: 'text-[4rem] tracking-[-0.03em] leading-[0.9]',
  h3: 'text-[2.5rem] tracking-[-0.03em] leading-[1.2]',
  h4: 'text-[2rem] tracking-[-0.03em] leading-[1.2]',
  h5: 'text-[1.375rem] tracking-[-0.03em] leading-[1.2]',
  h6: 'text-md tracking-[-0.03em] leading-[1.2]'
}

const Heading = forwardRef((props, ref) => {
  const { as = 'h1', tagStyle, className, ...rest } = props

  // There is no h0, but we have a style for h0
  const Component = as === 'h0' ? 'h1' : as

  return (
    <Component
      ref={ref}
      className={cn(className, 'font-serif ', styles[tagStyle || as])}
      {...rest}
    />
  )
})

export default Heading
