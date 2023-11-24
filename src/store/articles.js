import { atom, useSetAtom } from 'jotai'
import { focusAtom } from 'jotai/optics'
import { useAtomCallback } from 'jotai/utils'
import keys from 'lodash/keys'
import reduce from 'lodash/reduce'
import { useCallback, useMemo } from 'react'
import getIndexedAtom from './getIndexedAtom'

export const VIEW_GRID = 'grid'
export const VIEW_LIST = 'list'

const getArticles = async (filters = {}, order, index = 0, limit = 12) => {
  const { pageType, brand } = filters
  const response = await fetch(`/api/article/${pageType || 'all'}/${brand || 'all'}/${index}/${limit}`)
  return response.json()
}

const getReleases = async (filters = {}, order, index = 0, limit = 12) => {
  const { month, brand } = filters
  const response = await fetch(`/api/release/${order || 'asc'}/${month || 'now'}/${brand || 'all'}/${index}/${limit}`)
  return response.json()
}

const apiMethodSelector = {
  articles: getArticles,
  releases: getReleases
}

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
  order: 'asc',
  ...data
})

export const getArticlesAtoms = (key, id, initial) => {
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

export const createHydratedArticleAtoms = page => {
  const setState = (key, id, data) => {
    getArticlesAtoms(key, id, {
      id: page._id,
      items: data.items || [],
      index: data.index,
      limit: data.limit,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      loading: false,
      filters: data.filters || {}
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

export const useApiMethods = (key, id) => {
  const {
    baseAtom,
    loadingAtom,
    itemsAtom,
    indexAtom,
    totalPagesAtom,
    totalItemsAtom,
    limitAtom,
    filtersAtom,
    orderAtom
  } = getArticlesAtoms(key, id)

  const readState = useAtomCallback(
    useCallback(get => get(baseAtom), [baseAtom])
  )

  const setLoading = useSetAtom(loadingAtom)
  const setIndex = useSetAtom(indexAtom)
  const setItems = useSetAtom(itemsAtom)
  const setTotalPages = useSetAtom(totalPagesAtom)
  const setTotalItems = useSetAtom(totalItemsAtom)
  const setLimit = useSetAtom(limitAtom)
  const setFilters = useSetAtom(filtersAtom)
  const setOrder = useSetAtom(orderAtom)

  const loadMore = useCallback(async () => {
    const {
      index,
      items,
      limit,
      loading,
      filters,
      order
    } = await readState()
    if (!loading) {
      setLoading(true)
      try {
        const results = await apiMethodSelector[key](filters, order, index + 1, limit)
        setItems([...items, ...results.items])
        setIndex(index + 1)
        setTotalPages(results.totalPages)
        setTotalItems(results.totalItems)
        setLimit(results.limit)
      } finally {
        setLoading(false)
      }
    }
  }, [readState, setLoading, key, setItems, setIndex, setTotalPages, setTotalItems, setLimit])

  const reload = useCallback(async (newFilters, newOrder) => {
    const s = await readState()
    const { filters, limit, order } = s
    setLoading(true)
    try {
      if (newFilters) setFilters(newFilters)
      if (newOrder) setOrder(newOrder)
      const results = await apiMethodSelector[key](newFilters || filters, newOrder || order, 0, limit)
      setIndex(0)
      setItems(results.items)
      setTotalPages(results.totalPages)
      setTotalItems(results.totalItems)
      setLimit(results.limit)
    } finally {
      setLoading(false)
    }
  }, [key, readState, setFilters, setIndex, setItems, setLimit, setLoading, setTotalItems, setTotalPages])

  return useMemo(() => ({
    loadMore,
    reload
  }), [loadMore, reload])
}

export const useToggleFilterCallback = (key, id) => {
  const { filtersAtom } = getArticlesAtoms(key, id)
  const setFilters = useSetAtom(filtersAtom)
  const { reload } = useApiMethods(key, id)
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

export const useArticlesSlice = (id) => {
  const key = 'articles'
  const atoms = getArticlesAtoms(key, id)
  const methods = useApiMethods(key, id)
  const toggleFilter = useToggleFilterCallback(key, id)
  return useMemo(() => ({
    ...atoms,
    actions: {
      ...methods,
      toggleFilter
    }
  }), [atoms, methods, toggleFilter])
}

export const useReleasesSlice = (id) => {
  const key = 'releases'
  const atoms = getArticlesAtoms(key, id)
  const methods = useApiMethods(key, id)
  const toggleFilter = useToggleFilterCallback(key, id)
  return useMemo(() => ({
    ...atoms,
    actions: {
      ...methods,
      toggleFilter
    }
  }), [atoms, methods, toggleFilter])
}
