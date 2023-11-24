import { useCallback, useRef } from 'react'

function useEvent (handler) {
  const handlerRef = useRef(null)
  handlerRef.current = handler
  return useCallback((...args) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current
    return fn(...args)
  }, [])
}

export default useEvent
