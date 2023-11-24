import cn from 'clsx'
import gsap from 'gsap'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'

import Flip from 'gsap/dist/Flip'
import dynamic from 'next/dynamic.js'
import { useIsAuthenticated, useSession } from '../../auth'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import useComposeRefs from '../../hooks/useComposeRefs'
import BellIcon from '../../icons/bell.svg'
import CaretIcon from '../../icons/caret.svg'
import UserIcon from '../../icons/user.svg'
import colors from '../../theme/colors.cjs'
import MenuNavButton from './MenuNavButton'
import {
  isMenuOpen,
  menuView as menuViewAtom,
  MENU_VIEW_MAIN,
  MENU_VIEW_NOTIFICATIONS,
  MENU_VIEW_PROFILE
} from './menuState'
import MainNavigation from './Navigation/MainNavigation'
import Notifications from './Navigation/Notifications'
import Overlay from './Overlay'
import ProfilePlaceholder from './Profile/Placeholder'
import Search from './Search'
import { isSearchOpenAtom } from './searchState.js'

const Profile = dynamic(() => import('./Profile'), {
  loading: ProfilePlaceholder
})

export default function MenuContent () {
  const [open, setOpen] = useAtom(isMenuOpen)
  const bodyScrollRef = useBodyScrollLock(open)
  const ref = useRef()
  const contentRef = useRef()
  const backgroundRef = useRef()
  const searchRef = useRef()
  const searchInputRef = useRef()
  const [isSearchOpen, setSearchOpen] = useAtom(isSearchOpenAtom)
  const authenticated = useIsAuthenticated()
  const localsRef = useRef({ menuOpened: false, searchOpened: false })
  const session = useSession()

  const photoUrl = session?.user?.photoURL

  localsRef.current.isSearchOpen = isSearchOpen

  const onClose = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  // Nav / routing within the menu
  const [menuView, setView] = useAtom(menuViewAtom)

  const onSetView = useCallback(
    view => {
      setView(view)
      setSearchOpen(false)
    },
    [setSearchOpen, setView]
  )

  const onShowProfile = useCallback(
    async view => {
      onSetView(view)
    },
    [onSetView]
  )

  useEffect(() => {
    localsRef.current.menuOpened = localsRef.current.menuOpened || open
    if (!localsRef.current.menuOpened) return

    gsap.set(ref.current, {
      pointerEvents: open ? 'all' : 'none',
      height: `calc(100svh - ${window.innerWidth < 768 ? 142 : 192}px)`
    })
    const btns = ref.current.querySelectorAll('.menu-nav-btn')

    gsap.set(backgroundRef.current, { opacity: 1 })
    const currentState = Flip.getState(backgroundRef.current, {
      props: 'left,top,width,height,opacity'
    })
    const buttonSize = window.innerWidth < 768 ? '36px' : '45px'
    gsap.set(backgroundRef.current, {
      height: open && isSearchOpen ? 64 : open ? '100%' : buttonSize,
      width: open ? '100%' : buttonSize,
      left: open ? 0 : '0.5em',
      top: open ? 0 : '0.5em'
    })

    const tl = gsap.timeline()
    tl.add(
      Flip.from(currentState, {
        duration: 0.7,
        ease: 'power4.inOut'
      })
    )
    if (!open) {
      tl.to(backgroundRef.current, { opacity: 0, duration: 0.2 })
    }

    if (open) {
      tl.to(
        btns,
        { autoAlpha: 1, xPercent: 0, stagger: 0.05, duration: 0.6, ease: 'power2.out' },
        0.3
      )

      tl.to(
        contentRef.current,
        { autoAlpha: 1, duration: 0.6, ease: 'power2.out' },
        localsRef.current.isSearchOpen ? 0.8 : 0.3
      )
      tl.to(
        contentRef.current.querySelectorAll('.menu-fade-up'),
        { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05, overwrite: true },
        0.3
      )
    } else {
      tl.to(
        contentRef.current,
        { autoAlpha: 0, duration: localsRef.current.isSearchOpen ? 0.3 : 0.6, ease: 'expo.out' },
        0
      )
      tl.to(
        contentRef.current.querySelectorAll('.menu-fade-up'),
        { autoAlpha: 0, y: 10, duration: 0.6, ease: 'power2.out', overwrite: true },
        0
      )

      tl.to(btns, { autoAlpha: 0, xPercent: -100, duration: 0.4 }, 0)
      tl.eventCallback('onComplete', () => {
        setView(MENU_VIEW_MAIN)
      })
    }

    return () => {
      tl.kill()
    }
  }, [setView, open])

  // When the search opens, trigger the animation that slides the search results up
  useEffect(() => {
    localsRef.current.searchOpened =
      localsRef.current.searchOpened || isSearchOpen
    if (!localsRef.current.searchOpened) return

    const tl = gsap.timeline()
    // Opening animation
    const currentSearchState = Flip.getState(searchRef.current, {
      props: 'left,top,width,height,opacity'
    })

    const currentBackgroundRefState = Flip.getState(backgroundRef.current, {
      props: 'height'
    })

    gsap.set(searchRef.current, {
      top: isSearchOpen ? 64 : '100%',
      height: isSearchOpen ? '100%' : 64
    })

    gsap.set(backgroundRef.current, {
      height: isSearchOpen ? 64 : '100%'
    })

    tl.add(
      Flip.from(currentSearchState, {
        duration: 0.8,
        ease: 'power4.inOut'
      })
    )
    tl.add(
      Flip.from(currentBackgroundRefState, {
        duration: 0.8,
        ease: 'power4.inOut'
      }),
      0
    )
  }, [isSearchOpen])

  return (
    <>
      <div
        ref={useComposeRefs(ref, bodyScrollRef)}
        className='absolute -left-2 -top-2 z-menuContent w-menuSmall max-w-md md:w-96 md:max-w-none pointer-events-none max-h-[44rem]'
        style={{ height: 'calc(100vh - 164px)' }}
      >
        <div
          ref={backgroundRef}
          className='absolute top-3 left-2 w-8 h-8 md:w-10 mdLh-10 bg-white rounded-menu opacity-0'
        />
        <div
          ref={contentRef}
          className='relative invisible z-header h-full opacity-0'
        >
          <header className='h-[64px] flex justify-end items-center gap-2 px-2'>
            <div
              className={cn(
                'overflow-hidden transition-opacity duration-150 flex-grow ml-28 flex justify-end cursor-pointer group',
                menuView !== MENU_VIEW_MAIN || isSearchOpen
                  ? 'opacity-100 pointer-events-auto'
                  : 'opacity-0 pointer-events-none'
              )}
              onClick={() => onSetView(MENU_VIEW_MAIN)}
            >
              <MenuNavButton
                icon={<CaretIcon width={8} className='rotate-180' />}
                id={MENU_VIEW_MAIN}
                onClick={onSetView}
                title='Back'
              />
            </div>
            <div className='overflow-hidden'>
              <MenuNavButton
                icon={
                  photoUrl
                    ? <img
                    alt={session?.user?.displayName}
                    src={photoUrl}
                    loading='lazy'
                    className='rounded-full p-[2px]'
                  />
                    : <UserIcon width={16} />}
                id={MENU_VIEW_PROFILE}
                onClick={onShowProfile}
                isActive={menuView === MENU_VIEW_PROFILE}
                title='Account'
              />
            </div>
            <div className='hidden overflow-hidden'>
              <MenuNavButton
                icon={
                  <BellIcon
                    color={authenticated ? 'black' : colors.neutral['500']}
                    width={16}
                  />
                }
                id={MENU_VIEW_NOTIFICATIONS}
                // badgeCount={4}
                onClick={onSetView}
                disabled={!authenticated}
                title={!authenticated ? 'You need to be logged in' : ''}
                isActive={menuView === MENU_VIEW_NOTIFICATIONS}
              />
            </div>
          </header>

          <section
            className='overflow-y-scroll transparent-scrollbar'
            style={{ height: 'calc(100% - 92px)' }}
          >
            {(menuView === MENU_VIEW_MAIN || !menuView) && (
              <MainNavigation onClose={onClose} />
            )}
            {menuView === MENU_VIEW_NOTIFICATIONS && (
              <Notifications onClose={onClose} />
            )}
            {menuView === MENU_VIEW_PROFILE && <Profile />}
          </section>

          <div
            ref={searchRef}
            className='absolute top-full w-full bg-white z-header rounded-menu h-[64px] translate-y-1'
          >
            <Search ref={searchInputRef} />
          </div>
        </div>
      </div>
      <Overlay onClick={onClose} show={open} />
    </>
  )
}
