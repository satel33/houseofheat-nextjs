import cn from 'clsx'
import { useCallback, useEffect, useState } from 'react'

import { useDebouncedCallback } from '../../hooks/useDebouncedCallback'
import { useWindowResize } from '../../hooks/useWindowResize'
import screens from '../../theme/screens.cjs'
import BrandLogo from '../ArticleTile/BrandLogo'
import Ticker from '../Ticker'

export default function ToolbarTitle ({
  className,
  logo,
  text,
  light,
  marquee = false
}) {
  const [isMarqueeEnabled, setMarqueeEnabled] = useState(marquee)
  // We want to enable the marquee on mobile even for the release toolbar
  const checkMarquee = useCallback(() => {
    if (!marquee) {
      setMarqueeEnabled(window.innerWidth < parseInt(screens.md, 10))
    }
  }, [marquee])

  useWindowResize(useDebouncedCallback(checkMarquee, 300, [checkMarquee]))
  useEffect(checkMarquee, [text, checkMarquee])

  const TextComponent = isMarqueeEnabled ? Ticker : 'span'

  const maskStyles = {
    maskImage: 'linear-gradient(270deg,transparent,#000 10%,#000 95%,transparent)',
    WebkitMaskImage: 'linear-gradient(270deg,transparent,#000 10%,#000 95%,transparent)'
  }
  const marqueeWrapStyles = isMarqueeEnabled ? maskStyles : {}

  return (
    <div
      className={cn(
        className,
        'flex grow shrink items-center col overflow-hidden'
      )}
    >
      {logo && (
        <BrandLogo
          logoImage={logo}
          light={light}
          className='hidden md:block w-auto h-9 mr-10 shrink-0'
        />
      )}
      <div className='overflow-hidden w-full' style={marqueeWrapStyles}>
        <TextComponent
          className='whitespace-nowrap text-ellipsis block grow shrink'
          {...(isMarqueeEnabled ? { pxPerSecond: 20 } : {})}
        >
          <span className='mr-8 ml-3 relative before:block before:absolute before:-left-3 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-current before:rounded-full'>
            {text}
          </span>
        </TextComponent>
      </div>
    </div>
  )
}
