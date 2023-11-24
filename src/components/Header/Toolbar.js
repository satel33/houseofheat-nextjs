import cn from 'clsx'
import { useRouter } from 'next/router'
import { forwardRef, useCallback } from 'react'

import { useAtomValue } from 'jotai'
import { useMemo } from 'react'
import { resolveLink } from '../../helpers/resolvers'
import { useSmallBrandLogo } from '../../hooks/useBrand'
import { useReleaseDate } from '../../hooks/useReleaseDate'
import useReleasePageTitle from '../../hooks/useReleasePageTitle'
import { settingsAtom } from '../../store/content'
import BuyNowButton from '../ArticleTile/BuyNowButton'
import Rating from '../ArticleTile/Rating'
import ReleaseCountdown from '../ArticleTile/ReleaseCountdown'
import Button from '../Button'
import {
  isBuyNowDialogOpenAtom,
  useBuyNowDialogToggleCallback
} from '../BuyNowDialog.js/buyNowState'
import Link from '../Link'
import RateSneakerButton from '../RateSneakerButton'
import Section from '../Section'
import { MonoTag } from '../Typography/Mono'
import ToolbarTitle from './ToolbarTitle'

const ReleaseToolbar = forwardRef(({ className, page, light, link }, ref) => {
  const brandLogo = useSmallBrandLogo(page)
  const { releaseDate, releaseDateLabel } = useReleaseDate(page)
  const router = useRouter()
  const isBuyNowDialogOpen = useAtomValue(isBuyNowDialogOpenAtom)
  const toggleBuyNowDialog = useBuyNowDialogToggleCallback()

  const onToolbarClick = useCallback(() => {
    const url = resolveLink(link)?.url
    if (url) router.push(url, null, { scroll: false })
  }, [router, link])

  const ratingDisabled = page.rating?.disabled

  const onCloseClick = useCallback(
    e => {
      toggleBuyNowDialog(page)
      e.stopPropagation()
    },
    [toggleBuyNowDialog, page]
  )

  const title = useReleasePageTitle(page)

  return (
    <MonoTag wrap={false}>
      <Section
        as='div'
        onClick={onToolbarClick}
        className={cn(
          'flex w-full h-toolbar items-center justify-between',
          'md:grid grid-cols-12 gap-4 md:gap-6',
          link && 'cursor-pointer',
          className
        )}
        noBottomMargin
        ref={ref}
      >
        <ToolbarTitle
          text={title}
          logo={brandLogo}
          light={light}
          className='col-span-6 h-full'
        />
        <span className='block whitespace-nowrap md:col-start-7 md:col-span-2 mx-4 md:mx-0'>
          <ReleaseCountdown
            date={releaseDate}
            releaseDateLabel={releaseDateLabel}
            key={page._id}
          />
        </span>
        <div className='flex justify-between col-start-9 col-span-4 xl:col-start-10 xl:col-span-3'>
          <span className='hidden grow md:flex items-center whitespace-nowrap shrink-0'>
            {!ratingDisabled && <Rating article={page} />}
          </span>
          <div className='flex md:space-x-4 whitespace-nowrap shrink-0 relative'>
            {!ratingDisabled && (
              <RateSneakerButton
                page={page}
                className={cn(
                  'h-6 !py-0 hidden md:block',
                  isBuyNowDialogOpen && 'invisible'
                )}
                withBorder
                withTransition={false}
              />
            )}
            {isBuyNowDialogOpen && (
              <Button
                className={cn('justify-center absolute right-0 h-6 !py-0', 'bg-black border-black text-white', light && '!bg-white border-white !text-black hover:!bg-black hover:!border-black hover:!text-white')}
                withBorder
                onClick={onCloseClick}
                withTransition={false}
              >
                Close
              </Button>
            )}
            <BuyNowButton
              article={page}
              withBorder
              withTransition={false}
              fontSize='text-xs'
              flash={true}
              className={cn('group h-6 !py-0 bg-black border-black text-white', isBuyNowDialogOpen && 'invisible', light && '!bg-white border-white !text-black hover:!bg-black hover:!border-black hover:!text-white')}
            />
          </div>
        </div>
      </Section>
    </MonoTag>
  )
})

const NotificationToolbar = forwardRef(
  ({ className, logo, title, link, linkText, light, marquee }, ref) => {
    return (
      <MonoTag wrap={false}>
        <Section
          as='div'
          className={cn(
            'flex w-full h-toolbar items-center justify-between space-x-6 md:space-x-10',
            className
          )}
          noBottomMargin
          ref={ref}
        >
          <ToolbarTitle
            text={title}
            logo={logo}
            light={light}
            marquee={marquee}
          />
          {link && (
            <div className='flex md:space-x-4 whitespace-nowrap shrink-0'>
              <Button
                as={Link}
                link={link}
                showText={!linkText}
                withBorder
                withTransition={false}
              >
                {linkText}
              </Button>
            </div>
          )}
        </Section>
      </MonoTag>
    )
  }
)

const Toolbar = forwardRef(({ page, light, className }, ref) => {
  const { toolbar } = useAtomValue(settingsAtom)
  const releasePage = useMemo(() => {
    if (page._type === 'release') {
      return {
        ...page.relatedArticle,
        releases: [page]
      }
    }
    return page.pageType === 'release' ? page : toolbar.releasePage
  }, [page, toolbar.releasePage])
  const { culturePage, readMoreLabel } = toolbar
  const brandLogo = useSmallBrandLogo(culturePage)

  if (
    page.pageType === 'release' ||
    page._type === 'release' ||
    toolbar.type === 'release'
  ) {
    return (
      <ReleaseToolbar
        light={light}
        page={releasePage}
        link={page.pageType === 'release' ? null : releasePage}
        className={className}
        ref={ref}
      />
    )
  }

  if (toolbar.type === 'culture') {
    return (
      <NotificationToolbar
        light={light}
        title={culturePage.title}
        link={culturePage}
        linkText={readMoreLabel}
        logo={brandLogo}
        marquee
        className={className}
        ref={ref}
      />
    )
  }

  return (
    <NotificationToolbar
      light={light}
      title={toolbar.text}
      link={toolbar.link}
      logo={toolbar.image}
      marquee
      className={className}
      ref={ref}
    />
  )
})

export default Toolbar
