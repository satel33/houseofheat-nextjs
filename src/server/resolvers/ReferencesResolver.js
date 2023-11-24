import forEach from 'lodash/forEach'
import map from 'lodash/map'
import reduce from 'lodash/reduce'
import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'
import compact from 'lodash/compact'

import {
  ASSET_PROJECTION,
  PAGE_REFERENCE_PROJECTION
} from '../../lib/queries/projections'

const DOCUMENT_QUERIES = {
  image: `
  *[_id in $imageIds]{
    ${ASSET_PROJECTION}
  }`,
  file: `
  *[_id in $fileIds]{
    ...
  }`,
  reference: `
  *[_id in $referenceIds]{
    ${PAGE_REFERENCE_PROJECTION}
  }`
}

export default class ReferencesResolver {
  constructor (client) {
    this.queries = {}
    this.documentQueries = {
      image: {},
      reference: {},
      file: {}
    }
    this.client = client
  }

  addQuery (id, query, callback) {
    if (!this.queries[id]) {
      this.queries[id] = {
        query,
        callbacks: [callback]
      }
    } else {
      this.queries[id].callbacks.push(callback)
    }
  }

  addDocument (type, id, callback) {
    if (!this.documentQueries[type]) this.documentQueries[type] = {}
    if (!this.documentQueries[type][id]) {
      this.documentQueries[type][id] = [callback]
    } else {
      this.documentQueries[type][id].push(callback)
    }
  }

  async resolve () {
    const groqQueries = compact([
      ...map(this.queries, ({ query }, key) => `"${key}": ${query}`),
      ...map(DOCUMENT_QUERIES, (query, key) => `"${key}": ${query}`)
    ])

    if (isEmpty(groqQueries)) return

    const query = `{
      ${groqQueries.join(',')},
    }`

    const params = reduce(
      this.documentQueries,
      (result, ids, key) => {
        result[`${key}Ids`] = map(ids, (_, id) => id)
        return result
      },
      {}
    )

    const results = await this.client.fetch(query, params)

    forEach(results, (result, key) => {
      if (this.queries[key]) {
        forEach(this.queries[key].callbacks, cb => cb(key, result))
      }
      if (this.documentQueries[key]) {
        forEach(this.documentQueries[key], (callbacks, key) => {
          forEach(callbacks, cb => {
            cb(
              key,
              find(result, x => x._id === key),
              result
            )
          })
        })
      }
    })
  }
}
