import { useAtomValue } from 'jotai'
import { formatDate } from '../helpers/dates'
import { settingsAtom } from '../store/content'
import { Tags } from './ArticleTile/ArticleMetaTags'
import RelatedArticles from './RelatedArticles'
import Section from './Section'
import Mono from './Typography/Mono'
import Advertisement from './Advertisement'

const Label = (props) => {
  return (
    <span {...props} className='opacity-50 inline-block mr-2' />
  )
}

export default function PageFooter ({ page, lastAd }) {
  const { labels } = useAtomValue(settingsAtom)
  if (page.pageType !== 'release' && page.pageType !== 'culture') return null
  const { pageType, author, publishedDate, brand, model, tags, relatedArticles } = page
  const relatedArticlesTitle = pageType === 'release' ? labels.relatedReleasesTitle : labels.relatedCultureArticlesTitle
  const pageHasFooter = (pageType === 'release' || pageType === 'culture')

  return (
    <>
      {pageHasFooter && (
        <Section as='footer' grid className='items-center'>
          <Mono className='col-span-6 sm:col-span-3 lg:col-span-2'><Label>Author:</Label><span className='inline-block'>{author?.name}</span></Mono>
          <Mono className='col-span-6 sm:col-span-3 lg:col-span-2'><Label>Date:</Label>{formatDate(publishedDate)}</Mono>
          <Mono className='col-span-full sm:col-span-6 lg:col-span-8 flex items-center'>
            <Label>Tags:</Label><Tags brand={brand} model={model} tags={tags} limit={20} showTime={false} />
          </Mono>
          <div className='border-b-[1px] border-b-black border-solid h-[1px] col-span-full' />
        </Section>
      )}

      {lastAd && pageHasFooter && <Advertisement
        data={lastAd}
        bottomMargin
        page={page}
      />}

      <RelatedArticles articles={relatedArticles} title={relatedArticlesTitle} />
    </>
  )
}
