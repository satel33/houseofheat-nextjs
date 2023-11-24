import { AsyncWalkBuilder } from 'walkjs'
import getReleases from '../getReleases'

export default async function resolveReleasesFromAlgolia (
  input
) {
  await new AsyncWalkBuilder()
    .withGlobalFilter(x => x.val?._type === 'releasesSlice' || x.val?._type === 'releasesCalendarSlice')
    .withSimpleCallback(async node => {
      const brand = node.val.filters?.brands?.[0]
      const results = await getReleases(undefined, undefined, brand, 0, node.val?._type === 'releasesSlice' ? 8 : 24)

      node.val.filters = {
        brand: brand || null
      }

      node.val.items = results.items
      node.val.totalItems = results.totalItems
      node.val.totalPages = results.totalPages
      node.val.index = results.index
      node.val.limit = results.limit
    })
    .walk(input)
}
