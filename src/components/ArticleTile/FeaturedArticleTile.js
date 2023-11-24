import cn from 'clsx'

import { map } from 'lodash'
// import { forwardRef, useMemo, useState, useCallback, useRef, useEffect } from 'react'
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react'

import { primaryInput } from 'detect-it'
import {
  getForegroundColorFromBackgroundColor,
  isColorDark
} from '../../helpers/colors'
import { getPageThemeColor } from '../../helpers/page'
import { useLargeBrandLogo } from '../../hooks/useBrand'
import Caret from '../ArticleTile/caret.svg'
import Link from '../Link'
import Heading from '../Typography/Heading'
import Mono from '../Typography/Mono'
import ArticleImageSlider from './ArticleImageSlider'
import ArticleMeta from './ArticleMeta'
import ArticleMetaTags from './ArticleMetaTags'
import BrandLogo from './BrandLogo'
import BuyNowButton from './BuyNowButton'
// import gsap from 'gsap'
import useComposeRefs from '../../hooks/useComposeRefs'

const Meta = ({ article, variant, classNames, isHovering }) => {
  if (article.pageType === 'release') {
    return (
      <div className='flex flex-col'>
        <ArticleMeta
          article={article}
          showRatingProgressBar
          variant={variant}
          classNames={classNames}
          isHovering={isHovering}
        />
         <div className={cn('line w-100 top-0 left-0 right-0 h-[1px] bg-current opacity-50')}/>
        <ArticleMetaTags
          article={article}
          className={cn(
            'grid gap-1 grid-cols-2',
            variant === 'featured-homepage' &&
              'md:gap-6 md:grid-cols-8 xl:grid-cols-9 text-xs h-[calc(2.25rem-2px)]',
            variant === 'featured' && 'md:gap-6 md:grid-cols-12 text-xs'
          )}
          classNames={{
            time: cn(
              (variant === 'featured-homepage' || variant === 'featured') &&
                'md:col-start-5 md:col-span-3 md:!justify-self-start text-xs'
            ),
            tags: cn(
              (variant === 'featured-homepage' || variant === 'featured') &&
                'md:col-span-4 text-xs'
            )
          }}
        />
      </div>
    )
  }
  return (
    <ArticleMeta article={article} variant={variant} isHovering={isHovering} />
  )
}

const FeaturedArticleTile = forwardRef(
  (
    {
      article,
      className,
      isFullWidth = false,
      logoPosition,
      variant = 'tile',
      preload,
      imageSizes
    },
    ref
  ) => {
    const anotherRef = useRef()
    // const localsRef = useRef({ })
    const [isHovering, setIsHovering] = useState(false)
    const { title, featuredImages } = article
    const brandLogo = useLargeBrandLogo(article)

    const backgroundColor = getPageThemeColor(article)
    const foregroundColor = getForegroundColorFromBackgroundColor(
      backgroundColor
    )

    const images = useMemo(() => {
      return map(featuredImages, image => ({
        ...image,
        className: !image.cover
          ? variant === 'homepage'
            ? 'p-4 md:p-8'
            : 'p-0 md:p-8'
          : variant === 'homepage'
            ? 'p-4 sm:p-10'
            : ''
      }))
    }, [variant, featuredImages])

    // useEffect(() => {
    //   if (!isHovering) return
    //   if (!anotherRef?.current) return
    //   if (localsRef.current.timeline) localsRef.current.timeline.kill()

    //   const tl = gsap.timeline()
    //   tl.fromTo(anotherRef.current.querySelectorAll('.line'), {
    //     scaleX: 1,
    //     transformOrigin: '100% 0'
    //   }, {
    //     scaleX: 0,
    //     duration: 0.5,
    //     ease: 'power3.inOut',
    //     overwrite: true
    //   })

    //   tl.fromTo(anotherRef.current.querySelectorAll('.line'), {
    //     scaleX: 0,
    //     transformOrigin: '0% 0'
    //   }, {
    //     scaleX: 1,
    //     duration: 0.4,
    //     ease: 'power3.inOut'
    //   })

    //   localsRef.current.timeline = tl
    // }, [isHovering])

    const onMouseEnter = useCallback(() => {
      setIsHovering(true)
    }, [])

    const onMouseLeave = useCallback(() => {
      setIsHovering(false)
    }, [])

    const composedRef = useComposeRefs(ref, anotherRef)

    return (
      <article
        style={{ backgroundColor, color: foregroundColor }}
        className={cn(
          className,
          'flex flex-col relative -mx-4 md:mx-0',
          (backgroundColor === '#fff' || backgroundColor === '#ffffff') &&
            'border-[1px] border-neutral-500'
        )}
        ref={composedRef}
        onMouseEnter={primaryInput !== 'touch' ? onMouseEnter : undefined}
        onMouseLeave={primaryInput !== 'touch' ? onMouseLeave : undefined}
      >
        <ArticleImageSlider
          article={article}
          images={images}
          mobileAspect={variant === 'homepage' ? 1.67 : 1.16}
          aspect={1.67}
          slideClassName={cn('lg:max-w-[57vw] m-auto h-full', images?.length === 1 && 'w-full')}
          preload={preload}
          imageSizes={imageSizes}
          className={cn('grow m-auto w-full self-center', images?.length === 1 && 'flex')}
        />
        {variant === 'homepage' && images.length > 1 && (
          <Mono className='relative flex md:hidden justify-center items-center top-[-10px]'>
            <Caret className='rotate-180' />
            <span className='block mx-4 pt-[1px]'>Drag</span>
            <Caret />
          </Mono>
        )}
        <div
          className={cn(
            'flex justify-end flex-col overflow-hidden',
            variant === 'homepage'
              ? 'px-4 pb-4 pt-4 md:px-6 md:pb-6 md:pt-0'
              : 'px-6 pb-6 pt-6 md:pt-2'
          )}
        >
          {/* <div className={cn('line w-100 mb-2 h-[1px] bg-current opacity-50')} /> */}
          <div className='block md:flex'>
            <BrandLogo
              logoImage={brandLogo}
              className={cn(
                logoPosition === 'top' && 'absolute top-6',
                'mb-4 md:mr-16 md:mb-0 pointer-events-none w-auto h-10 md:h-16'
              )}
              light={isColorDark(backgroundColor)}
            />
            <Link
              link={article}
              showText={false}
              className='block relative'
              scroll={false}
              prefetch={preload}
            >
              <Heading
                tagStyle='h4'
                as='h2'
                className={cn(
                  'mb-2',
                  isFullWidth ? 'mt-2' : 'max-w-lg line-clamp-3'
                )}
              >
                {title}
              </Heading>
            </Link>
          </div>
          {article.pageType === 'release' && <div className={cn('line w-100 top-0 left-0 right-0 h-[1px] bg-current opacity-50')}/>}
          <Meta
            article={article}
            variant={variant === 'homepage' ? 'featured-homepage' : 'featured'}
            classNames={{
              buyNowButton: variant === 'homepage' ? 'hidden md:flex' : 'flex'
            }}
            isHovering={isHovering}
          />
          {article.pageType === 'release' && <div className={cn('line w-100 top-0 left-0 right-0 h-[1px] bg-current opacity-50', variant === 'homepage' && 'hidden md:block')}/>}
          {variant === 'homepage' && (
            <BuyNowButton
              article={article}
              withBorder
              className='w-full justify-center flex md:hidden py-4'
            />
          )}
        </div>
      </article>
    )
  }
)

export default FeaturedArticleTile
