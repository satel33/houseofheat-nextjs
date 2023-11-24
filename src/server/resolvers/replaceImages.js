import { AsyncWalkBuilder } from 'walkjs'

export default async function replaceImages (
  input,
  referencesResolver
) {
  await new AsyncWalkBuilder()
    .withGlobalFilter((x) => x.val?._type === 'image' || x.val?._type === 'imageWithMeta')
    .withSimpleCallback(async (node) => {
      const refId = node.val?.asset?._ref
      if (refId) {
        referencesResolver.addDocument('image', refId, (key, asset) => {
          node.val.asset = asset || null
        })
      }
    })
    .walk(input)
}
