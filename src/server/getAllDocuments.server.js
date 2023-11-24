import { getClient } from './sanity.server'

export default async function getAllDocuments (type) {
  return getClient().fetch(
    `*[!(_id in path('drafts.**')) && _type == $type]{
      _id,
      "slug": slug.current
    }`,
    { type }
  )
}
