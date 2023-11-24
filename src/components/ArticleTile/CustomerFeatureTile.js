import cn from 'clsx'
import { forwardRef, useMemo } from 'react'
// import {
//   getForegroundColorFromBackgroundColor,
//   isColorDark
// } from '../../helpers/colors'
import { useLargeBrandLogo } from '../../hooks/useBrand'
import Link from '../Link'
import ResponsiveImage from '../ResponsiveImage'
import Heading from '../Typography/Heading'
import Mono from '../Typography/Mono'
import BrandLogo from './BrandLogo'

const CustomFeatureTile = forwardRef(
  (
    {
      title,
      subtitle,
      image,
      brand,
      color,
      link,
      className,
      logoPosition,
      variant = 'tile',
      preload,
      imageSizes
    },
    ref
  ) => {
    const brandLogo = useLargeBrandLogo(useMemo(() => ({ brand }), [brand]))

    const backgroundColor = color?.toLowerCase()
    // const foregroundColor = getForegroundColorFromBackgroundColor(
    //   backgroundColor
    // )

    return (
      <article
        style={{ backgroundColor, color: 'white' }}
        className={cn(
          className,
          'flex flex-col relative -mx-4 md:mx-0',
          'aspect-[0.75] md:aspect-auto',
          (backgroundColor === '#fff' || backgroundColor === '#ffffff') &&
            'border-[1px] border-neutral-500'
        )}
        ref={ref}
      >
        <Link
          to={link}
          showText={false}
          className='block relative grow'
          scroll={false}
          prefetch={preload}
        >
          <ResponsiveImage
            className='md:absolute md:inset-0'
            mobileAspect={0.75}
            preload={preload}
            imageSizes={imageSizes}
            image={image}
          />
          <div className='absolute pointer-events-none h-[30vh] bottom-0 left-0 right-0 z-1' style={{ background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.8))' }}/>
        </Link>
        <div
          className={cn(
            'flex justify-end flex-col overflow-hidden absolute bottom-0 left-0 right-0',
            variant === 'homepage'
              ? 'px-4 pb-4 pt-4 md:px-6 md:pb-3 md:pt-3'
              : 'px-6 pb-6 pt-6 md:pt-2'
          )}
        >
          <div className='flex md:items-center z-[2]'>
            <BrandLogo
              logoImage={brandLogo}
              className={cn(
                logoPosition === 'top' && 'absolute top-6',
                'md:mr-16 pointer-events-none w-auto h-10 md:h-16'
              )}
              light={true}
            />
            <div className='ml-4'>
              <Link
                to={link}
                showText={false}
                className='block relative'
                scroll={false}
              >
                <Heading tagStyle='h4' as='h2'>
                  {title}
                </Heading>
              </Link>
              {subtitle && (
                <Mono as='div'>
                  {subtitle}
                </Mono>
              )}
            </div>
          </div>
        </div>
      </article>
    )
  }
)

export default CustomFeatureTile
