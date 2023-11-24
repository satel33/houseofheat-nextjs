import cn from 'clsx'
import { primaryInput } from 'detect-it'
import gsap from 'gsap'
import { useEffect, useRef } from 'react'
import gradients from '../theme/gradients.cjs'

let gradientIndex = 0

const GradientHoverEffect = ({ className, offset = '-12%' }) => {
  const backgroundRef = useRef()
  useEffect(() => {
    if (primaryInput === 'touch') return

    if (backgroundRef.current) {
      let tl
      const element = backgroundRef.current
      const parentNode = element.parentNode.parentNode
      const mouseEnter = () => {
        if (tl) tl.kill()
        tl = gsap.timeline()
        const gradient = gradients[gradientIndex++ % gradients.length]

        tl.set(element, {
          width: '400%',
          opacity: 0.8,
          background: `linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 25%, ${gradient.from} 30%, ${gradient.to} 40%)`
        })
        tl.to(element, { x: offset, duration: 0.25, ease: 'power2.out' })
      }

      const mouseLeave = () => {
        if (tl) tl.kill()
        tl = gsap.timeline()
        tl.to(element, { x: '0%', ease: 'power2.out' })
      }
      parentNode.addEventListener('mouseenter', mouseEnter)
      parentNode.addEventListener('mouseleave', mouseLeave)
      return () => {
        parentNode.removeEventListener('mouseenter', mouseEnter)
        parentNode.removeEventListener('mouseleave', mouseLeave)
      }
    }
  }, [offset])

  return (
    <div className={cn(className, 'overflow-hidden absolute inset-0')}>
      <div
        className='absolute top-0 bottom-0 left-0 z-0 pointer-events-none'
        ref={backgroundRef}
      />
    </div>
  )
}

export default GradientHoverEffect
