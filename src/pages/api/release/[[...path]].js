
import getReleases from '../../../server/getReleases'

const handler = async (req, res) => {
  const { path = [] } = req.query
  const [order, month, brand, index = 0, limit = 12] = path

  const resolvedBrand = brand && brand !== 'all' ? brand : null
  const resolvedMonth = month && month !== 'now' ? parseInt(month) : null
  const articles = await getReleases(order, resolvedMonth, resolvedBrand, parseInt(index), parseInt(limit))

  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate') // 10 minute revalidation
  res.json(articles)
}

export default handler
