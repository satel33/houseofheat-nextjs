import cn from 'clsx'
import { primaryInput } from 'detect-it'
import gsap from 'gsap'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import dynamic from 'next/dynamic'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { clamp, mapRange } from '../../helpers/math'
import { useBodyScrollLockScrollbarPadding } from '../../hooks/useBodyScrollLock'
import { useIsHomepage } from '../../hooks/useIsHomepage'
import { dialogOpenAtom, pageScrollAtom } from '../../store/content'
import screens from '../../theme/screens.cjs'
import { useAttachHeaderEvents, useHeaderColor } from './headerHooks'
import { headerState } from './headerState'
import LogoIcon from './LogoIcon'
import MenuButton from './MenuButton'
import { isMenuOpen, menuView as menuViewAtom } from './menuState'

const MenuContent = dynamic(() => import('./MenuContent'))

export default function Menu () {
  const [open, setOpen] = useAtom(isMenuOpen)
  const menuView = useAtomValue(menuViewAtom)
  const menuViewRef = useRef(menuView)
  const closeButtonRef = useRef()
  const isHomepage = useIsHomepage()
  const [dialogOpen, setDialogOpen] = useAtom(dialogOpenAtom)
  const setDialogScrollProgress = useSetAtom(pageScrollAtom)

  const { headerRef, color } = useHeaderColor()
  useAttachHeaderEvents()
  useBodyScrollLockScrollbarPadding(headerRef)

  // When 'menuView' changes (on the first load), we need to open it!
  useEffect(() => {
    if (!open && menuViewRef.current === '' && menuView !== '') {
      menuViewRef.current = menuView
      setOpen(true)
    }
  }, [open, menuView, setOpen])

  const { large } = useAtomValue(headerState)

  useEffect(() => {
    if (window.innerWidth >= parseInt(screens.md)) {
      gsap.to(headerRef.current, {
        y: large ? '8vw' : '0',
        duration: 0.4,
        ease: large ? 'sine.in' : 'sine.out'
      })
    } else {
      gsap.set(headerRef.current, { y: 0 })
    }
  }, [large])

  const [loadMenu, setLoadMenu] = useState(false)
  const onMenuOver = useCallback(() => {
    if (!loadMenu) setLoadMenu(true)
  }, [loadMenu])

  const initialStylesAndClasses = useMemo(() => {
    return {
      styles: {
        '--foreground': color.current.foreground,
        '--background': color.current.background
      },
      className: large ? 'md:translate-y-[8vw]' : ''
    }
  }, [])

  const onCloseDialog = useCallback(() => {
    setDialogOpen(false)
    setDialogScrollProgress(0)
  }, [setDialogOpen])

  useEffect(() => {
    gsap.to(closeButtonRef.current, {
      opacity: dialogOpen ? 1 : 0,
      pointerEvents: dialogOpen ? 'all' : 'none',
      duration: dialogOpen ? 1 : 0.5,
      overwrite: true
    })
    gsap.set(closeButtonRef.current.children[0], {
      pointerEvents: dialogOpen ? 'all' : 'none'
    })
  }, [dialogOpen])

  useEffect(() => {
    gsap.to(headerRef.current, {
      opacity: 1,
      duration: 1,
      delay: 0.5,
      ease: 'sine.inOut'
    })
  }, [])

  // dialog close btn hoverstates
  const mouseOver = useCallback(() => {
    gsap.to(closeButtonRef.current.children[0], {
      scale: 0.9,
      opacity: 0.8,
      duration: 0.3,
      ease: 'expo.out',
      overwrite: true
    })
  }, [])

  const mouseLeave = useCallback(() => {
    gsap.to(closeButtonRef.current.children[0], {
      scale: 1,
      opacity: 1,
      duration: 0.3,
      ease: 'expo.out',
      overwrite: true
    })
  }, [])

  const eventListeners = {
    onMouseEnter: primaryInput !== 'touch' ? mouseOver : null,
    onMouseLeave: primaryInput !== 'touch' ? mouseLeave : null,
    onMouseDown: primaryInput !== 'touch' ? mouseLeave : null
  }

  return (
    <section
      className={cn(
        'fixed top-toolbar left-0 w-full pointer-events-none z-menu',
        initialStylesAndClasses.className
      )}
      ref={headerRef}
      style={initialStylesAndClasses.styles}
    >
      <div className='relative flex items-center gap-4 px-4 md:px-6 py-6'>
        <div className='flex-grow-0 flex-shrink-0 relative'>
          <MenuButton className='relative mt-[4px] md:mt-0' onMouseOver={onMenuOver} />
          {(loadMenu || open) && <MenuContent />}
        </div>
        {isHomepage && <h1 className='col-span-full sr-only'>House Of Heat</h1>}
        <div className='flex-1 relative text-current z-menuContent'>
          <LogoIcon />
        </div>
      </div>
      <div ref={closeButtonRef} className='opacity-0'>
        <button
          className={cn(
            'absolute right-6 top-1/2 w-[38px] h-[38px] md:w-[47px] md:h-[47px] cursor-pointer -translate-y-1/2 rounded-full',
            'flex justify-center items-center',
            open && '!pointer-events-none'
          )}
          style={{
            backgroundColor: 'var(--foreground)',
            color: 'var(--background)'
          }}
          onClick={onCloseDialog}
          title='Close Dialog'
          {...eventListeners}
        >
          <CloseBtnSvg />
        </button>
      </div>
    </section>
  )
}

const CloseBtnSvg = () => {
  const progress = useAtomValue(pageScrollAtom)

  const calcProgress = () => {
    if (progress < 0.02) return 1
    if (progress > 0.9) return mapRange(0.9, 1, clamp(progress, 0, 1), 0, -1)
    return (1 - mapRange(0, 0.9, clamp(progress, 0, 1), 0, 1))
  }

  return (
    <svg width='37' height='37' viewBox='0 0 37 37' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M18.5 0.5C20.8638 0.5 23.2044 0.965584 25.3883 1.87017C27.5722 2.77475 29.5565 4.10062 31.2279 5.77208C32.8994 7.44353 34.2252 9.42784 35.1298 11.6117C36.0344 13.7956 36.5 16.1362 36.5 18.5C36.5 20.8638 36.0344 23.2044 35.1298 25.3883C34.2252 27.5722 32.8994 29.5565 31.2279 31.2279C29.5565 32.8994 27.5722 34.2252 25.3883 35.1298C23.2044 36.0344 20.8638 36.5 18.5 36.5C16.1362 36.5 13.7956 36.0344 11.6117 35.1298C9.42783 34.2252 7.44353 32.8994 5.77207 31.2279C4.10062 29.5565 2.77475 27.5722 1.87017 25.3883C0.965581 23.2044 0.499999 20.8638 0.5 18.5C0.500001 16.1362 0.965586 13.7955 1.87017 11.6117C2.77476 9.42783 4.10063 7.44352 5.77209 5.77207C7.44354 4.10062 9.42785 2.77475 11.6117 1.87016C13.7956 0.965581 16.1362 0.499998 18.5 0.5L18.5 0.5Z'
        stroke='#00DC09'
        strokeDasharray='113'
        strokeDashoffset={113 * calcProgress() }
      />
      <line y1='-0.5' x2='15' y2='-0.5' transform='matrix(0.707107 -0.707107 -0.707107 -0.707107 12 24)' stroke='currentColor'/>
      <line y1='-0.5' x2='15' y2='-0.5' transform='matrix(0.707107 0.707107 0.707107 -0.707107 13 13)' stroke='currentColor'/>
    </svg>
  )
}
