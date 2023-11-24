import cn from 'clsx'

import { primaryInput } from 'detect-it'
import { useContext, useEffect, useMemo } from 'react'
import { getForegroundColorFromBackgroundColor } from '../../../helpers/colors'
import { formatDate } from '../../../helpers/dates'
import { getPageThemeColor } from '../../../helpers/page'
import screens from '../../../theme/screens.cjs'
import { DialogContext } from '../../Dialog'
import { useRegisterHeaderColorSwitcher } from '../../Menu/headerHooks'
import FollowAction from '../../ReleaseActions/FollowAction'
import ShareAction from '../../ReleaseActions/ShareAction'
import ResponsiveImage from '../../ResponsiveImage'
import Section from '../../Section'
import Ticker from '../../Ticker'
import { MonoSmall } from '../../Typography/Mono'
import { FieldSet } from './FieldSet'

/* ------------------------------------------------------------------------------
The release hero has 4 different variations:
1. Etched image in a vertical layout
2. Cover image in a vertical layout
3. Etched image in a horizontal layout
4. Cover image in a horizontal layout
--------------------------------------------------------------------------------- */

export default function CulturePageHero ({ data, page }) {
  const { featuredImages, author, publishedDate } = page
  const { tickerText, variation, title } = data

  const backgroundColor = getPageThemeColor(page)
  const color = getForegroundColorFromBackgroundColor(backgroundColor)

  const ref = useRegisterHeaderColorSwitcher(backgroundColor)

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

  const hasBrand = !!page.brand

  return (
    <Section
      noGutter
      noBottomMargin
      className={cn(
        'mb-8 md:mb-20 md:min-h-[100vh] flex flex-col',
        inDialog ? 'pt-0' : 'pt-toolbar'
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
            'w-full relative col-span-full row-start-1 mb-12 md:min-h-[512px] flex',
            isHorizontalLayout
              ? 'md:col-start-2 md:mb-0'
              : 'md:mt-24 md:flex-grow',
            isCoverImage && isHorizontalLayout
              ? ''
              : 'mt-24 md:mt-0 items-center'
          )}
        >
          <ResponsiveImage
            image={featuredImages[0]}
            className={cn(
              'md:!absolute md:inset-0',
              isHorizontalLayout ? '' : 'md:mx-auto'
            )}
            preload
            imageSizes={
              isHorizontalLayout
                ? `(max-width: ${screens.md}) 100vw, 64vw`
                : `(max-width: ${screens.md}) 100vw, 50vw`
            }
            contain={!isHorizontalLayout || !isCoverImage}
            mobileAspect={isHorizontalLayout && isCoverImage ? 0.67 : 1.5}
          />
        </div>
        <div
          className={cn(
            'flex flex-wrap px-4 col-span-full pb-6 flex-col justify-end',
            isHorizontalLayout
              ? 'md:col-span-1'
              : 'md:flex-row-reverse md:justify-between md:items-end'
          )}
        >
          <h1
            className={cn(
              'z-1 font-normal tracking-[-0.02em] leading-[1] font-serif',
              'mb-12 max-w-2xl',
              isHorizontalLayout
                ? 'md:mb-14 md:mr-32 md:max-w-[40rem]'
                : 'max-w-none md:w-1/2 md:mb-0 lg:pr-28',
              longTitle
                ? 'text-[40px] md:text-[3rem]'
                : 'text-[40px] md:text-[4rem]'
            )}
          >
            {title}
          </h1>
          <div
            className={cn(
              'font-mono text-sm uppercase',
              isHorizontalLayout
                ? ''
                : 'md:w-1/2 md:flex md:flex-col-reverse md:justify-between md:mt-8'
            )}
          >
            <div
              className={cn(
                'flex mb-8 md:w-1/2',
                isHorizontalLayout ? '' : 'md:mb-0'
              )}
            >
              <FollowAction
                releases={[page]}
                classNames={{
                  dropDown: 'text-black md:bg-transparent md:text-current',
                  label: 'hidden md:block opacity-50 mb-4'
                }}
              />
              <ShareAction
                className={cn(
                  hasBrand && 'ml-4',
                  hasBrand && (isHorizontalLayout ? 'md:ml-8' : 'md:ml-20')
                )}
                classNames={{ label: 'hidden md:block opacity-50 mb-4' }}
              />
            </div>
            <div className={cn(isHorizontalLayout ? '' : 'md:flex md:flex-col md:w-1/2 md:mb-4')}>
              <FieldSet
                label='Written By'
                value={author?.name}
                labelClassName={cn(isHorizontalLayout ? '' : 'mb-4')}
              />
              <FieldSet
                label='Date'
                value={formatDate(publishedDate)}
                labelClassName={cn(isHorizontalLayout ? '' : 'mb-4')}
              />
            </div>
          </div>
        </div>
      </div>
      {tickerText && (
        <div className='overflow-hidden uppercase flex-grow-0 flex-shrink-0 relative'>
          <div className='absolute h-[1px] top-0 left-0 right-0 bg-current opacity-50' />
          <div className='absolute h-[1px] bottom-0 left-0 right-0 bg-current opacity-50' />
          <Ticker className='select-none' pxPerSecond={50}>
            <div className='flex justify-center items-center relative'>
              <MonoSmall className='mr-8 md:mr-16 my-2 before:absolute before:block before:bg-current before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:-left-4 md:before:-left-8 before:rounded'>
                {tickerText}
              </MonoSmall>
            </div>
          </Ticker>
        </div>
      )}
    </Section>
  )
}
