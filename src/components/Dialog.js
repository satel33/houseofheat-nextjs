import { primaryInput } from 'detect-it'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef } from 'react'
import { resolveInternalLinkUrl } from '../helpers/resolvers'
import { useRestoreScrollState } from '../scroll/useScrollHistory'
import { dialogAtom, dialogOpenAtom, pageScrollAtom, usePagesAtom, usePageToLoadAtom } from '../store/content'
import InfinitePageLoader from './InfinitePageLoader'

export const DialogContext = React.createContext()

export const DialogProvider = ({ children }) => {
  const value = useMemo(() => ({ inDialog: true }), [])
  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  )
}

export default function Dialog ({ parentPage }) {
  const dialogRef = useRef()
  const overlayRef = useRef()
  const innerRef = useRef()

  const setPages = useSetAtom(usePagesAtom(dialogAtom))
  const pageToLoad = useAtomValue(usePageToLoadAtom(dialogAtom))
  const setPageProgress = useSetAtom(pageScrollAtom)

  const open = useAtomValue(dialogOpenAtom)

  const localsRef = useRef({ y: 0, open })

  const restoreScrollState = useRestoreScrollState()

  const router = useRouter()

  useEffect(() => {
    if (pageToLoad) {
      // If we are navigating to a page and the dialog is already open then we need to close it first
      if (!localsRef.current.open) {
        setPages([pageToLoad])
      } else {
        const windowHeight = primaryInput === 'touch' ? window.innerHeight : '100vh'
        const timeline = gsap.timeline()
        const y = window.scrollY

        gsap.set(dialogRef.current, { position: 'fixed', top: 0, overflow: 'hidden', height: windowHeight })
        gsap.set(innerRef.current, { position: 'absolute', top: -y })
        window.scrollTo(0, 0)

        timeline.to(dialogRef.current, {
          y: windowHeight,
          duration: 1.2,
          ease: 'expo.inOut',
          onComplete: () => {
            setPages([pageToLoad])
            gsap.set(dialogRef.current, { position: 'relative', overflow: 'auto', height: 'auto' })
            gsap.set(innerRef.current, { position: 'relative', top: 0 })
          }
        })
        timeline.to(dialogRef.current, {
          y: 0,
          duration: 1.2,
          ease: 'expo.out'
        })
        return () => {
          timeline.kill()
        }
      }
    }
  }, [pageToLoad])

  useEffect(() => {
    const windowHeight = primaryInput === 'touch' ? window.innerHeight : '100vh'
    localsRef.current.open = open
    const tl = gsap.timeline()

    tl.to(dialogRef.current, {
      y: open ? 0 : windowHeight,
      duration: open ? 1.2 : 0.8,
      ease: 'expo.inOut',
      onComplete: () => {
        ScrollTrigger.refresh()
        if (!open) {
          setPageProgress(0)
          setPages(undefined)
        }
      }
    })

    tl.to(overlayRef.current, { opacity: open ? 0.7 : 0, duration: 0.8, ease: 'sine.inOut' }, '-=1.2s')

    const y = window.scrollY
    if (open) {
      localsRef.current.y = y
    }

    if (open) {
      gsap.set('main', { position: 'fixed', top: -y })
      gsap.set(dialogRef.current, { position: 'relative', overflow: 'auto', height: 'auto' })
      gsap.set(innerRef.current, { position: 'relative', top: 0 })
      restoreScrollState()
    } else {
      gsap.set('main', { position: 'static' })
      gsap.set(dialogRef.current, { position: 'fixed', top: 0, overflow: 'hidden', height: windowHeight })
      gsap.set(innerRef.current, { position: 'absolute', top: -y })
      window.scrollTo(0, localsRef.current.y)
    }
    return () => {
      tl.kill()
    }
  }, [open, restoreScrollState])

  useEffect(() => {
    if (parentPage._type === 'errorPage') return
    if (!open) {
      const parentPageUrl = resolveInternalLinkUrl(parentPage)
      if (parentPageUrl !== router.asPath) {
        router.push(`${parentPageUrl}${window.location.search}`, null, { shallow: true, scroll: false })
      }
    }
  }, [open])

  return (
    <DialogProvider open={open}>
      <>
        <div className='fixed inset-0 bg-white opacity-0 z-dialogOverlay pointer-events-none' ref={overlayRef} />
        <div className='fixed inset-0 translate-y-full z-dialog' ref={dialogRef}>
          <div className='w-full z-1' ref={innerRef}>
            <InfinitePageLoader contentAtom={dialogAtom} />
          </div>
        </div>
      </>
    </DialogProvider>
  )
}
