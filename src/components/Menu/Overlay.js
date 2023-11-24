import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Overlay ({ show, onClick }) {
  const ref = useRef()

  useEffect(() => {
    gsap.to(ref.current, {
      duration: 1,
      ease: 'sine.inOut',
      opacity: show ? 1 : 0,
      pointerEvents: show ? 'all' : 'none'
    })
  }, [show])

  return createPortal(
    <div
      ref={ref}
      onClick={onClick}
      className='bg-neutral-200 fixed z-menuOverlay inset-0 opacity-0 pointer-events-none'
    />,
    document.querySelector('body')
  )
}
