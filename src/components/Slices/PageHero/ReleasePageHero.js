import cn from 'clsx'
import first from 'lodash/first'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'

import { primaryInput } from 'detect-it'
import compact from 'lodash/compact'
import { useContext, useEffect, useMemo } from 'react'
import { getForegroundColorFromBackgroundColor } from '../../../helpers/colors'
import { formatNewYorkDate } from '../../../helpers/dates'
import { getPageThemeColor } from '../../../helpers/page'
import screens from '../../../theme/screens.cjs'
import ArticleImageSlider from '../../ArticleTile/ArticleImageSlider'
import Rating from '../../ArticleTile/Rating'
import ReleaseCountdown from '../../ArticleTile/ReleaseCountdown'
import { DialogContext } from '../../Dialog'
import { useRegisterHeaderColorSwitcher } from '../../Menu/headerHooks'
import ResponsiveImage from '../../ResponsiveImage'
import Section from '../../Section'
import Ticker from '../../Ticker'
import { MonoSmall } from '../../Typography/Mono'
import { FieldSet } from './FieldSet'

/* ------------------------------------------------------------------------------
The release hero has 4 different variations:
1. Etched image in a vertical layout - /jordan/air-jordan-5-concord-release-date-2022
2. Cover image in a vertical layout - /reebok/reebok-instapump-fury-allen-iverson-icons-pack-release-date-info-georgetown-fv0419-answer-fv0418-mvp-fv0417
3. Etched image in a horizontal layout - /nike/where-to-buy-off-white-x-nike-air-max-90-desert-ore-release-date-aa7293-200
4. Cover image in a horizontal layout - /puma/adriana-lima-puma-collection-2019-release-date-info
--------------------------------------------------------------------------------- */

export default function ReleasePageHero ({ data, page }) {
  const { featuredImages, releases, rating } = page
  const { tickerText, variation, title } = data

  const ratingDisabled = rating?.disabled
  const hasRating = rating?.averageRating || rating?.initialRating

  const backgroundColor = getPageThemeColor(page)
  const color = getForegroundColorFromBackgroundColor(backgroundColor)

  const ref = useRegisterHeaderColorSwitcher(backgroundColor)

  const release = releases?.[0]
  const releaseDatesFormatted = uniq(releases.map(r => release.releaseDateLabel || formatNewYorkDate(r.releaseDate)))
  const colors = compact(uniq(releases.map(r => r.color)))
  const brand =
    page.brand ||
    first(uniq([...releases.map(r => r.brand), page.brand]))
  const models = compact(
    uniqBy(compact([...releases.map(r => r.model), page.model]), x => x.title)
  )
  const codes = compact(uniq(releases.map(r => r.styleCode)))
  const retail = compact(uniq(releases.map(r => r.retail)))

  const { inDialog } = useContext(DialogContext) || {}

  useEffect(() => {
    if (primaryInput === 'touch') {
      ref.current.style.height = `${
        ref.current.getBoundingClientRect().height
      }px`
    }
  }, [ref])

  const isCoverImage = featuredImages?.[0].cover
  const isHorizontalLayout = !variation
    ? isCoverImage
    : variation === 'horizontal'
  const longTitle = useMemo(() => title?.split(' ').length > 8, [title])

  return (
    <Section
      noGutter
      noBottomMargin
      className={cn(
        'mb-8 md:mb-20 md:min-h-[100vh] flex flex-col',
        inDialog ? 'pt-0' : 'pt-[48px]'
      )}
      style={{ backgroundColor, color }}
      ref={ref}
    >
      <div
        className={cn(
          'flex-grow flex-shrink',
          isHorizontalLayout ? 'md:grid md:grid-cols-2' : 'md:flex md:flex-col'
        )}
      >
        <div
          className={cn(
            'w-full relative col-span-full row-start-1 mb-12 flex',
            isHorizontalLayout
              ? 'md:col-start-2 md:mb-0'
              : 'md:mt-24 md:flex-grow md:min-h-[20vw]',
            isCoverImage && isHorizontalLayout
              ? ''
              : 'mt-24 md:mt-0 items-center'
          )}
        >
          {(isHorizontalLayout || featuredImages.length === 1) && (
            <ResponsiveImage
              image={featuredImages[0]}
              preload
              imageSizes={
                isHorizontalLayout
                  ? `(max-width: ${screens.md}) 100vw, 64vw`
                  : `(max-width: ${screens.md}) 100vw, 50vw`
              }
              className={cn(
                'md:!absolute md:inset-0',
                isHorizontalLayout ? '' : 'md:mx-auto'
              )}
              contain={!isHorizontalLayout || !isCoverImage}
              mobileAspect={isHorizontalLayout && isCoverImage ? 1 : 1.5}
            />
          )}
          {!isHorizontalLayout && featuredImages.length > 1 && (
            <ArticleImageSlider
              article={page}
              images={featuredImages}
              aspect={1.5}
              backgroundColor={backgroundColor}
              asLink={false}
              className='w-full'
              slideClassName='md:w-pageHeroImageWidth mx-auto'
              preload
              imageSizes={
                isHorizontalLayout
                  ? `(max-width: ${screens.md}) 100vw, 64vw`
                  : `(max-width: ${screens.md}) 100vw, 50vw`
              }
            />
          )}
        </div>
        <div
          className={cn(
            'flex px-4 col-span-full pb-6 flex-col justify-end',
            isHorizontalLayout
              ? 'md:col-span-1'
              : 'md:flex-row-reverse md:justify-between md:items-end'
          )}
        >
          <h1
            className={cn(
              'z-1 text-[3rem] md:text-[4rem] font-normal tracking-[-0.02em] leading-[1] font-serif',
              'mb-12 max-w-2xl',
              isHorizontalLayout
                ? 'md:mb-14 md:mr-32 md:mt-28 md:max-w-[40rem]'
                : 'max-w-none md:w-1/2 md:mb-0 lg:pr-28',
              longTitle
                ? 'text-[3rem] md:text-[3rem]'
                : 'text-[3rem] md:text-[4rem]'
            )}
          >
            {title}
          </h1>
          <div className={cn('font-mono text-sm uppercase', !isHorizontalLayout && 'md:w-1/2')}>
            <div className='mb-4 md:mb-4'>
              <FieldSet className='grid grid-cols-5 gap-6' label='Release' value={releaseDatesFormatted} />
              {!ratingDisabled && hasRating && (
                <FieldSet
                  label='Heat'
                  className='grid grid-cols-5 gap-6'
                  value={<Rating article={page} showFlame={false} />}
                />
              )}
            </div>
            <FieldSet className='grid grid-cols-5 gap-6' label='Brand' value={brand?.title} link={brand} />
            <FieldSet className='grid grid-cols-5 gap-6' label='Model' value={models?.map(({ title }) => title)} link={models} />
            <FieldSet className='grid grid-cols-5 gap-6' label='SKU' value={codes} />
            <FieldSet className='grid grid-cols-5 gap-6' label='Color' value={colors} />
            <FieldSet className='grid grid-cols-5 gap-6' label='Retail' value={retail} />
          </div>
        </div>
      </div>
      <div className='overflow-hidden uppercase flex-grow-0 flex-shrink-0 relative'>
        <div className='absolute h-[1px] top-0 left-0 right-0 bg-current opacity-50' />
        <div className='absolute h-[1px] bottom-0 left-0 right-0 bg-current opacity-50' />
        {(release || tickerText) && (
          <Ticker className='select-none' pxPerSecond={50}>
            <div className='flex justify-center items-center relative'>
              <MonoSmall className='mr-8 md:mr-16 my-2 before:absolute before:block before:bg-current before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:-left-4 md:before:-left-8 before:rounded'>
                {!tickerText && (
                  <ReleaseCountdown
                    date={release.releaseDate}
                    releaseDateLabel={release.releaseDateLabel}
                    key={page._id}
                    releaseDatePrefixText='Drops '
                    releaseTimePrefixText='Drops In '
                  />
                )}
                {tickerText}
              </MonoSmall>
            </div>
          </Ticker>
        )}
      </div>
    </Section>
  )
}
