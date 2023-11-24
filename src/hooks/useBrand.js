import { useAtomValue } from 'jotai'
import find from 'lodash/find'
import { useMemo } from 'react'
import { sharedDataAtom } from '../store/content'

const useBrand = (article) => {
  const { brands } = useAtomValue(sharedDataAtom)
  return useMemo(() => {
    if (!article) return null
    const brandId = article?.brand?._id || article?.brand?._ref || article.releases?.[0]?.brand?._id || article.releases?.[0]?.brand?._ref
    return find(brands, ({ _id }) => _id === brandId)
  }, [article, brands])
}

export const useSmallBrandLogo = (article) => {
  return useBrand(article)?.smallLogo
}

export const useLargeBrandLogo = (article) => {
  return useBrand(article)?.smallLogo
}

export default useBrand
