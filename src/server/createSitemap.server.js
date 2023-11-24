import { SitemapStream, streamToPromise } from 'sitemap'

import { resolveInternalLinkUrl } from '../helpers/resolvers'
import getAllDocuments from './getAllDocuments.server'

const createSitemap = async props => {
  const { res, req } = props
  if (!req || !res) {
    return {
      props: {}
    }
  }

  res.setHeader('Content-Type', 'application/xml')
  // res.setHeader('Content-Encoding', 'gzip')

  const smStream = new SitemapStream({
    hostname: `https://${req.headers.host}/`
  })
  // const pipeline = smStream.pipe(createGzip())

  try {
    // We also add all the locale pages as well as the current page to the links prop
    // See https://developers.google.com/search/docs/advanced/crawling/localized-versions#sitemap
    const allPages = await getAllDocuments('page')

    allPages.map(page =>
      smStream.write({
        url: `https://${req.headers.host}${resolveInternalLinkUrl(page)}`,
        changefreq: page.slug === 'home' ? 'daily' : 'weekly',
        priority: 0.8
      })
    )
    smStream.end()

    const resp = await streamToPromise(smStream)

    res.write(resp)
    res.end()
  } catch (error) {
    console.error(error)
    res.statusCode = 500
    res.write('Could not generate sitemap.')
    res.end()
  }

  return {
    props: {}
  }
}

export default createSitemap
