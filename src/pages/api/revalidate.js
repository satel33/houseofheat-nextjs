import compact from 'lodash/compact'
import uniq from 'lodash/uniq'
import { resolveInternalLinkUrl } from '../../helpers/resolvers'
import { PAGE_REFERENCE_PROJECTION } from '../../lib/queries/projections'
import createSanityClient from '../../lib/sanity'
import secureWebhook from './_secureWebhook'

const revalidatePageAndLists = async (res, page) => {
  const link = resolveInternalLinkUrl(page)
  const brand = page?.brand?.slug

  const links = compact([
    ...uniq(['/', link]),
    '/culture',
    '/releases',
    brand && `/${brand}`,
    brand && `/${brand}-release-dates`
  ])

  for (let i = 0; i < links.length; i++) {
    await res.revalidate(links[i])
  }
  await res.json({ revalidated: true, links })
}

async function handler (req, res) {
  try {
    if (req.body._type === 'page') {
      return revalidatePageAndLists(res, req.body)
    } else if (req.body._type === 'release') {
      const client = createSanityClient()
      if (req.body.relatedArticle?._ref) {
        const page = await client.fetch(`
          *[!(_id in path('drafts.**')) && _id == $id] [0]
          {
            ${PAGE_REFERENCE_PROJECTION}
          }`,
        { id: req.body.relatedArticle._ref }
        )
        return revalidatePageAndLists(res, page)
      } else {
        return res.json({ revalidated: false })
      }
    } else {
      return res.json({ revalidated: false })
    }
  } catch (err) {
    // We don't what this to try multiple times
    return res.status(200).json({ error: 'Error revalidating', revalidated: false, _id: req.body._id, title: req.body.title, message: err.message })
  }
}

export default secureWebhook(handler)
