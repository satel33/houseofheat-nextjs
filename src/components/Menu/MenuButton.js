import cn from 'clsx'
import { useAtomValue, useSetAtom } from 'jotai'
import { useCallback, useRef } from 'react'

import { primaryInput } from 'detect-it'
import gsap from 'gsap'
import HamburgerIcon from './HamburgerIcon'
import { isMenuOpen } from './menuState'

export default function MenuButton ({ className, ...props }) {
  const ref = useRef()
  const setOpen = useSetAtom(isMenuOpen)
  const open = useAtomValue(isMenuOpen)

  const onButtonClick = useCallback(async () => {
    setOpen(open => !open)
  }, [setOpen])

  const mouseOver = useCallback(() => {
    gsap.to(ref.current, {
      scale: 1,
      opacity: 0.8,
      duration: 0.3,
      ease: 'expo.out',
      overwrite: true
    })
  }, [])

  const mouseLeave = useCallback(() => {
    gsap.to(ref.current, {
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
    <button
      onClick={onButtonClick}
      id='menu-btn'
      ref={ref}
      className={cn(
        'flex items-center justify-center pointer-events-auto',
        'z-header rounded-full w-[38px] h-[38px] md:w-[47px] md:h-[47px]',
        'focus:opacity-100',
        className
      )}
      style={{
        backgroundColor: 'var(--foreground)',
        color: 'var(--background)'
      }}
      {...props}
      {...eventListeners}
      title={ open ? 'Close Menu' : 'Open Menu' }
    >
      <HamburgerIcon />
    </button>
  )
}
