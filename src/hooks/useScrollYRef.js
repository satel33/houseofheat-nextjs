import { createRef, useEffect } from 'react'

const scrollYRef = createRef()

const useScrollYRef = () => {
  if (!scrollYRef.current) scrollYRef.current = { attached: 0, y: 0 }

  useEffect(() => {
    const storeScroll = () => {
      scrollYRef.current.y = window.scrollY
    }

    if (!scrollYRef.current.attached) {
      window.addEventListener('scroll', storeScroll, { passive: true })
      storeScroll()
    }
    scrollYRef.current.attached = scrollYRef.current.attached + 1

    return () => {
      scrollYRef.current.attached -= 1
      if (scrollYRef.current.attached === 0) {
        window.removeEventListener('scroll', storeScroll)
      }
    }
  }, [])
  return scrollYRef
}

export default useScrollYRef
