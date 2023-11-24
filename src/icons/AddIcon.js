import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function AddIcon ({ className, on = false, ...props }) {
  const verticalLineRef = useRef()
  const horizontalLineRef = useRef()
  useEffect(() => {
    gsap.to(verticalLineRef.current, { transformOrigin: '50% 50%', rotate: on ? 90 : 0, duration: 0.15, ease: 'sine.inOut' })
    gsap.to(horizontalLineRef.current, { transformOrigin: '50% 50%', rotate: on ? 180 : 0, duration: 0.15, ease: 'sine.inOut' })

  }, [on])
  return (
    <svg className={className} width='12px' height='12px' viewBox='0 0 12 12' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      <path d='M5.402 10.203V.797h1.176v9.406H5.402Z' fill='currentColor' ref={verticalLineRef} />
      <path d='M1.17 4.912h9.406v1.176H1.171V4.912Z' fill='currentColor' ref={horizontalLineRef}/>
    </svg>
  )
}
