import cn from 'clsx'
import { primaryInput } from 'detect-it'
import range from 'lodash/range'
import { useRouter } from 'next/router'
import React, { useCallback, useMemo, useState } from 'react'
import {
  getImages,
  getReleaseDate,
  getReleaseDateLabel
} from '../../../helpers/page'
import { resolveLink } from '../../../helpers/resolvers'
import useBrand from '../../../hooks/useBrand'
import Advertisement from '../../Advertisement'
import ArticleMetaTags from '../../ArticleTile/ArticleMetaTags'
import BuyNowButton from '../../ArticleTile/BuyNowButton'
import Rating from '../../ArticleTile/Rating'
import ReleaseCountdown from '../../ArticleTile/ReleaseCountdown'
import GradientHoverEffect from '../../GradientHoverEffect'
import Link from '../../Link'
import ResponsiveImage from '../../ResponsiveImage'
import { MonoTag } from '../../Typography/Mono'

export default function ArticlesList ({ page, articles, className, loading, countdownDateFormat }) {
  const articlesList = useMemo(
    () =>
      loading
        ? range(6).map((_, i) => ({ _id: i, placeholder: true }))
        : articles,
    [articles, loading]
  )
  return (
    <div className={cn('col-span-full', className)}>
      {articlesList.map((article, i) => {
        return (
          <React.Fragment key={article._id}>
            <ArticleListItem article={article} countdownDateFormat={countdownDateFormat} />
            {i % 12 === 11 && (
              <Advertisement
                page={page}
                size='full'
                className='my-10 md:my-20'
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

const Placeholder = ({ className, light }) => {
  return (
    <div
      className={cn(
        className,
        ' animate-pulse rounded-full w-full',
        light ? 'bg-neutral-700' : 'bg-neutral-500'
      )}
    />
  )
}

function ArticleListItem ({ article, countdownDateFormat }) {
  const [isHovering, setIsHovering] = useState(false)
  const images = getImages(article)
  const releaseDate = getReleaseDate(article)
  const releaseDateLabel = getReleaseDateLabel(article)
  const router = useRouter()
  const brand = useBrand(article)
  const { placeholder } = article

  const isRelease =
    article.pageType === 'release' || article._type === 'release'

  const onTileClick = useCallback(() => {
    const url = resolveLink(article)?.url
    if (url) {
      router.push(url, null, { scroll: false })
    }
  }, [article, router])

  const onMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    setIsHovering(false)
  }, [])

  return (
    <article
      className={cn(
        'flex py-2 border-y -mt-[1px] md:grid md:grid-cols-12 gap-x-5 md:gap-x-6 md:items-end bg-white relative overflow-hidden',
        !placeholder && 'cursor-pointer'
      )}
      onClick={!placeholder ? onTileClick : undefined}
      onMouseEnter={ primaryInput !== 'touch' ? onMouseEnter : undefined }
      onMouseLeave={ primaryInput !== 'touch' ? onMouseLeave : undefined }
    >
      {!placeholder && <GradientHoverEffect />}

      <div className='hidden md:block font-mono'>
        {isRelease && (
          <ReleaseCountdown
            className={cn(
              'text-xs uppercase relative block md:pl-4',
              'before:hidden md:before:block before:absolute before:left-0 before:w-2 before:h-2 before:bg-black before:rounded-full'
            )}
            date={releaseDate}
            releaseDateLabel={releaseDateLabel}
            key={article._id}
            dateFormat={countdownDateFormat}
          />
        )}
        {placeholder && <Placeholder light className='h-2 max-w-[10rem]' />}
      </div>

      <div className='md:col-span-2 relative'>
        {!placeholder && images?.[0] && <ResponsiveImage
          style={{ backgroundColor: article.pageTheme }}
          image={images?.[0]}
          aspect={128 / 80}
          contain={!images?.[0].cover}
          fallbackAlt={article?.title}
          className={cn(
            'w-36 md:w-36'
          )}
        />}
        {placeholder && <div className='bg-neutral-700 animate-pulse' style={{ aspectRatio: '128 / 80' }}/>}
      </div>
      <div className='flex-1 flex flex-col justify-end gap-2 md:col-span-5 md:col-start-4 relative'>
        {brand && <MonoTag>{brand?.title}</MonoTag>}
        {placeholder && <Placeholder light className='h-2 max-w-[5rem]' />}
        <Link
          link={!placeholder && article}
          showText={false}
          className='block'
          onClick={e => e.stopPropagation()}
        >
          <p
            className={cn(
              'text-[0.875rem] md:text-md leading-tight md:leading-tight line-clamp-2',
              placeholder &&
                'bg-neutral-500 animate-pulse rounded-full h-4 w-full max-w-[35rem]'
            )}
          >
            {article.title}
          </p>
        </Link>
        {placeholder && <Placeholder light className='h-2 max-w-[10rem]' />}
        {!placeholder && (
          <div className='flex'>
            {isRelease && (
              <ReleaseCountdown
                className='text-xs uppercase md:hidden'
                date={releaseDate}
                releaseDateLabel={releaseDateLabel}
                key={article._id}
              />
            )}
            <div className='flex md:hidden ml-4'>
              <Rating className='text-xs' article={article} />
            </div>
          </div>
        )}
      </div>
      {placeholder && (
        <Placeholder
          light
          className='hidden md:flex md:col-span-3 md:col-start-10 h-2 max-w-[5rem]'
        />
      )}
      {isRelease && (
        <div className='hidden md:flex md:col-span-3 md:col-start-10 justify-between items-center relative'>
          <div className='flex'>
            <Rating className='text-xs' article={article} showEmptyRating isHovering={isHovering} />
          </div>
          <BuyNowButton article={article} className='mr-2' />
        </div>
      )}
      {!isRelease && (
        <div className='hidden md:flex md:col-span-2 md:col-start-11 justify-end items-center mr-2 relative'>
          <ArticleMetaTags className='text-xxs' article={article} />
        </div>
      )}
    </article>
  )
}
