import {
  INDEX_DESC_RELEASES,
  INDEX_PAGES,
  INDEX_PAGES_SEARCH,
  INDEX_RELEASES
} from '../lib/algolia/indexes'
import client from './client'

export const SEARCH_TYPE_PAGE = 'page'
export const SEARCH_TYPE_RELEASE = 'release'

const pagesIndex = client.initIndex(INDEX_PAGES)
const pagesSearchIndex = client.initIndex(INDEX_PAGES_SEARCH)
const releasesIndex = client.initIndex(INDEX_RELEASES)
const releaseDescIndex = client.initIndex(INDEX_DESC_RELEASES)

export const getIndex = (type = SEARCH_TYPE_PAGE, order, query) => {
  if (type === SEARCH_TYPE_RELEASE) {
    return order === 'desc' ? releaseDescIndex : releasesIndex
  }
  return query ? pagesSearchIndex : pagesIndex
}
