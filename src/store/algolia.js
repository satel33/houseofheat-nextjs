import { atom, useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { focusAtom } from 'jotai/optics'
import reduce from 'lodash/reduce'
import keys from 'lodash/keys'
import { useAtomCallback } from 'jotai/utils'
import { search } from '../api/search'
import dayjs from 'dayjs'
import { SEARCH_TYPE_PAGE, SEARCH_TYPE_RELEASE } from '../api/getIndex'
import getIndexedAtom from './getIndexedAtom'

export const VIEW_GRID = 'grid'
export const VIEW_LIST = 'list'

const createInitialState = (data = {}) => ({
  items: [],
  index: 0,
  limit: 12,
  totalPages: 0,
  totalItems: 0,
  query: undefined,
  filters: {},
  loading: false,
  view: 'grid',
  type: 'page',
  order: 'asc',
  ...data
})

export const getAlgoliaAtoms = (key, id, initial) => {
  return getIndexedAtom(key, id, () => {
    const initialValue = createInitialState(initial)
    const dataAtom = atom(initialValue)
    const focusAtoms = reduce(
      keys(initialValue),
      (result, key) => {
        result[key + 'Atom'] = focusAtom(dataAtom, optic => optic.prop(key))
        return result
      },
      {}
    )
    return {
      baseAtom: dataAtom,
      ...focusAtoms
    }
  })
}

export const createHydratedAlgoliaAtoms = page => {
  const setState = (key, id, data) => {
    getAlgoliaAtoms(key, id, {
      id: page._id,
      items: data.items || [],
      index: data.index,
      limit: data.limit,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      loading: false,
      type: data.searchType,
      filters: data.filters || {},
      order: data.order
    })
  }
  const articlesSlice = page?.slices?.find(x => x._type === 'articlesSlice')
  if (articlesSlice) {
    setState('articles', page._id + articlesSlice.key, articlesSlice)
  }
  const releasesSlice = page?.slices?.find(x => x._type === 'releasesSlice')
  if (releasesSlice) {
    setState('releases', page._id + releasesSlice.key, releasesSlice)
  }
  const releaseCalendarSlice = page?.slices?.find(x => x._type === 'releasesCalendarSlice')
  if (releaseCalendarSlice) {
    setState('releases', page._id + releaseCalendarSlice.key, releaseCalendarSlice)
  }
}

export const useAlgoliaMethods = (key, id) => {
  const {
    baseAtom,
    loadingAtom,
    itemsAtom,
    indexAtom,
    totalPagesAtom,
    totalItemsAtom,
    limitAtom,
    queryAtom,
    orderAtom,
    filtersAtom
  } = getAlgoliaAtoms(key, id)

  const readAlgoliaSearchState = useAtomCallback(
    useCallback(get => get(baseAtom), [baseAtom])
  )

  const setLoading = useSetAtom(loadingAtom)
  const setIndex = useSetAtom(indexAtom)
  const setItems = useSetAtom(itemsAtom)
  const setTotalPages = useSetAtom(totalPagesAtom)
  const setTotalItems = useSetAtom(totalItemsAtom)
  const setLimit = useSetAtom(limitAtom)
  const setQuery = useSetAtom(queryAtom)
  const setOrder = useSetAtom(orderAtom)
  const setFilters = useSetAtom(filtersAtom)

  const loadMore = useCallback(async () => {
    const {
      index,
      query,
      items,
      limit,
      loading,
      filters,
      type,
      order
    } = await readAlgoliaSearchState()
    if (!loading) {
      setLoading(true)
      try {
        const results = await search(type, query, filters, index + 1, limit, order)
        setItems([...items, ...results.hits])
        setIndex(index + 1)
        setTotalPages(results.nbPages)
        setTotalItems(results.nbHits)
        setLimit(results.hitsPerPage)
      } finally {
        setLoading(false)
      }
    }
  }, [readAlgoliaSearchState, setLoading, setItems, setIndex, setTotalPages, setTotalItems, setLimit])

  const searchMethod = useCallback(async (query, filters, order) => {
    const { type, limit, loading } = await readAlgoliaSearchState()
    if (!loading) {
      setLoading(true)
      setQuery(query)
      setOrder(order)
      setFilters(filters)
      try {
        const results = await search(type, query, filters, 0, limit, order)
        setIndex(0)
        setItems(results.hits)
        setTotalPages(results.nbPages)
        setTotalItems(results.nbHits)
        setLimit(results.hitsPerPage)
      } finally {
        setLoading(false)
      }
    }
  }, [readAlgoliaSearchState, setFilters, setIndex, setItems, setLimit, setLoading, setOrder, setQuery, setTotalItems, setTotalPages])

  const reload = useCallback(async () => {
    const { query, order, filters } = await readAlgoliaSearchState()
    await searchMethod(query, filters, order)
  }, [readAlgoliaSearchState, searchMethod])

  return useMemo(() => ({
    loadMore,
    reload,
    search: searchMethod
  }), [loadMore, reload, searchMethod])
}

export const useToggleFilterCallback = (key, id) => {
  const { filtersAtom } = getAlgoliaAtoms(key, id)
  const setFilters = useSetAtom(filtersAtom)
  const { reload } = useAlgoliaMethods(key, id)
  return useCallback(
    async (filterName, id) => {
      setFilters(filters => {
        const items = filters[filterName] || []
        const newIds = items.includes(id)
          ? [...items.filter(f => f !== id)]
          : [...items, id]
        return {
          ...filters,
          [filterName]: newIds
        }
      })
      await reload()
    },
    [reload, setFilters]
  )
}

export const useAlgoliaSlice = (key, id, initial) => {
  const atoms = getAlgoliaAtoms(key, id, initial)
  const methods = useAlgoliaMethods(key, id)
  const toggleFilter = useToggleFilterCallback(key, id)
  return useMemo(() => ({
    ...atoms,
    actions: {
      ...methods,
      toggleFilter
    }
  }), [atoms, methods, toggleFilter])
}

export const useAlgoliaArticlesSlice = (id) => {
  return useAlgoliaSlice('articles', id, {
    type: SEARCH_TYPE_PAGE,
    filters: {
      brands: [],
      pageTypes: ['culture', 'release']
    }
  })
}

export const useAlgoliaReleasesSlice = (id) => {
  return useAlgoliaSlice('releases', id, {
    type: SEARCH_TYPE_RELEASE,
    filters: {
      brands: [],
      dates: [`>=${dayjs().unix()}`]
    }
  })
}

export const useAlgoliaSearchAtoms = (id) => {
  return useAlgoliaSlice('search', id, {
    type: SEARCH_TYPE_PAGE,
    filters: {}
  })
}
