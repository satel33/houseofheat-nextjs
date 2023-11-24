import { GoogleAuth } from 'google-auth-library'
import compact from 'lodash/compact'
import last from 'lodash/last'
import omit from 'lodash/omit'
import sortBy from 'lodash/sortBy'
import qs from 'querystringify'
import { getIndex, SEARCH_TYPE_PAGE } from '../../api/getIndex'

const handler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(404)
  }

  if (process.env.NODE_ENV === 'production') {
    // 1 hour cache
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=3599')
  }

  // const index = req.query.index || 0
  const limit = req.query.limit || 24
  const brand = req.query.brand

  try {
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_API_TRENDING_CREDENTIALS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_API_TRENDING_CREDENTIALS_PRIVATE_KEY.replace(
          /\\n/g,
          '\n'
        )
      },
      scopes: ['https://www.googleapis.com/auth/analytics.readonly']
    })

    const params = {
      ids: `ga:${process.env.GOOGLE_ANALYTICS_VIEW_ID}`,
      'start-date': '7daysAgo',
      'end-date': 'today',
      metrics: 'ga:uniquePageviews',
      dimensions: 'ga:pagePath',
      sort: '-ga:uniquePageviews',
      'start-index': 1,
      'max-results': limit * 2,
      // filter out URLs that are not culture or release articles and any that have a query string
      filters: 'ga:pagePath=~\\/.+\\/.+;ga:pagePath!~\\?'
    }

    if (brand) {
      params.filters += `;ga:pagePath=~/${brand}`
    }

    const url = `https://www.googleapis.com/analytics/v3/data/ga?${qs.stringify(
      params
    )}`
    const client = await auth.getClient()
    const response = await client.request({ url })
    const data = response.data
    const slugs = data.rows.map(([url, hits]) => ({
      slug: last(compact(url.split('?')[0].split('/'))),
      hits
    }))
    const algoliaIndex = getIndex(SEARCH_TYPE_PAGE, null)
    const filters = `(pageType:release OR pageType:culture) AND (${slugs
      .map(({ slug }) => `slug:${slug}`)
      .join(' OR ')})`
    const opts = { filters, page: 0, hitsPerPage: limit }
    const results = await algoliaIndex.search(undefined, opts)
    results.hits = sortBy(
      results.hits,
      r => -parseInt(slugs.find(x => x.slug === r.slug)?.hits || 0)
    )
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate') // 10 minute revalidation
    return res.json(omit(results, ['params']))
  } catch (e) {
    return res.status(500).json({ error: e.toString() })
  }
}

export default handler
