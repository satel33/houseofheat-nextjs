import cn from 'clsx'
import ArticleTile from '../../ArticleTile/ArticleTile'
import FeaturedArticleTile from '../../ArticleTile/FeaturedArticleTile'

import flatten from 'lodash/flatten'
import { useMemo } from 'react'
import Advertisement from '../../Advertisement'
import { gridClasses } from '../../Section'
import Newsletter from '../Newsletter'

const tileSelector = {
  article: ArticleTile,
  featured: FeaturedArticleTile,
  advertisement: AdTile,
  newsletter: NewsletterTile
}

function AdTile ({ className, article = {} }) {
  return (
    <aside className={className}>
      <Advertisement {...article} bottomMargin={false} />
    </aside>
  )
}

function NewsletterTile ({ className, article = {} }) {
  return (
    <div className={className}>
      <Newsletter data={article} className='mt-16 mb-12 -mx-4 md:-mx-6' />
    </div>
  )
}

export default function ArticlesGrid ({
  page,
  articles,
  className,
  showNewsletterSubscription,
  newsletter
}) {
  const items = useMemo(() => {
    const tileClasses = 'col-span-full md:col-span-4 xl:col-span-3'
    return flatten(
      articles.map((a, index) => {
        const featured = index % 12 === 8
        const tiles = [
          {
            type: featured ? 'featured' : 'article',
            key: a._id,
            data: a,
            className: featured
              ? 'col-span-full md:col-span-full'
              : tileClasses,
            props: { logoPosition: 'top' }
          }
        ]

        if (index % 12 === 7) {
          tiles.push({
            type: 'advertisement',
            key: `${a._id}-1`,
            data: { background: false, page, size: 'gridTile1', id: `${a._id}-1` },
            className:
              'col-span-full md:col-span-4 xl:col-span-full border-[1px] border-neutral-500 bg-neutral-50 grid items-center p-4'
          })
        }

        if (index % 12 === 11) {
          tiles.push({
            type: 'advertisement',
            key: `${a._id}-2`,
            className:
              'col-span-full xl:col-span-3 border-[1px] border-neutral-500 bg-neutral-50 grid items-center p-4',
            data: { background: false, page, size: 'gridTile2', id: `${a._id}-2` }
          })
        }

        if (index === 11 && showNewsletterSubscription && newsletter) {
          tiles.push({
            type: 'newsletter',
            key: `newsletter-${a._id}`,
            className: 'col-span-full',
            data: newsletter
          })
        }

        return tiles
      })
    )
  }, [page, articles, newsletter, showNewsletterSubscription])

  return (
    <div className={cn('col-span-full', gridClasses, className)}>
      {items.map(
        ({
          type,
          key,
          data,
          newsletter,
          className,
          classNames,
          props = {}
        }) => {
          const Component = tileSelector[type]
          return (
            <Component
              key={key}
              {...props}
              classNames={classNames}
              className={cn(className, 'h-full')}
              article={data}
              newsletter={newsletter}
            />
          )
        }
      )}
    </div>
  )
}
