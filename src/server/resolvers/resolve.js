import isArray from 'lodash/isArray'
import replaceReferences from './replaceReferences'
import replaceImages from './replaceImages'
import resolveArticlesFromAlgolia from './resolveArticlesFromAlgolia'
import resolveReleasesFromAlgolia from './resolveReleasesFromAlgolia'
import resolveRelatedArticles from './resolveRelatedArticles'
import ReferencesResolver from './ReferencesResolver'
import replaceFiles from './replaceFiles'

const resolveObject = async (data, referencesResolver) => {
  await replaceImages(data, referencesResolver)
  await replaceFiles(data, referencesResolver)
  await replaceReferences(data, referencesResolver)
  await resolveRelatedArticles(data, referencesResolver)
  await resolveArticlesFromAlgolia(data, referencesResolver)
  await resolveReleasesFromAlgolia(data, referencesResolver)
}

export default async function resolve (data, client) {
  const referencesResolver = new ReferencesResolver(client)
  if (isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      await resolveObject(data[i], referencesResolver)
    }
  } else {
    await resolveObject(data, referencesResolver)
  }

  await referencesResolver.resolve()

  return data
}
