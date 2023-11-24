import groq from 'groq'
import isEmpty from 'lodash/isEmpty'

import { createPageQuery } from '../../queries/createPageQuery'
import createSanityClient from '../../sanity/index'
import { getAlgoliaIndex } from '../index'
import transform from '../transformers/index'
import removeFromIndex from './removeFromIndex'

export default async function addToIndex (ids) {
  if (isEmpty(ids)) return

  const documentsAdded = []
  const documentsRemoved = []

  const client = createSanityClient()
  const pageQuery = createPageQuery()
  const query = groq`*[!(_id in path('drafts.**')) && _id in $ids] { ${pageQuery} }`
  const documents = await client.fetch(query, { ids })

  const docsToDelete = []

  const rawDocsToAdd = documents.filter(x => !docsToDelete.includes(x))
  // When we update a page that contains releases, we need to also update the related releases
  // When we update a release we also need to update the related page
  for (let i = 0; i < rawDocsToAdd.length; i++) {
    const doc = rawDocsToAdd[i]
    if (doc._type === 'page' && !isEmpty(doc.releases)) {
      rawDocsToAdd.push(await client.fetch(query, { ids: doc.releases.map(x => x._id) }))
    }
    if (doc._type === 'release' && doc.relatedArticle) {
      rawDocsToAdd.push(await client.fetch(query, { ids: [doc.relatedArticle._id] }))
    }
  }

  const docsToAdd = await transform(rawDocsToAdd)
  const releasesDocs = docsToAdd.filter(d => d._type === 'release')
  const pagesDocs = docsToAdd.filter(d => d._type === 'page')

  // Pages
  if (pagesDocs.length) {
    try {
      await getAlgoliaIndex().saveObjects(pagesDocs)
      documentsAdded.push(...pagesDocs)
    } catch (e) {
      console.warn('An error occurred whilst saving pages:', e.message)
    }
  }

  // Releases
  if (releasesDocs.length) {
    try {
      await getAlgoliaIndex('release').saveObjects(releasesDocs)
      documentsAdded.push(...releasesDocs)
    } catch (e) {
      console.warn('An error occurred whilst saving releases:', e.message)
    }
  }

  // Delete docs
  if (docsToDelete.length) {
    await removeFromIndex(docsToDelete.map(d => d._id))
    documentsRemoved.push(...docsToDelete)
  }

  return {
    added: documentsAdded,
    removed: documentsRemoved
  }
}
