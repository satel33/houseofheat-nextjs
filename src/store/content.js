import { atom, useAtomValue, useSetAtom } from 'jotai'
import filter from 'lodash/filter'
import { focusAtom } from 'jotai/optics'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/router'
import { resolveInternalLinkUrl } from '../helpers/resolvers'

export const settingsAtom = atom()
export const sharedDataAtom = atom()

export const brandsForFiltering = atom((get) => filter(get(sharedDataAtom)?.brands, ({ visibleInFilters }) => visibleInFilters))

export const dialogOpenAtom = atom(false)

export const pageAtom = atom({
  pages: [],
  activeIndex: 0
})

export const dialogAtom = atom({
  pages: [],
  activeIndex: 0,
  pageToLoad: null
})

export const useProfileSettings = () => {
  return useAtomValue(settingsAtom).profile
}

export const useActivePageAtom = (contentAtom) => {
  const pagesAtom = usePagesAtom(contentAtom)
  const pageIndexAtom = useActivePageIndexAtom(contentAtom)
  const pageToLoad = usePageToLoadAtom(contentAtom)
  return useMemo(() => {
    return atom((get) => {
      return get(pagesAtom)?.[get(pageIndexAtom)] || get(pageToLoad)
    })
  }, [pageIndexAtom, pageToLoad, pagesAtom])
}

export const usePagesAtom = (contentAtom) => {
  return useMemo(() => focusAtom(contentAtom, (optic) => optic.prop('pages')), [contentAtom])
}

export const useActivePageIndexAtom = (contentAtom) => {
  return useMemo(() => focusAtom(contentAtom, (optic) => optic.prop('activeIndex')), [contentAtom])
}

export const usePageToLoadAtom = (contentAtom) => {
  return useMemo(() => focusAtom(contentAtom, (optic) => optic.prop('pageToLoad')), [contentAtom])
}

export const useSetActivePage = (contentAtom) => {
  const pages = useAtomValue(usePagesAtom(contentAtom))
  const setActiveIndex = useSetAtom(useActivePageIndexAtom(contentAtom))
  const router = useRouter()
  const localsRef = useRef({ changingRoute: false })

  useEffect(() => {
    const handleRouteChangeStart = (url, { shallow }) => { if (!shallow) localsRef.changingRoute = true }
    const handleRouteChangeComplete = (url, { shallow }) => { if (!shallow) localsRef.changingRoute = false }

    router.events.on('routeChangeStart', handleRouteChangeStart)
    router.events.on('routeChangeError', handleRouteChangeComplete)
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeError', handleRouteChangeComplete)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  return useCallback((page) => {
    if (localsRef.changingRoute) return
    const index = pages.indexOf(page)
    setActiveIndex(index)
    if (router.asPath !== resolveInternalLinkUrl(page)) {
      router.replace(resolveInternalLinkUrl(page), null, { shallow: true, scroll: false })
    }
  }, [pages, setActiveIndex])
}

export const pageScrollAtom = atom(0)