import { AsyncWalkBuilder } from 'walkjs'
import getArticles from '../getArticles'

export default async function resolveArticlesFromAlgolia (
  input
) {
  await new AsyncWalkBuilder()
    .withGlobalFilter(x => x.val?._type === 'articlesSlice')
    .withSimpleCallback(async node => {
      const results = await getArticles(node.val.filter, node.val.filters?.brands?.[0], 0, 12)

      node.val.filters = {
        brand: node.val.filters?.brands?.[0] || null,
        pageType: node.val.filter || null
      }
      node.val.items = results.items
      node.val.totalItems = results.totalItems
      node.val.totalPages = results.totalPages
      node.val.index = results.index
      node.val.limit = results.limit
    })
    .walk(input)
}
