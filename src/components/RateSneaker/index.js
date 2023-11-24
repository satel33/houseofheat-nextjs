import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { isRateSneakerDialogOpen } from './rateSneakerState'
import gsap from 'gsap'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import useComposeRefs from '../../hooks/useComposeRefs'
import dynamic from 'next/dynamic'
import Loading from './Loading'
import { primaryInput } from 'detect-it'
import { useWindowSize } from 'react-use'
import { settingsAtom } from '../../store/content'

const RateSneaker = dynamic(() => import('./RateSneaker'), {
  loading: Loading
})

// const RateSneaker = Loading

export default function Dialog ({ page }) {
  const open = useAtomValue(isRateSneakerDialogOpen)
  const ref = useRef()
  const bodyScrollRef = useBodyScrollLock(open)
  const composedRef = useComposeRefs(ref, bodyScrollRef)
  const localsRef = useRef({ loaded: false })
  const { toolbar } = useAtomValue(settingsAtom)
  const releasePage = page.pageType === 'release' ? page : toolbar.releasePage

  useEffect(() => {
    if (open) localsRef.current.loaded = true
    ref.current.style.overflowY = open ? 'scroll' : 'auto'
    gsap.to(ref.current, {
      y: open ? 0 : '-100%',
      ease: 'expo.inOut',
      duration: 0.8
    })
  }, [open])

  const { height } = useWindowSize()
  useEffect(() => {
    if (primaryInput === 'touch') {
      ref.current.style.height = `${window.innerHeight}px`
    }
  }, [height])

  return (
    <div
      className='fixed top-0 left-0 w-full bg-black -translate-y-full h-[100vh] z-modal text-white overflow-hidden'
      ref={composedRef}
    >
      {(open || localsRef.current.loaded) && <RateSneaker page={releasePage} />}
    </div>
  )
}
