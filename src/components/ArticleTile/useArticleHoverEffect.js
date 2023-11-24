import gsap from 'gsap'
import lerp from 'lerp'
import { useCallback, useEffect, useRef, useState } from 'react'

export default function useArticleHoverEffect (enabled) {
  const localsRef = useRef({ currentRotation: 0, targetRotation: 0, currentPosition: { x: 0, y: 0 }, targetPosition: { x: 0, y: 0 }, ease: 0.05 })
  const articleRef = useRef()
  const [isHovering, setIsHovering] = useState(false)

  // useEffect(() => {
  //   const onMove = (e) => {
  //     const rect = articleRef.current.getBoundingClientRect()

  //     const mouseX = (((e.clientX - rect.left) / rect.width) - 0.5) * 2
  //     const mouseY = (((e.clientY - rect.top) / rect.height) - 0.5) * 2

  //     localsRef.current.targetRotation = Math.max(-20, Math.min(20, 5 * mouseX * mouseY))

  //     localsRef.current.targetPosition.x = Math.max(-5, Math.min(5, mouseX * 5))
  //     localsRef.current.targetPosition.y = Math.max(-5, Math.min(5, mouseY * 5))
  //     localsRef.current.ease = 0.05
  //   }

  //   document.addEventListener('mousemove', onMove)
  //   return () => {
  //     document.removeEventListener('mousemove', onMove)
  //   }
  // }, [])

  const onMouseEnter = useCallback(() => {
    setIsHovering(true)
  }, [])

  const onMouseLeave = useCallback(() => {
    if (enabled) {
      localsRef.current.targetRotation = 0
      localsRef.current.targetPosition = { x: 0, y: 0 }
      localsRef.current.ease = 0.1
    }

    setIsHovering(false)
  }, [enabled])

  const onMouseMove = useCallback((e) => {
    if (enabled) {
      const rect = articleRef.current.getBoundingClientRect()
      // Normalized mouse position in container
      const mouseX = (((e.clientX - rect.left) / rect.width) - 0.5) * 2
      const mouseY = (((e.clientY - rect.top) / rect.height) - 0.5) * 2

      localsRef.current.targetRotation = 10 * mouseX * mouseY

      localsRef.current.targetPosition.x = mouseX * 5
      localsRef.current.targetPosition.y = mouseY * 5
      localsRef.current.ease = 0.05
    }
  }, [enabled])

  useEffect(() => {
    if (enabled) {
      const images = articleRef.current.querySelectorAll('img')
      const setRotation = gsap.quickSetter(images, 'rotate', 'deg')
      const setX = gsap.quickSetter(images, 'x', '%')
      const setY = gsap.quickSetter(images, 'y', '%')

      const loop = () => {
        const { ease } = localsRef.current
        const rotation = lerp(localsRef.current.currentRotation, localsRef.current.targetRotation, ease)
        localsRef.current.currentRotation = rotation

        const x = lerp(localsRef.current.currentPosition.x, localsRef.current.targetPosition.x, ease)
        const y = lerp(localsRef.current.currentPosition.y, localsRef.current.targetPosition.y, ease)

        localsRef.current.currentPosition.x = x
        localsRef.current.currentPosition.y = y
        setRotation(rotation)
        setX(x)
        setY(y)
      }
      gsap.ticker.add(loop)

      return () => {
        gsap.ticker.remove(loop)
      }
    }
  }, [enabled])

  return {
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    isHovering,
    articleRef
  }
}
