import { atom, useSetAtom } from 'jotai'
import { useCallback, useMemo } from 'react'
import { getTrending } from '../../../api/getTrending'
import getIndexedAtom from '../../../store/getIndexedAtom'

export const TAB_LATEST = 'latest'
export const TAB_TRENDING = 'trending'

export const useTrendingLatestTabAtom = (id) => {
  return useMemo(() => getIndexedAtom('trendingLatestTab', id, () => atom(TAB_LATEST)), [id])
}

export const useTrendingArticlesAtom = (id) => {
  return useMemo(() => getIndexedAtom('trendingArticles', id, () => atom([])), [id])
}

export const useTrendingArticlesLoadingAtom = (id) => {
  return useMemo(() => getIndexedAtom('trendingArticlesLoading', id, () => atom(false)), [id])
}

export const useLoadTrendingArticlesCallback = (id) => {
  const setItems = useSetAtom(useTrendingArticlesAtom(id))
  const setLoading = useSetAtom(useTrendingArticlesLoadingAtom(id))
  return useCallback(async () => {
    setLoading(true)
    try {
      const response = await getTrending()
      if (response.ok) {
        const result = await response.json()
        setItems(result.hits)
      }
    } finally {
      setLoading(false)
    }
  }, [setItems, setLoading])
}
