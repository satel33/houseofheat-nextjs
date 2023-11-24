import { groq } from 'next-sanity'

import { getClient } from './sanity.server'

export default async function getImageAssetByFileName (filename) {
  const client = getClient()

  const query = groq`
    *[!(_id in path('drafts.**')) && _type == "sanity.imageAsset" && originalFilename == $filename][0]
  `
  const imageAsset = await client.fetch(query, { filename })
  return imageAsset
}
