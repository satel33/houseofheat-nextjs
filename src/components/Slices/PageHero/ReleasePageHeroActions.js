import cn from 'clsx'
import first from 'lodash/first'
import { isReleased } from '../../../helpers/dates'
import Advertisement from '../../Advertisement'
import BuyNowButton from '../../ArticleTile/BuyNowButton'
import Rating from '../../ArticleTile/Rating'
import RateSneakerButton from '../../RateSneakerButton'
import AddToCalendarAction from '../../ReleaseActions/AddToCalendarAction'
import FollowAction from '../../ReleaseActions/FollowAction'
import ShareAction from '../../ReleaseActions/ShareAction'
import Section from '../../Section'
import { monoClassName } from '../../Typography/Mono'

export default function ReleasePageHeroActions ({ page }) {
  const { releases } = page
  const ratingDisabled = page.rating?.disabled
  const release = first(releases) || {}
  const { releaseDate } = release

  const disableAddToCalendar = !release || isReleased(releaseDate)

  return (
    <>
      <Section grid className='gap-y-8'>
        <div className='col-span-full flex h-[65px] md:col-span-6 md:col-start-7 md:row-start-1 lg:col-span-5 lg:col-start-7'>
          {!ratingDisabled && (
            <RateSneakerButton
              page={page}
              className={cn('flex-1 justify-center text-sm', monoClassName)}
              withBorder
              text={
                <>
                  Rate release
                  <Rating
                    showFlame={false}
                    article={page}
                    className='inline-block ml-2 md:ml-4 opacity-50'
                  />
                </>
              }
            />
          )}
          <BuyNowButton
            article={page}
            flash
            className='flex-1 justify-center bg-black text-white group'
          />
        </div>
        <div className='col-span-full md:col-span-5 grid grid-cols-12 md:flex md:gap-x-6 md:row-start-1'>
          <FollowAction releases={releases} className='col-span-5' />
          <ShareAction className='col-span-3 -ml-[1px] md:ml-0' />
          <AddToCalendarAction
            className='col-span-4 md:flex flex-col justify-between relative -ml-[1px] md:ml-0'
            buttonProps={{
              className: 'h-8',
              labelClassName: 'text-xs md:text-xs'
            }}
            classNames={{ button: 'whitespace-nowrap', buttonText: 'text-xs' }}
            release={release}
            disabled={disableAddToCalendar}
          />
        </div>
      </Section>
      <Section grid noBottomMargin className='mb-8 md:-mt-12 -mt-8'>
        <div className='col-span-full md:col-span-5 md:col-start-7'>
          <Advertisement size='tile' bottomMargin={false} />
        </div>
      </Section>
    </>
  )
}
