
import { BRAND_PROJECTION, IMAGE_PROJECTION, MODEL_PROJECTION, RELEASE_BUY_LINKS_PROJECTION } from '../lib/queries/projections'
import { getClient } from './sanity.server'

const getArticles = async (type, brand, index = 0, limit = 12) => {
  const client = getClient()

  const start = index * limit
  const end = start + limit
  const query = `*[!(_id in path('drafts.**'))
    && defined(publishedDate)
    ${type && type !== 'all' ? '&& pageType == $type' : "&& (pageType == 'release' || pageType == 'culture')"}    
    ${brand && brand !== 'all' ? '&& (brand._ref == $brand || model._ref == $brand || $brand in tags[]._ref)' : ''}]`
  const queryWithPaging = `
    ${query}
    | order(publishedDate desc) [$start...$end] {
    _id,
    _type,
    pageType,
    title,
    publishedDate,
    "slug": slug.current,
    "pageTheme": pageTheme,
    "featuredImages": featuredImages[] { ${IMAGE_PROJECTION} },
    "author": author-> { name },
    "brand": brand->{${BRAND_PROJECTION}},
    "model": model->{ ${MODEL_PROJECTION} },
    "tags": tags[]-> { _id, title, "slug": slug.current },
    publishedDate,
    releaseDateLabel,
    "releases": releases[]-> {
      releaseDate,
      releaseDateLabel,
      styleCode,
      title,
      "shoppingButtons": shoppingButtons[] { ${RELEASE_BUY_LINKS_PROJECTION}}
    },
    rating
  }`
  const result = await client.fetch(`{
    "totalItems": count(${query}),
    "items": ${queryWithPaging}
  }`, { brand: brand || null, type: type || null, start, end })

  return {
    ...result,
    totalPages: Math.ceil(result.totalItems / limit),
    index,
    limit
  }
}

export default getArticles
