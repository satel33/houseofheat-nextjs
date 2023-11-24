import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import toArray from 'lodash/toArray'
import { isMenuOpen } from './menuState'
import { useAtomValue } from 'jotai'

export default function HamburgerIcon () {
  const open = useAtomValue(isMenuOpen)
  const ref = useRef()
  useEffect(() => {
    if (!ref.current) return

    const [line1, line2, line3] = toArray(ref.current.children)

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power4.out',
        transformOrigin: '50% 50%'
      }
    })

    tl.to(line1, { rotationZ: open ? 45 : 0, y: open ? 5 : 0 }, 0)
    tl.to(line2, { scale: open ? 0 : 1 }, 0)
    tl.to(line3, { rotationZ: open ? -45 : 0, y: open ? -5 : 0 }, 0)

    return () => tl.kill()
  }, [open])

  return (
    <svg
      viewBox='0 0 16 12'
      width='16'
      height='12'
      fill='none'
      style={{ stroke: 'var(--background)' }}
      xmlns='http://www.w3.org/2000/svg'
      ref={ref}
    >
      <line x2='16' y1='1' y2='1' />
      <line x2='16' y1='6' y2='6' />
      <line x2='16' y1='11' y2='11' />
    </svg>
  )
}
