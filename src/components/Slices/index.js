import compact from 'lodash/compact'
import last from 'lodash/last'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import { useAtomValue } from 'jotai'
import { settingsAtom } from '../../store/content'
import ErrorBoundary from '../ErrorBoundary'
import PageFooter from '../PageFooter'
import AdvertisementSlice from './AdvertisementSlice'
import Articles from './Articles'
import EmbedPlaceholder from './EmbedSlice/Placeholder'
import Error404 from './Error404'
import ErrorVideo from './Error404/ErrorVideoSlice'
import HomepageHero from './HomepageHero'
import HtmlSlice from './HtmlSlice'
import ImageSlice from './ImageSlice'
import ImageSlider from './ImageSlider'
import ImageSummarySliderPlaceholder from './ImageSummarySlider/ImageSummarySliderPlaceholder'
import ImagesGrid from './ImagesGrid'
import LargeQuote from './LargeQuote'
import Newsletter from './Newsletter'
import PageHero from './PageHero'
import ReleasesCalendar from './ReleasesCalendar'
import ReleasesGrid from './ReleasesGrid'
import ReleasesPreview from './ReleasesPreview'
import RichText from './RichText'

const EmbedSlice = dynamic(() => import('./EmbedSlice'), {
  loading: EmbedPlaceholder
})

const ImageSummarySlider = dynamic(() => import('./ImageSummarySlider'), {
  loading: ImageSummarySliderPlaceholder
})

const sliceComponentSelector = {
  homepageHeroSlice: HomepageHero,
  pageHero: PageHero,
  releasesCalendarSlice: ReleasesCalendar,
  releasesSlice: ReleasesPreview,
  articlesSlice: Articles,
  newsletterSlice: Newsletter,
  richTextSlice: RichText,
  htmlSlice: HtmlSlice,
  imageSlice: ImageSlice,
  imageSliderSlice: ImageSlider,
  imagesGridSlice: ImagesGrid,
  embedSlice: EmbedSlice,
  error404Slice: Error404,
  imageSummarySliderSlice: ImageSummarySlider,
  advertisement: AdvertisementSlice,
  releaseGridSlice: ReleasesGrid,
  errorVideoSlice: ErrorVideo,
  largeQuote: LargeQuote
}

function getLastAdvertisement (slice) {
  if (slice?._type === 'advertisement') return slice
  if (slice?._type === 'imagesGridSlice') {
    return getLastAdvertisement(last(slice?.images))
  }
  return null
}

export default function Slices ({ page, slices }) {
  const settings = useAtomValue(settingsAtom)

  const pageHasFooter =
    page?.pageType === 'release' || page?.pageType === 'culture'
  const lastAd = useMemo(() => getLastAdvertisement(last(slices)), [slices])

  const sliceComponents = useMemo(() => {
    return compact(
      slices.map((slice, i) => {
        if (
          i + 1 === slices.length &&
          slice._type === 'advertisement' &&
          pageHasFooter
        ) {
          return null
        }

        const Component = sliceComponentSelector[slice._type]
        if (!Component) {
          return (
            <section
              key={ slice._key }
              className='relative mb-8 flex h-24 items-center justify-center'
            >
              <div className='absolute inset-0 animate-pulse bg-green' />
              <div className='relative font-mono text-lg'>
                The slice <strong>{ slice._type }</strong> is missing
              </div>
            </section>
          )
        }

        return (
          <ErrorBoundary key={ `slice-${page._id}-${slice._key}` }>
            <Component
              data={ slice }
              page={ page }
              settings={ settings }
              isFirst={ i === 0 }
              index={ i }
              pageHasFooter={ pageHasFooter }
            />
          </ErrorBoundary>
        )
      })
    )
  }, [slices, page, settings, pageHasFooter])

  return (
    <>
      { sliceComponents }
      <PageFooter page={ page } lastAd={ lastAd } />
    </>
  )
}
