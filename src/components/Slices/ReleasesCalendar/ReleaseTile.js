import cn from 'clsx'
import { primaryInput } from 'detect-it'
import gsap from 'gsap'
import { useEffect, useMemo, useRef, useState } from 'react'
import { isColorDark } from '../../../helpers/colors.js'
import { getNewYorkDate, isReleased } from '../../../helpers/dates'
import { getPageLink, getPageThemeColor } from '../../../helpers/page'
import { useSmallBrandLogo } from '../../../hooks/useBrand'
import { useReleaseDate } from '../../../hooks/useReleaseDate'
import colors from '../../../theme/colors.cjs'
import screens from '../../../theme/screens.cjs'
import BrandLogo from '../../ArticleTile/BrandLogo.js'
import BuyNowButton from '../../ArticleTile/BuyNowButton.js'
import Rating from '../../ArticleTile/Rating.js'
import ReleaseCountdown from '../../ArticleTile/ReleaseCountdown'
import Link from '../../Link.js'
import AddToCalendarAction from '../../ReleaseActions/AddToCalendarAction'
import ResponsiveImage from '../../ResponsiveImage'
import Mono from '../../Typography/Mono.js'

export default function ReleaseTile ({ release, className }) {
  const [isHovering, setIsHovering] = useState(false)
  const ref = useRef()
  const contentRef = useRef()
  const footerRef = useRef()
  const boxShadowRef = useRef()
  const { title, styleCode } = release
  const brandLogo = useSmallBrandLogo(release)
  const link = getPageLink(release)
  const backgroundColor = getPageThemeColor(release)
  const isBackgroundDark = isColorDark(backgroundColor)
  const color = isBackgroundDark ? colors.white : colors.black
  const { releaseDate, releaseDateLabel } = useReleaseDate(release)

  const isMobile = primaryInput === 'touch'

  useEffect(() => {
    if (ref.current) {
      const element = ref.current
      let tl = null

      if (isMobile) {
        gsap.set(contentRef.current, {
          y: -footerRef.current.getBoundingClientRect().height + 1
        })
        gsap.set([contentRef.current.children[0], contentRef.current.children[1]], {
          y: 10
        })
        gsap.set(element, { overflow: 'visible' })
      }

      const mouseEnter = () => {
        if (tl) tl.kill()
        if (isMobile) return
        setIsHovering(true)
        tl = gsap.timeline()
        tl.to(contentRef.current, {
          y: -footerRef.current.getBoundingClientRect().height + 1,
          duration: 0.25,
          ease: 'power2.out'
        })
        tl.to(
          [contentRef.current.children[0], contentRef.current.children[1]],
          { y: 10, duration: 0.25, ease: 'power2.out' },
          0
        )
        tl.set(element, { overflow: 'visible' })
      }
      const mouseLeave = () => {
        if (tl) tl.kill()
        if (isMobile) return
        setIsHovering(false)
        tl = gsap.timeline()
        tl.set(element, { overflow: 'hidden' })
        tl.to(contentRef.current, {
          y: 0,
          duration: 0.15,
          ease: 'power2.inOut'
        })
        tl.to(
          [contentRef.current.children[0], contentRef.current.children[1]],
          { y: 0, duration: 0.15, ease: 'power2.inOut' },
          0
        )
      }
      element.addEventListener('mouseenter', mouseEnter)
      element.addEventListener('mouseleave', mouseLeave)
      return () => {
        element.removeEventListener('mouseenter', mouseEnter)
        element.removeEventListener('mouseleave', mouseLeave)
      }
    }
  }, [])

  const releaseDateText = useMemo(() => {
    if (isReleased(releaseDate)) return 'Dropped'
    return releaseDateLabel || getNewYorkDate(releaseDate).format('MMM DD')
  }, [releaseDate])

  return (
    <article
      className={cn(
        className,
        'flex flex-col relative border-[1px] border-neutral-500 overflow-hidden hover:z-1'
      )}
      style={{
        '--background-color': backgroundColor,
        '--color': color,
        color,
        backgroundColor
      }}
      ref={ref}
    >
      <header className='flex justify-between h-10 items-center mx-6 mt-6'>
        {brandLogo && (
          <BrandLogo
            logoImage={brandLogo}
            className='pointer-events-none w-auto h-10'
            light={isBackgroundDark}
          />
        )}
        {!brandLogo && <Mono>{release.brand?.title}</Mono>}
        {/* <div className='flex items-center text-sm'>
          <Rating article={release} isHovering={isHovering}/>
        </div> */}

        <div className='text-[1.2rem] uppercase'>
          {releaseDateText}
        </div>
      </header>
      <Link link={link} showText={false}>
        {release.featuredImage && <ResponsiveImage
          image={release.featuredImage}
          aspect={1.35}
          mobileAspect={1.35}
          contain={!release.featuredImage?.cover}
          fallbackAlt={title}
          imageSizes={`(max-width: ${screens.md}) 100vw, (max-width: ${screens.xl}) 33vw, 25vw`}
        />}
      </Link>
      <div ref={contentRef}>
        <div
          ref={boxShadowRef}
          className='absolute h-2 -top-2 left-0 right-0 opacity-0'
        />
        <Link
          link={link}
          showText={false}
          className='block '
          style={{ backgroundColor: 'var(--background-color)' }}
        >
          <div className='px-6 py-6 relative'>
            <span className='block line-clamp-1 font-serif text-md xl:leading-[1.35] h-6'>
              {title}
            </span>
            <Mono className='inline-block min-h-[1.2em]'>
              <ReleaseCountdown
                date={releaseDate}
                releaseDateLabel={releaseDateLabel}
                key={release._id}
                className='block'
                showCountdownOnly
                fallbackComponent={<span>{styleCode}</span>}
              />
            </Mono>
          </div>
        </Link>
        <footer
          className='pb-6 h-14 absolute top-full left-6 right-6 -my-[1px] pt-[1px]'
          ref={footerRef}
          style={{ backgroundColor: 'var(--background-color)' }}
        >
          <div className='flex justify-between items-center relative text-xs h-9'>
            <div className='line w-100 absolute top-0 left-0 right-0 h-[1px] bg-current opacity-50'/>
            <AddToCalendarAction
              release={release}
              showDropText={false}
              fill={backgroundColor}
              withBorder={false}
              withHover={false}
              classNames={{
                button: 'group !px-0 h-5 hover:!bg-transparent group-hover:!bg-transparent',
                buttonText: 'text-xs group-hover:opacity-60 transition-opacity',
                dropDown: 'mt-2',
                links: 'text-xs !px-2'
              }}
            />
            <div className='flex items-center text-sm'>
              <Rating article={release} isHovering={isHovering}/>
            </div>
            <BuyNowButton
              article={release}
              withTransition={false}
              flash={true}
              className='group h-5 border-[1px] hover:border-black py-1 px-2' textClassName='text-xs'
            />
            <div className='line w-100 absolute bottom-0 left-0 right-0 h-[1px] bg-current opacity-50'/>
          </div>
        </footer>
      </div>
    </article>
  )
}
