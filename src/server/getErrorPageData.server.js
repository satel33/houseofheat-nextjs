import { groq } from 'next-sanity'

import {
  CATEGORY_AND_BRAND_PROJECTION,
  PAGE_PROJECTION,
  SETTINGS_PROJECTION
} from '../lib/queries/projections'
import resolve from './resolvers/resolve'
import { getClient } from './sanity.server'

export default async function getErrorPageData (id) {
  const client = getClient()
  const query = groq`
    {
      "page": *[!(_id in path('drafts.**')) && _type == "errorPage" && _id == $id] | order(_updatedAt desc)[0] {
        ${PAGE_PROJECTION}
      },
      "shared": {
        "brands": *[!(_id in path('drafts.**')) && _type == "brand"] {
          ${CATEGORY_AND_BRAND_PROJECTION}
        }
      },
      "settings": *[!(_id in path('drafts.**')) && _type == "settings"] | order(_updatedAt desc)[0] {
        ${SETTINGS_PROJECTION}
      }
    }
  `

  const data = await client.fetch(query, { id })

  await resolve(data, client)

  return data
}
