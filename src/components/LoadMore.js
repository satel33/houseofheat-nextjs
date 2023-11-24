import { useInView } from 'react-intersection-observer'

import cn from 'clsx'
import { useCallback } from 'react'
import gradients from '../theme/gradients.cjs'
import AnimatedGradient from './AnimatedGradient'
import Ticker from './Ticker'
import Mono from './Typography/Mono'

export default function LoadMore ({
  className,
  onAppearInView,
  options = {},
  text = 'Loading more',
  showGradient = true,
  bgColor
}) {
  const onChange = useCallback(
    inView => {
      if (inView) onAppearInView?.()
    },
    [onAppearInView]
  )
  const mergedOptions = {
    threshold: 0,
    rootMargin: '0% 0px 50% 0px',
    ...options,
    onChange
  }
  const { inView, ref } = useInView(mergedOptions)

  return (
    <div
      ref={ref}
      className={cn(
        className,
        'overflow-hidden border-y border-black/50 relative py-2'
      )}
      style={{ background: !showGradient && bgColor }}
    >
      {showGradient && <AnimatedGradient
        gradient={gradients[0]}
        invert
        duration={2}
        animate={inView}
        className='z-0'
      />}
      <Ticker pxPerSecond={100} animate={inView}>
        <div className='flex items-center'>
          <Mono as='p' className='mx-3'>
            {text}
          </Mono>
        </div>
      </Ticker>
    </div>
  )
}
