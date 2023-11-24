import cn from 'clsx'

import { resolveLink } from '../helpers/resolvers'
import CaretIcon from '../icons/caret.svg'
import Link from './Link'
import Mono from './Typography/Mono'

export const hoverClassNames = ''
// 'after:opacity-0 after:duration-150 hover:after:opacity-100 after:absolute after:-inset-[1px] after:gradients-call-to-action after:blur-[2px] after:-z-1 after:rounded-full'

export default function CallToAction ({ className, link, roundedStyles = true }) {
  if (!link) return null
  const { text, url } = resolveLink(link)

  return (
    <Link
      className={cn(
        roundedStyles && 'bg-white relative inline-flex items-center leading-none px-3 py-2 rounded-full border-[1px]',
        roundedStyles && 'before:-z-1 before:rounded-full',
        roundedStyles && hoverClassNames,
        className
      )}
      to={url}
    >
      <Mono className='inline-flex items-center'>
        {text}
        <CaretIcon className='h-2 ml-2 inline-block' />
      </Mono>
    </Link>
  )
}
