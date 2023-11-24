import { groq } from 'next-sanity'

import dayjs from 'dayjs'
import forEach from 'lodash/forEach'
import {
  CATEGORY_AND_BRAND_PROJECTION,
  PAGE_PROJECTION,
  SETTINGS_PROJECTION
} from '../lib/queries/projections'
import resolve from './resolvers/resolve'
import { getClient } from './sanity.server'

export default async function getReleasesByBrandPageData (slug, brand, preview) {
  const client = getClient(preview?.active)

  const idFilter = !preview?.active ? "!(_id in path('drafts.**')) &&" : ''
  const query = groq`
    {
      "page": *[${idFilter} _type == "page" && slug.current == $slug] | order(_updatedAt desc)[0] {
        ${PAGE_PROJECTION}
      },
      "shared": {
        "brands": *[!(_id in path('drafts.**')) && _type == "brand"] {
          ${CATEGORY_AND_BRAND_PROJECTION}
        }
      },
      "settings": *[${idFilter} _type == "settings"] | order(_updatedAt desc)[0] {
        ${SETTINGS_PROJECTION}
      }
    }
  `
  const data = await client.fetch(query, { slug: 'releases' })

  if (!data.page) return null
  const releaseSlices = data.page.slices.filter(({ _type }) => _type === 'releasesSlice' || _type === 'releasesCalendarSlice')

  const brandData = data.shared.brands.find(({ slug }) => slug === brand.toLowerCase())
  if (!brandData) return null

  data.page.slug = slug
  data.page.title = `${brandData.title} Release Dates ${dayjs().year()}`
  data.page.pageContentTitle = brandData.title
  data.page._id = data.page._id + slug

  forEach(releaseSlices, s => {
    if (!s.filters) s.filters = {}
    s.filters.brands = [brandData._id]
    s.hideBrandFilter = true
  })

  await resolve(data, client)

  return data
}
