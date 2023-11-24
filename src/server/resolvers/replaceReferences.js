import { AsyncWalkBuilder } from 'walkjs'

export default async function replaceReferences (
  input,
  referencesResolver
) {
  await new AsyncWalkBuilder()
    .withGlobalFilter((x) => x.val?._type === 'reference' || (x.val?._type === 'page' && x.val?._ref))
    .withSimpleCallback(async (node) => {
      const refId = node.val._ref

      // If it is a image reference then ignore it, it will be picked up in the replaceImages call
      if (refId.startsWith('image-')) return

      referencesResolver.addDocument('reference', refId, (key, doc) => {
        /**
       * Here we'll mutate the original reference object by clearing the
       * existing keys and adding all keys of the reference itself.
       */
        if (doc) {
          Object.keys(node.val).forEach((key) => delete node.val[key])
          Object.keys(doc).forEach((key) => (node.val[key] = doc[key]))
        }
      })
    })
    .walk(input)
}
