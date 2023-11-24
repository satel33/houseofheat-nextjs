import dayjs from 'dayjs'
import range from 'lodash/range'
import reverse from 'lodash/reverse'
import { getClient } from './sanity.server'

const pageProjection = `
_id,
_type,
pageType,
"slug": slug.current,
"brand": brand->{
  "slug": slug.current,
},
_updatedAt
`

export default async function getSiteMapData (year) {
  if (!year) {
    const { publishedDate } = await getClient().fetch(
      `*[!(_id in path('drafts.**')) && _type == 'page' && (pageType == 'release' || pageType == 'culture')] {
        publishedDate
      }| order(publishedDate asc) [0]`
    )
    const firstYear = dayjs(publishedDate).year()
    const currentYear = dayjs().year()
    let sitemapUrls = range((currentYear - firstYear) + 1).map((_, i) => ({
      url: `sitemap-${firstYear + i}.xml`
    }))
    sitemapUrls = reverse(sitemapUrls)
    return [
      { url: 'sitemap/sitemap-0.xml' },
      ...sitemapUrls
    ]
  }
  // Theses are the top level pages and brand listing pages
  if (year === '0') {
    const pages = await getClient().fetch(
      `*[!(_id in path('drafts.**')) && _type == 'page' && pageType == 'page']{
        ${pageProjection}
      }`
    )
    const brandsAndModels = await getClient().fetch(
      `*[!(_id in path('drafts.**')) && (_type == 'brand')]{
        _id,
        "slug": slug.current,
        _updatedAt,
        _type,
        "pageType": "brand"
      }`
    )

    const releasesByBrandPages = brandsAndModels.filter(({ _type }) => _type === 'brand').map(brand => ({
      ...brand,
      slug: `${brand.slug}-release-dates`
    }))

    return [
      ...pages,
      ...brandsAndModels,
      ...releasesByBrandPages
    ]
  }

  const from = dayjs(`${year}-01-01`)
  const to = from.add(1, 'year')
  const articles = await getClient().fetch(
    `*[!(_id in path('drafts.**')) && _type == 'page' && (pageType == 'release' || pageType == 'culture') && (publishedDate >= '${from.toISOString()}' && publishedDate < '${to.toISOString()}')]{
      ${pageProjection}
    } | order(publishedDate desc) `)

  return articles
}
