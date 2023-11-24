import cn from 'clsx'
import { primaryInput } from 'detect-it'
import { useMemo, useRef } from 'react'

import { isColorDark, showBorder } from '../../helpers/colors'
import { getImages, getPageLink, getPageThemeColor } from '../../helpers/page'
import { useSmallBrandLogo } from '../../hooks/useBrand'
import colors from '../../theme/colors.cjs'
import screens from '../../theme/screens.cjs'
import Link from '../Link'
import ArticleImageSlider from './ArticleImageSlider'
import ArticleMeta from './ArticleMeta'
import BrandLogo from './BrandLogo'
import Rating from './Rating.js'
import useArticleHoverEffect from './useArticleHoverEffect'

export default function ArticleTile ({
  article,
  className,
  imageClassName,
  imageAspect = 1.47,
  mobileImageAspect = 1.25,
  centerAlignTitle,
  classNames = {},
  showRating,
  preload
}) {
  const contentRef = useRef()

  const { title } = article
  const images = getImages(article)
  const brandLogo = useSmallBrandLogo(article)
  const link = getPageLink(article)
  const backgroundColor = getPageThemeColor(article)
  const isBackgroundDark = isColorDark(backgroundColor)
  const color = isBackgroundDark ? colors.white : colors.black

  const { isHovering, articleRef, onMouseEnter, onMouseLeave, onMouseMove } = useArticleHoverEffect(!images?.[0].cover)

  const slideImages = useMemo(
    () =>
      images.map(image => ({
        ...image,
        className: !image.cover
          ? imageClassName || 'px-4 py-4 md:px-12 md:py-8'
          : ''
      })),
    [images, imageClassName]
  )

  return (
    <article
      className={cn(
        className,
        classNames.article,
        'flex flex-col relative bg-white',
        showBorder(backgroundColor) && 'border-[1px] border-neutral-500'
      )}
      onMouseEnter={primaryInput !== 'touch' ? onMouseEnter : undefined}
      onMouseLeave={primaryInput !== 'touch' ? onMouseLeave : undefined}
      onMouseMove={primaryInput !== 'touch' ? onMouseMove : undefined}
      style={{ '--background-color': backgroundColor, '--color': color, color: 'var(--color)' }}
      ref={articleRef}
    >
      <ArticleImageSlider
        article={article}
        images={slideImages}
        aspect={imageAspect}
        mobileAspect={mobileImageAspect}
        backgroundColor={backgroundColor}
        imageClassName={cn(classNames.image)}
        preload={preload}
        className={classNames.slider}
        cursorSize={0.8}
        imageSizes={`(max-width: ${screens.md}) 100vw, (max-width: ${screens.xl}) 33vw, 25vw`}
      />
      {brandLogo && (
        <BrandLogo
          logoImage={brandLogo}
          className='absolute top-6 left-6 md:top-3 md:left-3 lg:top-6 lg:left-6 xl:top-4 xl:left-4 pointer-events-none w-auto h-10'
          light={isBackgroundDark}
        />
      )}
      {showRating && (
        <div className='absolute top-6 right-6 md:top-3 md:right-3 lg:top-6 lg:right-6 xl:top-4 xl:right-4 flex items-center text-sm'>
          <Rating article={article}/>
        </div>
      )}
      <div
        className={cn(
          'grow flex flex-col relative overflow-hidden',
          classNames.content
        )}
        ref={contentRef}
        style={{ backgroundColor }}
      >
        <div className='relative z-1 flex flex-col p-6 xl:p-4 gap-y-4 grow'>
          <Link
            link={link}
            showText={false}
            className={cn(
              'grow flex font-serif text-md xl:leading-[1.35]',
              centerAlignTitle && 'items-center',
              classNames.title
            )}
            prefetch={preload}
          >
            <span className='block line-clamp-2 h-[3em] xl:h-[2.7em]'>
              {title}
            </span>
          </Link>
          <ArticleMeta article={article} buttonTransition={false} color={color} isBackgroundDark={isBackgroundDark} isHovering={isHovering}/>
        </div>
      </div>
    </article>
  )
}
