import cn from 'clsx'

import Heading from '../../Typography/Heading'

export default function MobileToggle ({ active, children, onClick }) {
  return (
    <Heading
      as='button'
      tagStyle='h0'
      className={cn('font-sans', active ? 'underline' : 'opacity-10')}
      onClick={() => {
        onClick?.()
      }}
    >
      {children}
    </Heading>
  )
}
