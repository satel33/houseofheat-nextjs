import compact from 'lodash/compact'
import { getIndex, SEARCH_TYPE_PAGE, SEARCH_TYPE_RELEASE } from './getIndex'

const FACET_BRAND = 'brand._id'
const FACET_MODEL = 'model._id'
const FACET_PTYPE = 'pageType'
const FACET_DATE = 'releaseDateTimestamp'
const FACET_TAGS = 'tags._id'

export const search = async (
  type,
  query,
  filter = {},
  index = 0,
  limit = 12,
  order
) => {
  const { pageTypes = ['culture', 'release'], brands, dates, tags } =
    filter || {}
  const filters = compact([
    type === SEARCH_TYPE_PAGE &&
      pageTypes?.map(t => [`${FACET_PTYPE}:${t}`]).join(' OR '),
    brands
      ?.map(b => [`${FACET_BRAND}:${b} OR ${FACET_MODEL}:${b}`])
      .join(' OR '),
    type === SEARCH_TYPE_RELEASE &&
      dates?.map(d => [`${FACET_DATE}${d}`]).join(' OR '),
    type === SEARCH_TYPE_PAGE &&
      tags?.map(c => [`${FACET_TAGS}:${c}`]).join(' OR ')
  ])
    .map(f => `(${f})`)
    .join(' AND ')

  const algoliaIndex = getIndex(type, order, query)
  const opts = {
    filters,
    page: index,
    hitsPerPage: limit,
    optionalWords: query
  }
  const results = await algoliaIndex.search(!query ? undefined : query, opts)
  return results
}
