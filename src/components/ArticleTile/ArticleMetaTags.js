import cn from 'clsx'
import dayjs from 'dayjs'
import friendlyTime from 'friendly-time'
import compact from 'lodash/compact'
import filter from 'lodash/filter'
import uniqBy from 'lodash/uniqBy'
import { useMemo, useRef } from 'react'

import Link from '../Link'
import Mono from '../Typography/Mono'

export function Tags ({
  className,
  brand,
  model,
  categories = [],
  tags = [],
  showCategories = true,
  limit = 2,
  margin = true,
  isDark = false
}) {
  const totalRef = useRef(0)
  const brandModelCategoriesAndTags = useMemo(() => {
    const items = filter(
      compact([
        brand,
        model,
        ...(showCategories && categories ? categories : []),
        ...(tags || [])
      ]),
      x => x?.title
    )
    const results = uniqBy(items, c => c.title.toLowerCase())
    totalRef.current = results.length
    return limit ? results.slice(0, limit) : results
  }, [brand, model, showCategories, categories, tags, limit])

  return (
    <div className={cn(className, 'flex items-center flex-wrap', (!margin && totalRef.current > limit) && 'mr-3')}>
      {brandModelCategoriesAndTags.map(({ _type, slug, title }, i) => {
        const isLink = _type === 'brand' || _type === 'model'
        const showMore =
          totalRef.current > limit &&
          i === brandModelCategoriesAndTags.length - 1
        return (
          <Link
            key={slug}
            to={isLink ? `/${slug}` : null}
            className={cn(
              'block border rounded-xl px-2 py-1 transition whitespace-nowrap relative',
              isLink && !isDark && 'hover:bg-black hover:text-white hover:border-black',
              isLink && isDark && 'hover:bg-white hover:text-black hover:border-white',
              margin && 'my-1'
            )}
          >
            <span>{title}</span>
            {showMore && <span className='absolute -right-3'>+</span>}
          </Link>
        )
      })}
    </div>
  )
}

export default function ArticleMetaTags ({
  article,
  className,
  classNames = {},
  limit = 2,
  showTime = true
}) {
  const { publishedDate, brand, model, categories, tags, pageType } = article
  const time = friendlyTime(dayjs(publishedDate).toDate())

  return (
    <Mono as='div' className={cn(className, 'items-center whitespace-nowrap')}>
      <Tags
        brand={brand}
        model={model}
        categories={categories}
        tags={tags}
        showCategories={pageType === 'release'}
        limit={limit}
        className={classNames.tags}
      />
      {showTime && pageType === 'release' && (
        <time
          className={cn(
            'justify-self-end md:justify-self-center',
            classNames.time
          )}
        >
          {time}
        </time>
      )}
    </Mono>
  )
}
