import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import compact from 'lodash/compact'
import last from 'lodash/last'
import singletonRouter from 'next/dist/client/router'
import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { resolveInternalLinkUrl } from '../helpers/resolvers'
import {
  dialogOpenAtom,
  pageScrollAtom,
  usePagesAtom,
  useSetActivePage
} from '../store/content'
// import colors from '../theme/colors.cjs'
import { DialogContext } from './Dialog'
import LoadMore from './LoadMore'
import Slices from './Slices'
import Mono from './Typography/Mono'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { mapRange } from '../helpers/math'
import useWindowResize from '../hooks/useWindowResize'
import { primaryInput } from 'detect-it'

export const NextPageBackground = ({ page }) => {
  const keepScrollingRef = useRef()
  const gradientRef = useRef()
  const next = page?.next
  const backgroundColor = next?.pageTheme || next?.dominantColor

  useEffect(() => {
    if (primaryInput === 'touch') return
    setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)
    if (!next) return
    const el = keepScrollingRef.current
    // const y = window.innerHeight * 1 * 0.8
    // const setY = gsap.quickSetter(el, 'y', 'px')
    // const set3D = gsap.quickSetter(el, 'force3D')
    const setOpacity = gsap.quickSetter(el, 'opacity')

    const tl = gsap.fromTo(el, {
      y: 0
    }, {
      y: () => `${window.innerHeight / 1.5}px`,
      scrollTrigger: {
        id: 'parallax',
        trigger: gradientRef.current,
        scrub: 0.2,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (e) => {
          // setY(e.progress * y)
          if (e.progress > 0.8) {
            setOpacity(mapRange(0.8, 0.85, e.progress, 1, 0))
          } else {
            setOpacity(1)
          }
          // set3D(e.progress > 0 && e.progress < 1)
        }
      }
    })

    return () => {
      tl.kill()
    }
  }, [])

  if (!next) return null
  return (
    <>
      <div className='px-6 md:absolute w-full' ref={keepScrollingRef}>
        <div className='w-full h-[1px] bg-current opacity-50 mb-3' />
        <div className='flex justify-between items-start'>
          <Mono>Keep Scrolling</Mono>
          <Mono className='text-right max-w-[50vw]'>Serving up your next slice of heat</Mono>
        </div>
      </div>
      <div
        className='h-[30vh] md:h-[80vh] z-0'
        ref={gradientRef}
        style={{
          background: `radial-gradient(48.64% 100% at 50% 0%, #FFFFFF 0%, rgba(255, 255, 255, 0.991353) 6.67%, rgba(255, 255, 255, 0.96449) 13.33%, rgba(255, 255, 255, 0.91834) 20%, rgba(255, 255, 255, 0.852589) 26.67%, rgba(255, 255, 255, 0.768225) 33.33%, rgba(255, 255, 255, 0.668116) 40%, rgba(255, 255, 255, 0.557309) 46.67%, rgba(255, 255, 255, 0.442691) 53.33%, rgba(255, 255, 255, 0.331884) 60%, rgba(255, 255, 255, 0.231775) 66.67%, rgba(255, 255, 255, 0.147411) 73.33%, rgba(255, 255, 255, 0.0816599) 80%, rgba(255, 255, 255, 0.03551) 86.67%, rgba(255, 255, 255, 0.0086472) 93.33%, rgba(255, 255, 255, 0) 100%), linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.991353) 6.67%, rgba(255, 255, 255, 0.96449) 13.33%, rgba(255, 255, 255, 0.91834) 20%, rgba(255, 255, 255, 0.852589) 26.67%, rgba(255, 255, 255, 0.768225) 33.33%, rgba(255, 255, 255, 0.668116) 40%, rgba(255, 255, 255, 0.557309) 46.67%, rgba(255, 255, 255, 0.442691) 53.33%, rgba(255, 255, 255, 0.331884) 60%, rgba(255, 255, 255, 0.231775) 66.67%, rgba(255, 255, 255, 0.147411) 73.33%, rgba(255, 255, 255, 0.0816599) 80%, rgba(255, 255, 255, 0.03551) 86.67%, rgba(255, 255, 255, 0.0086472) 93.33%, rgba(255, 255, 255, 0) 100%), ${backgroundColor}`
        }}
      />
    </>
  )
}

export function useActivePageSetter (onPageActive) {
  const ref = useRef()
  const dialogContext = useContext(DialogContext)
  const getDialogOpen = useAtomCallback(
    useCallback(get => {
      return get(dialogOpenAtom)
    }, [])
  )

  useEffect(() => {
    if (!ref.current) return
    const options = {
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0
    }
    const observer = new window.IntersectionObserver(async entries => {
      const dialogOpen = await getDialogOpen()
      if (dialogContext?.inDialog && !dialogOpen) return
      if (!dialogContext?.inDialog && dialogOpen) return

      if (entries?.[0]?.isIntersecting) {
        if (onPageActive) {
          onPageActive()
        }
      }
    }, options)
    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [dialogContext?.inDialog, getDialogOpen, onPageActive])

  return ref
}

export const PageContent = ({ contentAtom, page }) => {
  const setActivePage = useSetActivePage(contentAtom)
  const setPageProgress = useSetAtom(pageScrollAtom)
  const dialogOpen = useAtomValue(dialogOpenAtom)
  const localsRef = useRef({ dialogOpen: false })
  const timelineRef = useRef({})

  const ref = useActivePageSetter(
    useCallback(() => {
      setActivePage(page)
    }, [page])
  )

  useEffect(() => {
    localsRef.dialogOpen = dialogOpen
  }, [dialogOpen])

  useEffect(() => {
    timelineRef.current = gsap.timeline({
      scrollTrigger: {
        id: 'dialogScroll',
        trigger: ref.current,
        scrub: true,
        start: 'top 100vh',
        end: 'bottom top',
        onUpdate: (e) => {
          if (!localsRef.dialogOpen) return
          setPageProgress(e.progress)
        }
      }
    })

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill()
      }
    }
  }, [])

  useWindowResize(useCallback(() => {
    ScrollTrigger.refresh()
  }, []), false, false)

  return (
    <div ref={ref}>
      <Slices key={page._id} page={page} slices={page?.slices} />
      <NextPageBackground page={page} />
    </div>
  )
}

export default function InfinitePageLoader ({ as = 'div', contentAtom, page }) {
  const [pages, setPages] = useAtom(usePagesAtom(contentAtom))
  const loadingRef = useRef()

  const next = last(pages)?.next || page?.next

  const onLoadNextPage = useCallback(async () => {
    if (next && !loadingRef.current) {
      loadingRef.current = true
      try {
        const href = resolveInternalLinkUrl(next)
        const dataHref = await singletonRouter.router.pageLoader.getDataHref({
          asPath: href,
          href
        })
        const nextPage = (await (await window.fetch(dataHref)).json())
          ?.pageProps?.data?.page
        if (nextPage) {
          setPages(pages => [...pages, nextPage])
          ScrollTrigger.refresh()
        }
      } finally {
        loadingRef.current = false
      }
    }
  }, [pages])

  if (!next) return null

  const Component = as
  return (
    <Component className='bg-white'>
      {compact(pages)?.map(page => (
        <PageContent key={page._id} page={page} contentAtom={contentAtom} />
      ))}
      {next && (
        <LoadMore onAppearInView={onLoadNextPage} text='Loading Next Article' showGradient={false} bgColor={next?.pageTheme || next?.dominantColor}/>
      )}
    </Component>
  )
}
