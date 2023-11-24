import gsap from 'gsap'
import { useCallback, useEffect, useRef } from 'react'

import { useAtom, useAtomValue } from 'jotai'
import { useBodyScrollLockScrollbarPadding } from '../../hooks/useBodyScrollLock'
import useComposeRefs from '../../hooks/useComposeRefs'
import useOutsideClick from '../../hooks/useOutsideClick'
import { settingsAtom } from '../../store/content'
import sizes from '../../theme/sizes.cjs'
import AnimatedGradient from '../AnimatedGradient'
import BuyNowDialog from '../BuyNowDialog.js'
import { buyNowPageAtom, isBuyNowDialogOpenAtom } from '../BuyNowDialog.js/buyNowState'
import Toolbar from './Toolbar'
import useBackgroundColor from './useBackgroundColor'

export default function Header ({ page }) {
  const { toolbar } = useAtomValue(settingsAtom)
  const [buyNowDialogOpen, setBuyNowDialogOpen] = useAtom(isBuyNowDialogOpenAtom)
  const buyNowReleasePage = useAtomValue(buyNowPageAtom)
  const buyNowDialogPage = buyNowDialogOpen && buyNowReleasePage
  const pageToShowInHeader = buyNowDialogPage && buyNowDialogPage._id !== page._id ? buyNowDialogPage : page

  const {
    backgroundColor,
    foregroundColor,
    initialColors,
    light
  } = useBackgroundColor(toolbar, pageToShowInHeader, !buyNowDialogOpen)

  const headerRef = useRef()
  const toolbarRef = useRef()
  const dialogShadowRef = useRef()
  const localsRef = useRef({ buyNowDialogOpenChanged: buyNowDialogOpen })

  useBodyScrollLockScrollbarPadding(headerRef)

  const outsideClickRef = useOutsideClick(
    useCallback(() => {
      setBuyNowDialogOpen(false)
    }, [setBuyNowDialogOpen]),
    buyNowDialogOpen
  )

  useEffect(() => {
    // TODO: Would be good to make this a shader
    gsap.to(headerRef.current, {
      color: foregroundColor,
      duration: 0.5,
      ease: 'sine.inOut'
    })
  }, [foregroundColor])

  useEffect(() => {
    gsap.to(toolbarRef.current, {
      opacity: 1,
      duration: 0.5,
      delay: 0.3,
      ease: 'sine.inOut'
    })
  }, [page, buyNowDialogOpen])

  useEffect(() => {
    // We don't what to run the gsap animation if the open value has not changed
    if (localsRef.current.buyNowDialogOpenChanged === buyNowDialogOpen) return
    localsRef.current.buyNowDialogOpenChanged = buyNowDialogOpen
    const target = -headerRef.current.getBoundingClientRect().height +
        toolbarRef.current.getBoundingClientRect().height

    gsap.fromTo(headerRef.current,
      { y: buyNowDialogOpen ? target : 0 },
      {
        y: buyNowDialogOpen ? 0 : target,
        ease: buyNowDialogOpen ? 'power3.inOut' : 'expo.out',
        duration: 0.8,
        onComplete: () => {
          if (!buyNowDialogOpen && headerRef.current) {
            headerRef.current.style.transform = `translateY(calc(-100% + ${sizes.toolbar}))`
          }
        }
      })
    gsap.to(dialogShadowRef.current, {
      opacity: buyNowDialogOpen ? 0.4 : 0,
      ease: buyNowDialogOpen ? 'power3.inOut' : 'expo.out',
      duration: 0.8
    })
  }, [buyNowDialogOpen])

  const composedRefs = useComposeRefs(headerRef, outsideClickRef)

  return (
    <>
      <header
        className='fixed top-0 left-0 w-full z-header'
        ref={composedRefs}
        style={{
          color: initialColors.current.foregroundColor,
          transform: `translateY(calc(-100% + ${sizes.toolbar}))`
        }}
      >
        <BuyNowDialog />
        <Toolbar
          page={pageToShowInHeader}
          light={light}
          ref={toolbarRef}
          className='opacity-0'
        />
        <AnimatedGradient gradient={backgroundColor} animateTransition transitionDuration={0.5} />
      </header>
      <div className='bg-black fixed top-0 left-0 w-screen h-screen z-menu opacity-0 pointer-events-none' ref={dialogShadowRef} />
    </>
  )
}
