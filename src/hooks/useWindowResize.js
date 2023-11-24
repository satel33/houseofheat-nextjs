import { useEffect, useRef } from 'react'

export const useWindowResize = (
  callback,
  runOnMount = false,
  widthOnly = false
) => {
  const localesRef = useRef({})
  useEffect(() => {
    const onResize = () => {
      if (widthOnly) {
        if (localesRef.current.width !== window.innerWidth) {
          localesRef.current.width = window.innerWidth
          callback?.()
        }
      } else {
        callback?.()
      }
    }
    window.addEventListener('resize', onResize, { passive: true })
    if (runOnMount) {
      onResize()
    }
    localesRef.current.width = window.innerWidth
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [callback, widthOnly]) /* eslint-disable-line */
  return localesRef
}

export default useWindowResize
