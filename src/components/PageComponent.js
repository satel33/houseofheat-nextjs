import get from 'lodash/get'

import { primaryInput } from 'detect-it'
import gsap from 'gsap'
import Flip from 'gsap/dist/Flip'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { useAtomValue, useSetAtom } from 'jotai'
import { useAtomsDevtools } from 'jotai/devtools'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { resolveInternalLinkUrl } from '../helpers/resolvers'
import { useScrollHistory } from '../scroll/useScrollHistory'
import { useHydrateStore } from '../store'
import {
  dialogAtom,
  dialogOpenAtom,
  pageAtom,
  useActivePageAtom,
  useActivePageIndexAtom,
  usePagesAtom,
  usePageToLoadAtom
} from '../store/content'
import { BrandFilter } from './ArticleTile/BrandLogo'
import { isBuyNowDialogOpenAtom } from './BuyNowDialog.js/buyNowState'
import Cursor from './Cursor'
import Dialog from './Dialog'
import Header from './Header'
import InfinitePageLoader, {
  NextPageBackground,
  useActivePageSetter
} from './InfinitePageLoader'
import Menu from './Menu'
import { isMenuOpen } from './Menu/menuState'
import Meta from './Meta'
import RateSneaker from './RateSneaker'
import Slices from './Slices'
import usePageTracking from './usePageTracking'
import useGlobalEscKey from '../hooks/useGlobalEscKey'

gsap.registerPlugin(Flip, ScrollTrigger)
gsap.config({ nullTargetWarn: process.env.NODE_ENV !== 'production' })

const AtomsDevtools = ({ children }) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAtomsDevtools('hoh')
  }
  return children
}

const usePageAndDialog = pageData => {
  const [page, setPage] = useState(pageData)
  const setDialogOpen = useSetAtom(dialogOpenAtom)
  const setDialogPageToLoad = useSetAtom(usePageToLoadAtom(dialogAtom))
  const setActivePageIndex = useSetAtom(useActivePageIndexAtom(pageAtom))
  const setPages = useSetAtom(usePagesAtom(pageAtom))

  useEffect(() => {
    if (pageData?._id === page?._id) {
      setDialogOpen(false)
    } else {
      if (
        primaryInput !== 'touch' &&
        (pageData?.pageType === 'release' ||
          pageData?.pageType === 'culture') &&
        (page?.pageType === 'page' || page?.pageType === 'tag')
      ) {
        setDialogOpen(true)
        setDialogPageToLoad({ ...pageData })
      } else {
        setPage(pageData)
        setPages([])
        setActivePageIndex(-1)
        setDialogOpen(false)
      }
    }
  }, [pageData])

  return { page }
}

export default function PageComponent ({ data }) {
  const shared = get(data, ['shared'])
  const settings = get(data, ['settings'])
  const pageData = get(data, ['page'])
  const localsRef = useRef({ routeReady: false })

  useHydrateStore(settings, shared, pageData)

  const { page } = usePageAndDialog(pageData)

  const dialogOpen = useAtomValue(dialogOpenAtom)
  const activeDialogPage = useAtomValue(useActivePageAtom(dialogAtom))

  const activePage = useAtomValue(useActivePageAtom(pageAtom)) || page
  const setActivePageIndex = useSetAtom(useActivePageIndexAtom(pageAtom))

  const activePageOrDialog = dialogOpen ? activeDialogPage : activePage

  const seo = get(pageData, ['seo'])

  const setMenuOpen = useSetAtom(isMenuOpen)
  const setBuyDialogOpen = useSetAtom(isBuyNowDialogOpenAtom)
  const router = useRouter()

  useScrollHistory(page)

  usePageTracking(activePageOrDialog)

  useEffect(() => {
    const handleRouteChange = () => {
      if (!localsRef.current.routeReady) {
        localsRef.current.routeReady = true
        return
      }
      setMenuOpen(false)
      setBuyDialogOpen(false)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [setMenuOpen])

  const ref = useActivePageSetter(
    useCallback(() => {
      if (page.pageType !== 'release' && page.pageType !== 'culture') return
      const pageUrl = resolveInternalLinkUrl(page)
      if (pageUrl !== window.location.pathname) {
        router.replace(pageUrl, null, { shallow: true, scroll: false })
        setActivePageIndex(-1)
      }
    }, [page])
  )

  useGlobalEscKey()

  if (!pageData) return null

  return (
    <AtomsDevtools>
      <Meta seo={seo} page={activePageOrDialog} />
      <BrandFilter />
      <Header page={activePageOrDialog} />
      <Menu />
      <main ref={ref}>
        <Slices key={page._id} page={page} slices={page?.slices} />
        <NextPageBackground page={page} />
      </main>
      <InfinitePageLoader page={page} contentAtom={pageAtom} />
      <RateSneaker page={activePageOrDialog} />
      <Dialog parentPage={activePage} />
      <Cursor />
    </AtomsDevtools>
  )
}
