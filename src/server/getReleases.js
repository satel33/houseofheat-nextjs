
import dayjs from 'dayjs'
import { RELEASE_REFERENCE_PROJECTION } from '../lib/queries/projections'
import { getClient } from './sanity.server'

const getReleases = async (order = 'asc', month, brand, index = 0, limit = 12) => {
  const client = getClient()
  let now = dayjs()
  if (month) {
    let fromDate = now.month(month - 1)
    if (order === 'asc') {
      if (order === 'asc' && fromDate.isBefore(now)) {
        fromDate = fromDate.year(fromDate.year() + 1)
      }
      if (order !== 'asc' && fromDate.isAfter(now)) {
        fromDate = fromDate.year(fromDate.year() - 1)
      }
    }
    now = fromDate
  }

  const start = index * limit
  const end = start + limit
  const query = `*[!(_id in path('drafts.**'))
    && _type == 'release'
    && defined(releaseDate)
    && ${order === 'asc' ? 'releaseDate >= $now' : 'releaseDate < $now'}
    ${brand ? '&& brand._ref == $brand' : ''}]`
  const queryWithPaging = `
    ${query}
    | order(releaseDate ${order === 'asc' ? 'asc' : 'desc'}) [$start...$end] {
    title,
    ${RELEASE_REFERENCE_PROJECTION}
  }`
  const result = await client.fetch(`{
    "totalItems": count(${query}),
    "items": ${queryWithPaging}
  }`, { now: now.toISOString(), brand: brand || null, start, end })

  return {
    ...result,
    totalPages: Math.ceil(result.totalItems / limit),
    index,
    limit
  }
}

export default getReleases
