import flatten from 'lodash/flatten'

import transformPage from './page'
import transformRelease from './release'

// Transform each document based on its `_type` attribute
export default async function transform (documents) {
  return Promise.all(flatten(documents).map(doc =>
    doc._type === 'release' ? transformRelease(doc) : transformPage(doc)
  ))
}
