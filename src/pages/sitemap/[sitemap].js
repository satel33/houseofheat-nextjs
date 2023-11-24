import { safeHtml, stripIndent } from 'common-tags'
import dayjs from 'dayjs'
import isEmpty from 'lodash/isEmpty'
import { resolveInternalLinkUrl } from '../../helpers/resolvers'
import getSitemapData from '../../server/getSitemapData.server'

const Sitemap = () => null

export default Sitemap

// NOTE: Priority and Frequency are note used by google
const getPriority = page => {
  if (page.pageType === 'release' || page.pageType === 'culture') return '0.5'
  const url = resolveInternalLinkUrl(page)
  if (url === '/') return '1.0'
  if (page._type === 'model') return '0.7'
  if (page._type === 'brand') return '0.8'
  return '0.9'
}

const getFrequency = page => {
  return page.pageType === 'release' || page.pageType === 'culture'
    ? 'monthly'
    : 'daily'
}

export const getServerSideProps = async ({ res, req, params }) => {
  if (!req || !res) return { props: {} }

  const slug = params.sitemap
  const regex = /sitemap-(.*)\.xml/
  const found = slug.match(regex)
  if (!found) {
    return { notFound: true }
  }
  const year = found[1]

  const sitemapData = await getSitemapData(year)

  if (isEmpty(sitemapData)) {
    return { notFound: true }
  }

  let xml =
    stripIndent`
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ` + '\n'

  xml += sitemapData
    .map(
      page =>
        safeHtml`
        <url>
          <loc>https://${req.headers.host}${resolveInternalLinkUrl(page)}</loc>
          <lastmod>${dayjs(page._updatedAt).format('YYYY-MM-DD')}</lastmod>
          <changefreq>${getFrequency(page)}</changefreq>
          <priority>${getPriority(page)}</priority>
        </url>
      ` + '\n'
    )
    .join('\n')

  xml +=
    stripIndent`
    </urlset>
  ` + '\n'

  res.setHeader('Content-Type', 'application/xml')
  res.write(xml)
  res.end()

  return {
    props: {}
  }
}
