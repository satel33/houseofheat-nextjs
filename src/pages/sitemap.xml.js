import { safeHtml, stripIndent } from 'common-tags'
import getSitemapData from '../server/getSitemapData.server'

const Sitemap = () => null

export default Sitemap

export const getServerSideProps = async ({ res, req }) => {
  if (!req || !res) return { props: {} }

  const sitemapIndexData = await getSitemapData()

  let xml =
    stripIndent`
    <?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ` + '\n'
  xml += sitemapIndexData
    .map(
      ({ url }) =>
        safeHtml`
  <sitemap>
    <loc>https://${req.headers.host}/${url}</loc>
  </sitemap>
    `
    )
    .join('\n')
  xml +=
    stripIndent`
    </sitemapindex>
  ` + '\n'

  res.setHeader('Content-Type', 'application/xml')
  res.write(xml)
  res.end()

  return {
    props: {}
  }
}
