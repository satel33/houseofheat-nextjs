import { atom } from 'jotai'
import { atomWithStorage, RESET } from 'jotai/utils'
import uniq from 'lodash/uniq'
import first from 'lodash/first'

export const isSearchOpenAtom = atom(false)

export const previousSearchesAtom = atomWithStorage('hoh-searches', [])
export const savePreviousSearchesAtom = atom(
  get => get(previousSearchesAtom),
  (get, set, search) => {
    if (!search) return
    const prevSearches = get(previousSearchesAtom)
    const lastSearch = first(prevSearches)
    if (lastSearch && (lastSearch.indexOf(search) >= 0 || search.indexOf(lastSearch) >= 0)) {
      set(previousSearchesAtom, uniq([search, ...prevSearches.slice(1)]).slice(0, 8))
    } else {
      set(previousSearchesAtom, uniq([search, ...get(previousSearchesAtom)]).slice(0, 8))
    }
  }
)
export const clearPreviousSearchQueriesAtom = atom(null, (_, set) => {
  set(previousSearchesAtom, RESET)
})
