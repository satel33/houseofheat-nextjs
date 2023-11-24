import getArticles from '../../../server/getArticles'

const handler = async (req, res) => {
  const { path = [] } = req.query
  const [type, brand, index = 0, limit = 12] = path

  const resolvedType = type && type !== 'all' ? type : null
  const resolvedBrand = brand && brand !== 'all' ? brand : null
  const articles = await getArticles(resolvedType, resolvedBrand, parseInt(index), parseInt(limit))

  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate') // 10 minute revalidation
  res.json(articles)
}

export default handler
