import first from 'lodash/first'
import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
import { groq } from 'next-sanity'

import {
  CATEGORY_AND_BRAND_PROJECTION,
  PAGE_PROJECTION, SETTINGS_PROJECTION, TAG_PAGE_PROJECTION
} from '../lib/queries/projections'
import resolve from './resolvers/resolve'
import { getClient } from './sanity.server'

export default async function getPageData (slug, preview) {
  const client = getClient(preview?.active)

  const idFilter = !preview?.active ? "!(_id in path('drafts.**')) &&" : ''
  const query = groq`
    {
      "page": *[${idFilter} _type == "page" && slug.current == $slug] | order(_updatedAt desc)[0] {
        ${PAGE_PROJECTION}
      },
      "tags": *[${idFilter} (_type == "brand" || _type == "model" || _type == "tag") && slug.current == $slug] | order(_updatedAt desc) {
        ${TAG_PAGE_PROJECTION}
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
  let data = await client.fetch(query, { slug })

  if (data.tags && !data.page) {
    data.page = first(sortBy(data.tags, ({ _type }) => _type))
  }
  data = omit(data, ['tags'])

  await resolve(data, client)

  return data
}
