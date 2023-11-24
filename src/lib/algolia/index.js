import algoliaSearch from 'algoliasearch'
import {
  INDEX_PAGES,
  INDEX_RELEASES,
  INDEX_DESC_RELEASES
} from './indexes'

const client = algoliaSearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  process.env.ALGOLIA_API_KEY
)

// A few indexes to play with: "releases" and "pages". They have different sorting & filtering preferences.
// The "descending-order" one is the replica of the "releases" index, except that its ranking order is reversed,
// to display the releases from the newest to the oldest (whenever selecting the "dropped" ones)
const algoliaPagesIndex = client.initIndex(INDEX_PAGES)
const algoliaReleasesIndex = client.initIndex(INDEX_RELEASES)
const algoliaOldReleasesIndex = client.initIndex(INDEX_DESC_RELEASES)

/**
 * Export this function for CLI usage
 */
export const getAlgoliaIndex = (_type = 'page', descending = false) => {
  if (_type !== 'release') return algoliaPagesIndex

  return descending ? algoliaOldReleasesIndex : algoliaReleasesIndex
}
