import cn from 'clsx'
import gsap from 'gsap'
import { useRef } from 'react'
import { useIsomorphicLayoutEffect } from 'react-use'

export default function AnimatedGradient ({
  className,
  gradient,
  duration = 5,
  transitionDuration = 0.5,
  animate = true,
  animateTransition = false,
  invert
}) {
  const ref = useRef()
  const initialGradient = useRef(gradient)
  const { from, to } = initialGradient.current || {}

  useIsomorphicLayoutEffect(() => {
    if (animate && ref.current && gradient.from !== gradient.to) {
      const tl = gsap.timeline({ repeat: -1 })
      if (invert) {
        tl.fromTo(
          ref.current,
          { x: '-50%', z: -100 },
          { x: '0%', z: -100, duration, ease: 'none' }
        )
      } else {
        tl.fromTo(
          ref.current,
          { x: '0%', z: -100 },
          { x: '-50%', z: -100, duration, ease: 'none' }
        )
      }
      return () => {
        tl.kill()
      }
    }
  }, [duration, animate, invert, gradient])

  useIsomorphicLayoutEffect(() => {
    const { from, to } = gradient
    const linearGradient = `linear-gradient(90deg, ${from} 0%, ${to} 25%, ${from} 50%, ${to} 75%, ${from} 100%)`
    if (animateTransition) {
      gsap.to(ref.current, {
        background: linearGradient,
        duration: transitionDuration,
        ease: 'sine.inOut'
      })
    } else {
      gsap.set(ref.current, {
        background: linearGradient
      })
    }
  }, [gradient, animateTransition])

  return (
    <div
      className={cn(
        'absolute inset-0 flex w-[400%] -z-1 pointer-events-none',
        className
      )}
      ref={ref}
      style={{
        background: `linear-gradient(90deg, ${from} 0%, ${to} 25%, ${from} 50%, ${to} 75%, ${from} 100%)`
      }}
    />
  )
}
