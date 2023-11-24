import { useCallback } from 'react'

import cn from 'clsx'
import { hasBuyNowLinks } from '../../helpers/page'
import { useReleaseDate } from '../../hooks/useReleaseDate'
import Button from '../Button'
import { useBuyNowDialogToggleCallback } from '../BuyNowDialog.js/buyNowState'
import Mono from '../Typography/Mono'
import CaretIcon from './caret.svg'

export default function BuyNowButton ({
  article,
  fontSize,
  textClassName,
  flash = false,
  ...props
}) {
  const { released } = useReleaseDate(article)
  const toggleBuyNowDialog = useBuyNowDialogToggleCallback()
  const onBuyClick = useCallback(
    e => {
      toggleBuyNowDialog(article)
      e.stopPropagation()
    },
    [article, toggleBuyNowDialog]
  )

  if (!hasBuyNowLinks(article)) return null

  return (
    <Button onClick={onBuyClick} {...props}>
      <span
        className={cn(
          'rounded-full w-[0.3125rem] h-[0.3125rem] mr-2 block',
          released ? 'bg-green' : 'bg-red'
        )}
      />
      <Mono size={fontSize} className={cn('whitespace-nowrap', textClassName, flash && 'group-hover:animate-flash')}>
        Buy Now
      </Mono>
      <CaretIcon className='ml-2 block' />
    </Button>
  )
}
