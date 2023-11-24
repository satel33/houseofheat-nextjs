import cn from 'clsx'

import useBrand, { useSmallBrandLogo } from '../../../hooks/useBrand'
import BrandLogo from '../../ArticleTile/BrandLogo'
import Rating from '../../ArticleTile/Rating'
import ReleaseCountdown from '../../ArticleTile/ReleaseCountdown'
import GradientHoverEffect from '../../GradientHoverEffect'
import Link from '../../Link'
import ResponsiveImage from '../../ResponsiveImage'
import { MonoTag } from '../../Typography/Mono'

export default function Release ({ className, release, isSelected, ...props }) {
  const {
    title,
    featuredImage,
    releaseDate,
    releaseDateLabel,
    relatedArticle
  } = release

  const brandLogo = useSmallBrandLogo(release)
  const brand = useBrand(release)
  const backgroundColor = release.pageTheme || release.relatedArticle?.pageTheme

  return (
    <Link
      link={relatedArticle}
      showText={false}
      className={cn(className, 'relative block group py-4 md:pt-2 md:pb-8')}
      {...props}
    >
      <GradientHoverEffect />
      <article className='relative grid grid-cols-releasePreviewGrid grid-rows-releasePreviewGrid gap-y-2 gap-x-4'>
        <div className='md:hidden min-w-[30vw] col-start-1 row-span-3'>
          <ResponsiveImage
            image={featuredImage}
            className='h-full'
            mobileAspect={120 / 100}
            contain
            style={{ backgroundColor }}
            imageSizes='30vw'
            fallbackAlt={release?.title}
          />
        </div>

        <ReleaseCountdown
          className={cn(
            'text-xs block relative md:pl-4 row-start-3 md:row-start-1 col-start-2 md:col-start-1 self-end min-w-[6rem] uppercase font-mono whitespace-nowrap',
            'before:hidden md:before:block before:absolute before:left-0 before:w-2 before:h-2 before:bg-black before:rounded-full group-hover:before:opacity-100 before:transition-opacity before:duration-250',
            isSelected ? 'before:opacity-100' : 'before:opacity-10 '
          )}
          date={releaseDate}
          releaseDateLabel={releaseDateLabel}
          key={release._id}
        />
        <div className='flex flex-col row-span-2 col-span-2 md:col-span-1 self-end md:self-start '>
          {brand?.title && (
            <MonoTag className='hidden md:block mb-1'>{brand?.title}</MonoTag>
          )}
          {brandLogo && (
            <BrandLogo
              className='md:hidden w-auto h-8 mb-2 self-start'
              logoImage={brandLogo}
            />
          )}
          <p className='text-[0.875rem]'>{title}</p>
        </div>

        <div className='flex md:pr-2 row-start-3 col-start-3 md:row-start-1 items-end'>
          <Rating
            className='text-xs'
            article={release.relatedArticle}
            isHovering={isSelected}
          />
        </div>
      </article>
    </Link>
  )
}
